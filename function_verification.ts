import { expect, Page } from '@playwright/test';
import { getLigneTache } from './function_action';

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