import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Sign a message with a Solana private key
 * 
 * @param message - The message to sign (string or Uint8Array)
 * @param privateKey - The private key in base58 format
 * @returns The signature in base58 format
 */
export function signMessage(
  message: string | Uint8Array,
  privateKey: string
): string {
  try {
    // Decode the private key from base58
    const secretKey = bs58.decode(privateKey);

    // Convert message to Uint8Array if it's a string
    const messageBytes =
      typeof message === 'string'
        ? new TextEncoder().encode(message)
        : message;

    // Sign the message
    const signature = nacl.sign.detached(messageBytes, secretKey);

    // Return signature in base58 format
    return bs58.encode(signature);
  } catch (error) {
    throw new Error(
      `Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Create a signed payload for API requests
 * 
 * @param payload - The payload object to sign
 * @param privateKey - The private key in base58 format
 * @returns The payload with signature added
 */
export function createSignedPayload<T extends Record<string, any>>(
  payload: T,
  privateKey: string
): T & { signature: string } {
  // Create a deterministic string representation of the payload
  const message = JSON.stringify(payload, Object.keys(payload).sort());
  
  // Sign the message
  const signature = signMessage(message, privateKey);

  // Return payload with signature
  return {
    ...payload,
    signature,
  };
}

/**
 * Extract keypair from private key
 * 
 * @param privateKey - The private key in base58 format
 * @returns Object containing public and private keys in base58 format
 */
export function getKeypairFromPrivateKey(privateKey: string): {
  publicKey: string;
  privateKey: string;
} {
  try {
    const secretKey = bs58.decode(privateKey);
    const keypair = nacl.sign.keyPair.fromSecretKey(secretKey);

    return {
      publicKey: bs58.encode(keypair.publicKey),
      privateKey: bs58.encode(keypair.secretKey),
    };
  } catch (error) {
    throw new Error(
      `Failed to extract keypair: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate a new keypair
 * 
 * @returns Object containing public and private keys in base58 format
 */
export function generateKeypair(): {
  publicKey: string;
  privateKey: string;
} {
  const keypair = nacl.sign.keyPair();

  return {
    publicKey: bs58.encode(keypair.publicKey),
    privateKey: bs58.encode(keypair.secretKey),
  };
}

