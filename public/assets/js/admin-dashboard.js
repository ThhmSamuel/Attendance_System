
// function updateLiveTime() {
//     var currentTime = new Date();
//     var hours = currentTime.getHours();
//     var minutes = currentTime.getMinutes();
//     var seconds = currentTime.getSeconds();
//     hours = (hours < 10 ? "0" : "") + hours;
//     minutes = (minutes < 10 ? "0" : "") + minutes;
//     seconds = (seconds < 10 ? "0" : "") + seconds;

//     var formattedTime = hours + ":" + minutes + ":" + seconds;
//     document.getElementById("live-time").innerHTML = formattedTime;
// }
// setInterval(updateLiveTime, 1000);
// updateLiveTime();

// function updateDate() {
//     var currentDate = new Date();
//     var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
//     var formattedDate = currentDate.toLocaleDateString('en-UK', options);
    
//     document.getElementById('liveDate').textContent = formattedDate;
//   }
//   setInterval(updateDate, 1000);
//   updateDate();


//   const checkboxes = document.querySelectorAll('.checkbox');
        
//   checkboxes.forEach(checkbox => {
//       checkbox.addEventListener('change', function() {
//           const targetId = this.dataset.target;
//           const row = this.closest('tr'); // Get the parent row using closest()
//           if (this.checked) {
//               row.remove(); // Remove the entire row
//           }
//       });
//   });
// const wrapper = document.querySelector(".admin-wrapper");
// const carousel = document.querySelector(".carousel");
// const firstCardWidth = carousel.querySelector(".admin-card").offsetWidth;
// const arrowBtns = document.querySelectorAll(".admin-wrapper i");
// const carouselChildrens = [...carousel.children];
// let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;
// // Get the number of cards that can fit in the carousel at once
// let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
// // Insert copies of the last few cards to beginning of carousel for infinite scrolling
// carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
//     carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
// });
// // Insert copies of the first few cards to end of carousel for infinite scrolling
// carouselChildrens.slice(0, cardPerView).forEach(card => {
//     carousel.insertAdjacentHTML("beforeend", card.outerHTML);
// });
// // Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
// carousel.classList.add("no-transition");
// carousel.scrollLeft = carousel.offsetWidth;
// carousel.classList.remove("no-transition");
// // Add event listeners for the arrow buttons to scroll the carousel left and right
// arrowBtns.forEach(btn => {
//     btn.addEventListener("click", () => {
//         carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
//     });
// });
// const dragStart = (e) => {
//     isDragging = true;
//     carousel.classList.add("dragging");
//     // Records the initial cursor and scroll position of the carousel
//     startX = e.pageX;
//     startScrollLeft = carousel.scrollLeft;
// }
// const dragging = (e) => {
//     if(!isDragging) return; // if isDragging is false return from here
//     // Updates the scroll position of the carousel based on the cursor movement
//     carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
// }
// const dragStop = () => {
//     isDragging = false;
//     carousel.classList.remove("dragging");
// }
// const infiniteScroll = () => {
//     // If the carousel is at the beginning, scroll to the end
//     if(carousel.scrollLeft === 0) {
//         carousel.classList.add("no-transition");
//         carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
//         carousel.classList.remove("no-transition");
//     }
//     // If the carousel is at the end, scroll to the beginning
//     else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
//         carousel.classList.add("no-transition");
//         carousel.scrollLeft = carousel.offsetWidth;
//         carousel.classList.remove("no-transition");
//     }
//     // Clear existing timeout & start autoplay if mouse is not hovering over carousel
//     clearTimeout(timeoutId);
//     if(!wrapper.matches(":hover")) autoPlay();
// }
// const autoPlay = () => {
//     if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
//     // Autoplay the carousel after every 2500 ms
//     timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
// }
// autoPlay();
// carousel.addEventListener("mousedown", dragStart);
// carousel.addEventListener("mousemove", dragging);
// document.addEventListener("mouseup", dragStop);
// carousel.addEventListener("scroll", infiniteScroll);
// wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
// wrapper.addEventListener("mouseleave", autoPlay);
   