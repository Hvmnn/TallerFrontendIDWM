import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { rutValidator } from './rutValidator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted: boolean = false;
  errorMessages: string[] = [];
  registrationSuccess: boolean = false;
  registrationError: string | null = null;

   constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
   ) {}

   ngOnInit(): void{
    this.registerForm = this.formBuilder.group({
      rut: ['', [Validators.required], rutValidator()],
      name: ['', [Validators.required]],
      birthday: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(0[1-9]|[1-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/[0-9]{2}$'
          )
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      GenderId: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  get f(){return this.registerForm.controls}

  async onSubmit(){
    this.submitted = true;
    this.errorMessages = [];
    this.registrationError = null;

    if(this.registerForm.invalid){
      return;
    }
    if(this.registerForm.value.password !== this.registerForm.value.confirmPassword){
      this.errorMessages.push('Las contraseñas no son iguales.');
      return;
    }

    try {
      const data = await this.loginService.register(this.registerForm);
      if (data && data.token) {
        this.registrationSuccess = true;
        setTimeout(() => {
          this.router.navigate(['']);
        }, 4000);
      } else {
        this.registrationError = data.message;
      }
    } catch (err: any) {
      this.errorMessages.push('Ha ocurrido un error al crear la cuenta');
    }
  }

  closeSuccessMessage(): void {
    this.registrationSuccess = false;
    this.router.navigate(['']);
  }

  closeErrorMessage(): void {
    this.registrationError = null;
  }
}
