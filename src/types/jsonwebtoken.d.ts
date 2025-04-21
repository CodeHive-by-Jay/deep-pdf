declare module 'jsonwebtoken' {
    export function decode(token: string, options?: any): null | { [key: string]: any } | string;
    export function verify(token: string, secretOrPublicKey: string, options?: any): { [key: string]: any };
    export function sign(payload: string | object | Buffer, secretOrPrivateKey: string, options?: any): string;
} 