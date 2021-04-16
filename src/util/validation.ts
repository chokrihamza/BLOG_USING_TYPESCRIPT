namespace App{//Validation logic
export interface Validatable{
      value: string|number;
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      min?: number;
      max?: number;
}
export function validate(validatableInput:Validatable) {
      let isValid = true;
      if (validatableInput.required) {
            isValid=isValid&&validatableInput.value.toString().trim().length!==0
      }
      if (validatableInput.minLength!==undefined&& typeof validatableInput.value==='string') {
            isValid = isValid && validatableInput.value.length >= validatableInput.minLength;


      }
      if (validatableInput.maxLength!==undefined&& typeof validatableInput.value==='string') {
            isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
            

      }
      if (validatableInput.min !== null&&validatableInput.min !== undefined && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value>= validatableInput.min 
      }
      if (validatableInput.max !== null&&validatableInput.max !== undefined && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value<= validatableInput.max 
      }
      return isValid;
}}