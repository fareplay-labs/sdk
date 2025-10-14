import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Verify a Solana signature
 * 
 * @param message - The original message (string or Uint8Array)
 * @param signature - The signature in base58 format
 * @param publicKey - The public key in base58 format
 * @returns True if the signature is valid, false otherwise
 */
export function verifySolanaSignature(
  message: string | Uint8Array,
  signature: string,
  publicKey: string
): boolean {
  try {
    // Decode the public key and signature from base58
    const publicKeyBytes = bs58.decode(publicKey);
    const signatureBytes = bs58.decode(signature);

    // Convert message to Uint8Array if it's a string
    const messageBytes =
      typeof message === 'string'
        ? new TextEncoder().encode(message)
        : message;

    // Verify the signature
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    // If any error occurs during verification, treat as invalid signature
    return false;
  }
}

/**
 * Verify a signed payload
 * 
 * @param payload - The payload object with signature
 * @param publicKey - The public key in base58 format
 * @returns True if the signature is valid, false otherwise
 */
export function verifySignedPayload<T extends Record<string, any>>(
  payload: T & { signature: string },
  publicKey: string
): boolean {
  try {
    const { signature, ...data } = payload;

    // Create the same deterministic string representation used during signing
    const message = JSON.stringify(data, Object.keys(data).sort());

    // Verify the signature
    return verifySolanaSignature(message, signature, publicKey);
  } catch (error) {
    return false;
  }
}

/**
 * Validate a Solana public key format
 * 
 * @param publicKey - The public key string to validate
 * @returns True if the public key format is valid
 */
export function isValidPublicKey(publicKey: string): boolean {
  try {
    const decoded = bs58.decode(publicKey);
    // Solana public keys are 32 bytes
    return decoded.length === 32;
  } catch {
    return false;
  }
}

/**
 * Validate a signature format
 * 
 * @param signature - The signature string to validate
 * @returns True if the signature format is valid
 */
export function isValidSignature(signature: string): boolean {
  try {
    const decoded = bs58.decode(signature);
    // Ed25519 signatures are 64 bytes
    return decoded.length === 64;
  } catch {
    return false;
  }
}

