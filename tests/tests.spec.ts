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

    test('N:1.2 - Ajouter une tâche à la fin d une liste existante', async ({ page }) => {
            await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

            // Création d'un contexte
            for (let i = 1; i <= 5; i++) {
                await action.ajouterUneTache(page, `Tâche ${i}`);
            }
            await verification.verifierNombreTachesAffichees(page, 5);

            // Action : Ajout d'une nouvelle tâche
            await action.ajouterUneTache(page, 'Tâche Finale');

            // Vérifications
            await verification.verifierNombreTachesAffichees(page, 6);
            await verification.verifierPresenceTache(page, 'Tâche Finale');
            
            // Vérification spécifique qu'elle est bien en dernière position
            const derniereTache = page.locator('ul.todo-list li').last();
            await expect(derniereTache).toContainText('Tâche Finale');
    });


    test('N:2.1 - Filtrer les tâches Actives vs Terminées', async ({ page }) => {
            await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

            // Préparation : 2 tâches actives, 2 tâches terminées
            const tacheActive = 'Tâche Active';
            const tacheFinie = 'Tâche Finie';
            
            await action.ajouterUneTache(page, tacheActive);
            await action.ajouterUneTache(page, 'Autre Active');
            await action.ajouterUneTache(page, tacheFinie);
            await action.ajouterUneTache(page, 'Autre Finie');

            // On en termine 2
            await action.basculerStatutTache(page, tacheFinie, 'fait');
            await action.basculerStatutTache(page, 'Autre Finie', 'fait');

            // --- Test N:2.1.2 : Filtre Actives ---
            await action.filtrerParStatut(page, 'actives');
            await verification.verifierNombreTachesAffichees(page, 2);
            await verification.verifierPresenceTache(page, tacheActive);
            await verification.verifierAbsenceTache(page, tacheFinie);

            // --- Test N:2.1.1 : Filtre Terminées ---
            await action.filtrerParStatut(page, 'terminees');
            await verification.verifierNombreTachesAffichees(page, 2);
            await verification.verifierPresenceTache(page, tacheFinie);
            await verification.verifierAbsenceTache(page, tacheActive);

            // --- Test N:2.1.3 : Filtre Toutes ---
            await action.filtrerParStatut(page, 'toutes');
            await verification.verifierNombreTachesAffichees(page, 4);
    });

    test('N:2.3.1 - Supprimer une tâche spécifique', async ({ page }) => {
            await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');
            
            await action.ajouterUneTache(page, 'Tâche A');
            await action.ajouterUneTache(page, 'Tâche B à supprimer');
            await verification.verifierNombreTachesAffichees(page, 2);

            // Action : Suppression
            await action.supprimerUneTache(page, 'Tâche B à supprimer');

            // Vérifications
            await verification.verifierNombreTachesAffichees(page, 1);
            await verification.verifierAbsenceTache(page, 'Tâche B à supprimer');
            await verification.verifierPresenceTache(page, 'Tâche A');
    });

        
    test('N:2.3.2 - Basculer une tâche de "à faire" à "faite"', async ({ page }) => {
        await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');
        
        await action.ajouterUneTache(page, 'Tâche à cocher');
        
        // Action : Marquer comme fait
        await action.basculerStatutTache(page, 'Tâche à cocher', 'fait');
        await verification.verifierStatutTache(page, 'Tâche à cocher', 'fait');

        // Action : Re-marquer comme à faire
        await action.basculerStatutTache(page, 'Tâche à cocher', 'a_faire');
        await verification.verifierStatutTache(page, 'Tâche à cocher', 'a_faire');
    });

    test('N:2.3.3 - Scénario : Modifier le nom d une tâche', async ({ page }) => {
        await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

        await action.ajouterUneTache(page, 'Nom Provisoire');

        await action.renommerUneTache(page, 'Nom Provisoire', 'Nom Définitif');

        await verification.verifierAbsenceTache(page, 'Nom Provisoire');
        await verification.verifierPresenceTache(page, 'Nom Définitif');
    });

    test('N:2.3.3 - Renommer avec une chaîne vide (Suppression implicite)', async ({ page }) => {
            await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');
            
            await action.ajouterUneTache(page, 'Tâche à supprimer par vide');
            await verification.verifierNombreTachesAffichees(page, 1);

            // Action : Renommer avec vide (comportement standard TodoMVC)
            await action.renommerUneTache(page, 'Tâche à supprimer par vide', '');
            
            // Vérification : La tâche a disparu
            await verification.verifierNombreTachesAffichees(page, 0);
            await verification.verifierAbsenceTache(page, 'Tâche à supprimer par vide');
        });

    test('N:2.3 - Vider toutes les tâches terminées', async ({ page }) => {
            await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');
            
            // Préparation : 3 tâches dont 2 finies
            await action.ajouterUneTache(page, 'Reste 1');
            await action.ajouterUneTache(page, 'Finie 1');
            await action.ajouterUneTache(page, 'Finie 2');
            
            await action.basculerStatutTache(page, 'Finie 1', 'fait');
            await action.basculerStatutTache(page, 'Finie 2', 'fait');
            
            await verification.verifierNombreTachesAffichees(page, 3);

            // Action : Vider les tâches terminées
            await action.viderTachesTerminees(page);

            // Vérifications
            await verification.verifierNombreTachesAffichees(page, 1);
            await verification.verifierPresenceTache(page, 'Reste 1');
            await verification.verifierAbsenceTache(page, 'Finie 1');
            await verification.verifierAbsenceTache(page, 'Finie 2');
        });
});




test('Ajouter une tâche et la place à la fin de la liste de 5 taches', async ({ page }) => {

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
    await action.ajouterUneTache(page, 'Nouvelle tâche');

    // Vérifier qu'il y a maintenant 6 tâches
    await verification.verifierNombreTachesAffichees(page, 6);

    // Vérifier que la nouvelle tâche est la dernière
    const derniereTache = tasks.last();
    await expect(derniereTache).toContainText('Nouvelle tâche');

});


test('Ajout en fin de liste de 6 taches et filtres Completed / Active ', async ({ page }) => {

    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');

    const input = page.locator('input.new-todo');
    const tasks = page.locator('.todo-list li');
    const tache1 = 'Tâche 2'
    const tache2 = 'Tâche 4'

    // Ajouter 5 tâches
    for (let i = 1; i <= 5; i++) {
        await action.ajouterUneTache(page, `Tâche ${i}`)
    }

    // Vérifier qu'il y a 5 tâches
    await verification.verifierNombreTachesAffichees(page, 5);

    // Ajouter une nouvelle tâche
    await action.ajouterUneTache(page, 'Nouvelle tâche');

    // Vérifier qu'il y a maintenant 6 tâches
    await verification.verifierNombreTachesAffichees(page, 6);

    // Vérifier que la nouvelle tâche est la dernière
    const derniereTache = tasks.last();
    await expect(derniereTache).toContainText('Nouvelle tâche');

    // Cocher deux tâches
    await action.basculerStatutTache(page, tache1, "fait");
    await action.basculerStatutTache(page, tache2, "fait");
    await verification.verifierStatutTache(page, tache1, "fait")
    await verification.verifierStatutTache(page, tache2, "fait")

    // Filtrer les tâches terminées
    await action.filtrerParStatut(page, 'terminees')
    await verification.verifierNombreTachesAffichees(page, 2)
  

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


test('Clear les taches finies', async ({ page }) => {

    await page.goto('https://todomvc.com/examples/angular/dist/browser/#/all');
    
    const input = page.locator('input.new-todo');
    const tasks = page.locator('.todo-list li');
    const tache1 = 'Tâche 2'
    const tache2 = 'Tâche 4'
    const tachesCocher = [tache1, tache2];
    
    // Ajouter 5 tâches
    for (let i = 1; i <= 5; i++) {
        await action.ajouterUneTache(page, `Tâche ${i}`)
    }

    // Vérifier qu'il y a 5 tâches
    await verification.verifierNombreTachesAffichees(page, 5);

    //Cocher 2 taches comme faites
    await action.basculerStatutTache(page, tache1, "fait");
    await action.basculerStatutTache(page, tache2, "fait");
    await verification.verifierStatutTache(page, tache1, "fait")
    await verification.verifierStatutTache(page, tache2, "fait")

    //On vide les taches terminees
    await action.viderTachesTerminees(page);

    //On verifie
    await verification.verifierNombreTachesAffichees(page, 3);
    for (const t of tachesCocher) {
        await verification.verifierAbsenceTache(page, t)
    }

});

test('Scénario Complet : Cycle de vie d une To-Do List', async ({ page }) => {
        await page.goto('https://todomvc.com/examples/angular/dist/browser/#/');

        // 1. Ajout massif
        for (let i = 1; i <= 4; i++) {
            await action.ajouterUneTache(page, `Tâche ${i}`);
        }
        await verification.verifierNombreTachesAffichees(page, 4);

        // 2. Modification d'une tâche
        await action.renommerUneTache(page, 'Tâche 2', 'Tâche 2 Modifiée');
        await verification.verifierAbsenceTache(page, 'Tâche 2');

        // 3. Complétion de certaines tâches
        await action.basculerStatutTache(page, 'Tâche 1', 'fait');
        await action.basculerStatutTache(page, 'Tâche 2 Modifiée', 'fait');

        // 4. Filtrage pour vérifier l'état
        await action.filtrerParStatut(page, 'terminees');
        await verification.verifierNombreTachesAffichees(page, 2);
        
        await action.filtrerParStatut(page, 'actives');
        await verification.verifierNombreTachesAffichees(page, 2);

        // 5. Suppression globale des terminées
        await action.filtrerParStatut(page, 'toutes'); // Retour à la vue globale pour le bouton
        await action.viderTachesTerminees(page);
        
        // 6. Vérification finale
        await verification.verifierNombreTachesAffichees(page, 2); // Il ne reste que les 2 actives
        await verification.verifierAbsenceTache(page, 'Tâche 1');
        await verification.verifierAbsenceTache(page, 'Tâche 2 Modifiée');
});