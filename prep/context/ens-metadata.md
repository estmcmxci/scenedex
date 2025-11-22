ENS resolvers are smart contracts that store and serve metadata for ENS names. Here’s a breakdown of how they work, what you can store, and any relevant limits:

---

## **How ENS Resolvers Store and Serve Metadata**

### **1. Address Records**
Resolvers store address records (e.g., Ethereum addresses) mapped to ENS nodes (namehashes).  
Example from context:
```solidity
mapping(bytes32 => address) addresses;

function addr(bytes32 node) constant returns(address) {
    return addresses[node];    
}

function setAddr(bytes32 node, address addr) only_owner {
    addresses[node] = addr;
    AddrChanged(node, addr);
}
```
- The `addr` function returns the address for a given node.
- The `setAddr` function allows the owner to set the address.

### **2. Text Records (Metadata)**
ENSIP-5 defines a standard for storing arbitrary key-value text data (metadata) for ENS names:
```solidity
interface IERC634 {
  function text(bytes32 node, string key) view returns (string text);
}
```
- The `text` function returns a UTF-8 string for a given key and node.
- Keys can be things like `email`, `url`, `avatar`, etc.

### **3. Other Records**
Resolvers can also store other types of data, such as content hashes, public keys, etc., but the most common are address and text records.

---

## **Format and Size Limits**

### **Format**
- **Keys:**  
  - Global keys: lowercase letters, numbers, hyphens (e.g., `avatar`, `email`).
  - Service keys: reverse dot notation (e.g., `com.twitter`).
- **Values:**  
  - Arbitrary UTF-8 strings for text records.
  - Ethereum addresses for address records.

### **Size Limits**
- **On-chain Storage:**  
  - There is **no explicit size limit** enforced by the ENS resolver contracts for text records or addresses.
  - **Practical Limit:** The main constraint is Ethereum’s gas cost for storing data. Large strings are expensive to store, so in practice, text records should be kept reasonably small (typically a few hundred bytes).
  - If a key is not present, the resolver must return an empty string.

---

## **Summary Table of Common Keys**  
*(For reference, not as a summary table in the answer)*

- `avatar`, `description`, `display`, `email`, `keywords`, `mail`, `notice`, `location`, `phone`, `url`
- Service keys: `com.github`, `com.twitter`, etc.

---

## **References**
- [ENSIP-5: Text Records](https://docs.ens.domains/ensip/5)
- [ENSIP-1: Registry & Resolver Examples](https://docs.ens.domains/ens-improvement-proposals/ensip-1-ens)



### How ENS Metadata Works

With ENS, the **text record itself is the metadata**—you store key-value pairs directly on the resolver contract. You do not typically point a text record to a metadata URI (like you might with an NFT’s metadata). Instead, you store the actual data (such as a description, avatar URL, or other info) as the value for a specific key.

- **Text records** are stored directly on-chain in the resolver contract.
- Each record is a key-value pair, e.g.:
  - `key: "avatar"`, `value: "https://example.com/avatar.png"`
  - `key: "description"`, `value: "My ENS domain"`
- You can store any UTF-8 string as the value.

#### Example: Setting a text record
```solidity
function setText(bytes32 node, string calldata key, string calldata value) external;
```
- You would call this function on the resolver, setting the key (e.g., `"avatar"`) and the value (e.g., a direct image URL).

### When to Use a Metadata URI

- If your metadata is too large or dynamic for on-chain storage, you **could** store a pointer (like an IPFS or HTTPS URL) in a text record (e.g., `key: "metadata"`, `value: "ipfs://..."`).
- However, this is not the standard ENS pattern. Most apps expect the actual data (or direct links to images, etc.) in the text records themselves.

### Reference

> The `text` data may be any arbitrary UTF-8 string. If the key is not present, the empty string must be returned.  
> — [ENSIP-5: Text Records](https://docs.ens.domains/ensip/5)

---

**In summary:**  
- Store metadata directly in ENS text records for best compatibility.
- Only use a metadata URI if you have a specific need (e.g., very large or dynamic data), and be aware that not all apps will know to look for or parse it.


## Building an app that expects a specific key in the ENS text records

If you build an app that expects a specific key in the ENS text records (for example, `metadata`), and the value of that key is a URI (such as an IPFS or HTTPS link), your app can:

1. **Read the ENS text record** for that key.
2. **Fetch the URI** stored in the value.
3. **Retrieve and display the metadata** from that URI in your app’s UI.

This is a valid and flexible pattern, especially if your metadata is too large or dynamic for on-chain storage. Just keep in mind:

- This is **not the default ENS convention** (most apps expect the data itself in the text record), but it is fully supported and works well for custom integrations.
- Your app will need to handle the off-chain fetch and parsing of the metadata.

#### Example Flow

1. ENS text record:
   - `key: "myapp-metadata"`
   - `value: "ipfs://Qm...xyz"` (or `"https://example.com/metadata.json"`)

2. Your app:
   - Reads the `"myapp-metadata"` key from the ENS resolver.
   - Fetches the content from the URI.
   - Parses and displays the metadata in the UI.

#### Reference

> The `text` data may be any arbitrary UTF-8 string.  
> — [ENSIP-5: Text Records](https://docs.ens.domains/ensip/5)

---

