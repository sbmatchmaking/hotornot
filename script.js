const errorMssg = document.getElementById("error-mssg");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");
const pfp = document.getElementById("user-pfp")

let options;
let cur;

function setUid(fname, lname) {
    fetch("https://sbmmbk.lol/api/v2.1.3/json/p/name_to_uuid", {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({fname: fname, lname: lname})
    })
        .then(response => response.json())
        .then(data => {
            if (data.length === 1) {
                localStorage.setItem("user-uid", data[0].pk);
                redirect();
            } else {
                cur = 0;
                options = data;
                pfp.style.visibility = "visible";
                pfp.src = options[cur].fields.pfp_src;
                leftArrow.textContent = "Prev";
                rightArrow.textContent = "Next";
                errorMssg.textContent = "Please use the left and right arrows to find yourself. When found, click on the image."
            }
        });
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function redirect() {
    window.location.href = "matching.html"
}

function handleCredentialResponse(response) {
    // console.log("Encoded JWT ID token: " + response.credential);
    const responsePayload = decodeJwtResponse(response.credential);
    // localStorage.setItem("user-name", responsePayload.name);
    // localStorage.setItem("user-email", responsePayload.email);
    // userName.textContent = responsePayload.name;
    // userEmail.textContent = responsePayload.email;
    // userPicture.src = responsePayload.picture;
    // console.log("ID: " + responsePayload.sub);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log("Image URL: " + responsePayload.picture);
    // console.log("Email: " + responsePayload.email);

    if (responsePayload.email.endsWith("@student.fuhsd.org")) {
        let userName = responsePayload.name
        let fname = userName.substring(0, userName.indexOf(" "));
        let lname = userName.substring(userName.lastIndexOf(" ") + 1);
        localStorage.setItem("profile-pic", responsePayload.picture);
        setUid(fname, lname);
        // window.location.href = "matching.html"
        // setTimeout(function () {window.location.href = "matching.html"}, 1000);
    } else {
        errorMssg.textContent = "You must sign in with your school email!"
    }
}

window.onload = function () {
    const uid = localStorage.getItem("user-uid");
    // console.log(uid);
    if (uid != null) {
        window.location.href = "matching.html";
    } else {
        pfp.style.visibility = "hidden";

        google.accounts.id.initialize({
            client_id: "662378591934-jvon7etbdg6n57ssiqsdrvuerck8e64h.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(document.getElementById("buttonDiv"), {theme: "outline", size: "large"}  // customization attributes
        );
        google.accounts.id.prompt(); // also display the One Tap dialog
    }
}

pfp.addEventListener("click", function() {
    localStorage.setItem("user-uid", options[cur].pk);
    redirect();
});

leftArrow.addEventListener("click", function() {
    cur = (cur - 1 + options.length) % options.length
    pfp.src = options[cur].fields.pfp_src;

});

rightArrow.addEventListener("click", function() {
    cur = (cur + 1 + options.length) % options.length
    pfp.src = options[cur].fields.pfp_src;
});

