import { Page } from '@playwright/test';

// 1. Fonction qui nomme la tâche (saisie dans le champ texte)
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






/* async function ajouterTache(page: import('@playwright/test').Page, label: string): Promise<void> {
  const input = page.locator('input.new-todo');
  await input.fill(label);
  await input.press('Enter');
} */