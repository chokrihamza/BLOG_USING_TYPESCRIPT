namespace App{//autobind decorator
export function autobind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
      
      const originalMethod = descriptor.value;
      const ajustedDescriptor:PropertyDescriptor={
            configurable: true,
            get() {
                  const boundFn = originalMethod.bind(this);
                  return boundFn
            }
            

      }
      return ajustedDescriptor
}}