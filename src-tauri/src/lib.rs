use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{
    utils::config::Color, Emitter, LogicalSize, Manager, Monitor, WebviewUrl, WebviewWindow,
    WebviewWindowBuilder,
};

const FLOAT_LABEL: &str = "flutuante";
const JANELA_LARGURA: f64 = 420.0;
const JANELA_ALTURA: f64 = 600.0;
const IGNORAR_BLUR_MS: u64 = 2_000;
const FUNDO_TRANSPARENTE: Color = Color(0, 0, 0, 0);

static TRANSICAO: AtomicBool = AtomicBool::new(false);
static OVERLAY_ATIVO: AtomicBool = AtomicBool::new(false);
static IGNORAR_BLUR_ATE_MS: AtomicU64 = AtomicU64::new(0);

fn agora_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

fn ignorar_blur_por(ms: u64) {
    IGNORAR_BLUR_ATE_MS.store(agora_ms().saturating_add(ms), Ordering::SeqCst);
}

fn deve_ignorar_blur() -> bool {
    agora_ms() < IGNORAR_BLUR_ATE_MS.load(Ordering::SeqCst)
}

fn overlay_aberto(app: &tauri::AppHandle) -> bool {
    OVERLAY_ATIVO.load(Ordering::SeqCst)
        || app
            .webview_windows()
            .keys()
            .any(|label| label.starts_with("overlay-"))
}

fn fechar_overlays(app: &tauri::AppHandle) {
    let labels: Vec<String> = app
        .webview_windows()
        .keys()
        .filter(|label| label.starts_with("overlay-"))
        .cloned()
        .collect();

    for label in labels {
        if let Some(janela) = app.get_webview_window(&label) {
            let _ = janela.close();
        }
    }
}

fn esconder_flutuante(app: &tauri::AppHandle) {
    if let Some(flutuante) = app.get_webview_window(FLOAT_LABEL) {
        let _ = flutuante.hide();
    }
}

fn mostrar_principal(app: &tauri::AppHandle) {
    if let Some(main) = app.get_webview_window("main") {
        let _ = main.unminimize();
        let _ = main.show();
        let _ = main.set_focus();
    }
}

fn cobrir_monitor(janela: &WebviewWindow, monitor: &Monitor) {
    let _ = janela.set_fullscreen(false);
    let _ = janela.set_decorations(false);
    let _ = janela.set_shadow(false);
    let _ = janela.set_always_on_top(true);
    let _ = janela.set_position(*monitor.position());
    let _ = janela.set_size(*monitor.size());
    let _ = janela.show();
}

fn cobrir_principal(main: &WebviewWindow) {
    if let Ok(Some(monitor)) = main.current_monitor() {
        cobrir_monitor(main, &monitor);
        return;
    }
    let _ = main.set_decorations(false);
    let _ = main.set_shadow(false);
    let _ = main.set_always_on_top(true);
    let _ = main.show();
}

fn restaurar_layout_principal(app: &tauri::AppHandle) {
    if let Some(main) = app.get_webview_window("main") {
        let _ = main.set_fullscreen(false);
        let _ = main.set_always_on_top(false);
        let _ = main.set_shadow(true);
        let _ = main.set_decorations(true);
        let _ = main.set_skip_taskbar(false);
        let _ = main.set_size(LogicalSize::new(JANELA_LARGURA, JANELA_ALTURA));
        let _ = main.center();
        let _ = main.unminimize();
        let _ = main.show();
        let _ = main.set_focus();
    }
}

fn mesmo_monitor(a: &Monitor, b: &Monitor) -> bool {
    a.position() == b.position() && a.size() == b.size()
}

fn motivo_valido(motivo: &str) -> bool {
    motivo == "foco" || motivo == "pausa" || motivo == "pausaLonga"
}

fn abrir_overlay_extra(app: &tauri::AppHandle, index: usize, monitor: &Monitor, motivo: &str) {
    let label = format!("overlay-{index}");
    let scale = monitor.scale_factor();
    let pos = monitor.position();
    let size = monitor.size();
    let script = format!("window.__POMODORO_MOTIVO__ = '{motivo}';");

    let Ok(janela) = WebviewWindowBuilder::new(app, &label, WebviewUrl::App("overlay.html".into()))
        .title("Pomodoro")
        .decorations(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .visible(false)
        .shadow(false)
        .transparent(true)
        .background_color(FUNDO_TRANSPARENTE)
        .inner_size(size.width as f64 / scale, size.height as f64 / scale)
        .position(pos.x as f64 / scale, pos.y as f64 / scale)
        .initialization_script(&script)
        .build()
    else {
        return;
    };

    cobrir_monitor(&janela, monitor);

    let handle = app.clone();
    janela.on_window_event(move |event| {
        if matches!(event, tauri::WindowEvent::CloseRequested { .. })
            && OVERLAY_ATIVO.load(Ordering::SeqCst)
        {
            let _ = fechar_overlay(handle.clone());
        }
    });
}

#[tauri::command]
fn abrir_overlay(app: tauri::AppHandle, motivo: String) -> Result<(), String> {
    if !motivo_valido(&motivo) {
        return Err("motivo inválido".into());
    }

    ignorar_blur_por(IGNORAR_BLUR_MS);
    esconder_flutuante(&app);
    fechar_overlays(&app);
    OVERLAY_ATIVO.store(true, Ordering::SeqCst);

    let Some(main) = app.get_webview_window("main") else {
        OVERLAY_ATIVO.store(false, Ordering::SeqCst);
        return Err("janela principal não encontrada".into());
    };

    let _ = main.set_skip_taskbar(false);
    let _ = main.unminimize();
    cobrir_principal(&main);
    let _ = main.set_focus();

    let monitor_principal = main.current_monitor().ok().flatten();
    if let Ok(monitors) = app.available_monitors() {
        for (index, monitor) in monitors.iter().enumerate() {
            if monitor_principal
                .as_ref()
                .is_some_and(|atual| mesmo_monitor(atual, monitor))
            {
                continue;
            }
            abrir_overlay_extra(&app, index, monitor, &motivo);
        }
    }

    Ok(())
}

#[tauri::command]
fn fechar_overlay(app: tauri::AppHandle) -> Result<(), String> {
    OVERLAY_ATIVO.store(false, Ordering::SeqCst);
    ignorar_blur_por(IGNORAR_BLUR_MS);
    fechar_overlays(&app);
    esconder_flutuante(&app);
    restaurar_layout_principal(&app);
    app.emit("overlay-dispensado", ())
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn posicao_flutuante(app: &tauri::AppHandle) -> (f64, f64) {
    let lado = 72.0;
    let margem = 16.0;
    let monitor = app
        .get_webview_window("main")
        .and_then(|main| main.current_monitor().ok().flatten())
        .or_else(|| app.primary_monitor().ok().flatten());

    if let Some(monitor) = monitor {
        let scale = monitor.scale_factor();
        let area = monitor.work_area();
        let x = area.position.x as f64 / scale + area.size.width as f64 / scale - lado - margem;
        let y = area.position.y as f64 / scale + area.size.height as f64 / scale - lado - margem;
        return (x, y);
    }
    (margem, margem)
}

fn mostrar_flutuante_inner(app: &tauri::AppHandle) -> Result<(), String> {
    if overlay_aberto(app) {
        mostrar_principal(app);
        return Ok(());
    }

    if let Some(existente) = app.get_webview_window(FLOAT_LABEL) {
        existente.show().map_err(|e| e.to_string())?;
        let _ = existente.set_always_on_top(true);
        if let Some(main) = app.get_webview_window("main") {
            let _ = main.hide();
            let _ = main.unminimize();
        }
        return Ok(());
    }

    let (x, y) = posicao_flutuante(app);
    let janela = WebviewWindowBuilder::new(app, FLOAT_LABEL, WebviewUrl::App("float.html".into()))
        .title("Pomodoro")
        .decorations(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .transparent(true)
        .shadow(false)
        .background_color(FUNDO_TRANSPARENTE)
        .visible(false)
        .inner_size(72.0, 72.0)
        .position(x, y)
        .build()
        .map_err(|e| e.to_string())?;

    let _ = janela.set_always_on_top(true);
    janela.show().map_err(|e| e.to_string())?;

    if let Some(main) = app.get_webview_window("main") {
        let _ = main.hide();
        let _ = main.unminimize();
    }
    Ok(())
}

#[tauri::command]
fn mostrar_flutuante(app: tauri::AppHandle) -> Result<(), String> {
    if overlay_aberto(&app) || deve_ignorar_blur() {
        mostrar_principal(&app);
        return Ok(());
    }
    if TRANSICAO.swap(true, Ordering::SeqCst) {
        return Ok(());
    }
    let resultado = mostrar_flutuante_inner(&app);
    TRANSICAO.store(false, Ordering::SeqCst);
    if resultado.is_err() {
        mostrar_principal(&app);
    }
    resultado
}

#[tauri::command]
fn restaurar_principal(app: tauri::AppHandle) -> Result<(), String> {
    ignorar_blur_por(IGNORAR_BLUR_MS);
    esconder_flutuante(&app);
    if let Some(main) = app.get_webview_window("main") {
        if main.is_fullscreen().unwrap_or(false) {
            restaurar_layout_principal(&app);
            return Ok(());
        }
    }
    mostrar_principal(&app);
    Ok(())
}

fn escutar_minimizar(app: &tauri::AppHandle) {
    let handle = app.clone();
    if let Some(main) = app.get_webview_window("main") {
        main.on_window_event(move |event| {
            if overlay_aberto(&handle) || deve_ignorar_blur() {
                return;
            }
            let deve_flutuar = match event {
                tauri::WindowEvent::Focused(false) => true,
                tauri::WindowEvent::Moved(_) | tauri::WindowEvent::Resized(_) => handle
                    .get_webview_window("main")
                    .and_then(|janela| janela.is_minimized().ok())
                    .unwrap_or(false),
                _ => false,
            };
            if deve_flutuar {
                let _ = mostrar_flutuante(handle.clone());
            }
        });
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            abrir_overlay,
            fechar_overlay,
            mostrar_flutuante,
            restaurar_principal
        ])
        .setup(|app| {
            escutar_minimizar(app.handle());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("erro ao iniciar o Pomodoro");
}
