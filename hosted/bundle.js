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
  sendAjax('DELETE', '/delete-NFT', deleteData, loadNFTsFromServer); // Creates whitty one-liners from NFT!

  handleText(randomPassLine());
};

var handlePassword = function handlePassword(e) {
  e.preventDefault();
  $("NFTMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Both fields are required, bub.");
    return false;
  }

  if ($("#pass").val() === $("#pass2").val()) {
    handleError("They should be different passwords, bub.");
    return false;
  }

  sendAjax('POST', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);
  return false;
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
    }, "Oops, no more NFTs! Time to invest!"));
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
    }, " Value: ", NFT.value, " Crypt&#8209Toes"), /*#__PURE__*/React.createElement("input", {
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
};

var AccountWindow = function AccountWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "accountForm",
    name: "accountForm",
    onSubmit: handlePassword,
    action: "/passChange",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    className: "passwordLabel",
    htmlFor: "pass"
  }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("label", {
    className: "passwordLabel",
    htmlFor: "pass2"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  }));
};

var createAccountWindow = function createAccountWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AccountWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
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
  var accountButton = document.querySelector("#accountButton");
  NFTButton.addEventListener("click", function (e) {
    e.preventDefault();
    createNFTWindow(csrf);
    return false;
  });
  accountButton.addEventListener("click", function (e) {
    e.preventDefault();
    createAccountWindow(csrf);
    return false;
  });
  createNFTWindow(csrf); //default view

  loadNFTsFromServer();
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
