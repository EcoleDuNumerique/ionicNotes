import {AbstractControl} from '@angular/forms';

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    console.log(AC.get('password').value);

    let password = AC.get('password').value;
    let confirmPassword = AC.get('passwordConfirmation').value;
    if(password != confirmPassword) {
      console.log('false');
      AC.get('passwordConfirmation').setErrors({
        MatchPassword: true
      });
    } else {
      console.log('true');
      return null
    }
  }
}
