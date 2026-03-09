import { test, expect, Page } from '@playwright/test';

// FONCTIONS D'ACTION


/**
 * N:1 - Ajouter une tâche à la liste
 * Abstraction : L'utilisateur "ajoute" une tâche, peu importe la touche (Entrée) ou le bouton.
 */
export async function ajouterUneTache(page: Page, titre: string): Promise<void> {
  const champSaisie = page.locator('input.new-todo');
  await champSaisie.fill(titre);
  await champSaisie.press('Enter');
}

/**
 * N:2.3.1 - Supprimer une tâche existante
 * Abstraction : L'utilisateur "supprime" une tâche identifiée par son nom.
 * Détail technique : Nécessite un hover pour révéler le bouton .destroy
 */
export async function supprimerUneTache(page: Page, titre: string): Promise<void> {
  const ligneTache = getLigneTache(page, titre);
  await ligneTache.hover(); 
  await ligneTache.locator('button.destroy').click();
}

/**
 * N:2.3.2 - Changer le statut (Faire / Fait)
 * Abstraction : Basculer l'état d'une tâche.
 */
export async function basculerStatutTache(page: Page, titre: string, etatCible: 'fait' | 'a_faire'): Promise<void> {
  const ligneTache = getLigneTache(page, titre);
  const checkbox = ligneTache.locator('input.toggle');
  
  const estCoche = await checkbox.isChecked();
  const doitEtreCoche = (etatCible === 'fait');

  if (estCoche !== doitEtreCoche) {
    await checkbox.click();
  }
}

/**
 * N:2.3.3 - Modifier le libellé d'une tâche
 * Abstraction : Renommer une tâche.
 */
export async function renommerUneTache(page: Page, ancienTitre: string, nouveauTitre: string): Promise<void> {
  const ligneTache = getLigneTache(page, ancienTitre);
  await ligneTache.dblclick();
  
  const inputEdition = ligneTache.locator('input.edit');
  await inputEdition.fill(nouveauTitre);
  await inputEdition.press('Enter');
}


/**
 * N:2.1 - Filtrer la liste par statut
 * Abstraction : L'utilisateur "voit" les tâches actives, complètes ou toutes.
 */
export async function filtrerParStatut(page: Page, filtre: 'toutes' | 'actives' | 'terminees'): Promise<void> {
  let hrefValue = '';
  switch (filtre) {
    case 'toutes':
      hrefValue = '#/';
      break;
    case 'actives':
      hrefValue = '#/active';
      break;
    case 'terminees':
      hrefValue = '#/completed';
      break;
  }
  
  // Sélection précise via l'attribut href dans la liste .filters
  await page.locator(`ul.filters li a[href="${hrefValue}"]`).click();
}


export function getLigneTache(page: Page, titre: string) {
  // Sélectionne le li qui contient un label avec le texte exact
  return page.locator('ul.todo-list li').filter({ hasText: titre });
}

export async function viderTachesTerminees(page: Page){
    await page.getByRole('button', { name: 'Clear Completed' }).click();
}
