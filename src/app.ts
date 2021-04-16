//Drag and Drop interfaces
interface Draggable{
      dragStartHandler(event:DragEvent):void;
      dragEndHandler(event: DragEvent): void;

};
interface DragTarget{
      dragOverHandler(event:DragEvent):void;
      dropHandler(event:DragEvent):void;
      dragLeaveHandler(event:DragEvent):void;
}

//Project Type
enum ProjectSatus{
      Active,
      Finishid
}
class Project{
      constructor(public id: string,
            public title: string,
            public decription: string,
            public people: number,
            public status:ProjectSatus
      
      ) {
            
      }
}
//Project state Management Class
type Listener<T> = (item: T[]) => void
 //class State
class state<T>{
      protected listeners: Listener<T>[] = [];
      addListeners(listenerFn:Listener<T>) {
            this.listeners.push(listenerFn);
      }
}
 //ProjectState 
class ProjectState extends state<Project>{
     
      private projects: Project[] = [];
      private static instance: ProjectState;
      private constructor() {
            super()
      }
      static getInstance() {
            if (this.instance) {
                  return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance
      }
    
      addProject(title:string,description:string,numOfPeople:number) {
            const newProject = new Project(Math.random().toString(),
                  title,
                  description,
                  numOfPeople,
                  ProjectSatus.Active)
            this.projects.push(newProject);
            this.updateListeners()
            
      }
      moveProjectMethod(projectId:string,newStatus:ProjectSatus) {  //switch project state
            const project = this.projects.find(prj => prj.id === projectId);
            if (project&&project.status!=newStatus) {
                  project.status = newStatus;
                  this.updateListeners()
            }

      }
      private updateListeners() {
            for (const listenerFn of this.listeners) {
                  listenerFn(this.projects.slice())
            }  
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
//Component Base class 
abstract class Component<T extends HTMLElement,U extends HTMLElement>{
      templateElement: HTMLTemplateElement;
      hostElement: T;
      element: U;
      constructor(templateId: string,
            hostElementId: string,
            insertAtStart:Boolean,
            newElementId?: string) {
            this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)!;
            this.hostElement = <T>document.getElementById(hostElementId);

            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = <U>importedNode.firstElementChild;
            if (newElementId) {
                  this.element.id = newElementId;
                  
            }
            this.attach(insertAtStart)
      }
      private attach(insertAtBeginning:Boolean) {
            this.hostElement.insertAdjacentElement(insertAtBeginning?'afterbegin':'beforeend',this.element)
      }
      abstract configure(): void;
      abstract renderContent(): void;
      
}
//Project Item class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
      implements Draggable {
      private project: Project;
      get persons() {
            if (this.project.people == 1) {
                  return '1 person';
            } else {
                  return `${this.project.people} persons`
            }
      }
      constructor(hostId:string,project:Project) {
            super('single-project',hostId,false,project.id);
            this.project = project;
            this.configure();
            this.renderContent();
      }
      @autobind
      dragStartHandler(event: DragEvent) {
            event.dataTransfer!.setData('text/plain', this.project.id);
            event.dataTransfer!.effectAllowed = 'move';

       };
      dragEndHandler(_event: DragEvent) {
            console.log('Drag ended')
       };
      configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
       };
      renderContent() {
            this.element.querySelector('h2')!.textContent = this.project.title;
            this.element.querySelector('h3')!.textContent =this.persons+' assigned';
            this.element.querySelector('p')!.textContent =this.project.decription ;

      };
}


//ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement>
      implements DragTarget{
      
      assignedProjects: Project[];

      constructor(private type: 'active' | 'finished') {
            super('project-list', 'app', false, `${type}-projects`);
            this.assignedProjects=[]
            this.configure();
            this.renderContent();
      }
      @autobind
      dragOverHandler(event: DragEvent) {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');


       };
      @autobind
      dropHandler(event: DragEvent) {
            const prjId = event.dataTransfer!.getData('text/plain');
            projectState.moveProjectMethod(prjId, this.type === 'active' ?
                  ProjectSatus.Active :
                  ProjectSatus.Finishid)

       };

      @autobind
      dragLeaveHandler(event: DragEvent) {
            if (event.dataTransfer && event.dataTransfer.types[0] == 'text/plain') {
                
                  const listEl = this.element.querySelector('ul')!;
                  listEl.classList.remove('droppable');    
            }
            
       };
      
      configure() {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop',this.dropHandler)
            projectState.addListeners((projects: Project[]) => {
                  const relevantProjects = projects.filter(prj => {
                        if (this.type === 'active') {
                              return prj.status===ProjectSatus.Active
                              
                        } else {
                              return prj.status===ProjectSatus.Finishid 
                        }
                  })
                  this.assignedProjects = relevantProjects;
                  this.renderProjects()
            });
       }
       renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector('ul')!.id = listId;
            this.element.querySelector('h2')!.textContent=this.type.toUpperCase()+'PROJECTS'
      }
      private renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`)!;
            listEl.innerHTML = '';
            for (const projItem of this.assignedProjects) {
                  new ProjectItem(this.element.querySelector('ul')!.id, projItem);
                }
      }
      
     
}



//ProjetcInput class
class ProjectInput extends Component<HTMLDivElement,HTMLFormElement>{
    
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

const projInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishProjectList = new ProjectList('finished');

