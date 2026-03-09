// import { test, expect, Page } from '@playwright/test';

// async function nommerTache(page: Page, label: string): Promise<void> {
//   const input = page.locator('input.new-todo');
//   await input.fill(label);
// }

// // 2. Fonction qui ajoute la tâche à la liste (appui sur Entrée)
// async function ajouterTacheALaListe(page: Page): Promise<void> {
//   const input = page.locator('input.new-todo');
//   await input.press('Enter');
// }

// // 3. Fonction qui utilise les deux précédentes
// async function ajouterTache(page: Page, label: string): Promise<void> {
//   await nommerTache(page, label);
//   await ajouterTacheALaListe(page);
// }



// test('Ajouter une tâche avec fonctions décomposées', async ({ page }) => {

//   await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

//   await ajouterTache(page, 'Tâche TP 1');

//   const items = page.locator('.todo-list li');
//   await expect(items).toHaveCount(1);

// });

 //----------------------------------
import { test, expect, Page } from '@playwright/test';
import { cocherTache, supprimerTache, remettreTacheAFaire, renommerTache } from '../fonctions';

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


function getLigneTache(page: Page, titre: string) {
  // Sélectionne le li qui contient un label avec le texte exact
  return page.locator('ul.todo-list li').filter({ hasText: titre });
}


//FONCTIONS DE VÉRIFICATION

/**
 * Vérifie qu'une tâche avec un titre donné est visible dans la liste.
 */
export async function verifierPresenceTache(page: Page, titre: string): Promise<void> {
  await expect(getLigneTache(page, titre)).toBeVisible();
}

/**
 * Vérifie qu'une tâche n'est plus dans la liste.
 * Niveau : C&T
 */
export async function verifierAbsenceTache(page: Page, titre: string): Promise<void> {
  await expect(getLigneTache(page, titre)).not.toBeVisible();
}

/**
 * Vérifie le nombre total de tâches affichées (dans le filtre actuel).
 */
export async function verifierNombreTachesAffichees(page: Page, nombre: number): Promise<void> {
  await expect(page.locator('ul.todo-list li')).toHaveCount(nombre);
}

/**
 * Vérifie si une tâche est marquée comme "faite" visuellement.
 */
export async function verifierStatutTache(page: Page, titre: string, etat: 'fait' | 'a_faire'): Promise<void> {
  const ligne = getLigneTache(page, titre);
  const checkbox = ligne.locator('input.toggle');
  const estCoche = await checkbox.isChecked();
  
  if (etat === 'fait') {
    expect(estCoche).toBe(true);
  } else {
    expect(estCoche).toBe(false);
  }
}


// SCÉNARIOS DE TEST
test.describe('Gestion de la "To-Do List" (Modèle de Tâche)', () => {

  test('N:1 - Scénario : Ajouter une nouvelle tâche', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

    await ajouterUneTache(page, 'Apprendre Playwright');

    await verifierPresenceTache(page, 'Apprendre Playwright');
    await verifierNombreTachesAffichees(page, 1);
  });

  test('N:2.1 - Scénario : Filtrer les tâches par statut', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

    // Préparation
    await ajouterUneTache(page, 'Tâche 1');
    await ajouterUneTache(page, 'Tâche 2');
    await basculerStatutTache(page, 'Tâche 2', 'fait');

    // Test N:2.1.2 : Voir les tâches actives (href="#/active")
    await filtrerParStatut(page, 'actives');
    await verifierNombreTachesAffichees(page, 1);
    await verifierPresenceTache(page, 'Tâche 1');
    await verifierAbsenceTache(page, 'Tâche 2');

    // Test N:2.1.1 : Voir les tâches terminées (href="#/completed")
    await filtrerParStatut(page, 'terminees');
    await verifierNombreTachesAffichees(page, 1);
    await verifierPresenceTache(page, 'Tâche 2');

    // Test N:2.1.3 : Revoir tout (href="#/")
    await filtrerParStatut(page, 'toutes');
    await verifierNombreTachesAffichees(page, 2);
  });

  test('N:2.3.2 & N:2.3.1 - Scénario : Compléter puis supprimer une tâche', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

    await ajouterUneTache(page, 'Tâche à lifecycle complet');

    await basculerStatutTache(page, 'Tâche à lifecycle complet', 'fait');
    await verifierStatutTache(page, 'Tâche à lifecycle complet', 'fait');

    await supprimerUneTache(page, 'Tâche à lifecycle complet');

    await verifierAbsenceTache(page, 'Tâche à lifecycle complet');
    await verifierNombreTachesAffichees(page, 0);
  });

  test('N:2.3.3 - Scénario : Modifier le nom d une tâche', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

    await ajouterUneTache(page, 'Nom Provisoire');

    await renommerUneTache(page, 'Nom Provisoire', 'Nom Définitif');

    await verifierAbsenceTache(page, 'Nom Provisoire');
    await verifierPresenceTache(page, 'Nom Définitif');
  });

});



test('Supprimer une tâche', async ({ page }) => {

  await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

  // Ajouter une tâche avant de la supprimer
  const input = page.locator('input.new-todo');
  await input.fill('Tâche à supprimer');
  await input.press('Enter');

  // Vérifier qu'elle existe
  const items = page.locator('.todo-list li');
  await expect(items).toHaveCount(1);

  // Supprimer la tâche
  await supprimerTache(page, 'Tâche à supprimer');

  // Vérifier qu'elle a été supprimée
  await expect(items).toHaveCount(0);

});


test('Cocher une tâche comme faite', async ({ page }) => {

  await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

  // Ajouter une tâche
  const input = page.locator('input.new-todo');
  await input.fill('Tâche à cocher');
  await input.press('Enter');

  // Vérifier qu'elle est initialement non cochée
  const task = page.locator('.todo-list li', { hasText: 'Tâche à cocher' });
  const checkbox = task.locator('input.toggle');
  await expect(checkbox).not.toBeChecked();

  // Cocher la tâche
  await cocherTache(page, 'Tâche à cocher');

  // Vérifier qu'elle est cochée
  await expect(checkbox).toBeChecked();

});




test('Changer une tâche terminée en tâche à faire', async ({ page }) => {

  await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

  const input = page.locator('input.new-todo');

  // Ajouter une tâche
  await input.fill('Ma tâche');
  await input.press('Enter');

  const task = page.locator('.todo-list li', { hasText: 'Ma tâche' });
  const checkbox = task.locator('input.toggle');

  // Marquer la tâche comme terminée
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  // Remettre la tâche à faire
  await remettreTacheAFaire(page, 'Ma tâche');

  // Vérifier que la tâche est maintenant à faire
  await expect(checkbox).not.toBeChecked();

});




test('Changer le nom d une tâche', async ({ page }) => {

  await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

  const input = page.locator('input.new-todo');

  // Ajouter une tâche
  await input.fill('Ancienne tâche');
  await input.press('Enter');

  // Renommer la tâche
  await renommerTache(page, 'Ancienne tâche', 'Nouvelle tâche');

  // Vérifier que le nouveau nom apparaît
  const updatedTask = page.locator('.todo-list li', { hasText: 'Nouvelle tâche' });
  await expect(updatedTask).toHaveCount(1);

});