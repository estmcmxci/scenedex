/**
 * Decode failed transaction to see what operation was attempted
 * Usage: npx tsx lib/services/decode-failed-tx.ts <txHash>
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http, decodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';

const TX_HASH = process.argv[2] as `0x${string}`;
const RPC_URL = process.env.BASE_RPC_URL!;

const RESOLVER_ABI = [
  {
    name: 'setText',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
      { name: 'value', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'setAddr',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'addr', type: 'address' },
    ],
    outputs: [],
  },
] as const;

const MULTISEND_ABI = [
  {
    name: 'multiSend',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'transactions', type: 'bytes' },
    ],
    outputs: [],
  },
] as const;

async function decodeTx() {
  console.log(`\n🔍 DECODING FAILED TRANSACTION`);
  console.log(`================================================\n`);
  console.log(`Transaction: ${TX_HASH}\n`);
  
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  
  const tx = await publicClient.getTransaction({ hash: TX_HASH });
  
  console.log(`From: ${tx.from}`);
  console.log(`To: ${tx.to}`);
  console.log(`Value: ${tx.value.toString()} wei\n`);
  
  // Check if it's a multi-send call
  if (tx.to?.toLowerCase() === '0x9641d764fc13c8b624c04430c7356c1c7c8102e2'.toLowerCase()) {
    console.log(`⚠️  This is a multi-send transaction (even though it should be single operation)\n`);
    try {
      const decoded = decodeFunctionData({
        abi: MULTISEND_ABI,
        data: tx.input,
      });
      console.log(`Function: ${decoded.functionName}`);
      console.log(`Args: ${JSON.stringify(decoded.args, null, 2)}\n`);
    } catch (e) {
      console.log(`Could not decode as multi-send: ${e}\n`);
    }
  } else if (tx.to?.toLowerCase() === '0x85c87e548091f204c2d0350b39ce1874f02197c6'.toLowerCase()) {
    console.log(`✅ This is a direct resolver call\n`);
    try {
      const decoded = decodeFunctionData({
        abi: RESOLVER_ABI,
        data: tx.input,
      });
      console.log(`Function: ${decoded.functionName}`);
      if (decoded.functionName === 'setText') {
        console.log(`Node: ${decoded.args[0]}`);
        console.log(`Key: ${decoded.args[1]}`);
        console.log(`Value: ${decoded.args[2]}`);
      } else if (decoded.functionName === 'setAddr') {
        console.log(`Node: ${decoded.args[0]}`);
        console.log(`Address: ${decoded.args[1]}`);
      }
    } catch (e) {
      console.log(`Could not decode: ${e}\n`);
    }
  }
  
  // Get receipt to check for revert reason
  const receipt = await publicClient.getTransactionReceipt({ hash: TX_HASH });
  console.log(`\nReceipt Status: ${receipt.status}`);
  console.log(`Logs: ${receipt.logs.length}`);
  
  // Try to get revert reason by simulating
  try {
    console.log(`\n🔍 Attempting to simulate transaction to get revert reason...`);
    await publicClient.call({
      to: tx.to!,
      data: tx.input,
      from: tx.from,
      value: tx.value,
    });
    console.log(`✅ Simulation succeeded (unexpected - transaction should fail)`);
  } catch (simError: any) {
    console.log(`❌ Simulation failed (expected)`);
    if (simError.data) {
      console.log(`Revert data: ${simError.data}`);
    }
    if (simError.message) {
      console.log(`Error message: ${simError.message}`);
    }
    if (simError.cause) {
      console.log(`Cause: ${simError.cause}`);
    }
  }
}

decodeTx();

