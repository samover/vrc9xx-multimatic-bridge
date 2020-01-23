import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export interface Cypher {
    iv: string;
    encryptedData: string;
}

const keyBuffer = Buffer.alloc(32);
const ivBuffer = Buffer.alloc(16);

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.concat([Buffer.from(process.env.CRYPTO_KEY)], keyBuffer.length);

export const encrypt = (value: string): Cypher => {
    const IV = Buffer.from(Array.prototype.map.call(ivBuffer, () => {return Math.floor(Math.random() * 256)}));

    const cipher = createCipheriv(ALGORITHM, Buffer.from(KEY), IV);
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: IV.toString('hex'), encryptedData: encrypted.toString('hex') };
};

export const decrypt = (value: Cypher): string => {
    let iv = Buffer.from(value.iv, 'hex');
    let encryptedText = Buffer.from(value.encryptedData, 'hex');
    let decipher = createDecipheriv(ALGORITHM, Buffer.from(KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

