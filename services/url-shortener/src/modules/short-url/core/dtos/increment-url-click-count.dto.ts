export class IncrementUrlClickCountRequestDto {
  shortCode: string;

  constructor(shortCode: string) {
    this.shortCode = shortCode;
  }
}
