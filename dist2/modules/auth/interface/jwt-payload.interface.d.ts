export interface JwtPayload {
    sub: number;
    email: string;
    entityId: string;
    businessName: string;
    iat?: number;
    exp?: number;
}
