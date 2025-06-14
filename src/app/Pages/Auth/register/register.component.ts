import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { Lengths, Patterns, ValidationMessages } from '@Constants/index';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
  ],
})
export class RegisterComponent {
  validationMessages = ValidationMessages;

  registerForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(Lengths.fullNameMinLength),
      Validators.maxLength(Lengths.fullNameMaxLength),
      Validators.pattern(Patterns.alphabetsPattern),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(Patterns.emailPattern),
      Validators.maxLength(Lengths.emailMaxLength),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(Patterns.passwordPattern),
      Validators.maxLength(Lengths.passwordMaxLength),
      Validators.minLength(Lengths.passwordMinLength),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // Submit the form data to your API here
    }
  }
}
