import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import {NFTCard} from "../components/nftCard";
import {NFTCardLarge} from "../components/nftCardLarge";


const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [displayNFTs, setDisplayNFTs] = useState([]);
  const [ownersForId, setOwnersForId] = useState([]);
  const [displayNFTsForOwner, setDisplayNFTsForOwner] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [ownerForCurrentNFTs, setOwnerOfCurrentNFTs] = useState("");

  const [curPage, setCurPage] = useState(""); //"", "ALL_NFTs", "NFTS_FOR_WALLET", "WALLETS_FOR_NFT"

  const [mergeStudentIds, setMergeStudentIds] = useState(false);
  const [hide01Holders, setHide01Holders] = useState(false);

  const [nftForTokenAddresses, setNFTForTokenAddresses] = useState("");
  
  const studentIdTitle1 = "Web3 Early Student Card";
  const studentIdTitle2 = "Your journey as a Web3 developer starts here";

  const mintKudosContract = '0x60576A64851C5B42e8c57E3E4A5cF3CF4eEb2ED6';
  const apiKey = "21NOQwygOnotsg4S0euuwL9Iv4bKiIPo";

  const getOwnerCount = async (tokenId) => {
    var requestOptions = {
        method: 'GET'
        };
    const baseURL = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}/getOwnersForToken/`; 

    // array to hold the filtered NFTS
    // run the first fetch
    let fetchURL = `${baseURL}?contractAddress=${mintKudosContract}&tokenId=${tokenId}`;
    let ownerCount = await fetch(fetchURL, requestOptions).then(data => data.json());
    
    if (ownerCount) {
      return ownerCount.owners.length;
    }
    return 0;
  }

  /**
   * Fetches all NFTs, filters based on one value, stores in state variable
   * and then calls method for additional updating
   */
  const fetchNFTsForMintKudos = async () => {
    setSpinner(true);
    // clear the current state
    setNFTs([]);
    setCurPage("ALL_NFTs");
    var requestOptions = {
      method: 'GET'
    };
    const baseURL = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}/getNFTsForCollection/`; 

    // array to hold the filtered NFTS
    let filteredNFTs = [];

    // run the first fetch
    let fetchURL = `${baseURL}?contractAddress=${mintKudosContract}&withMetadata=${"true"}`;
    let nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    console.log("fetching NFTs, batch 1");
    if (nfts) {
      for(const curNFT of nfts.nfts) {
        if(curNFT.metadata.attributes[1].value == "Alchemy") {
          curNFT.ownerCount = await getOwnerCount(curNFT.id.tokenId);
          filteredNFTs.push(curNFT);
        }
      }
    }
    let nextToken = nfts.nextToken;
   
    // if we hace nfts.nextToken, keep fetching
    let batchCounter = 1;
    while(nextToken) {
      fetchURL = `${baseURL}?contractAddress=${mintKudosContract}&withMetadata=${"true"}&startToken=${nextToken}`;
      console.log(`fetching NFTs, batch ${batchCounter++}`);
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      nextToken = nfts.nextToken;
      for(const curNFT of nfts.nfts) {
        if(curNFT.metadata.attributes[1].value == "Alchemy") {
          curNFT.ownerCount = await getOwnerCount(curNFT.id.tokenId);
          filteredNFTs.push(curNFT);
        }
      }
 
    }
    // Store the unfiltered Alchemy NFTs as a state variable
    // this allows us to re-filter without re-querying the API
    setNFTs(filteredNFTs);
    // run filters
    filterNFTs(filteredNFTs, mergeStudentIds, hide01Holders);
    setSpinner(false);
  }
  
  /**
   * Takes NFTs loaded into state and does additional filtering
   * 1. Merge student IDs
   * 2. Hide 0 / 1 holders
   */
  const filterNFTs = async (currentlyDisplayedNFTs, shouldMergeIds, shouldHide01) => {
      // update state
      setMergeStudentIds(shouldMergeIds);
      setHide01Holders(shouldHide01);

      // if the user has chosen to hide NFTs with 0 or 1 holders
      if(shouldHide01) {
        currentlyDisplayedNFTs = currentlyDisplayedNFTs.filter(nft => nft.ownerCount > 1);
      }

      // visually merge multiple student IDs
      let mergedIds = []; // IDS of all NFTs merged together
      if(shouldMergeIds) {
        let mergedNFTs = [];
        let idNFT;
        let idCount = 0;
        for(let i=0; i<currentlyDisplayedNFTs.length; i++) {
          // if we're in an ID, just add up owner count
          if(currentlyDisplayedNFTs[i].title.includes(studentIdTitle1) || currentlyDisplayedNFTs[i].title.includes(studentIdTitle2)) {
            idNFT = currentlyDisplayedNFTs[i];
            idCount += idNFT.ownerCount;
            mergedIds.push(currentlyDisplayedNFTs[i].id.tokenId);
          }
          else {
            mergedNFTs.push(currentlyDisplayedNFTs[i]);
          }
        }
  
        
        idNFT.isMerged = true;
        idNFT.mergedCount = idCount;
        idNFT.mergedIds = mergedIds;
        mergedNFTs.unshift(idNFT);
        currentlyDisplayedNFTs = mergedNFTs;
      }

      setDisplayNFTs(currentlyDisplayedNFTs);
  }
  
  /**
   * 
   * Called to display a list of all wallets that hold a given tokenId 
   */
  const showHolderAddresses = async(tokenIds, nft) => {
    setCurPage("WALLETS_FOR_NFT");
    
    setSpinner(true);
 
    setOwnersForId([]);
    setNFTForTokenAddresses(nft);


    var requestOptions = {
      method: 'GET'
      };
    const baseURL = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}/getOwnersForToken/`; 
    
    let allOwners = [];
    for(let i=0; i<tokenIds.length; i++) {
      let fetchURL = `${baseURL}?contractAddress=${mintKudosContract}&tokenId=${tokenIds[i]}`;
      let owners = await fetch(fetchURL, requestOptions).then(data => data.json());
      
      for(let j=0; j<owners.owners.length; j++) {
        allOwners.push(owners.owners[j]);
      }
    }
    
    setOwnersForId(allOwners);
    // scroll up!
    setSpinner(false);
    window.scrollTo(0, 0);
  }

  /**
   * Updates the display to show all NFTs owned by a single wallet address
   */
  const showNFTsForOwner = async(owner) => {
      setCurPage("NFTs_FOR_WALLET");
      // since we are always called from the wallet address display
      // we need to update state to no longer display wallet addresses

      setOwnerOfCurrentNFTs(owner);
      
      // now query for NFTs owned by a given wallet
      let nfts;
      const baseURL = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}/getNFTs/`;
      var requestOptions = {
        method: 'GET'
      };
      
      const fetchURL = `${baseURL}?owner=${owner}&contractAddresses%5B%5D=${mintKudosContract}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      if(nfts) {
        setDisplayNFTsForOwner(nfts.ownedNfts);
      }
    
  }

  // our default page, shows loading graphic while we query the API
  if(!curPage) {
    return (
      <body className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900" >

      <div className="bg-indigo-600 sticky top-0">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="hidden md:inline"> NFTs For Contract</span>
              </p>
            </div>
            <div className="order-2 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto"> 
                  <label className="text-white py-2 px-4"><input checked={mergeStudentIds} onChange={(e)=>{filterNFTs(NFTs, e.target.checked, hide01Holders)}} type={"checkbox"} ></input>Merge Student IDs</label>
                  <label className="text-white py-2 px-4"><input checked={hide01Holders} onChange={(e)=>{filterNFTs(NFTs, mergeStudentIds, e.target.checked)}} type={"checkbox"} ></input>Hide 0/1 Holders</label>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <a href="#" onClick={(e)=>{fetchNFTsForMintKudos()}} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"> Query Chain </a>
            </div>
          
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8 gap-y-3">

        <div className="flex flex-col w-full justify-center items-center gap-y-2">
          <label className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"}>Contract ID: {mintKudosContract}</label>
          
        </div>


        <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
          <p className='text-white'>Click Query Chain to begin. Initial query can take ~one minute. Be patient.</p>
        </div>
    
      </div>
      </body>     
    )
  }
  // this shows all NFTs for a given wallet
  else if(curPage == "NFTs_FOR_WALLET"){
    return (
      <body className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900" >

      <div className="bg-indigo-600 sticky top-0">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="hidden md:inline"> NFTs For Wallet Address</span>
              </p>
            </div>
            
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <a href="#" onClick={(e)=>{showHolderAddresses([...nftForTokenAddresses.id.tokenId], nftForTokenAddresses)}} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"> Back To Wallet List </a>
            </div>
          
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8 gap-y-3">

        <div className="flex flex-col w-full justify-center items-center gap-y-2">
          <label className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"}>Wallet ID: {ownerForCurrentNFTs}</label>
          
        </div>


        <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
          {
            displayNFTsForOwner.length && displayNFTsForOwner.map(nft => {
              return (
                <NFTCard nft={nft} callbackFunction={showHolderAddresses}></NFTCard>
              )
            })
          }
        </div>
    
      </div>
      </body>
    )   
  }
  // this shows all wallet addresses for a given NFT
  else if(curPage == "WALLETS_FOR_NFT"){
    return (
      <body className="min-h-screen bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900" >
           <div className="bg-indigo-600 sticky top-0">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="hidden md:inline"> Owners For NFT</span>
              </p>
            </div>
            
            
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <a href="#" onClick={(e)=>{setCurPage("ALL_NFTs")}} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"> Show All NFTs </a>
            </div>
          
          </div>
        </div>
      </div>

    <div class="flex w-full p-5">
       <div class="w-1/2 h-full ml-5 bg-rose-500">
  
       <NFTCardLarge nft={nftForTokenAddresses}></NFTCardLarge>
      </div>
       <div class="grow h-full ml-5 bg-amber-500 pl-10">
        <h2 className="text-2xl">Owners</h2>
       <ol className='list-decimal text-white justify-center'>
        {spinner && (
          <>
          
          <svg role="status" class="w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          </>
          )}

          {
            !spinner && ownersForId.length && ownersForId.map(owner => {
              return (
                <li><button className="underline" onClick={(e)=>{showNFTsForOwner(owner)}}>{owner}</button></li>
              )
            })
          }
          </ol>

       </div>
    </div>

    
      </body>
    )
  }
  else { // ALL_NFTs
    return (
      <body className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900" >

      <div className="bg-indigo-600 sticky top-0">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="hidden md:inline"> NFTs For Contract</span>
              </p>
            </div>
            <div className="order-2 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto"> 
                  <label className="text-white py-2 px-4"><input checked={mergeStudentIds} onChange={(e)=>{filterNFTs(NFTs, e.target.checked, hide01Holders)}} type={"checkbox"} ></input>Merge Student IDs</label>
                  <label className="text-white py-2 px-4"><input checked={hide01Holders} onChange={(e)=>{filterNFTs(NFTs, mergeStudentIds, e.target.checked)}} type={"checkbox"} ></input>Hide 0/1 Holders</label>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <a href="#" onClick={(e)=>{fetchNFTsForMintKudos()}} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"> Query Chain </a>
            </div>
          
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8 gap-y-3">

        <div className="flex flex-col w-full justify-center items-center gap-y-2">
          <label className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"}>Contract ID: {mintKudosContract}</label>
          
        </div>


        <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {spinner && (
          <>
          <svg role="status" class="w-80 h-80 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          </>
          )}

          {
            !spinner && displayNFTs.length && displayNFTs.map(nft => {
              return (
                <NFTCard nft={nft} callbackFunction={showHolderAddresses}></NFTCard>
              )
            })
          }
        </div>
    
      </div>
      </body>
    )
  }
}

export default Home
