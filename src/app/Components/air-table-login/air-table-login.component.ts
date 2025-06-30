import {
  API_URL,
  Lengths,
  Patterns,
  ValidationMessages,
} from '@Constants/index';
import { updateUserKeys } from '@Helpers/AirTableKeys';
import { ApiService } from '@Services/api.service';
import { AsyncHandlerService } from '@Services/async-handler.service';
import { ToastserviceService } from '@Services/toastservice.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-air-table-login',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIcon,
  ],
  templateUrl: './air-table-login.component.html',
  styleUrl: './air-table-login.component.css',
})
export class AirTableLoginComponent {
  validationMessages = ValidationMessages;
  hidePassword = true;
  loading: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('gelovo6460@asimarif.com', [
      Validators.required,
      Validators.pattern(Patterns.emailPattern),
      Validators.maxLength(Lengths.emailMaxLength),
    ]),
    password: new FormControl('Khan@12345', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<AirTableLoginComponent>,
    private toast: ToastserviceService,
    private api: ApiService,
    private asyncHandler: AsyncHandlerService
  ) {}

  get f() {
    return this.loginForm.controls;
  }

  submit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.asyncHandler.handleObservable(
        this.api.postData(API_URL.airtableLogin, this.loginForm.value),
        (res: any) => {
          const { mfa, sessionId } = res?.data;
          if (mfa && mfa?.required) {
            this.dialogRef.close({ mfa: true, sessionId });
          } else {
            this.toast.successMessage(res.message || 'Scrapping started');
            this.toast.successMessage('Air Table logged in successfully');
            updateUserKeys('dataScrap', 'PENDING');
            this.dialogRef.close({ mfa: false, sessionId });
          }
        }
      );
    }
  }
}
