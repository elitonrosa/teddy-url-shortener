import { UseGuards } from '@nestjs/common';
import { RequireUserGuard } from '../guards/require-user.guard';

export const RequireUser = () => UseGuards(RequireUserGuard);
