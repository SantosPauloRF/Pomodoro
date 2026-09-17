import { expect, test } from "@playwright/test";

test.describe("timer Pomodoro", () => {
  test("mostra foco parado em 25:00", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("mode-label")).toHaveText("Foco");
    await expect(page.getByTestId("cycle-label")).toHaveText("1 de 4");
    await expect(page.getByTestId("timer-display")).toHaveText("25:00");
    await expect(page.getByRole("button", { name: "Iniciar foco" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Pular" })).toBeVisible();
  });

  test("iniciar, pausar e resetar no mesmo modo", async ({ page }) => {
    await page.goto("/?focoMs=8000&pausaMs=5000");
    await expect(page.getByTestId("timer-display")).toHaveText("00:08");
    await page.getByRole("button", { name: "Iniciar foco" }).click();
    await expect(page.getByRole("button", { name: "Pausar" })).toBeVisible();
    await page.getByRole("button", { name: "Pausar" }).click();
    const congelado = await page.getByTestId("timer-display").textContent();
    expect(congelado).toMatch(/00:0[0-8]/);
    await page.waitForTimeout(700);
    await expect(page.getByTestId("timer-display")).toHaveText(congelado ?? "");
    await page.getByRole("button", { name: "Resetar" }).click();
    await expect(page.getByTestId("mode-label")).toHaveText("Foco");
    await expect(page.getByTestId("timer-display")).toHaveText("00:08");
    await expect(page.getByRole("button", { name: "Iniciar foco" })).toBeVisible();
    await expect(page.getByTestId("overlay")).toHaveCount(0);
  });

  test("ao zerar mostra overlay e a pausa não começa sozinha", async ({
    page,
  }) => {
    await page.goto("/?focoMs=1200&pausaMs=4000");
    await page.getByRole("button", { name: "Iniciar foco" }).click();
    await expect(page.getByTestId("overlay")).toBeVisible({ timeout: 5_000 });
    await expect(page.getByTestId("overlay-title")).toHaveText("Hora de parar");
    await page.getByRole("button", { name: "Entendi" }).click();
    await expect(page.getByTestId("overlay")).toHaveCount(0);
    await expect(page.getByTestId("mode-label")).toHaveText("Pausa");
    await expect(page.getByTestId("timer-display")).toHaveText("00:04");
    await expect(page.getByRole("button", { name: "Iniciar pausa" })).toBeVisible();
  });

  test("pular o foco vai para a pausa parada", async ({ page }) => {
    await page.goto("/?focoMs=8000&pausaMs=5000");
    await page.getByRole("button", { name: "Pular" }).click();
    await expect(page.getByTestId("overlay")).toHaveCount(0);
    await expect(page.getByTestId("mode-label")).toHaveText("Pausa");
    await expect(page.getByTestId("timer-display")).toHaveText("00:05");
    await expect(page.getByRole("button", { name: "Iniciar pausa" })).toBeVisible();
  });

  test("fim da pausa pede para voltar ao foco", async ({ page }) => {
    await page.goto("/?focoMs=1500&pausaMs=1500");
    await page.getByRole("button", { name: "Iniciar foco" }).click();
    await expect(page.getByTestId("overlay-title")).toHaveText("Hora de parar", {
      timeout: 6_000,
    });
    await page.getByRole("button", { name: "Entendi" }).click();
    await page.getByRole("button", { name: "Iniciar pausa" }).click();
    await expect(page.getByTestId("overlay-title")).toHaveText(
      "Hora de voltar ao foco",
      { timeout: 6_000 },
    );
    await page.getByRole("button", { name: "Entendi" }).click();
    await expect(page.getByTestId("mode-label")).toHaveText("Foco");
    await expect(page.getByTestId("cycle-label")).toHaveText("2 de 4");
    await expect(page.getByTestId("timer-display")).toHaveText("00:02");
    await expect(page.getByRole("button", { name: "Iniciar foco" })).toBeVisible();
  });

  test("o 4º foco segue para pausa longa", async ({ page }) => {
    await page.goto("/?focoMs=800&pausaLongaMs=1200&focoNoCiclo=4");
    await expect(page.getByTestId("cycle-label")).toHaveText("4 de 4");
    await page.getByRole("button", { name: "Iniciar foco" }).click();
    await expect(page.getByTestId("overlay-title")).toHaveText("Hora de parar", {
      timeout: 5_000,
    });
    await page.getByRole("button", { name: "Entendi" }).click();
    await expect(page.getByTestId("mode-label")).toHaveText("Pausa longa");
    await expect(page.getByTestId("timer-display")).toHaveText("00:02");
    await expect(
      page.getByRole("button", { name: "Iniciar pausa longa" }),
    ).toBeVisible();
  });

  test("configuração altera o tempo de foco e grava", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Configurações" }).click();
    await page.getByLabel("Foco (minutos)").fill("2");
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByTestId("timer-display")).toHaveText("02:00");
    await page.reload();
    await expect(page.getByTestId("timer-display")).toHaveText("02:00");
  });

  test("o ícone flutuante mostra anel, hora e data", async ({ page }) => {
    await page.goto("/?focoMs=8000");
    await page.getByRole("button", { name: "Iniciar foco" }).click();
    await page.goto("/float.html");
    await expect(page.getByTestId("float-icon")).toBeVisible();
    await expect(page.locator(".anel-flutuante .anel-arco")).toBeVisible();
    await expect(page.getByTestId("float-clock")).toHaveText(/\d{2}:\d{2}/);
    await expect(page.getByTestId("float-date")).toHaveText(
      /^(dom|seg|ter|qua|qui|sex|sáb) \d{1,2}$/,
    );
    await expect(page.getByTestId("float-play")).toHaveAttribute(
      "aria-label",
      "Pausar",
    );
  });
});
