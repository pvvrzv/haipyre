export class abstractMethodCallError extends Error {
  constructor() {
    super('Illegal abstract method call');
  }
}