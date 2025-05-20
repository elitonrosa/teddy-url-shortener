export interface IUrlFormatter {
  generateFullUrl(shortCode: string): string;
  generateShortCode(): string;
}
