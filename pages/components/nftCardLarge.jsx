const NFTCardLarge = ({nft}) => {    
    if(!nft) {
        return (
            <p>no nft provided</p>
        )
    }

    if(nft.media[0].gateway.includes(".mp4")) {
        return (         
            <video autoPlay className="object-cover h-128 w-full rounded-t-md"  >
                <source src={nft.media[0].gateway} type="video/mp4" />
            </video>
          )
    }
    else {
        return (     
           <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
        )       
    }
 
}

export default NFTCardLarge