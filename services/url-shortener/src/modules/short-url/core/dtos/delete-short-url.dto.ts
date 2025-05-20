export class DeleteShortUrlRequestDto {
  shortCode: string;
  userId: string;

  constructor(shortCode: string, userId: string) {
    this.shortCode = shortCode;
    this.userId = userId;
  }
}
