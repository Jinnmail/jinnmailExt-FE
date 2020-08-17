// const JM_DASHBOARD_URL = 'https://account.jinnmail.com', JM_API_URL = 'https://whatismyname2.xyz/api/v1/'; // 'https://jinnmailapp.herokuapp.com/api/v1/';
// const JM_DASHBOARD_URL = 'https://testling.xyz', JM_API_URL = 'https://api.testling.xyz/api/v1/';
const JM_DASHBOARD_URL = 'http://localhost:3001', JM_API_URL = 'http://localhost:3000/api/v1/';

let url = JM_API_URL;

// let url = 'https://jinnmailapp.herokuapp.com/api/v1/';
// let url = 'http://localhost:3000/api/v1/';
// let url = 'http://localhost:9001/api/v1/'

$('#verifyButton').click((e)=>{
    // console.log('here');
    chrome.storage.sync.get(['email'],(result)=>{
        // console.log(result);
        if(result){
            let code=$('#codeVerify').val();
            // console.log(result.email,code);
            let data = { email: result.email, code: code };
            data = JSON.stringify(data);
            $.ajax({
                type: "POST",
                url: url + 'user/code/verify',
                data: data,
                success: (success) => {
                    // console.log(success)
                    $(".success-msg").show();
                    // console.log(success.data.sessionToken)
                    localStorage.setItem("verifiedEmail", result.email);
                    chrome.storage.sync.set({ verified:true}, function () {
                        // console.log('Value is set to ');
                        window.location.href = '../popup.html';
                    });
                    chrome.storage.local.set({"verifyCode": false}, function() {})
                },
                error: (err) => {
                    // alert(err.responseJSON.error)
                    $(".credintials-error").text(err.responseJSON.error)
                    $('#succMsg').hide();
                    $(".credintials-error").show()
                    chrome.storage.local.set({"verifyCode": false}, function() {})
                },
                contentType: 'application/json'
            });
        }
    })
})

$('#oldtoNewAcc').click((e)=>{
    chrome.storage.sync.remove(['verified'], (result) => {
        window.location.href = '../pages/signup.html';
    });
})

$('#newLogin').click((e)=>{
    chrome.storage.sync.remove(['verified'], (result) => {
        window.location.href = '../popup.html';
    });
})

chrome.storage.sync.get(['email'], result => {
    $('#succMsg').text(`Verification code was sent to ${result.email}`);
});

$("#resendCode").click(e => {
    chrome.storage.sync.get(['email'],(result)=>{
        // console.log(result);
        if(result){
            // console.log(" Resent to: " + result.email);
            let data = { email: result.email };
            data = JSON.stringify(data);
            $.ajax({
                type: "POST",
                url: url + 'user/code/resend',
                data: data,
                success: (success) => {
                    console.log(success)
                    $('#succMsg').hide();
                    setTimeout(() => {
                        $(".success-msg").show();
                    },1000);
                },
                error: (err) => {
                    // alert(err.responseJSON.error)
                    $(".credintials-error").text(err.responseJSON.error)
                    $('#succMsg').hide();
                    $(".credintials-error").show()
                },
                contentType: 'application/json'
            });
        }
    })
});