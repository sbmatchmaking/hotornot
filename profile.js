const pfp = document.getElementById("profile-pic");
const userPicture = document.getElementById("pfp");
const userName = document.getElementById("name")
const userInfo = document.getElementById("user-data")
const uuid = localStorage.getItem("user-uid");

// Initialize on load
window.onload = function () {
    const uid = localStorage.getItem("user-uid");
    if (uid == null) {
        window.location.href = "index.html";
    }

    pfp.src = localStorage.getItem("profile-pic");

    fetch("https://sbmmbk.lol/api/v2.1.3/json/g/userelo", {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({"uuid": uuid})
    })
        .then(response => response.json())
        .then(data => {
            userPicture.src = data[0].fields.pfp_src;
            userName.textContent = data[0].fields.fname + " " + data[0].fields.lname;
            userInfo.textContent = "Elo: " + data[0].fields.elo_rating;
        });
}
