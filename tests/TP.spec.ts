import { test, expect, Page } from '@playwright/test';

async function nommerTache(page: Page, label: string): Promise<void> {
  const input = page.locator('input.new-todo');
  await input.fill(label);
}

// 2. Fonction qui ajoute la tâche à la liste (appui sur Entrée)
async function ajouterTacheALaListe(page: Page): Promise<void> {
  const input = page.locator('input.new-todo');
  await input.press('Enter');
}

// 3. Fonction qui utilise les deux précédentes
async function ajouterTache(page: Page, label: string): Promise<void> {
  await nommerTache(page, label);
  await ajouterTacheALaListe(page);
}



test('Ajouter une tâche avec fonctions décomposées', async ({ page }) => {

  await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

  await ajouterTache(page, 'Tâche TP 1');

  const items = page.locator('.todo-list li');
  await expect(items).toHaveCount(1);

});