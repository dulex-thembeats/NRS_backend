// src/modules/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
  sub: number; // User ID (subject)
  email: string;
  entityId: string;
  businessName: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}
