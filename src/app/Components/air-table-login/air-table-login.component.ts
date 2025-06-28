import { Lengths, Patterns, ValidationMessages } from '@Constants/index';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-air-table-login',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIcon,
  ],
  templateUrl: './air-table-login.component.html',
  styleUrl: './air-table-login.component.css',
})
export class AirTableLoginComponent {
  validationMessages = ValidationMessages;
  hidePassword = true;

  loginForm = new FormGroup({
    email: new FormControl('gelovo6460@asimarif.com', [
      Validators.required,
      Validators.pattern(Patterns.emailPattern),
      Validators.maxLength(Lengths.emailMaxLength),
    ]),
    password: new FormControl('Khan@12345', [Validators.required]),
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AirTableLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  get f() {
    return this.loginForm.controls;
  }

  submit() {
    if (this.loginForm.valid) {
      this.dialogRef.close(this.loginForm.value);
    }
  }
}
