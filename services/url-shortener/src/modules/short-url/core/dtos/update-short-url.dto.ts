export class UpdateShortUrlRequestDto {
  shortCode: string;
  originalUrl: string;
  userId: string;

  constructor(shortCode: string, originalUrl: string, userId: string) {
    this.shortCode = shortCode;
    this.originalUrl = originalUrl;
    this.userId = userId;
  }
}
