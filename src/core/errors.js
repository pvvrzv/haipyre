export class AbstractMethodCallError extends Error {
  constructor() {
    super('Illegal abstract method call');
  }
}