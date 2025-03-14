export const ERC721_ABI = [{
  inputs: [
    {
      internalType: 'address',
      name: 'owner',
      type: 'address'
    }
  ],
  name: 'balanceOf',
  outputs: [
    {
      internalType: 'uint256',
      name: '',
      type: 'uint256'
    }
  ],
  stateMutability: 'view',
  type: 'function'
},
{
  inputs: [
    {
      internalType: 'address',
      name: 'from',
      type: 'address'
    },
    {
      internalType: 'address',
      name: 'to',
      type: 'address'
    },
    {
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256'
    }
  ],
  name: 'safeTransferFrom',
  outputs: [

  ],
  stateMutability: 'nonpayable',
  type: 'function'
},
{
  inputs: [
    {
      internalType: 'address',
      name: 'from',
      type: 'address'
    },
    {
      internalType: 'address',
      name: 'to',
      type: 'address'
    },
    {
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256'
    },
    {
      internalType: 'bytes',
      name: '_data',
      type: 'bytes'
    }
  ],
  name: 'safeTransferFrom',
  outputs: [

  ],
  stateMutability: 'nonpayable',
  type: 'function'
},
{
  inputs: [
    {
      internalType: 'address',
      name: 'from',
      type: 'address'
    },
    {
      internalType: 'address',
      name: 'to',
      type: 'address'
    },
    {
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256'
    }
  ],
  name: 'transferFrom',
  outputs: [

  ],
  stateMutability: 'nonpayable',
  type: 'function'
},
{
  inputs: [
    {
      internalType: 'address',
      name: 'owner',
      type: 'address'
    },
    {
      internalType: 'uint256',
      name: 'index',
      type: 'uint256'
    }
  ],
  name: 'tokenOfOwnerByIndex',
  outputs: [
    {
      internalType: 'uint256',
      name: '',
      type: 'uint256'
    }
  ],
  stateMutability: 'view',
  type: 'function'
}
]
