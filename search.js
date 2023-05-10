const leaderboard = document.getElementById('leaderboard');
const searchInput = document.getElementById('search-input');

// Add a listener to the search input
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const rows = leaderboard.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
        const name = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
        if (name.includes(query)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
});

window.onload = function () {
    fetch("https://sbmmbk.lol/api/v2.1.3/json/g/leaderboard")
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let student = data[i].fields;
                const row = leaderboard.insertRow();
                row.insertCell().textContent = student.fname + " " + student.lname
                row.insertCell().textContent = student.elo_rating
            }
        });
}
