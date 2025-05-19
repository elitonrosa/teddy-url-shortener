import { Body, Controller, HttpCode, Post, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoginUserRequestDto } from '../../core/dtos/login-user.dto';
import { RegisterUserRequestDto } from '../../core/dtos/register-user.dto';
import { LoginUserUseCase } from '../../core/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../core/use-cases/register-user.use-case';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { AuthExceptionFilter } from '../filters/auth-exception.filter';

@ApiTags('auth')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201 })
  async register(@Body() dto: RegisterUserDto): Promise<void> {
    const request = new RegisterUserRequestDto(dto.email, dto.password);
    await this.registerUserUseCase.execute(request);
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() dto: LoginUserDto): Promise<AuthResponseDto> {
    const request = new LoginUserRequestDto(dto.email, dto.password);
    const response = await this.loginUserUseCase.execute(request);
    return new AuthResponseDto(response.accessToken);
  }
}
