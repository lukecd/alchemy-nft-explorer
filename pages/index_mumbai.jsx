import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import {NFTCard} from "./components/nftCard";

const Home = () => {
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const fetchNFTs = async() => {
    //NOTE
    // set wallet address to the address of the current user
    // set collection to the final contract address of our deployed Web3Citizen contract
    let wallet = "0x125480d196cb351B91C29E47Dc45e0205fE37AEE";
    let collection = "0x27486d0f2af83f60fc4193b443031b82747a7777";

    let nfts;
    // this is my api key. can leave as is.
    const apiKey = "9OL0Iq8dsbaZkSM1jDKlf9bTWesXVWwO";
    const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}/getNFTs/`;

 
    if(!collection.length) {

      var requestOptions = {
        method: 'GET'
      };
   
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }
    else {
      console.log('fetching NFTs for collection owned by address');
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      console.log(fetchURL);
    }

    if(nfts) {
      console.log(nfts);
      setNFTs(nfts.ownedNfts);
    }
  }



  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            fetchNFTs();
    
          }
        }>Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
