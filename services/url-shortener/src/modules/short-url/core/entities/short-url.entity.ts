import { v4 as uuidv4 } from 'uuid';

export class ShortUrl {
  private readonly _id: string;
  private _originalUrl: string;
  private readonly _shortCode: string;
  private readonly _userId: string | undefined;
  private _clickCount: number;
  private readonly _updatedAt: Date;
  private readonly _createdAt: Date;

  constructor(
    id: string,
    originalUrl: string,
    shortCode: string,
    userId: string | undefined,
    clickCount?: number,
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    this._id = id;
    this._originalUrl = originalUrl;
    this._shortCode = shortCode;
    this._userId = userId;
    this._clickCount = clickCount ?? 0;
    this._updatedAt = updatedAt ?? new Date();
    this._createdAt = createdAt ?? new Date();
  }

  static create(
    originalUrl: string,
    shortCode: string,
    userId: string | undefined,
  ): ShortUrl {
    return new ShortUrl(uuidv4(), originalUrl, shortCode, userId);
  }

  static reconstitute(
    id: string,
    originalUrl: string,
    shortCode: string,
    userId: string | undefined,
    clickCount: number,
    updatedAt: Date,
    createdAt: Date,
  ): ShortUrl {
    return new ShortUrl(
      id,
      originalUrl,
      shortCode,
      userId,
      clickCount,
      updatedAt,
      createdAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get originalUrl(): string {
    return this._originalUrl;
  }

  get shortCode(): string {
    return this._shortCode;
  }

  get userId(): string | undefined {
    return this._userId;
  }

  get clickCount(): number {
    return this._clickCount;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  incrementClickCount(): void {
    this._clickCount++;
  }

  setClickCount(newClickCount: number): void {
    this._clickCount = newClickCount;
  }

  updateOriginalUrl(newOriginalUrl: string): void {
    this._originalUrl = newOriginalUrl;
  }

  belongsToUser(userId: string): boolean {
    return this._userId === userId;
  }
}
