export class GetOriginalUrlRequestDto {
  shortCode: string;

  constructor(shortCode: string) {
    this.shortCode = shortCode;
  }
}

export class GetOriginalUrlResponseDto {
  originalUrl: string;

  constructor(originalUrl: string) {
    this.originalUrl = originalUrl;
  }
}
