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


// Filtrer les tâches finies
export async function filtrerTachesFinies(page: Page): Promise<void> {
  await page.locator('a[href="#/completed"]').click();
}

// Filtrer les tâches actives
export async function filtrerTachesActives(page: Page): Promise<void> {
  await page.locator('a[href="#/active"]').click();
}

// Afficher toutes les tâches
export async function filtrerToutesLesTaches(page: Page): Promise<void> {
  await page.locator('a[href="#/all"]').click();
}

export async function supprimerTache(page: Page, label: string): Promise<void> {
  // Sélecteur de l'item contenant le label
  const item = page.locator('.todo-list li', { hasText: label });

  // Vérifier qu'il existe
  const count = await item.count();
  if (count === 0) {
    throw new Error(`Tâche "${label}" non trouvée`);
  }

  // Survoler pour faire apparaître le bouton supprimer
  await item.hover();

  // Cliquer sur le bouton delete
  const deleteButton = item.locator('.destroy');
  await deleteButton.click();
}


/**
 * Coche une tâche comme terminée
 * @param page Page Playwright
 * @param label Texte exact de la tâche à cocher
 */
export async function cocherTache(page: Page, label: string): Promise<void> {
  // Sélecteur de l'item contenant le label
  const item = page.locator('.todo-list li', { hasText: label });

  const count = await item.count();
  if (count === 0) {
    throw new Error(`Tâche "${label}" non trouvée`);
  }

  // Sélecteur de la checkbox
  const checkbox = item.locator('input.toggle');
  await checkbox.check();
}


/* async function ajouterTache(page: import('@playwright/test').Page, label: string): Promise<void> {
  const input = page.locator('input.new-todo');
  await input.fill(label);
  await input.press('Enter');
} */