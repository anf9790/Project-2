const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#NFTMessage").animate({width:'toggle'},350);
    setTimeout(function() {$("#NFTMessage").animate({width:'toggle'},350)}, 2500);
};

const handleText = (message) => {
    $("#errorMessage").text(message);
    $("#NFTMessage").animate({width:'toggle'},350);
    setTimeout(function() {$("#NFTMessage").animate({width:'toggle'},350)}, 2500);
};

const redirect = (response) => {
    $("NFTMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr,status,error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};