
function updateLiveTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    var formattedTime = hours + ":" + minutes + ":" + seconds;
    document.getElementById("live-time").innerHTML = formattedTime;
}
setInterval(updateLiveTime, 1000);
updateLiveTime();

function updateDate() {
    var currentDate = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    var formattedDate = currentDate.toLocaleDateString('en-UK', options);
    
    document.getElementById('liveDate').textContent = formattedDate;
  }
  setInterval(updateDate, 1000);
  updateDate();

  const checkboxes = document.querySelectorAll('.checkbox');
        
  checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
          const targetId = this.dataset.target;
          const row = this.closest('tr'); // Get the parent row using closest()
          if (this.checked) {
              row.remove(); // Remove the entire row
          }
      });
  });



   