export class RegisterUserRequestDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
