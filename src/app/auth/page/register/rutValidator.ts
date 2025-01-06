import { AbstractControl, ValidatorFn } from "@angular/forms";

export function rutValidator(): ValidatorFn{
    return(control: AbstractControl): {[key: string]: any} | null =>{
        const valid = validateRut(control.value);
        return valid ? null: {invalidRut: {value: control.value}};
    };
}

function validateRut(rut: string): boolean{
    if (!rut || rut.length < 7) return false;

    rut = rut.replace(/[\.\-]/g, '');
    const body = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
  
    let sum = 0;
    let mul = 2;
  
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i)) * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
  
    const res = sum % 11;
    const computedDv = res === 1 ? 'K' : res === 0 ? '0' : (11 - res).toString();
  
    return computedDv === dv;
}