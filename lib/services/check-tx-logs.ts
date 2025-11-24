/**
 * Check transaction logs to find revert reason
 * Usage: npx tsx lib/services/check-tx-logs.ts 0xa97fbc545ed1ef8c9d7c764dcd40a0e205dbc05ade84e5291d145f7c9bbe455a
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http, decodeEventLog } from 'viem';
import { baseSepolia } from 'viem/chains';

const TX_HASH = process.argv[2] as `0x${string}` || '0xa97fbc545ed1ef8c9d7c764dcd40a0e205dbc05ade84e5291d145f7c9bbe455a' as `0x${string}`;
const RPC_URL = process.env.BASE_RPC_URL!;

async function checkLogs() {
  console.log(`\n🔍 CHECKING TRANSACTION LOGS`);
  console.log(`================================================\n`);
  console.log(`Transaction: ${TX_HASH}\n`);
  
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  
  const receipt = await publicClient.getTransactionReceipt({ hash: TX_HASH });
  
  console.log(`Block: ${receipt.blockNumber}`);
  console.log(`Status: ${receipt.status}`);
  console.log(`Logs: ${receipt.logs.length}\n`);
  
  // Check for ExecutionFailure events
  const EXECUTION_FAILURE_TOPIC = '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23';
  const executionFailureLogs = receipt.logs.filter(log => 
    log.topics[0] === EXECUTION_FAILURE_TOPIC
  );
  
  console.log(`ExecutionFailure events: ${executionFailureLogs.length}\n`);
  
  for (const log of executionFailureLogs) {
    console.log(`📋 ExecutionFailure Event:`);
    console.log(`   Address: ${log.address}`);
    console.log(`   Topics: ${log.topics.length}`);
    console.log(`   Topic[0] (event): ${log.topics[0]}`);
    console.log(`   Topic[1] (txHash): ${log.topics[1]}`);
    console.log(`   Data (payment): ${log.data}\n`);
    
    try {
      const decoded = decodeEventLog({
        abi: [{
          name: 'ExecutionFailure',
          type: 'event',
          inputs: [
            { name: 'txHash', type: 'bytes32', indexed: true },
            { name: 'payment', type: 'uint256' },
          ],
        }],
        data: log.data,
        topics: log.topics,
      });
      console.log(`   Decoded:`);
      console.log(`     txHash: ${decoded.txHash}`);
      console.log(`     payment: ${decoded.payment.toString()} wei\n`);
    } catch (e) {
      console.log(`   Could not decode: ${e}\n`);
    }
  }
  
  // Check for other interesting events
  console.log(`\n📋 All Events:\n`);
  for (let i = 0; i < receipt.logs.length; i++) {
    const log = receipt.logs[i];
    console.log(`Event ${i + 1}:`);
    console.log(`   Address: ${log.address}`);
    console.log(`   Topics: ${log.topics.length}`);
    if (log.topics.length > 0) {
      console.log(`   Topic[0]: ${log.topics[0]}`);
    }
    console.log(`   Data: ${log.data.substring(0, 66)}...\n`);
  }
  
  // Try to get the transaction to see the input data
  console.log(`\n📋 Transaction Details:\n`);
  const tx = await publicClient.getTransaction({ hash: TX_HASH });
  console.log(`   From: ${tx.from}`);
  console.log(`   To: ${tx.to}`);
  console.log(`   Value: ${tx.value.toString()} wei`);
  console.log(`   Input data length: ${tx.input.length} bytes`);
  console.log(`   Input data (first 100 chars): ${tx.input.substring(0, 100)}...\n`);
}

checkLogs();

