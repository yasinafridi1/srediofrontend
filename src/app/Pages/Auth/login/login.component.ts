import { Component } from '@angular/core';
import {
  Validators,
  FormGroup,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import {
  API_URL,
  ENUMS,
  Lengths,
  Patterns,
  ValidationMessages,
} from '@Constants/index';
import { AuthLayoutComponent } from '@Layouts/auth-layout/auth-layout.component';
import { ToastserviceService } from '@Services/toastservice.service';
import { AsyncHandlerService } from '@Services/async-handler.service';
import { ApiService } from '@Services/api.service';
import { LocalStorageService } from '@Services/local-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIf,
    AuthLayoutComponent,
  ],
})
export class LoginComponent {
  validationMessages = ValidationMessages;
  hidePassword = true;
  loading = false;

  constructor(
    private toastService: ToastserviceService,
    private api: ApiService,
    private asyncHandler: AsyncHandlerService,
    private localstorage: LocalStorageService,
    private router: Router
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('khan@gmail.com', [
      Validators.required,
      Validators.pattern(Patterns.emailPattern),
      Validators.maxLength(Lengths.emailMaxLength),
    ]),
    password: new FormControl('Khan@1234', [
      Validators.required,
      Validators.pattern(Patterns.passwordPattern),
      Validators.maxLength(Lengths.passwordMaxLength),
      Validators.minLength(Lengths.passwordMinLength),
    ]),
  });

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.asyncHandler.handleObservable(
        this.api.postData(API_URL.login, this.loginForm.value),
        (data: any) => {
          this.toastService.successMessage(
            data?.message || 'Login successful!'
          );
          this.localstorage.setData(ENUMS.userData, data?.data?.userData);
          this.localstorage.setJwtTokens(data?.data);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
          // Handle successful login, e.g., store tokens, redirect, etc.
        },
        () => {
          this.loading = false;
        }
      );
    }
  }
}
