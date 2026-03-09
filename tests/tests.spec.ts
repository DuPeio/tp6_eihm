import { test, expect, Page } from '@playwright/test';
import * as action from '../function_action';
import * as verification from '../function_verification';


// SCÉNARIOS DE TEST
test.describe('Gestion de la "To-Do List" (Modèle de Tâche)', () => {

  test('N:1 - Scénario : Ajouter une nouvelle tâche', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

    await action.ajouterUneTache(page, 'Apprendre Playwright');

    await verification.verifierPresenceTache(page, 'Apprendre Playwright');
    await verification.verifierNombreTachesAffichees(page, 1);
  });

  test('N:2.1 - Scénario : Filtrer les tâches par statut', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

    // Préparation
    await action.ajouterUneTache(page, 'Tâche 1');
    await action.ajouterUneTache(page, 'Tâche 2');
    await action.basculerStatutTache(page, 'Tâche 2', 'fait');

    // Test N:2.1.2 : Voir les tâches actives (href="#/active")
    await action.filtrerParStatut(page, 'actives');
    await verification.verifierNombreTachesAffichees(page, 1);
    await verification.verifierPresenceTache(page, 'Tâche 1');
    await verification.verifierAbsenceTache(page, 'Tâche 2');

    // Test N:2.1.1 : Voir les tâches terminées (href="#/completed")
    await action.filtrerParStatut(page, 'terminees');
    await verification.verifierNombreTachesAffichees(page, 1);
    await verification.verifierPresenceTache(page, 'Tâche 2');

    // Test N:2.1.3 : Revoir tout (href="#/")
    await action.filtrerParStatut(page, 'toutes');
    await verification.verifierNombreTachesAffichees(page, 2);
  });

  test('N:2.3.2 & N:2.3.1 - Scénario : Compléter puis supprimer une tâche', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

    await action.ajouterUneTache(page, 'Tâche à lifecycle complet');

    await action.basculerStatutTache(page, 'Tâche à lifecycle complet', 'fait');
    await verification.verifierStatutTache(page, 'Tâche à lifecycle complet', 'fait');

    await action.supprimerUneTache(page, 'Tâche à lifecycle complet');

    await verification.verifierAbsenceTache(page, 'Tâche à lifecycle complet');
    await verification.verifierNombreTachesAffichees(page, 0);
  });

  test('N:2.3.3 - Scénario : Modifier le nom d une tâche', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

    await action.ajouterUneTache(page, 'Nom Provisoire');

    await action.renommerUneTache(page, 'Nom Provisoire', 'Nom Définitif');

    await verification.verifierAbsenceTache(page, 'Nom Provisoire');
    await verification.verifierPresenceTache(page, 'Nom Définitif');
  });

});