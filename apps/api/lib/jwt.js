import jwt from 'jsonwebtoken';

function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return secret;
}

function getExpiresIn() {
    const expires = process.env.JWT_EXPIRES_IN || '7d';
    console.log('JWT_EXPIRES_IN from env:', expires);
    return expires;
}

export function generateToken(user) {
    const secret = getSecret();
    const expires = getExpiresIn();
    
    const payload = {
        sub: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000), // issued at
    };
    
    console.log('Generating token with expires:', expires);
    
    const token = jwt.sign(payload, secret, {
        expiresIn: expires,
    });
    
    // Decode the token to see the actual expiration
    const decoded = jwt.decode(token);
    console.log('Token payload:', decoded);
    console.log('Token expires at:', new Date(decoded.exp * 1000));
    
    return token;
}

export function verifyToken(token) {
    try {
        const secret = getSecret();
        const decoded = jwt.verify(token, secret);
        console.log('Token verified successfully, expires at:', new Date(decoded.exp * 1000));
        return decoded;
    } catch (err) {
        console.log('Token verification failed:', err.message);
        return null;
    }
}