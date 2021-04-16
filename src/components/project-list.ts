///<reference path='base-component.ts'/>
///<reference path='../decorators/autobind.ts'/>
///<reference path='../state/project-state.ts'/>
///<reference path='../models/project.ts'/>
///<reference path='../models/drag-drop.ts'/>
namespace App{
      //ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement>
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
}