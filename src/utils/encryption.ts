import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';

const ENCRYPTION_KEY_NAME = 'myst_storage_encryption_key';

const getEncryptionKey = async (): Promise<string> => {
  const existingKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
  if (existingKey) return existingKey;

  const newKey = CryptoJS.lib.WordArray.random(32).toString();
  await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, newKey);
  return newKey;
};

/**
 * Encrypts any data payload (object, array, or string) to an AES ciphertext string.
 */
export const encryptData = async (data: unknown): Promise<string> => {
  try {
    const rawString = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(rawString, await getEncryptionKey()).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

/**
 * Decrypts an AES ciphertext string back into its original type (object, array, or string).
 */
export const decryptData = async <T = unknown>(cipherText: string | null): Promise<T | null> => {
  if (!cipherText) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, await getEncryptionKey());
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (decryptedString) {
      try {
        return JSON.parse(decryptedString) as T;
      } catch {
        return decryptedString as unknown as T;
      }
    }
  } catch (error) {
    // Decryption failed, might be old unencrypted text
  }

  // Fallback to parsing as unencrypted plain text JSON
  try {
    return JSON.parse(cipherText) as T;
  } catch {
    return cipherText as unknown as T;
  }
};
