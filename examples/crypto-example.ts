/**
 * Example: Using Crypto Utilities
 * 
 * This example demonstrates how to use the cryptographic utilities:
 * - Generate keypairs
 * - Sign messages
 * - Verify signatures
 * - Create and verify signed payloads
 */

import {
  generateKeypair,
  signMessage,
  verifySolanaSignature,
  createSignedPayload,
  verifySignedPayload,
  isValidPublicKey,
  isValidSignature,
} from '@fareplay/sdk';

function main() {
  console.log('=== Crypto Utilities Example ===\n');

  // Generate a new keypair
  console.log('1. Generating a new keypair...');
  const keypair = generateKeypair();
  console.log('Public Key:', keypair.publicKey);
  console.log('Private Key:', keypair.privateKey.substring(0, 20) + '...');

  // Sign a message
  console.log('\n2. Signing a message...');
  const message = 'Hello, FarePlay!';
  const signature = signMessage(message, keypair.privateKey);
  console.log('Message:', message);
  console.log('Signature:', signature);

  // Verify the signature
  console.log('\n3. Verifying the signature...');
  const isValid = verifySolanaSignature(message, signature, keypair.publicKey);
  console.log('Is valid:', isValid);

  // Verify with wrong message (should fail)
  console.log('\n4. Verifying with wrong message...');
  const wrongMessage = 'Wrong message';
  const isValidWrong = verifySolanaSignature(
    wrongMessage,
    signature,
    keypair.publicKey
  );
  console.log('Is valid (should be false):', isValidWrong);

  // Create a signed payload
  console.log('\n5. Creating a signed payload...');
  const payload = {
    name: 'My Casino',
    url: 'https://mycasino.com',
    timestamp: Date.now(),
  };
  const signedPayload = createSignedPayload(payload, keypair.privateKey);
  console.log('Signed payload:', signedPayload);

  // Verify the signed payload
  console.log('\n6. Verifying the signed payload...');
  const isPayloadValid = verifySignedPayload(signedPayload, keypair.publicKey);
  console.log('Is payload valid:', isPayloadValid);

  // Verify with tampered payload (should fail)
  console.log('\n7. Verifying tampered payload...');
  const tamperedPayload = { ...signedPayload, name: 'Tampered Casino' };
  const isTamperedValid = verifySignedPayload(
    tamperedPayload,
    keypair.publicKey
  );
  console.log('Is tampered payload valid (should be false):', isTamperedValid);

  // Validate public key format
  console.log('\n8. Validating public key format...');
  console.log('Valid public key:', isValidPublicKey(keypair.publicKey));
  console.log('Invalid public key:', isValidPublicKey('invalid-key'));

  // Validate signature format
  console.log('\n9. Validating signature format...');
  console.log('Valid signature:', isValidSignature(signature));
  console.log('Invalid signature:', isValidSignature('invalid-signature'));

  console.log('\n=== Example Complete ===');
}

// Run the example
main();

