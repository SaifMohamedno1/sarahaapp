import crypto from 'node:crypto';

const IV_LENGTH = 16;
const ENCRYPTION_SECRET_KEY = Buffer.from('0123456789abcdef0123456789abcdef', 'utf-8'); 

export const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  console.log('IV Generation', iv);

  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv);
  console.log('Cipher creation result', cipher);

  let encryptedData = cipher.update(text, 'utf-8', 'hex');
  console.log('update cipher result', encryptedData);

  encryptedData += cipher.final('hex');
  console.log('Final cipher result', encryptedData);

  return `${iv.toString('hex')}:${encryptedData}`;
};