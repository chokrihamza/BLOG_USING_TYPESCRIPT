///<reference path='base-component.ts'/>
///<reference path='../decorators/autobind.ts'/>
///<reference path='../util/validation.ts'/>
///<reference path='../state/project-state.ts'/>
namespace App{
      //ProjetcInput class
export class ProjectInput extends Component<HTMLDivElement,HTMLFormElement>{
    
      TitleInputElement: HTMLInputElement;
      DescriptionInputElement: HTMLInputElement;
      PeopleInputElement: HTMLInputElement;
      constructor() {
            super('project-input', 'app', true, "user-input");
            this.TitleInputElement = <HTMLInputElement>this.element.querySelector('#title');
            this.DescriptionInputElement = <HTMLInputElement>this.element.querySelector('#description');
            this.PeopleInputElement = <HTMLInputElement>this.element.querySelector('#people');
            this.configure()
           }
        configure() {
           
            this.element.addEventListener('submit',this.submitHandler)
      }
      renderContent() {
            
      }
      private gatherUserInput(): [string, string, number]|void {
            const enteredTitle = this.TitleInputElement.value;
            const enteredDescriptor = this.DescriptionInputElement.value;
            const enteredPeople = this.PeopleInputElement.value;
            const titleValidatable: Validatable = {
                  value: enteredTitle,
                  required: true,
            };
            const descriptionValidatable: Validatable = {
                  value: enteredDescriptor,
                  required: true,
                  minLength: 5,
            };
            const peopleValidatable: Validatable = {
                  value: +enteredPeople,
                  required: true,
                  min: 1,
                  max: 5
                  
            };
            if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
                  alert('Invalid Input,Please Try Again!');
                  return   
            }else {
                  return [enteredTitle,enteredDescriptor,+enteredPeople ]
            }
      }

      private clearInput() {
            this.TitleInputElement.value = '';
            this.DescriptionInputElement.value = '';
            this.PeopleInputElement.value ='';
      }
      @autobind
      private submitHandler(event:Event) {
            event.preventDefault();
            const userInput = this.gatherUserInput()
            if (Array.isArray(userInput)) {
                  const [title, desc, people] = userInput;
                  projectState.addProject(title, desc, people);
                 
                  this.clearInput()
            }
      }
    


    
}

}