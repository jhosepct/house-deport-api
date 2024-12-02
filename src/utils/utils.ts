import * as crypto from 'crypto';
import { Config } from "../config/configuration";

export class Utils{
  static encryptToken(token: string, secret: string): string {
    // Genera una clave de longitud válida (32 bytes para AES-256)
    const key = crypto.createHash('sha256').update(secret).digest();
    const iv = crypto.randomBytes(16); // Vector de inicialización de 16 bytes

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Devuelve el IV junto con el token cifrado, separados por un delimitador
    return `${iv.toString('hex')}:${encrypted}`;
  }

  static decryptToken(encryptedToken: string, secret: string): string {
    const [ivHex, encrypted] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.createHash('sha256').update(secret).digest();

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}