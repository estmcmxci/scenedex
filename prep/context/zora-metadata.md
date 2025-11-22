### ZORA Coin Metadata JSON with Animation and Content Properties

Source: https://docs.zora.co/coins/sdk/metadata

Illustrates an extended JSON metadata format for ZORA Coins, incorporating `animation_url` for non-image assets (like audio or video) and the `content` property. The `content` property provides a more consistent way to specify the asset's `mime` type and `uri` for better indexing.

```JSON
{
  "name": "boundless horse",
  "description": "boundless horse",
  "image": "ipfs://bafkreifch6stfh3fn3nqv5tpxnknjpo7zulqav55f2b5pryadx6hldldwe",
  "animation_url": "ipfs://bafybeiatmngyt4wwu6mla27523qk33klxopycomegris3n25y6rcqs27c4",
  "content": {
    "mime": "video/mp4",
    "uri": "ipfs://bafybeiatmngyt4wwu6mla27523qk33klxopycomegris3n25y6rcqs27c4"
  },
  "properties": {
    "category": "social"
  }
}
```

--------------------------------

### Basic ZORA Coin Metadata JSON Format

Source: https://docs.zora.co/coins/contracts/metadata

Illustrates the fundamental JSON structure for ZORA Coin metadata, adhering to EIP-7572, including `name`, `description`, `image`, and an optional `properties` object.

```JSON
{
  "name": "horse",
  "description": "boundless energy",
  "image": "ipfs://bafkreifch6stfh3fn3nqv5tpxnknjpo7zulqav55f2b5pryadx6hldldwe",
  "properties": {
    "category": "social"
  }
}
```

