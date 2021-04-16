//Project Type
namespace App {
      
export enum ProjectSatus{
      Active,
      Finishid
}
export class Project{
      constructor(public id: string,
            public title: string,
            public decription: string,
            public people: number,
            public status:ProjectSatus
      
      ) {
            
      }
}}