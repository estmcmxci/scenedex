/**
 * Get Calldata for Direct Subname Registration (Bypassing RegistrarController)
 * 
 * This function creates calldata for registering subnames directly via Registry,
 * without requiring BaseRegistrar to own the baseNode.
 * 
 * Flow:
 * 1. Registry.setSubnodeRecord() - Creates subname + sets owner + resolver + TTL (FREE, no payment)
 * 2. Resolver.setAddr() - Sets address record
 * 3. Resolver.setText() × N - Sets text records
 * 
 * Note: This requires multiple Safe transactions (not atomic like RegistrarController.register())
 * 
 * @param subnameLabel - Label for subname (e.g., "EROS001")
 * @param parentNode - Namehash of parent domain (e.g., scenius.basetest.eth)
 * @param ownerAddress - Address that will own the subname
 * @param resolverAddress - Resolver address
 * @param addressRecord - Address to set in resolver
 * @param textRecords - Text records to set
 * @returns Array of calldata operations for Safe transaction
 */

import { namehash, normalize } from 'viem/ens';
import { encodeFunctionData } from 'viem';
import { keccak256, toBytes } from 'viem';

const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;

export function getDirectSubnameCalldata(
  subnameLabel: string,
  parentNode: `0x${string}`,
  parentDomain: string, // e.g., "scenius.basetest.eth"
  ownerAddress: string,
  resolverAddress: string,
  addressRecord: string,
  textRecords: Record<string, string>
): Array<{ to: string; data: string; value: string }> {
  const operations: Array<{ to: string; data: string; value: string }> = [];
  
  // Normalize label
  const normalizedLabel = normalize(subnameLabel);
  // Label hash is keccak256 of the label bytes
  const labelHash = keccak256(toBytes(normalizedLabel));
  
  // Calculate subname node using namehash of full domain (more reliable)
  const fullSubname = `${normalizedLabel}.${parentDomain}`;
  const subnameNode = namehash(fullSubname);
  
  // Operation 1: Registry.setSubnodeRecord()
  // Creates subname + sets owner + resolver + TTL (FREE, no payment)
  const REGISTRY_ABI = [
    {
      name: 'setSubnodeRecord',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'label', type: 'bytes32' },
        { name: 'owner', type: 'address' },
        { name: 'resolver', type: 'address' },
        { name: 'ttl', type: 'uint64' },
      ],
      outputs: [],
    },
  ] as const;
  
  operations.push({
    to: REGISTRY_ADDRESS,
    data: encodeFunctionData({
      abi: REGISTRY_ABI,
      functionName: 'setSubnodeRecord',
      args: [
        parentNode,
        labelHash,
        ownerAddress as `0x${string}`,
        resolverAddress as `0x${string}`,
        0n, // TTL = 0 (default)
      ],
    }),
    value: '0', // FREE - no payment required
  });
  
  // Operation 2: Resolver.setAddr()
  const RESOLVER_ABI = [
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
  
  operations.push({
    to: resolverAddress,
    data: encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setAddr',
      args: [subnameNode, addressRecord as `0x${string}`],
    }),
    value: '0',
  });
  
  // Operation 3-N: Resolver.setText() for each text record
  const RESOLVER_TEXT_ABI = [
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
  ] as const;
  
  for (const [key, value] of Object.entries(textRecords)) {
    operations.push({
      to: resolverAddress,
      data: encodeFunctionData({
        abi: RESOLVER_TEXT_ABI,
        functionName: 'setText',
        args: [subnameNode, key, value],
      }),
      value: '0',
    });
  }
  
  return operations;
}

