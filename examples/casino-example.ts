/**
 * Example: Using FareCasinoClient
 * 
 * This example demonstrates how to use the Casino Client to:
 * - Send heartbeats
 * - Update status
 * - Start automatic heartbeat interval
 */

import { FareCasinoClient, generateKeypair } from '@fareplay/sdk';

async function main() {
  // For this example, we'll use a generated keypair
  // In production, you would use your actual casino's keypair
  const keypair = generateKeypair();
  const casinoId = 'your-casino-id'; // Replace with actual casino ID

  // Initialize the Casino Client
  const client = new FareCasinoClient({
    baseUrl: 'https://api.discover.fareplay.io',
    casinoId,
    privateKey: keypair.privateKey,
    timeout: 30000,
  });

  try {
    // Send a simple heartbeat
    console.log('Sending heartbeat...');
    const response = await client.sendHeartbeat({
      status: 'online',
      timestamp: Date.now(),
    });
    console.log('Heartbeat response:', response);

    // Send heartbeat with metrics
    console.log('\nSending heartbeat with metrics...');
    const metricsResponse = await client.sendHeartbeatWithMetrics('online', {
      activePlayers: 42,
      totalBets24h: 1250,
      uptime: 86400, // 24 hours in seconds
      responseTime: 45, // milliseconds
    });
    console.log('Heartbeat with metrics response:', metricsResponse);

    // Update status to maintenance
    console.log('\nUpdating status to maintenance...');
    await client.updateStatus('maintenance');
    console.log('Status updated to maintenance');

    // Convenience methods
    console.log('\nGoing online...');
    await client.goOnline();

    console.log('Going offline...');
    await client.goOffline();

    console.log('Back online...');
    await client.goOnline();

    // Start automatic heartbeat (sends heartbeat every 60 seconds)
    console.log('\nStarting automatic heartbeat...');
    const stopHeartbeat = client.startHeartbeat(60000, 'online');

    // Let it run for a bit
    console.log('Heartbeat running... (will stop after 5 minutes)');
    
    // Stop after 5 minutes
    setTimeout(() => {
      stopHeartbeat();
      console.log('Heartbeat stopped');
    }, 5 * 60 * 1000);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main();

