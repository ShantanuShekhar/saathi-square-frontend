// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
})
export class LoginComponent {
  loginForm!: FormGroup;
  hide = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please enter valid credentials.', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const payload = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
       // 🔹 Save token
      localStorage.setItem('token', res.token);

      // 🔹 Trigger BehaviorSubject
      this.authService.setLogin(res.token);

        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
