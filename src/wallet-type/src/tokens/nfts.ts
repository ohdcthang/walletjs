interface NftMediaCollection {
  low: { height: number; width: number; url: string };
  medium: { height: number; width: number; url: string };
  high: { height: number; width: number; url: string };
}

interface NftMedia {
  status: string;
  updatedAt: string;
  mimetype: string;
  parent_hash: string;
  media_collection: NftMediaCollection;
  original_media_url: string;
}

interface NftMetadataAttribute {
  trait_type: string;
  value: string;
}

interface NftMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url: string;
  attributes: NftMetadataAttribute[];
}

export interface NftItem {
  amount: string;
  token_id: string;
  token_address: string;
  contract_type: 'ERC1155' | 'ERC721';
  owner_of: string;
  last_metadata_sync: string;
  last_token_uri_sync: string;
  metadata: string | NftMetadata;
  block_number: string;
  block_number_minted: string | null;
  name: string;
  symbol: string;
  token_hash: string;
  token_uri: string;
  minter_address: string;
  rarity_rank: number | null;
  rarity_percentage: number | null;
  rarity_label: string | null;
  verified_collection: boolean;
  possible_spam: boolean;
  media: NftMedia;
  collection_logo: string | null;
  collection_banner_image: string | null;
  floor_price: number | null;
  floor_price_usd: number | null;
  floor_price_currency: string | null;
}

export interface NftListResponse {
    address: string;
    chain: string;
    nfts: NftItem[];
}
