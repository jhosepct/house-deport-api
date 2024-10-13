import * as jwt from 'jsonwebtoken';
export interface IJwtPayload extends jwt.JwtPayload {
    id: number;
    role: string;
    email: string;
    iat: number;
    exp: number;
}