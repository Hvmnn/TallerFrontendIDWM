import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { routes } from '../../../app.routes';
import { LoginService } from '../../service/login.service';
import { rutValidator } from './rutValidator';
import { Gender } from '../../interface/login';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted: boolean = false;
  errorMessages: string[] = [];
  registrationSucces: boolean = false;
  registrationError: string | null = null;

   constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
   ) {}

   ngOnInit(): void{
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      rut: ['', [Validators.required], rutValidator()],
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
  }
}
