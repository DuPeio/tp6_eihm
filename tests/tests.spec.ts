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



test('Ajouter une tâche la place à la fin de la liste de 5 taches', async ({ page }) => {

    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

    const input = page.locator('input.new-todo');
    const tasks = page.locator('.todo-list li');

    // Ajouter 5 tâches
    for (let i = 1; i <= 5; i++) {
        await action.ajouterUneTache(page, `Tâche ${i}`)

    }

    // Vérifier qu'il y a 5 tâches
    await verification.verifierNombreTachesAffichees(page, 5);

    // Ajouter une nouvelle tâche
    await action.ajouterUneTache(page, 'Nouvelle tâche')


    // Vérifier qu'il y a maintenant 6 tâches
    await verification.verifierNombreTachesAffichees(page, 6);

    // Vérifier que la nouvelle tâche est la dernière
    const derniereTache = tasks.last();
    await expect(derniereTache).toContainText('Nouvelle tâche');

});


test('ajout en fin de liste de 6 taches et filtres Completed / Active ', async ({ page }) => {

    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

    const input = page.locator('input.new-todo');
    const tasks = page.locator('.todo-list li');

    // Ajouter 5 tâches
    for (let i = 1; i <= 5; i++) {
        await action.ajouterUneTache(page, `Tâche ${i}`)
    }

    // Vérifier qu'il y a 5 tâches
    await verification.verifierNombreTachesAffichees(page, 5);

    // Ajouter une nouvelle tâche
    await action.ajouterUneTache(page, 'Nouvelle tâche')


    // Vérifier qu'il y a maintenant 6 tâches
    await verification.verifierNombreTachesAffichees(page, 6);

    // Vérifier que la nouvelle tâche est la dernière
    const derniereTache = tasks.last();
    await expect(derniereTache).toContainText('Nouvelle tâche');

    // Cocher deux tâches
    await action.basculerStatutTache(page, 'Tâche 2', "fait");
    await action.basculerStatutTache(page, 'Tâche 4', "fait");
    await verification.verifierStatutTache(page, 'Tâche 2', "fait")
    await verification.verifierStatutTache(page, 'Tâche 4', "fait")

    // Filtrer les tâches terminées
    await action.filtrerParStatut(page, 'terminees')
    await verification.verifierNombreTachesAffichees(page, 2)
    const tache1 = 'Tâche 2'
    const tache2 = 'Tâche 4'

    // verifier que les taches cochées sont bien dans la liste terminées  
    const tachesCocher = [tache1, tache2];
    for (const t of tachesCocher) {
        await verification.verifierPresenceTache(page, t)
    }

    // Filtrer les tâches actives
    await await action.filtrerParStatut(page, 'actives')
    await verification.verifierNombreTachesAffichees(page, 4);

    // Vérifier qu'aucune des tâches cochées n'apparaît
    for (const t of tachesCocher) {
        await verification.verifierAbsenceTache(page, t)
    }

});


test('renommer tache avec string vide', async ({ page }) => {

    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

    const tache1 = 'Tâche 1'
    const tache2 = 'Tâche 5'
    const tachesCocher = [tache1, tache2];
    // Ajout de 5 tâches
    for (let i = 1; i <= 5; i++) {
        await action.ajouterUneTache(page, `Tâche ${i}`)

    }
    //Vérification du nombre total de tâches
    await verification.verifierNombreTachesAffichees(page, 5);

    //On renomme en chaine de caracteres vide pour supprimer les taches
    await action.renommerUneTache(page, 'Tâche 1', '');
    await action.renommerUneTache(page, 'Tâche 5', '');

    //On vérifie que les taches ont bien été supprimé pour chaque filtre

    for (const t of tachesCocher) {
        await verification.verifierAbsenceTache(page, t)
    }

    await action.filtrerParStatut(page, 'actives');

    for (const t of tachesCocher) {
        await verification.verifierAbsenceTache(page, t)
    }

    await action.filtrerParStatut(page, 'terminees');

    for (const t of tachesCocher) {
        await verification.verifierAbsenceTache(page, t)
    }


});