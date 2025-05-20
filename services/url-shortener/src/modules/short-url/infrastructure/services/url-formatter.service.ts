import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { customAlphabet } from 'nanoid';

import { IUrlFormatter } from '../../core/services/url-formatter.interface';

@Injectable()
export class UrlFormatterService implements IUrlFormatter {
  private static readonly SHORT_CODE_ALPHABET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private static readonly SHORT_CODE_LENGTH = 6;

  constructor(private readonly configService: ConfigService) {}

  generateShortCode(): string {
    return customAlphabet(
      UrlFormatterService.SHORT_CODE_ALPHABET,
      UrlFormatterService.SHORT_CODE_LENGTH,
    )();
  }

  generateFullUrl(shortCode: string): string {
    const baseUrl = this.configService.get<string>('api.domain') || '';
    return `${baseUrl}/${shortCode}`;
  }
}
