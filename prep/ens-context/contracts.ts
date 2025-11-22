/**
 * ENS Contract addresses and ABIs for Sepolia testnet
 */

// Sepolia contract addresses
export const SEPOLIA_ADDRESSES = {
  // NameWrapper contract - used to create wrapped subnames
  NameWrapper: '0x0635513f179D50A207757E05759CbD106d7dFcE8' as const,
  
  // Public Resolver - used to set records (address, text, etc.)
  PublicResolver: '0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5' as const,
  
  // ENS Registry (same on all networks)
  Registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const,
};

/**
 * NameWrapper ABI - Only the functions we need
 */
export const NAME_WRAPPER_ABI = [
  {
    inputs: [
      { name: 'parentNode', type: 'bytes32' },
      { name: 'label', type: 'string' },
      { name: 'owner', type: 'address' },
      { name: 'resolver', type: 'address' },
      { name: 'ttl', type: 'uint64' },
      { name: 'fuses', type: 'uint32' },
      { name: 'expiry', type: 'uint64' },
    ],
    name: 'setSubnodeRecord',
    outputs: [{ name: 'node', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'id', type: 'uint256' },
    ],
    name: 'ownerOf',
    outputs: [{ name: 'owner', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Public Resolver ABI - Only the functions we need
 */
export const PUBLIC_RESOLVER_ABI = [
  {
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'a', type: 'address' },
    ],
    name: 'setAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
      { name: 'value', type: 'string' },
    ],
    name: 'setText',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'node', type: 'bytes32' },
    ],
    name: 'addr',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
    ],
    name: 'text',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * ENS Fuses - Bitmask values for subname permissions
 * Source: ENS NameWrapper documentation
 */
export const FUSES = {
  // Parent-controlled fuses
  PARENT_CANNOT_CONTROL: 1 << 16, // 65536 - Emancipates the subname
  
  // Owner-controlled fuses
  CANNOT_UNWRAP: 1 << 0,          // 1
  CANNOT_BURN_FUSES: 1 << 1,      // 2
  CANNOT_TRANSFER: 1 << 2,        // 4
  CANNOT_SET_RESOLVER: 1 << 3,    // 8
  CANNOT_SET_TTL: 1 << 4,         // 16
  CANNOT_CREATE_SUBDOMAIN: 1 << 5, // 32
  
  // Combined fuse for emancipated rental subname
  // MUST burn both CANNOT_UNWRAP and PARENT_CANNOT_CONTROL together
  EMANCIPATED_RENTAL: (1 << 0) | (1 << 16),    // 65537 (CANNOT_UNWRAP + PARENT_CANNOT_CONTROL)
} as const;

