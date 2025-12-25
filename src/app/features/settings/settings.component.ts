import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { ProfileSettingsDialogComponent } from './components/profile-settings-dialog/profile-settings-dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  onProfileSettings(): void {
    const dialogRef = this.dialog.open(ProfileSettingsDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Profile updated');
      }
    });
  }

  onChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Password changed');
      }
    });
  }

  onLogout(): void {
    console.log('Logout button clicked');
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout completed successfully');
        this.toastService.success('Logout successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Even if logout API fails, we've cleared local storage
        // Show success message anyway since local logout succeeded
        console.log('Logout completed (API may have failed, but local cleanup succeeded)');
        this.toastService.success('Logout successful');
        this.router.navigate(['/login']);
      }
    });
  }
}

