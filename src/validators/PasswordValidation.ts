import {AbstractControl} from '@angular/forms';

/**
 * Notre classe de validation pour matcher les mots de passe
 */
export class PasswordValidation {

  /**
   * Les deux mots de passes doivent être identiques
   *
   * @param {AbstractControl} AC
   * @returns {any}
   * @constructor
   */
  static MatchPassword(AC: AbstractControl) {

    //  On récupère la valeur de nos 2 mots de passe
    let password = AC.get('password').value;
    let confirmPassword = AC.get('passwordConfirmation').value;

    //  On vérifie qu'ils ne sont pas égaux
    if(password != confirmPassword) {
      //  Si c'est le cas, le rapport d'erreur passe à true (il y a des erreurs)
      AC.get('passwordConfirmation').setErrors({
        MatchPassword: true
      });
    } else {
      //  Pas d'erreur, false donc
      return null
    }
  }
}
