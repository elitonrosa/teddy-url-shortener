export class LoginUserRequestDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

export class LoginUserResponseDto {
  constructor(public readonly accessToken: string) {}
}
