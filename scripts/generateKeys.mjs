import crypto from 'crypto';
import fs from 'fs';

// Generate RSA key pair
crypto.generateKeyPair(
    'rsa',
    {
        modulusLength: 2048, // Key size in bits
        publicKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem', // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem', // Most common formatting choice
        },
    },
    (err, publicKey, privateKey) => {
        if (err) {
            console.error('Error generating keys:', err);
            return;
        }

        console.log('Public Key:\n', publicKey);
        console.log('Private Key:\n', privateKey);

        fs.writeFileSync('certs/private.pem', privateKey);
        fs.writeFileSync('certs/public.pem', publicKey);
    },
);
