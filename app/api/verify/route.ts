import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { namehash } from 'viem/ens';

// Default public Base Sepolia RPC (fallback if BASE_RPC_URL not set)
const DEFAULT_BASE_RPC_URL = 'https://sepolia.base.org';

const RESOLVER_ADDRESS = process.env.ENS_RESOLVER_BASE_SEPOLIA || '0x85C87e548091f204C2d0350b39ce1874f02197c6';
const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735'; // Base Sepolia Registry
const REVERSE_REGISTRAR = process.env.BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA || '0x876eF94ce0773052a2f81921E70FF25a5e76841f';
const SAFE_ADDRESS = process.env.SAFE_ADDRESS || process.env.CURATOR_SAFE_ADDRESS || '0x09b27FEbCAc92408628515132695E046B9dF929B';

const RESOLVER_ABI = [
  {
    name: 'addr',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: 'addr', type: 'address' }],
  },
  {
    name: 'text',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
    ],
    outputs: [{ name: 'value', type: 'string' }],
  },
] as const;

const REGISTRY_ABI = [
  {
    name: 'resolver',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: 'resolver', type: 'address' }],
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: 'owner', type: 'address' }],
  },
] as const;

const REVERSE_REGISTRAR_ABI = [
  {
    name: 'node',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'addr', type: 'address' }],
    outputs: [{ name: 'node', type: 'bytes32' }],
  },
] as const;

const RESOLVER_NAME_ABI = [
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: 'name', type: 'string' }],
  },
] as const;

const RPC_URL = process.env.BASE_RPC_URL || DEFAULT_BASE_RPC_URL;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

// Expected records based on buildRecordsFromRelease
const EXPECTED_RECORDS = [
  'avatar',
  'description',
  'address', // Text record (separate from addr)
  'eth.scenedex.releaseId',
  'eth.scenedex.artists',
  'eth.scenedex.mediaIPFS',
  'eth.scenedex.metadataURI',
  'eth.scenedex.zoraCoinAddress',
  'eth.scenedex.zoraCoinSymbol',
  'eth.scenedex.splitAddress',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { basename } = body;

    if (!basename) {
      return NextResponse.json(
        { success: false, error: 'Basename is required' },
        { status: 400 }
      );
    }

    const node = namehash(basename);
    console.log(`Verifying basename: ${basename}, Node: ${node}`);

    // Step 1: Check if subname exists in Registry
    let owner: string;
    try {
      owner = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: REGISTRY_ABI,
        functionName: 'owner',
        args: [node],
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to query registry owner',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    if (owner === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json({
        success: false,
        error: 'Subname does not exist in Registry',
        data: {
          basename,
          node,
          exists: false
        }
      });
    }

    // Step 2: Get resolver address
    let resolverAddress: string;
    try {
      resolverAddress = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: REGISTRY_ABI,
        functionName: 'resolver',
        args: [node],
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to query resolver',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    if (resolverAddress === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json({
        success: false,
        error: 'No resolver set',
        data: {
          basename,
          node,
          exists: true,
          owner,
          resolver: null
        }
      });
    }

    const resolverMatches = resolverAddress.toLowerCase() === RESOLVER_ADDRESS.toLowerCase();

    // Step 3: Query address record (addr)
    let addressRecord: string | null = null;
    try {
      addressRecord = await publicClient.readContract({
        address: resolverAddress as `0x${string}`,
        abi: RESOLVER_ABI,
        functionName: 'addr',
        args: [node],
      });
    } catch (error) {
      console.warn('Failed to query address record:', error);
    }

    // Step 4: Query all text records
    const textRecords: Record<string, { expected: boolean; value: string | null; status: string }> = {};

    for (const key of EXPECTED_RECORDS) {
      try {
        const value = await publicClient.readContract({
          address: resolverAddress as `0x${string}`,
          abi: RESOLVER_ABI,
          functionName: 'text',
          args: [node, key],
        });

        const hasValue = value && value !== '';
        textRecords[key] = {
          expected: true,
          value: hasValue ? value : null,
          status: hasValue ? 'SET' : 'EMPTY',
        };
      } catch (error) {
        textRecords[key] = {
          expected: true,
          value: null,
          status: 'ERROR',
        };
        console.warn(`Failed to query text record ${key}:`, error);
      }
    }

    // Step 5: Check reverse record (primary name for Safe address)
    const PARENT_DOMAIN = process.env.ENS_DOMAIN || 'scenius.basetest.eth';
    let primaryName: string | null = null;
    let reverseRecordStatus = 'UNKNOWN';

    try {
      // Get reverse node for Safe address
      const reverseNode = await publicClient.readContract({
        address: REVERSE_REGISTRAR as `0x${string}`,
        abi: REVERSE_REGISTRAR_ABI,
        functionName: 'node',
        args: [SAFE_ADDRESS as `0x${string}`],
      });

      if (reverseNode === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        reverseRecordStatus = 'NO_REVERSE_RECORD';
      } else {
        reverseRecordStatus = 'REVERSE_NODE_EXISTS';

        // Query resolver for the name
        try {
          primaryName = await publicClient.readContract({
            address: RESOLVER_ADDRESS as `0x${string}`,
            abi: RESOLVER_NAME_ABI,
            functionName: 'name',
            args: [reverseNode],
          });

          if (primaryName && primaryName !== '') {
            const matchesExpected = primaryName.toLowerCase() === PARENT_DOMAIN.toLowerCase();
            reverseRecordStatus = matchesExpected ? 'VERIFIED' : 'DIFFERENT_NAME';
          } else {
            reverseRecordStatus = 'EMPTY_NAME';
          }
        } catch (error) {
          reverseRecordStatus = 'QUERY_FAILED';
          console.warn('Failed to query name from resolver:', error);
        }
      }
    } catch (error) {
      reverseRecordStatus = 'QUERY_FAILED';
      console.warn('Failed to query reverse record:', error);
    }

    // Calculate summary
    const setCount = Object.values(textRecords).filter(r => r.value !== null).length;
    const totalCount = EXPECTED_RECORDS.length;
    const successRate = Math.round((setCount / totalCount) * 100);

    const data = {
      basename,
      node,
      exists: true,
      owner,
      resolver: {
        address: resolverAddress,
        matchesExpected: resolverMatches,
        expectedAddress: RESOLVER_ADDRESS
      },
      addressRecord,
      textRecords,
      reverseRecord: {
        safeAddress: SAFE_ADDRESS,
        expectedPrimaryName: PARENT_DOMAIN,
        actualPrimaryName: primaryName,
        status: reverseRecordStatus
      },
      summary: {
        recordsSet: setCount,
        totalRecords: totalCount,
        successRate: `${successRate}%`,
        allRecordsSet: setCount === totalCount
      }
    };

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
