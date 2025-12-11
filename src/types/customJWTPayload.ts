export interface CustomJwtPayload {
    email: string;
    id: number;
    roles: { id: number; value: string; description: string }[];
    iat: number;
    exp: number;
}