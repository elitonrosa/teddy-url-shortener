import { Inject, Injectable } from '@nestjs/common';

import { CLICK_COUNT_SERVICE } from '../constants/injection-tokens';
import { IncrementUrlClickCountRequestDto } from '../dtos/increment-url-click-count.dto';
import { IClickCountService } from '../services/click-count.service.interface';

@Injectable()
export class IncrementUrlClickCountUseCase {
  constructor(
    @Inject(CLICK_COUNT_SERVICE)
    private readonly clickCountService: IClickCountService,
  ) {}

  async execute(request: IncrementUrlClickCountRequestDto): Promise<void> {
    await this.clickCountService.incrementClickCount(request.shortCode);
  }
}
