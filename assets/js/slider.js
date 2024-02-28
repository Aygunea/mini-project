document.addEventListener('DOMContentLoaded', function() {
    AOS.init();
  });
const sliderContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const nextIcon = document.querySelector(".next");
const prevIcon = document.querySelector(".prev");

let currentIndex = 0;

// sliderContainer.addEventListener("mouseover", stopPlay)
// sliderContainer.addEventListener("mouseout", startPlay);

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
}

function updateSlider() {
  const newTransform = -currentIndex * 100 + "%";
  sliderContainer.style.transform = `translateX(${newTransform})`;
}

nextIcon.addEventListener("click", nextSlide);
prevIcon.addEventListener("click", prevSlide);

let interval;

function startPlay() {
  interval = setInterval(nextSlide, 3000);
}

// function stopPlay() {
//   clearInterval(interval);
// }

startPlay();