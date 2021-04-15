//Project Management Class
class ProjectState{
      private projects: any[] = [];
      private static instance: ProjectState;
      private constructor() {
            
      }
      static getInstance() {
            if (this.instance) {
                  return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance
      }
      addProject(title:string,description:string,numOfPeople:number) {
            const newProject = {
                  id: Math.random().toString(),
                  title: title,
                  decription: description,
                  people: numOfPeople,
                  
            };
            this.projects.push(newProject);
      }
}

const projectState = ProjectState.getInstance();
//Validation logic
interface Validatable{
      value: string|number;
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      min?: number;
      max?: number;
}
function validate(validatableInput:Validatable) {
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
}
//autobind decorator
function autobind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
      
      const originalMethod = descriptor.value;
      const ajustedDescriptor:PropertyDescriptor={
            configurable: true,
            get() {
                  const boundFn = originalMethod.bind(this);
                  return boundFn
            }
            

      }
      return ajustedDescriptor
}
//ProjectList Class
class ProjectList{
      templateElement: HTMLTemplateElement;
      hostElement: HTMLDivElement;
      element: HTMLElement;
      constructor(private type:'active'|'finished') {
            this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
            this.hostElement = <HTMLDivElement>document.getElementById('app')!;
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = <HTMLElement>importedNode.firstElementChild;
            this.element.id = `${this.type}-projects`;
            this.attach();
            this.renderContent()
      }
      private renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector('ul')!.id = listId;
            this.element.querySelector('h2')!.textContent=this.type.toUpperCase()+'PROJECTS'
      }
      private attach() {
            this.hostElement.insertAdjacentElement('beforeend',this.element)
      }
}



//ProjetcInput class
class ProjectInput{
      templateElement: HTMLTemplateElement;
      hostElement: HTMLDivElement;
      element: HTMLFormElement;
      TitleInputElement: HTMLInputElement;
      DescriptionInputElement: HTMLInputElement;
      PeopleInputElement: HTMLInputElement;
      constructor() {
            this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
            this.hostElement = <HTMLDivElement>document.getElementById('app')!;
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = <HTMLFormElement>importedNode.firstElementChild;
            this.element.id = "user-input";
            this.TitleInputElement = <HTMLInputElement>this.element.querySelector('#title');
            this.DescriptionInputElement = <HTMLInputElement>this.element.querySelector('#description');
            this.PeopleInputElement = <HTMLInputElement>this.element.querySelector('#people');
            this.configure()
            this.attach();
            
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
                  console.log(title,desc,people)
            }
            this.clearInput()
      }
      
      private configure() {
            this.element.addEventListener('submit',this.submitHandler)
      }


      private attach() {
            this.hostElement.insertAdjacentElement('afterbegin',this.element)
      }
}

const projInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishProjectList = new ProjectList('finished');