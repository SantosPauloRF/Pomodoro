use tauri::{Emitter, Manager, WebviewUrl, WebviewWindowBuilder};

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

#[tauri::command]
fn abrir_overlay(app: tauri::AppHandle, motivo: String) -> Result<(), String> {
    if motivo != "foco" && motivo != "pausa" {
        return Err("motivo inválido".into());
    }

    fechar_overlays(&app);

    let monitors = app.available_monitors().map_err(|e| e.to_string())?;
    if monitors.is_empty() {
        return Err("Nenhum monitor encontrado".into());
    }

    for (index, monitor) in monitors.iter().enumerate() {
        let label = format!("overlay-{index}");
        let scale = monitor.scale_factor();
        let pos = monitor.position();
        let size = monitor.size();
        let script = format!("window.__POMODORO_MOTIVO__ = '{motivo}';");

        let janela = WebviewWindowBuilder::new(
            &app,
            &label,
            WebviewUrl::App("overlay.html".into()),
        )
        .title("Pomodoro")
        .decorations(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .visible(false)
        .inner_size(size.width as f64 / scale, size.height as f64 / scale)
        .position(pos.x as f64 / scale, pos.y as f64 / scale)
        .initialization_script(&script)
        .build()
        .map_err(|e| e.to_string())?;

        let _ = janela.set_position(*pos);
        let _ = janela.set_size(*size);
        let _ = janela.set_always_on_top(true);
        janela.show().map_err(|e| e.to_string())?;
        let _ = janela.set_focus();
    }

    Ok(())
}

#[tauri::command]
fn fechar_overlay(app: tauri::AppHandle) -> Result<(), String> {
    fechar_overlays(&app);
    app.emit("overlay-dispensado", ())
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![abrir_overlay, fechar_overlay])
        .run(tauri::generate_context!())
        .expect("erro ao iniciar o Pomodoro");
}
