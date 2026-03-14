import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { AuthService } from './../../core/auth/services/auth.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
changePasswordForm: FormGroup = new FormGroup({
  password: new FormControl(null, [Validators.required]),
  newPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  rePassword: new FormControl(null, [Validators.required]) 
});

updatePassword(): void {
  if (this.changePasswordForm.valid) {
    const { password, newPassword } = this.changePasswordForm.value;
    const body = { password, newPassword };
    this.authService.changePassword(body).subscribe({
  next: (res) => {
    
    localStorage.setItem('socialToken', res.token);
    
    this.changePasswordForm.reset();
  },
});
  }
}
  

}
