import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly defaultDuration = 3000; // 3 seconds
  private readonly horizontalPosition: MatSnackBarHorizontalPosition = 'end'; // right
  private readonly verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show success toast (green)
   */
  success(message: string, duration: number = this.defaultDuration): void {
    this.show(message, 'success', duration);
  }

  /**
   * Show error toast (red)
   */
  error(message: string, duration: number = 5000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Show warning toast (orange/yellow)
   */
  warning(message: string, duration: number = this.defaultDuration): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Show info toast (blue)
   */
  info(message: string, duration: number = this.defaultDuration): void {
    this.show(message, 'info', duration);
  }

  /**
   * Show toast with custom configuration
   */
  private show(message: string, type: ToastType, duration: number): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [`toast-${type}`],
      politeness: 'polite'
    };

    this.snackBar.open(message, 'Close', config);
  }
}

