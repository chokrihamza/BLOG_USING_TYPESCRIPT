namespace App{//Project state Management Class
type Listener<T> = (item: T[]) => void
 //class State
class state<T>{
      protected listeners: Listener<T>[] = [];
      addListeners(listenerFn:Listener<T>) {
            this.listeners.push(listenerFn);
      }
}
 //ProjectState 
export class ProjectState extends state<Project>{
     
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

      export const projectState = ProjectState.getInstance();
}