export class UserAlreadyRegisteredException extends Error {
  constructor(email: string) {
    super(`User '${email}' is already registered`);
    this.name = 'UserAlreadyRegisteredException';
  }
}
