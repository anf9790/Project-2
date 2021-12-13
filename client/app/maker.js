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
    handleError(randomPassLine());
}

/*
const handleUpdate = (e) => {
    e.preventDefault();

    $("#NFTMessage").animate({width:'hide'},350);

    if($("#user").val()== ''|| $("#pass").val()==''|| $("#pass2").val()==''){
        handleError("I think you forgot something, bub.");
        return false;
    }

    if($("#pass").val()!== $("#pass2").val()){
        handleError("Those passwords don\'t match, bub. Are you one of those \"write-clickers\"");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
    const NFTId = NFT._id
    const _csrf = document.querySelector("#tokenInput");
    const deleteData = `_csrf=${_csrf.value}&NFTId=${NFTId}`;
    sendAjax('POST', $("#infoForm").attr("action"), $("#infoForm").serialize(), redirect);

    return false;
};*/

// Handles password changing.
const handlePassword = (e) => {
    e.preventDefault();

    $("#NFTMessage").animate({width:'hide'},350);

    if($("#pass").val()==''|| $("#pass2").val()==''){
        handleError("I think you forgot something, bub.");
        if($("#pass").val() != $("#pass2").val()){
            handleError("Those two don't match, bub.");
            return false;
        }
    }
    sendAjax('POST', '/password', $("#accountForm").serialize(), redirect);

    return false;
}

const handleName = (e) => {
    e.preventDefault();

    $("#NFTMessage").animate({width:'hide'},350);

    return false;
}

const AccountWindow = (props) => {
    <form id="accountForm" 
        name="accountForm"
        action="/account"
        method="POST"
        className="infoForm"
        >
            <label for="pass">New Password: </label>
            <input id="pass" type="password" name="pass"/>
            <label for="pass2">Retype New password: </label>
            <input id="pass2" type="password" name="pass2"/>
            <input class="formSubmit" type="submit" value="Change Password" onClick={handlePassword(props)}/>

            <label for="name">Name: </label>
            <input id="name" type="name" name="name"/>
            <label for="email">Email: </label>
            <input id="email" type="email" name="email"/>
            <label for="address">Address: </label>
            <input id="address" type="address" name="address"/>
            <label for="card">Credit Card: </label>
            <input id="card" type="card" name="card" placeholder="XXX-XXX-XXX"/>
            <label for="code">Security Code: </label>
            <input id="code" type="code" name="code" placeholder="xxxx"/>
            <input type="hidden" name="_csrf" value={{csrfToken}} />
        </form>
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
                <h3 className="emptyNFT">No NFTs yet</h3>
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
                <input className="NFTRelease" type="submit" value="Pass" onClick={()=>handleDelete(NFT)}/>
                <input className="NFTRelease" type="submit" value="Buy" onClick={()=>handleDelete(NFT)}/>
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

//////
/*
const infoForm = (props) => {
    return(
        <form id="infoForm" 
        name="infoForm"
        action="/info"
        method="POST"
        className="infoForm"
        >
            <label for="pass">New Password: </label>
            <input id="pass" type="password" name="pass"/>
            <label for="pass2">Retype New password: </label>
            <input id="pass2" type="password" name="pass2"/>
            <label for="name">Name: </label>
            <input id="name" type="name" name="name"/>
            <label for="email">Email: </label>
            <input id="email" type="email" name="email"/>
            <label for="address">Address: </label>
            <input id="address" type="address" name="address"/>
            <label for="card">Credit Card: </label>
            <input id="card" type="card" name="card" placeholder="XXX-XXX-XXX"/>
            <label for="code">Security Code: </label>
            <input id="code" type="code" name="code" placeholder="xxxx"/>
            <input type="hidden" name="_csrf" value={{csrfToken}} />
            <input class="formSubmit" type="submit" value="Change Password" />
        </form>
    )
};//onClick={()=>addMoney(props)}

/*
const addMoney = (prop) => {
    prop.money += 50.00
    sendAjax('POST', '/update', updateData, loadInfoFromServer);
    handleError(randomPassLine());
};

const infoList = function(props) {
    return (
        <div key={props._id} 
        className="info"
        >
            <h3 className="username"> Username: {props.username} </h3>
            <h3 className="name"> Name: {props.name} </h3>
            <h3 className="name"> Name: {props.name} </h3>
            
                <label for="money">Money: {{info.money}}</label>
                <input className="addMoney" type="submit" value="Pass" />/
        </div>
    )
};

const setup = function(csrf){
    ReactDOM.render(
        <update csrf={csrf}/>,document.querySelector("#makeNFT")
    );

    loadInfoFromServer();
};

const loadInfoFromServer =()=>{
    sendAjax('GET', '/up',null,(data)=>{
        ReactDOM.render(
            <InfoList info={data.info} />, document.querySelector("#info")
        )
    })
};*/
//////
/*
const InfoWindow = (props) => {
    return(
        <form id="infoForm" name="infoForm"
        onSubmit={handleUpdate}
        action="/update"
        method="POST"
        className="NFTForm"
        >
            <label for="pass">New Password: </label>
            <input id="pass" type="password" name="pass"/>
            <label for="pass2">Retype New password: </label>
            <input id="pass2" type="password" name="pass2"/>
            <label for="name">Name: </label>
            <input id="name" type="name" name="name"/>
            <label for="email">Email: </label>
            <input id="email" type="email" name="email"/>
            <label for="address">Address: </label>
            <input id="address" type="address" name="address"/>
            <label for="card">Credit Card: </label>
            <input id="card" type="card" name="card" placeholder="XXX-XXX-XXX"/>
            <label for="code">Security Code: </label>
            <input id="code" type="code" name="code" placeholder="xxxx"/>
            <input type="hidden" name="_csrf" value={{csrfToken}} />
            <input class="formSubmit" type="submit" value="Change Password" />

        </form>
    )
}

const createInfoWindow = (csrf) => {
    ReactDOM.render(
        <InfoWindow csrf={csrf} />,
        document.querySelector("#NFTs")
    )
}
*/

const createAccountWindow = (crsf) => {
    ReactDOM.render(
        <AccountWindow csrf={csrf}/>,document.querySelector("#NFTs")
    );

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
    const AccountButton = document.querySelector("#accountButton");

    AccountButton.addEventListener("click",(e)=>{
        e.preventDefault();
        createAccountWindow(csrf);
        return false;
    });

    NFTButton.addEventListener("click",(e)=>{
        e.preventDefault();
        createNFTWindow(csrf);
        return false;
    });

    createNFTWindow(csrf); //default view
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    })
}

$(document).ready(function() {
    getToken();
});