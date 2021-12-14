const handleNFTCreation = (e) => {
    e.preventDefault ();

    $("#NFTMessage").animate({width:'hide'},350);

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
    // Creates whitty one-liners from NFT!
    handleText(randomPassLine());
}

// Functionally identical to the above sadly, I couldn't get it to work...
const handlePurchase = (NFT) => {
    const NFTId = NFT._id
    const _csrf = document.querySelector("#tokenInput");
    const deleteData = `_csrf=${_csrf.value}&NFTId=${NFTId}`;
    sendAjax('DELETE', '/delete-NFT', deleteData, loadNFTsFromServer);
    // Creates whitty one-liners from NFT!
    handleText(randomBuyLine());
}

const handlePassword = (e) => {
    e.preventDefault();

    $("NFTMessage").animate({width:'hide'},350);

    if($("#pass").val()==''|| $("#pass2").val()==''){
        handleError("Both fields are required, bub.");
        return false;
    }

    if($("#pass").val() === $("#pass2").val()){
        handleError("They should be different passwords, bub.");
        return false;
    }

    sendAjax('POST', '/passChange', $("#accountForm").serialize(), redirect);

    return false;
}

const handlePersonal = (e) => {
    e.preventDefault();

    if($("#name").val()!='')
        sendAjax('POST', '/nameChange', $("#accountForm").serialize(), redirect);
    
    if($("#email").val()!='')
        sendAjax('POST', '/emailChange', $("#accountForm").serialize(), redirect);

    return false;
}

const handleAddress = (e) => {
    e.preventDefault();

    if($("#address").val()!='')
        sendAjax('POST', '/addressChange', $("#accountForm").serialize(), redirect);

    return false;
}

const handlePayment = (e) => {
    e.preventDefault();

    if($("#card").val()!='')
        sendAjax('POST', '/cardChange', $("#accountForm").serialize(), redirect);

    if($("#code").val()!='')
        sendAjax('POST', '/codeChange', $("#accountForm").serialize(), redirect);

    return false;
}

const NFTForm = (props) => {
    return(
        <form id="NFTForm" 
        onSubmit={handleNFTCreation}
        name="NFTForm"
        action="/maker"
        method="POST"
        className="NFTForm"
        >
            <input id="tokenInput" type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeNFTSubmit" type="submit" value="Load Another NFT"/>
        </form>
    )
};

const NFTList = function(props) {
    if(props.NFTs.length === 0){
        return(
            <div className="NFTList">
                <h3 className="emptyNFT">Oops, no more NFTs! Time to invest!</h3>
            </div>
        )
    }

    const NFTNodes = props.NFTs.map(function(NFT) {
        const style = {
            backgroundColor: NFT.color,
        };
        return (
            <div key={NFT._id} 
            className="NFT"
            >
                <img src="/assets/img/toad.png" alt="NFT image" className="NFTFace" style={style}/>
                <h3 className="NFTidNum"> idNum: {NFT.idNum} </h3>
                <h3 className="value"> Value: {NFT.value} Crypt-Toes</h3>
                <input className="NFTbutt" type="submit" value="Pass" onClick={()=>handleDelete(NFT)}/>
                <input className="NFTbutt" type="submit" value="Buy" onClick={()=>handlePurchase(NFT)}/>
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

const randomPassLine = () => {
    switch(Math.floor(Math.random() * 10))
    {
        case 0: return "Eh, that one was too same-y anyways."
            break;
        case 1: return "Yeah I agree, not worth it."
            break;
        case 2: return "Awe, and I thought that one was perfect for you..."
            break;
        case 3: return "One guy came in here lookin' for monkies, can you believe it?"
            break;
        case 4: return "Maybe you could buy something?"
            break;
        case 5: return "Y'know what helps me make a decision? Buyin' something."
            break;
        case 6: return "Man, that was a good deal too."
            break;
        case 7: return "Sure, I guess I didn't want your crypt-toes anyway."
            break;
        case 8: return "Where do you find all these crypts with all these toes?."
            break;
        case 9: return "Y'know window shopping is pretty, bub."
            break;
    }
}

const randomBuyLine = () => {
    switch(Math.floor(Math.random() * 10))
    {
        case 0: return "Excellent purchase."
            break;
        case 1: return "You're too kind."
            break;
        case 2: return "Are you gonna need help carrying that fake toad?"
            break;
        case 3: return "Why stop at one?"
            break;
        case 4: return "Great choice."
            break;
        case 5: return "They're all the rage with middle aged men!"
            break;
        case 6: return "Are you one one of those 'Crypt-Toe-Bros'?"
            break;
        case 7: return "What's that bub, you live in your mom's basement?"
            break;
        case 8: return "Where do you find all these crypts with all these toes?."
            break;
        case 9: return "Come back soon!... Or stay, that's alright too."
            break;
    }
}

// Contains all of the account-changing options
const AccountWindow = (props) => {
    return(
        <form id="accountForm" name="accountForm"
        method="POST"
        className="accountForm"
        >
            <div id="passDiv">
                <label className="nameLabel" htmlFor="name">Name: </label>
                <input id="name" type="name" name="name" placeholder={props.name}/>
                <label className="emailLabel" htmlFor="email">Email: </label>
                <input id="email" type="email" name="email" placeholder={props.email}/>
                <input className="formSubmit" type="submit" value="Update" onClick={handlePersonal}/>
            </div>
            <div id="passDiv">
                <label className="addressLabel" htmlFor="address">Address: </label>
                <input id="address" type="address" name="address" placeholder={props.address}/>
                <input className="formSubmit" type="submit" value="Update" onClick={handleAddress}/>
            </div>
            <div id="passDiv">
                <label className="cardLabel" htmlFor="card">Card: </label>
                <input id="card" type="card" name="card" placeholder={props.card}/>
                <label className="codeLabel" htmlFor="code">CVV: </label>
                <input id="code" type="code" name="code" placeholder={props.code}/>
                <input className="formSubmit" type="submit" value="Update" onClick={handlePayment}/>
            </div>
            <div id="passDiv">
                <label className="passwordLabel" htmlFor="pass">Old Password: </label>
                <input id="pass" type="password" name="pass" placeholder="old password"/>
                <label className="passwordLabel" htmlFor="pass2">New Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="new password"/>
                <input className="formSubmit" type="submit" value="Update" onClick={handlePassword}/>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf}/>
        </form>
    )
}

const createAccountWindow = (csrf) => {
    ReactDOM.render(
        <AccountWindow csrf={csrf} />,
        document.querySelector("#NFTs")
    )
}

const createNFTWindow = (csrf) => {
    ReactDOM.render(
        <NFTForm csrf={csrf}/>,document.querySelector("#makeNFT")
    );

    ReactDOM.render(
        <NFTList NFTs={[]}/>,document.querySelector("#NFTs")
    );
    
    loadNFTsFromServer();
}

const setup = (csrf) => {
    const NFTButton = document.querySelector("#NFTButton");
    const accountButton = document.querySelector("#accountButton");

    NFTButton.addEventListener("click",(e)=>{
        e.preventDefault();
        createNFTWindow(csrf);
        return false;
    });

    accountButton.addEventListener("click",(e)=>{
        e.preventDefault();
        createAccountWindow(csrf);
        return false;
    });

    createNFTWindow(csrf); //default view
    
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