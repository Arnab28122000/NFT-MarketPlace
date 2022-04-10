import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient , CID, IPFSHTTPClient } from "ipfs-http-client";
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import btoa from 'btoa';
import Image from 'next/image'



const ipfs = ipfsHttpClient({ host: "ipfs.infura.io", port: 5001, protocol: "https" , apiPath : "/api/v0"});

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function CreateItem() {
  // let ipfs;
  const authorization = "Basic " + btoa("27YUTi7nbH72bjDGwQMv90Zr8BL" + ":" + "37dd68dc69f33ea3491a03a73136ae11");
  // try {
  //   ipfs = ipfsHttpClient({
  //     url: "https://ipfs.infura.io:5001/api/v0",
  //     headers: {
  //       authorization,
  //     }
  //   });
  // } catch (error) {
  //   console.error("IPFS error ", error);
  //   ipfs = undefined;
  // }
  const [fileUrl, setFileUrl] = useState([])
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      // const added = await client.add(
      //   file,
      //   {
      //     progress: (prog) => console.log(`received: ${prog}`)
      //   }
      // )
      const added = await ipfs.add(file, 
        {
           progress: (prog) => console.log(`received: ${prog}`)
        }  
        );
      
      console.log("File:", file)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log("url:", url)
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file one: ', error)
    }  
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const result = await ipfs.add(data);
      const url = `https://ipfs.infura.io/ipfs/${result.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale() {
    try{
      const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()// getting the signer from metamask
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url) // create nft
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether') /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer) // initializing the marketplaceContract
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice }) 
    await transaction.wait()
    router.push('/')
    }catch(e){
      console.log('Error creating sale: ', e)
    }
    
  }

  return (
    <div className="flex justify-center bg-blue-800">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4 bg-blue-100"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4 bg-blue-100"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4 bg-blue-100 "
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
        style={{height: '30px', width: '400px'}}
          type="file"
          name="Asset"
          className="my-4 "
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4 bg-blue-200" width="350" src={fileUrl} />
          )
        }
        <button onClick={createSale} className="w-full bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white font-bold py-4 px-12 rounded">
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}