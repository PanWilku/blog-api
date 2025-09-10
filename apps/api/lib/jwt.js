import jwt from 'jsonwebtoken';
import "dotenv/config";

function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return secret;
}

function getExpiresIn() {
    return process.env.JWT_EXPIRES_IN;
}

export function generateToken(user) {
    const secret = getSecret();
    const expires = getExpiresIn();
    
    const payload = {
        sub: user.id,
        email: user.email,
    };
    return jwt.sign(payload, secret, {
        expiresIn: expires,
    });
}

export function verifyToken(token) {
    try {
        const secret = getSecret();
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}