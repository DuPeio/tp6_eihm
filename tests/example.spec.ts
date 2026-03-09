import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


test('Ajout d’une tâche en bas de la liste et non cochée', async ({ page }) => {

  const label: string = 'Tâche TP EIHM';

  // 1. Ouvrir l'application
  await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

  // 2. Saisir le label dans le champ de texte
  const input = page.locator('input.new-todo');
  await input.fill(label);

  // 3. Simuler la touche Entrée
  await input.press('Enter');

  // 4. Vérifier qu'il existe exactement un item contenant ce label
  const items = page.locator('.todo-list li');
  const itemWithLabel = items.filter({ hasText: label });

  await expect(itemWithLabel).toHaveCount(1);

  // 5. Vérifier que l'item n'est pas coché
  const checkbox = itemWithLabel.locator('input.toggle');
  await expect(checkbox).not.toBeChecked();

  // 6. Vérifier que cet item est le dernier de la liste (en bas)
  const lastItem = items.last();
  await expect(lastItem).toContainText(label);

});




test('Gestion de la sélection de plusieurs tâches', async ({ page }) => {

  const tasks: string[] = ['Tâche A', 'Tâche B', 'Tâche C'];

  // Ouvrir l'application
  await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

  const input = page.locator('input.new-todo');

  // 1. Ajouter plusieurs tâches
  for (const task of tasks) {
    await input.fill(task);
    await input.press('Enter');
  }

  const items = page.locator('.todo-list li');
  await expect(items).toHaveCount(tasks.length);

  const checkboxes = page.locator('.todo-list li input.toggle');

  // 2. Sélectionner toutes les tâches
  const toggleAll = page.locator('input.toggle-all');
  await toggleAll.check();

  for (let i = 0; i < tasks.length; i++) {
    await expect(checkboxes.nth(i)).toBeChecked();
  }

  // 3. Décocher toutes les tâches
  await toggleAll.uncheck();

  for (let i = 0; i < tasks.length; i++) {
    await expect(checkboxes.nth(i)).not.toBeChecked();
  }

  // 4. Cocher une seule tâche (la première)
  await checkboxes.nth(0).check();

  // 5. Vérifier que seule la première tâche est cochée
  await expect(checkboxes.nth(0)).toBeChecked();
  await expect(checkboxes.nth(1)).not.toBeChecked();
  await expect(checkboxes.nth(2)).not.toBeChecked();

});



test('Gestion des tâches et filtre Active', async ({ page }) => {

  const tasks: string[] = ['Tâche 1', 'Tâche 2', 'Tâche 3'];

  // 1. Ouvrir l'application
  await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

  const input = page.locator('input.new-todo');

  // 2. Ajouter plusieurs tâches
  for (const task of tasks) {
    await input.fill(task);
    await input.press('Enter');
  }

  const items = page.locator('.todo-list li');
  const checkboxes = page.locator('.todo-list li input.toggle');

  await expect(items).toHaveCount(tasks.length);

  // 3. Sélectionner toutes les tâches
  const toggleAll = page.locator('input.toggle-all');
  await toggleAll.check();

  for (let i = 0; i < tasks.length; i++) {
    await expect(checkboxes.nth(i)).toBeChecked();
  }

  // 4. Décocher toutes les tâches
  await toggleAll.uncheck();

  for (let i = 0; i < tasks.length; i++) {
    await expect(checkboxes.nth(i)).not.toBeChecked();
  }

  // 5. Cocher une seule tâche (la première)
  await checkboxes.nth(0).check();

  await expect(checkboxes.nth(0)).toBeChecked();
  await expect(checkboxes.nth(1)).not.toBeChecked();
  await expect(checkboxes.nth(2)).not.toBeChecked();

  // 6. Filtrer les tâches actives
  const activeFilter = page.locator('a[href="#/active"]');
  await activeFilter.click();

  // 7. Vérifier que seules les tâches actives (non cochées) apparaissent
  const visibleItems = page.locator('.todo-list li');
  await expect(visibleItems).toHaveCount(2);

  // Vérifier que les tâches visibles sont bien les non cochées
  await expect(visibleItems.nth(0)).toContainText('Tâche 2');
  await expect(visibleItems.nth(1)).toContainText('Tâche 3');

});