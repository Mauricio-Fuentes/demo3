import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@domain/users/entities/user.entity';

export interface TokenPayload {
  sub: string; // user id
  email: string;
  name: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

@Injectable()
export class JwtTokenService {
  private readonly accessTokenExpiresIn = 3600; // 1 hora en segundos
  private readonly refreshTokenExpiresIn = 604800; // 7 días en segundos
  private readonly tokenType = 'Bearer';

  constructor(private readonly jwtService: JwtService) {}

  generateTokens(user: User): TokenResponse {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        expiresIn: this.refreshTokenExpiresIn,
      },
    );

    return {
      access_token: accessToken,
      token_type: this.tokenType,
      expires_in: this.accessTokenExpiresIn,
      refresh_token: refreshToken,
      scope: user.scope, // Scope basado en el usuario
    };
  }
}

