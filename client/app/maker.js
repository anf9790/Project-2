const handleNFT = (e) => {
    e.preventDefault ();

    $("#NFTMessage").animate({width:'hide'},350);

    /*
    if($("#NFTColor").val() == '' || $("#NFTidNum").val()== '' || $("#value").val()== '') {
        handleError("RAWR! All fields are required");
        return false;
    }*/

    sendAjax('POST', $("#NFTForm").attr("action"), $("#NFTForm").serialize(), function(){
        loadNFTsFromServer();
    });

    return false;
};

const handleDelete = (NFT) => {
    const NFTId = NFT._id
    const _csrf = document.querySelector("#tokenInput");
    const deleteData = `_csrf=${_csrf.value}&NFTId=${NFTId}`;
    sendAjax('DELETE', '/delete-NFT', deleteData, loadNFTsFromServer);
}

const NFTForm = (props) => {
    return(
        <form id="NFTForm" 
        onSubmit={handleNFT}
        name="NFTForm"
        action="/maker"
        method="POST"
        className="NFTForm"
        >
            <input id="tokenInput" type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeNFTSubmit" type="submit" value="Next NFT"/>
            
        </form>
    )
};

const NFTList = function(props) {
    if(props.NFTs.length === 0){
        return(
            <div className="NFTList">
                <h3 className="emptyNFT">No NFTs yet</h3>
            </div>
        )
    }

    const NFTNodes = props.NFTs.map(function(NFT) {
        return (
            <div key={NFT._id} 
            className="NFT"
            >
                <img src="/assets/img/toad.png" alt="NFT image" className="NFTFace"/>
                <h3 className="NFTidNum"> idNum: {NFT.idNum} </h3>
                <h3 className="value"> Value: {NFT.value} Crypto-Bucks</h3>
                <input className="NFTRelease" type="submit" value="Release" onClick={()=>handleDelete(NFT)}/>
            </div>
        )
    })

    return (
        <div className="NFTList">
            {NFTNodes}
        </div>
    )
}

const loadNFTsFromServer =()=>{
    sendAjax('GET', '/getNFTs',null,(data)=>{
        ReactDOM.render(
            <NFTList NFTs={data.NFTs} />, document.querySelector("#NFTs")
        )
    })
}

const setup = function(csrf){
    ReactDOM.render(
        <NFTForm csrf={csrf}/>,document.querySelector("#makeNFT")
    );

    ReactDOM.render(
        <NFTList NFTs={[]}/>,document.querySelector("#NFTs")
    )

    loadNFTsFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    })
}

$(document).ready(function() {
    getToken();
});