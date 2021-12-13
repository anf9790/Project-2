"use strict";

var handleNFT = function handleNFT(e) {
  e.preventDefault();
  $("#NFTMessage").animate({
    width: 'hide'
  }, 350);
  /*
  if($("#NFTColor").val() == '' || $("#NFTidNum").val()== '' || $("#value").val()== '') {
      handleError("RAWR! All fields are required");
      return false;
  }*/

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
};

var NFTForm = function NFTForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "NFTForm",
    onSubmit: handleNFT,
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
    value: "Next NFT"
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
    return /*#__PURE__*/React.createElement("div", {
      key: NFT._id,
      className: "NFT"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/toad.png",
      alt: "NFT image",
      className: "NFTFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "NFTidNum"
    }, " idNum: ", NFT.idNum, " "), /*#__PURE__*/React.createElement("h3", {
      className: "value"
    }, " Value: ", NFT.value, " Crypto-Bucks"), /*#__PURE__*/React.createElement("input", {
      className: "NFTRelease",
      type: "submit",
      value: "Release",
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

var CollectionWindow = function CollectionWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    id: "upgrades"
  }, /*#__PURE__*/React.createElement("div", {
    className: "upgrade"
  }, /*#__PURE__*/React.createElement("p", null, "More seeds"), /*#__PURE__*/React.createElement("input", {
    type: "button",
    value: "x 5"
  })), /*#__PURE__*/React.createElement("div", {
    className: "upgrade"
  }, /*#__PURE__*/React.createElement("p", null, "Flower grow speed"), /*#__PURE__*/React.createElement("input", {
    type: "button",
    value: "x 2"
  }))));
};

var createCollectionWindow = function createCollectionWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(CollectionWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};
/** User Info Page **/


var InfoWindow = function InfoWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    id: "upgrades"
  }, /*#__PURE__*/React.createElement("div", {
    className: "upgrade"
  }, /*#__PURE__*/React.createElement("p", null, "More seeds"), /*#__PURE__*/React.createElement("input", {
    type: "button",
    value: "x 5"
  })), /*#__PURE__*/React.createElement("div", {
    className: "upgrade"
  }, /*#__PURE__*/React.createElement("p", null, "Flower grow speed"), /*#__PURE__*/React.createElement("input", {
    type: "button",
    value: "x 2"
  }))));
};

var createInfoWindow = function createInfoWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(InfoWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(NFTForm, {
    csrf: csrf
  }), document.querySelector("#makeNFT"));
  ReactDOM.render( /*#__PURE__*/React.createElement(NFTList, {
    NFTs: []
  }), document.querySelector("#NFTs"));
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
