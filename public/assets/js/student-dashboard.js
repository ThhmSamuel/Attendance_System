
function updateLiveTime() {
    var liveTimeElement = document.getElementById("live-time");
    if (liveTimeElement) {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        hours = (hours < 10 ? "0" : "") + hours;
        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        var formattedTime = hours + ":" + minutes + ":" + seconds;
 
        liveTimeElement.innerHTML = formattedTime;
    }
}  

// Function to update live date
function updateDate() {
    var liveDateElement = document.getElementById('liveDate');
    if (liveDateElement) {
        var currentDate = new Date();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        var formattedDate = currentDate.toLocaleDateString('en-UK', options);

        liveDateElement.textContent = formattedDate;
    }
}


// Function to initialize the page functionality
function initializePage() {
    // Call functions to update live time and live date
    updateLiveTime();
    updateDate();

    // Set intervals to update the time and date every second
    setInterval(updateLiveTime, 1000);
    setInterval(updateDate, 1000);

    // Checkbox functionality
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const targetId = this.dataset.target;
            const row = this.closest('tr');
            if (this.checked) {
                row.remove();
            }
        });
    });
}

// Check if the live time and live date elements exist before initializing page functionality
if (document.getElementById("live-time") && document.getElementById("liveDate")) {
    initializePage();
}