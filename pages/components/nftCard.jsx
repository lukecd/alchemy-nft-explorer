const NFTCard = ({nft,callbackFunction}) => {
    if(!nft) {
        return (
            <p>no nft provided</p>
        )
    }

    // this is our hack to manually merge the IDs
    let ownerCount = nft.ownerCount;
    let tokenIds = [];
    if(nft.isMerged) {
        console.log("is merge ",nft.mergedIds)
        ownerCount = nft.mergedCount;
        tokenIds = nft.mergedIds;
    }
    else {
        tokenIds[0] = nft.id.tokenId;
    }

    console.log("ownerCount=",ownerCount);

    if(nft.media[0].gateway.includes(".mp4")) {
        return (
            <div className="w-1/4 flex flex-col bg-slate-600">
            <div className="rounded-md">
            
            <video autoPlay className="object-cover h-128 w-full rounded-t-md"  >
                <source src={nft.media[0].gateway} type="video/mp4" />
            </video>
           </div>
            <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
                <div className="">
                    <h2 className="text-xl text-gray-800">{nft.title}</h2>
                    <p className="text-gray-600">Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>
                </div>
    
                <div className="flex-grow mt-2">
                    {ownerCount && (
                    <button className="underline" onClick={(e)=>{callbackFunction(tokenIds, nft)}}>Owned By {ownerCount}  Wallet(s)</button>
                    )}
              </div>
            </div>
    
        </div>
        )
    }
    else {
        return (
            <div className="w-1/4 flex flex-col bg-slate-600">
            <div className="rounded-md">
           <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
    
                
            </div>
            <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
                <div className="">
                    <h2 className="text-xl text-gray-800">{nft.title}</h2>
                    <p className="text-gray-600">Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>
                </div>
    
                <div className="flex-grow mt-2">
                    {ownerCount && (
                    <button className="underline" onClick={(e)=>{callbackFunction(tokenIds, nft)}}>Owned By {ownerCount}  Wallet(s)</button>
                    )}
                </div>
            </div>  
        </div>
        )       
    }
 
}

export default NFTCard
