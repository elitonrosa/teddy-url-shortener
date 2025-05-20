export interface IClickCountService {
  incrementClickCount(shortCode: string): Promise<void>;
}
