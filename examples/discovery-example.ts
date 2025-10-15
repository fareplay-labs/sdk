/**
 * Example: Using FareDiscoveryClient
 * 
 * This example demonstrates how to use the Discovery Client to:
 * - Register a casino
 * - Query casinos
 * - Update casino information
 */

import {
  FareDiscoveryClient,
  generateKeypair,
  createSignedPayload,
} from '@fareplay/sdk';

async function main() {
  // Initialize the Discovery Client
  const client = new FareDiscoveryClient({
    baseUrl: 'https://api.discover.fareplay.io',
    timeout: 30000,
  });

  // Generate a keypair for the casino
  const keypair = generateKeypair();
  console.log('Generated keypair:', keypair.publicKey);

  // Create registration data
  const registrationData = {
    name: 'My Awesome Casino',
    url: 'https://mycasino.com',
    publicKey: keypair.publicKey,
    metadata: {
      description: 'A fun and fair casino built on Solana',
      games: ['slots', 'roulette', 'rps'] as const,
      logo: 'https://mycasino.com/logo.png',
      banner: 'https://mycasino.com/banner.png',
      socialLinks: {
        twitter: 'https://twitter.com/mycasino',
        discord: 'https://discord.gg/mycasino',
      },
      minBetAmount: 0.01,
      maxBetAmount: 100,
      supportedTokens: ['SOL', 'USDC'],
    },
  };

  // Sign the registration request
  const signedRegistration = createSignedPayload(
    registrationData,
    keypair.privateKey
  );

  try {
    // Register the casino
    console.log('Registering casino...');
    const casino = await client.registerCasino(signedRegistration);
    console.log('Casino registered:', casino);

    // Get all casinos
    console.log('\nFetching all casinos...');
    const casinos = await client.getCasinos();
    console.log(`Found ${casinos.length} casinos`);

    // Get casinos with filters
    console.log('\nFetching online casinos with slots...');
    const onlineCasinos = await client.getCasinos({
      status: 'online',
      games: ['slots'],
      limit: 10,
      offset: 0,
    });
    console.log(`Found ${onlineCasinos.length} online casinos with slots`);

    // Get a specific casino
    console.log('\nFetching casino by ID...');
    const specificCasino = await client.getCasino(casino.id);
    console.log('Casino:', specificCasino);

    // Update casino
    console.log('\nUpdating casino...');
    const updateData = {
      status: 'maintenance' as const,
      metadata: {
        description: 'Updated description - Under maintenance',
      },
    };
    const signedUpdate = createSignedPayload(updateData, keypair.privateKey);
    const updatedCasino = await client.updateCasino(casino.id, signedUpdate);
    console.log('Casino updated:', updatedCasino);

    // Get casino statistics
    console.log('\nFetching casino statistics...');
    const stats = await client.getStats();
    console.log('Stats:', stats);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main();

