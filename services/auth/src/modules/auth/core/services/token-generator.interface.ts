export interface ITokenGenerator {
  generate(payload: { userId: string; email: string }): Promise<string>;
}
