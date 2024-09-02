const wrapper = document.querySelector(".wrapper");
const arrows = document.querySelectorAll(".wrapper i");
const slider = document.querySelector(".slider");
const sliderChildren = [...slider.children];
const cardWidth = document.querySelector(".card").offsetWidth;

let isDragging = false;
let startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the slider at once
let cardPreview = Math.round(slider.offsetWidth / cardWidth);

// Insert copies of the last few cards to beginning of the slider for infinite scrolling
sliderChildren
  .slice(-cardPreview)
  .reverse()
  .forEach((card) => {
    slider.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of the slider for infinite scrolling
sliderChildren.slice(0, cardPreview).forEach((card) => {
  slider.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Add event listeners for the arrows to scroll the slider left and right
arrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    slider.scrollLeft += arrow.id === "left" ? -cardWidth : cardWidth;
  });
});

const startDragging = (e) => {
  isDragging = true;
  slider.classList.add("dragging");
  // Record the initial cursor and scroll position of the slider
  startX = e.pageX;
  startScrollLeft = slider.scrollLeft;
};

const dragging = (e) => {
  if (isDragging) {
    // Update the scroll position of the slider based on the cursor movement
    slider.scrollLeft = startScrollLeft - (e.pageX - startX);
  }
};

const stopDragging = () => {
  isDragging = false;
  slider.classList.remove("dragging");
};

const autoplay = () => {
  if (window.innerWidth >= 800) {
    // Autoplay the slider after every 2500 ms
    timeoutId = setTimeout(() => (slider.scrollLeft += cardWidth), 2500);
  }
};

const infiniteScroll = () => {
  // If the slider is at the beginning, scroll to the end
  if (slider.scrollLeft === 0) {
    slider.classList.add("no-transition");
    slider.scrollLeft = slider.scrollWidth - 2 * slider.offsetWidth;
    slider.classList.remove("no-transition");
  }
  // If the slider is at the end, scroll to the beginning
  else if (
    Math.ceil(slider.scrollLeft) ===
    slider.scrollWidth - slider.offsetWidth
  ) {
    slider.classList.add("no-transition");
    slider.scrollLeft = slider.offsetWidth;
    slider.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over slider
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoplay();
};

slider.addEventListener("mousedown", startDragging);
slider.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", stopDragging);
slider.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoplay);
