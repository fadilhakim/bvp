$(document).ready(function(){
    if(window.location.hostname.indexOf('local') > -1 || window.location.hostname.indexOf('staging') > -1) {
        window.businessUrl = 'https://business-staging.bridestory.com';
    }else {
        window.businessUrl = 'https://business.bridestory.com';
    }
});

function submitRegistration () {
    // e.preventDefault();
    var businessName    = $('[name="businessName"]').val(),
    email               = $('[name="email"]').val(),
    password            = $('[name="password"]').val(),
    category            = $('[name="category"]').val();

    $('#businessEmpty').hide();
    $('#emailEmpty').hide();
    $('#wrongEmail').hide();
    $('#passwordEmpty').hide();

    if(!businessName) $('#businessEmpty').show();
    
    if(!email) $('#emailEmpty').show();
    else if(!validateEmail(email)) $('#wrongEmail').show();
    
    if(!password) $('#passwordEmpty').show();

    if(businessName && email && password && validateEmail(email)){
        document.cookie = 'BS.registration-data=' + JSON.stringify({'name' : businessName, 'email' : email, 'password' : password, 'category' : category}) + ';domain=.bridestory.com;';
        window.location = businessUrl + '/register/vendor';
    }   
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}