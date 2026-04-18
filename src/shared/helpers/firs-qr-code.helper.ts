import * as crypto from 'crypto';

/**
 * Decode Base64 → PEM public key
 */
function getPublicKeyPem(): string {
  const base64Key = process.env.FIRS_PUBLIC_KEY_BASE64;
  if (!base64Key) {
    throw new Error('Missing FIRS_PUBLIC_KEY_BASE64 env variable');
  }
  return Buffer.from(base64Key, 'base64').toString('utf-8');
}

/**
 * Encrypt IRN + Certificate using RSA public key
 */
function encryptPayload(payload: object): string {
  const publicKeyPem = getPublicKeyPem();
  const encryptedBuffer = crypto.publicEncrypt(
    {
      key: publicKeyPem,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(JSON.stringify(payload)),
  );
  return encryptedBuffer.toString('base64');
}

/**
 * Generate QR Code encrypted payload (Base64)
 * @param irn - The Invoice Reference Number
 * @returns The encrypted base64 string
 */
export function generateFirsQrCode(irn: string): string {
  const certificate = process.env.FIRS_CERTIFICATE_BASE64;
  if (!certificate) {
    throw new Error('Missing FIRS_CERTIFICATE_BASE64 env variable');
  }
  const payload = {
    irn,
    certificate,
  };
  const encryptedBase64 = encryptPayload(payload);
  return encryptedBase64;
}

