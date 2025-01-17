import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  submitted = false;
  errorMessages: string[] = [];

  constructor(private FormBuilder: FormBuilder, private router: Router, private loginService: LoginService){}

  ngOnInit(): void {
    this.loginForm = this.FormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
      })
  }

  get f(){return this.loginForm.controls}

  async onSubmit(){
    this.submitted = true;
    this.errorMessages = [];

    if(this.loginForm.invalid) {return}

    try{
      const data = await this.loginService.login(this.loginForm);
      if(data && data.token){
        if(data.user.role.type === "Admin"){
          this.router.navigate(['/products'])
        }
        else if(data.user.role.type === "Usuario"){
          this.router.navigate(['/products'])
        }
        else{
          this.errorMessages.push('Error al inicias sesión');
        }
      }
    }
    catch (err: any){
      this.errorMessages.push("El correo eletronico o la contraseña son incorrectas");
    }
  }
}
