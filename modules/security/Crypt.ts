import { createCipheriv, createDecipheriv } from 'crypto';

export interface Cypher {
    iv: string;
    encryptedData: string;
}

const keyBuffer = Buffer.alloc(32);
const ivBuffer = Buffer.alloc(16);

const getKey = (): Buffer => Buffer.concat([Buffer.from(process.env.CRYPTO_KEY)], keyBuffer.length);

export const ALGORITHM = 'aes-256-cbc';

export const encrypt = (value: string): Cypher => {
    const IV = Buffer.from(Array.prototype.map.call(ivBuffer, () => Math.floor(Math.random() * 256)));

    const cipher = createCipheriv(ALGORITHM, Buffer.from(getKey()), IV);
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: IV.toString('hex'), encryptedData: encrypted.toString('hex') };
};

export const decrypt = (value: Cypher): string => {
    const iv = Buffer.from(value.iv, 'hex');
    const encryptedText = Buffer.from(value.encryptedData, 'hex');
    const decipher = createDecipheriv(ALGORITHM, Buffer.from(getKey()), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
