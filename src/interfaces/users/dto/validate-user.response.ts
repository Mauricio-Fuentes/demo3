import { ApiProperty } from '@nestjs/swagger';

export class ValidateUserResponse {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6Im1hdXJpY2lvQGV4YW1wbGUuY29tIiwibmFtZSI6Ik1hdXJpY2lvIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  })
  access_token: string;

  @ApiProperty({
    description: 'Tipo de token',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Tiempo de expiración en segundos',
    example: 3600,
  })
  expires_in: number;

  @ApiProperty({
    description: 'Token de refresco JWT',
    example:
      'def50200a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Alcance del token',
    example: 'openid profile email',
  })
  scope: string;
}

