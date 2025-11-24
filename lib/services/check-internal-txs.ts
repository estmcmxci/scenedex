/**
 * Check internal transactions to identify which operation failed
 * Usage: npx tsx lib/services/check-internal-txs.ts 0xa97fbc545ed1ef8c9d7c764dcd40a0e205dbc05ade84e5291d145f7c9bbe455a
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http, decodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';

const TX_HASH = process.argv[2] as `0x${string}` || '0xa97fbc545ed1ef8c9d7c764dcd40a0e205dbc05ade84e5291d145f7c9bbe455a' as `0x${string}`;
const RPC_URL = process.env.BASE_RPC_URL!;
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || 'YourApiKeyToken';

async function checkInternalTxs() {
  console.log(`\n🔍 CHECKING INTERNAL TRANSACTIONS`);
  console.log(`================================================\n`);
  console.log(`Transaction: ${TX_HASH}\n`);
  
  // Use RPC trace to get detailed call information
  try {
    console.log(`📋 Tracing transaction using RPC debug_traceTransaction...\n`);
    
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(RPC_URL),
    });
    
    // Try to get trace using RPC
    // Note: This requires the RPC to support debug_traceTransaction
    try {
      const trace = await publicClient.request({
        method: 'debug_traceTransaction',
        params: [TX_HASH, { tracer: 'callTracer' }],
      } as any);
      
      if (trace) {
        console.log(`✅ Got trace data\n`);
        console.log(JSON.stringify(trace, null, 2).substring(0, 2000));
        console.log(`\n... (truncated)\n`);
      }
    } catch (traceError) {
      console.log(`⚠️  RPC trace not available: ${traceError}\n`);
    }
    
    // Try BaseScan API V2 for internal transactions
    console.log(`📋 Trying BaseScan API V2 for internal transactions...\n`);
    
    // BaseScan V2 API endpoint for internal transactions
    const url = `https://api-sepolia.basescan.org/api?module=account&action=txlistinternal&txhash=${TX_HASH}&apikey=${BASESCAN_API_KEY}`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    // Check if it's JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log(`⚠️  API returned non-JSON response`);
      console.log(`   First 500 chars: ${text.substring(0, 500)}\n`);
      data = { status: '0', message: 'Invalid response' };
    }
    
    if (data.status === '1' && data.result && data.result.length > 0) {
      console.log(`✅ Found ${data.result.length} internal transaction(s):\n`);
      
      for (let i = 0; i < data.result.length; i++) {
        const tx = data.result[i];
        console.log(`Internal Transaction ${i + 1}:`);
        console.log(`   From: ${tx.from}`);
        console.log(`   To: ${tx.to}`);
        console.log(`   Value: ${tx.value} wei`);
        console.log(`   Type: ${tx.type}`);
        console.log(`   Gas: ${tx.gas}`);
        console.log(`   Gas Used: ${tx.gasUsed}`);
        console.log(`   Is Error: ${tx.isError === '1' ? '❌ YES' : '✅ NO'}`);
        if (tx.isError === '1') {
          console.log(`   ⚠️  THIS OPERATION FAILED!`);
        }
        console.log(`   Input: ${tx.input ? tx.input.substring(0, 100) + '...' : 'N/A'}\n`);
        
        // Try to decode the input if it's a call
        if (tx.input && tx.input !== '0x' && tx.to) {
          try {
            // Common function selectors
            const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735';
            const RESOLVER_ADDRESS = '0x85C87e548091f204C2d0350b39ce1874f02197c6';
            const REVERSE_REGISTRAR = '0x876eF94ce0773052a2f81921E70FF25a5e76841f';
            
            if (tx.to.toLowerCase() === REGISTRY_ADDRESS.toLowerCase()) {
              console.log(`   📋 This is a Registry call`);
              const publicClient = createPublicClient({
                chain: baseSepolia,
                transport: http(RPC_URL),
              });
              
              // Try to decode setSubnodeRecord
              try {
                const decoded = decodeFunctionData({
                  abi: [{
                    name: 'setSubnodeRecord',
                    type: 'function',
                    inputs: [
                      { name: 'node', type: 'bytes32' },
                      { name: 'label', type: 'bytes32' },
                      { name: 'owner', type: 'address' },
                      { name: 'resolver', type: 'address' },
                      { name: 'ttl', type: 'uint64' },
                    ],
                  }],
                  data: tx.input as `0x${string}`,
                });
                console.log(`   ✅ Decoded: ${decoded.functionName}`);
                console.log(`      Node: ${decoded.args[0]}`);
                console.log(`      Label: ${decoded.args[1]}`);
                console.log(`      Owner: ${decoded.args[2]}`);
                console.log(`      Resolver: ${decoded.args[3]}`);
                console.log(`      TTL: ${decoded.args[4]}\n`);
              } catch (e) {
                console.log(`   ⚠️  Could not decode Registry call\n`);
              }
            } else if (tx.to.toLowerCase() === RESOLVER_ADDRESS.toLowerCase()) {
              console.log(`   📋 This is a Resolver call`);
            } else if (tx.to.toLowerCase() === REVERSE_REGISTRAR.toLowerCase()) {
              console.log(`   📋 This is a ReverseRegistrar call`);
            }
          } catch (e) {
            // Ignore decode errors
          }
        }
      }
    } else {
      console.log(`⚠️  No internal transactions found or API error`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message || 'N/A'}\n`);
      
      // Also try trace API
      console.log(`📋 Trying trace API...\n`);
      const traceUrl = `https://api-sepolia.basescan.org/v2/api?module=proxy&action=debug_traceTransaction&txhash=${TX_HASH}&apikey=${BASESCAN_API_KEY}`;
      const traceResponse = await fetch(traceUrl);
      const traceData = await traceResponse.json();
      
      if (traceData.result) {
        console.log(`✅ Got trace data`);
        console.log(`   Result keys: ${Object.keys(traceData.result).join(', ')}\n`);
      }
    }
  } catch (error) {
    console.error(`❌ Error fetching internal transactions: ${error}`);
  }
  
  // Also check the transaction receipt for logs that might indicate which operation failed
  console.log(`\n📋 Checking transaction receipt for operation details...\n`);
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  
  const receipt = await publicClient.getTransactionReceipt({ hash: TX_HASH });
  console.log(`Total logs: ${receipt.logs.length}`);
  
  // Look for logs from Registry, Resolver, or ReverseRegistrar
  const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735';
  const RESOLVER_ADDRESS = '0x85C87e548091f204C2d0350b39ce1874f02197c6';
  const REVERSE_REGISTRAR = '0x876eF94ce0773052a2f81921E70FF25a5e76841f';
  
  const registryLogs = receipt.logs.filter(log => 
    log.address.toLowerCase() === REGISTRY_ADDRESS.toLowerCase()
  );
  const resolverLogs = receipt.logs.filter(log => 
    log.address.toLowerCase() === RESOLVER_ADDRESS.toLowerCase()
  );
  const reverseLogs = receipt.logs.filter(log => 
    log.address.toLowerCase() === REVERSE_REGISTRAR.toLowerCase()
  );
  
  console.log(`Registry logs: ${registryLogs.length}`);
  console.log(`Resolver logs: ${resolverLogs.length}`);
  console.log(`ReverseRegistrar logs: ${reverseLogs.length}\n`);
  
  // If we have Registry logs, setSubnodeRecord might have succeeded
  // If we don't, it likely failed
  if (registryLogs.length === 0) {
    console.log(`⚠️  No Registry logs found - setSubnodeRecord likely FAILED\n`);
  } else {
    console.log(`✅ Registry logs found - setSubnodeRecord might have succeeded\n`);
  }
}

checkInternalTxs();

