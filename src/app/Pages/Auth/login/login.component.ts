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
import { SubscriptionService } from '@Services/subscription.service';
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
  subscription: any;

  constructor(
    private toastService: ToastserviceService,
    private api: ApiService,
    private asyncHandler: AsyncHandlerService,
    private localstorage: LocalStorageService,
    private router: Router,
    private notificationSubscription: SubscriptionService
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

      this.notificationSubscription
        .subscribeUser()
        .then((subscription: any) => {
          if (!subscription) {
            this.toastService.errorMessage(
              'Please allow notifications to continue.'
            );
            this.loading = false;
            return;
          }
          // Send subscription along with login form
          const payload = {
            ...this.loginForm.value,
            subscription,
          };

          this.asyncHandler.handleObservable(
            this.api.postData(API_URL.login, payload),
            (data: any) => {
              this.toastService.successMessage(
                data?.message || 'Login successful!'
              );
              this.localstorage.setData(ENUMS.userData, data?.data?.userData);
              this.localstorage.setJwtTokens(data?.data);
              this.router.navigate(['/']);
            },
            () => {
              this.loading = false;
            }
          );
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
}
