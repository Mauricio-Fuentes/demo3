import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  /**
   * Encripta un password usando bcrypt
   * @param password Password en texto plano
   * @returns Password encriptado (hash)
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara un password en texto plano con un hash
   * @param password Password en texto plano
   * @param hash Password encriptado (hash)
   * @returns true si coinciden, false en caso contrario
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

