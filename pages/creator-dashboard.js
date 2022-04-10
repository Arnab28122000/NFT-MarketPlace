import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import LoadingSpinner from './loading-spinner'

import {
  nftmarketaddress, nftaddress
} from '../config'

import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    try{
      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
      })
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
  
    console.log("signer:", signer)
      
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    console.log("marketContract:", marketContract)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    console.log("tokenContract:", tokenContract)
    const data = await marketContract.fetchItemsListed()

    console.log("data:", data)
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      console.log("tokenUri:", tokenUri)
      const meta = await axios.get(tokenUri)
      console.log("meta:", meta)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      console.log("item:", item)
      return item
    }))
    console.log("items:", items)

    /* create a filtered array of items that have been sold */
    const soldItems = items.filter(i => i.sold)
    console.log("soldItems:", soldItems)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded') 
    }catch(e){
      console.log("dashboard error:",e)
    }
    
  }
  if(loadingState === 'not-loaded'){
    return (<LoadingSpinner/>)
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
  return (
    <div className="bg-blue-800">
      <div className="p-4">
        <h2 className="text-white text-2xl py-2">Items Created</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className=" shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
        <div className="px-4">
        {
          Boolean(sold.length) && (
            <div>
              <h2 className="text-white text-2xl py-2">Items sold</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                  sold.map((nft, i) => (
                    <div key={i} className="shadow rounded-xl overflow-hidden">
                      <img src={nft.image} className="rounded" />
                      <div className="p-4 bg-black">
                        <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
        </div>
    </div>
  )
}