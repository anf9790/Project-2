"use strict";

var handleNFTCreation = function handleNFTCreation(e) {
  e.preventDefault();
  $("#NFTMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#NFTForm").attr("action"), $("#NFTForm").serialize(), function () {
    loadNFTsFromServer();
  });
  return false;
};

var handleDelete = function handleDelete(NFT) {
  var NFTId = NFT._id;

  var _csrf = document.querySelector("#tokenInput");

  var deleteData = "_csrf=".concat(_csrf.value, "&NFTId=").concat(NFTId);
  sendAjax('DELETE', '/delete-NFT', deleteData, loadNFTsFromServer);
  handleError(randomPassLine());
};
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


var handlePassword = function handlePassword(e) {
  e.preventDefault();
  $("#NFTMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("I think you forgot something, bub.");

    if ($("#pass").val() != $("#pass2").val()) {
      handleError("Those two don't match, bub.");
      return false;
    }
  }

  sendAjax('POST', '/password', $("#accountForm").serialize(), redirect);
  return false;
};

var handleName = function handleName(e) {
  e.preventDefault();
  $("#NFTMessage").animate({
    width: 'hide'
  }, 350);
  return false;
};

var AccountWindow = function AccountWindow(props) {
  /*#__PURE__*/
  React.createElement("form", {
    id: "accountForm",
    name: "accountForm",
    action: "/account",
    method: "POST",
    className: "infoForm"
  }, /*#__PURE__*/React.createElement("label", {
    "for": "pass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass"
  }), /*#__PURE__*/React.createElement("label", {
    "for": "pass2"
  }, "Retype New password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2"
  }), /*#__PURE__*/React.createElement("input", {
    "class": "formSubmit",
    type: "submit",
    value: "Change Password",
    onClick: handlePassword(props)
  }), /*#__PURE__*/React.createElement("label", {
    "for": "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "name",
    type: "name",
    name: "name"
  }), /*#__PURE__*/React.createElement("label", {
    "for": "email"
  }, "Email: "), /*#__PURE__*/React.createElement("input", {
    id: "email",
    type: "email",
    name: "email"
  }), /*#__PURE__*/React.createElement("label", {
    "for": "address"
  }, "Address: "), /*#__PURE__*/React.createElement("input", {
    id: "address",
    type: "address",
    name: "address"
  }), /*#__PURE__*/React.createElement("label", {
    "for": "card"
  }, "Credit Card: "), /*#__PURE__*/React.createElement("input", {
    id: "card",
    type: "card",
    name: "card",
    placeholder: "XXX-XXX-XXX"
  }), /*#__PURE__*/React.createElement("label", {
    "for": "code"
  }, "Security Code: "), /*#__PURE__*/React.createElement("input", {
    id: "code",
    type: "code",
    name: "code",
    placeholder: "xxxx"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: {
      csrfToken: csrfToken
    }
  }));
};

var NFTForm = function NFTForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "NFTForm",
    onSubmit: handleNFTCreation,
    name: "NFTForm",
    action: "/maker",
    method: "POST",
    className: "NFTForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "tokenInput",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeNFTSubmit",
    type: "submit",
    value: "Load Another NFT"
  }));
};

var NFTList = function NFTList(props) {
  if (props.NFTs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "NFTList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyNFT"
    }, "No NFTs yet"));
  }

  var NFTNodes = props.NFTs.map(function (NFT) {
    var style = {
      backgroundColor: NFT.color
    };
    return /*#__PURE__*/React.createElement("div", {
      key: NFT._id,
      className: "NFT"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/toad.png",
      alt: "NFT image",
      className: "NFTFace",
      style: style
    }), /*#__PURE__*/React.createElement("h3", {
      className: "NFTidNum"
    }, " idNum: ", NFT.idNum, " "), /*#__PURE__*/React.createElement("h3", {
      className: "value"
    }, " Value: ", NFT.value, " Crypt-Toes"), /*#__PURE__*/React.createElement("input", {
      className: "NFTRelease",
      type: "submit",
      value: "Pass",
      onClick: function onClick() {
        return handleDelete(NFT);
      }
    }), /*#__PURE__*/React.createElement("input", {
      className: "NFTRelease",
      type: "submit",
      value: "Buy",
      onClick: function onClick() {
        return handleDelete(NFT);
      }
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "NFTList"
  }, NFTNodes);
};

var loadNFTsFromServer = function loadNFTsFromServer() {
  sendAjax('GET', '/getNFTs', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(NFTList, {
      NFTs: data.NFTs
    }), document.querySelector("#NFTs"));
  });
};

var randomPassLine = function randomPassLine() {
  switch (Math.floor(Math.random() * 10)) {
    case 0:
      return "Eh, that one was too same-y anyways.";
      break;

    case 1:
      return "Yeah I agree, not worth it.";
      break;

    case 2:
      return "Awe, and I thought that one was perfect for you...";
      break;

    case 3:
      return "One guy came in here lookin' for monkies, can you believe it?";
      break;

    case 4:
      return "Maybe you could buy something?";
      break;

    case 5:
      return "Y'know what helps me make a decision? Buyin' something.";
      break;

    case 6:
      return "Man, that was a good deal too.";
      break;

    case 7:
      return "Sure, I guess I didn't want your crypt-toes anyway.";
      break;

    case 8:
      return "Where do you find all these crypts with all these toes?.";
      break;

    case 9:
      return "Y'know window shopping is pretty, bub.";
      break;
  }
}; //////

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


var createAccountWindow = function createAccountWindow(crsf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AccountWindow, {
    csrf: csrf
  }), document.querySelector("#NFTs"));
};

var createNFTWindow = function createNFTWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(NFTForm, {
    csrf: csrf
  }), document.querySelector("#makeNFT"));
  ReactDOM.render( /*#__PURE__*/React.createElement(NFTList, {
    NFTs: []
  }), document.querySelector("#NFTs"));
  loadNFTsFromServer();
};

var setup = function setup(csrf) {
  var NFTButton = document.querySelector("#NFTButton");
  var AccountButton = document.querySelector("#accountButton");
  AccountButton.addEventListener("click", function (e) {
    e.preventDefault();
    createAccountWindow(csrf);
    return false;
  });
  NFTButton.addEventListener("click", function (e) {
    e.preventDefault();
    createNFTWindow(csrf);
    return false;
  });
  createNFTWindow(csrf); //default view
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#NFTMessage").animate({
    width: 'toggle'
  }, 350);
};

var handleText = function handleText(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  $("NFTMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
