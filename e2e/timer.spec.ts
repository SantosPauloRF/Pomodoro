import { expect, test } from "@playwright/test";

test.describe("timer Pomodoro", () => {
  test("mostra foco parado em 25:00", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("mode-label")).toHaveText("Foco");
    await expect(page.getByTestId("timer-display")).toHaveText("25:00");
    await expect(page.getByRole("button", { name: "Iniciar" })).toBeVisible();
  });

  test("iniciar, pausar e resetar no mesmo modo", async ({ page }) => {
    await page.goto("/?focoMs=8000&pausaMs=5000");
    await expect(page.getByTestId("timer-display")).toHaveText("00:08");
    await page.getByRole("button", { name: "Iniciar" }).click();
    await expect(page.getByRole("button", { name: "Pausar" })).toBeVisible();
    await page.getByRole("button", { name: "Pausar" }).click();
    const congelado = await page.getByTestId("timer-display").textContent();
    expect(congelado).toMatch(/00:0[0-8]/);
    await page.waitForTimeout(700);
    await expect(page.getByTestId("timer-display")).toHaveText(congelado ?? "");
    await page.getByRole("button", { name: "Resetar" }).click();
    await expect(page.getByTestId("mode-label")).toHaveText("Foco");
    await expect(page.getByTestId("timer-display")).toHaveText("00:08");
    await expect(page.getByRole("button", { name: "Iniciar" })).toBeVisible();
    await expect(page.getByTestId("overlay")).toHaveCount(0);
  });

  test("ao zerar mostra overlay e a pausa não começa sozinha", async ({
    page,
  }) => {
    await page.goto("/?focoMs=1200&pausaMs=4000");
    await page.getByRole("button", { name: "Iniciar" }).click();
    await expect(page.getByTestId("overlay")).toBeVisible({ timeout: 5_000 });
    await expect(page.getByTestId("overlay-title")).toHaveText("Hora de parar");
    await page.getByRole("button", { name: "Entendi" }).click();
    await expect(page.getByTestId("overlay")).toHaveCount(0);
    await expect(page.getByTestId("mode-label")).toHaveText("Pausa");
    await expect(page.getByTestId("timer-display")).toHaveText("00:04");
    await expect(page.getByRole("button", { name: "Iniciar" })).toBeVisible();
  });

  test("fim da pausa pede para voltar ao foco", async ({ page }) => {
    await page.goto("/?focoMs=1500&pausaMs=1500");
    await page.getByRole("button", { name: "Iniciar" }).click();
    await expect(page.getByTestId("overlay-title")).toHaveText("Hora de parar", {
      timeout: 6_000,
    });
    await page.getByRole("button", { name: "Entendi" }).click();
    await page.getByRole("button", { name: "Iniciar" }).click();
    await expect(page.getByTestId("overlay-title")).toHaveText(
      "Hora de voltar ao foco",
      { timeout: 6_000 },
    );
    await page.getByRole("button", { name: "Entendi" }).click();
    await expect(page.getByTestId("mode-label")).toHaveText("Foco");
    await expect(page.getByTestId("timer-display")).toHaveText("00:02");
    await expect(page.getByRole("button", { name: "Iniciar" })).toBeVisible();
  });
});
