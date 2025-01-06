import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditClientService } from '../../service/edit-client.service';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-edit-client',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent {
  editForm!: FormGroup;
  submitted: boolean = false;
  errorMessages: string[] = [];
  editSuccess: boolean = false;
  editError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private editService: EditClientService,
    private auth: AuthService
  ){}

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required]],  
      birthday: ['', [Validators.required, this.validateBirthday]],
      genderId: ['',[Validators.required ,Validators.min(1), Validators.max(4)]]
    });
  }

  get f(){return this.editForm.controls}

  async onSubmit(){
    this.submitted = true;
    this.errorMessages = [];
    this.editError = null;

    const formValues = this.editForm.value;
    const formattedBirthday = this.formatDateToISO(formValues.birthday)

    const load = {
      name: formValues.name,
      birthday: formattedBirthday,
      genderId: formValues.genderId
    };
    try{
      console.log(this.editForm.value);
      this.editService.updateClient(this.editForm.value)
    }
    catch (error){
      this.editError = 'Error desconocido';
      console.error(error);
    }
  }

  formatDateToISO(dateString: string): string {
    // Convierte de dd-MM-yyyy a yyyy-MM-dd
    const [day, month, year] = dateString.split('-').map((part) => parseInt(part, 10));
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  validateBirthday(control: any): { [key: string]: boolean } | null {
    const dateValue = control.value;
    const currentDate = new Date();
    const inputDate = new Date(dateValue);

    if (!dateValue || isNaN(inputDate.getTime())) {
      return { invalidDate: true }; // Fecha inválida
    }

    if (inputDate >= currentDate) {
      return { futureDate: true }; // Fecha futura
    }

    return null; // Fecha válida
  }
}
