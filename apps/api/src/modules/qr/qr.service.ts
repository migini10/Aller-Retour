import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class QrService {
  private readonly secretKey = process.env.JWT_SECRET || 'aller-retour-qr-fallback-key-2026';

  /**
   * Generates a secure cryptographic signed token containing booking ID and metadata.
   */
  generateQrToken(bookingId: string, seatNumber: number): string {
    const payload = JSON.stringify({ bookingId, seatNumber, ts: Date.now() });
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(payload);
    const signature = hmac.digest('hex');
    
    // Return payload combined with signature
    return Buffer.from(JSON.stringify({ payload, signature })).toString('base64');
  }

  /**
   * Verifies the cryptographic token and returns the parsed payload.
   */
  verifyQrToken(token: string): { bookingId: string; seatNumber: number } {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      const { payload, signature } = decoded;

      const hmac = crypto.createHmac('sha256', this.secretKey);
      hmac.update(payload);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) {
        throw new UnauthorizedException('Signature QR invalide');
      }

      return JSON.parse(payload);
    } catch (e) {
      throw new UnauthorizedException('Format QR invalide ou signature corrompue');
    }
  }
}
