// 13 raccoon images
const raccoonImages = [
  "images/racoons1.jpeg",
  "images/racoons2.jpeg",
  "images/racoons3.jpeg",
  "images/racoons4.jpeg",
  "images/racoons5.jpeg",
  "images/racoons6.jpeg",
  "images/racoons7.jpeg",
  "images/racoons8.jpeg",
  "images/racoons9.jpeg",
  "images/racoons10.jpeg",
  "images/racoons11.jpeg",
  "images/racoons12.jpeg",
  "images/racoons13.jpeg"
];

// Global variable to track spin count
let spinCount = 0;

// Simple array shuffle (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Add "repeatCount" times the images to each reel
function populateReel(reelElement, repeatCount) {
  reelElement.innerHTML = "";
  const shuffled = shuffleArray(raccoonImages);

  for (let i = 0; i < repeatCount; i++) {
    shuffled.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      reelElement.appendChild(img);
    });
  }
}

// Function to spin the reel (with deceleration)
function spinReel(reelElement, duration, callback, forceJackpot = false, jackpotImage = null) {
  try {
    let startTime = null;
    const initialSpeed = 30; // Initial speed (px/frame)
    const deceleration = 0.5; // Deceleration rate
    let currentSpeed = initialSpeed;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < duration) {
        const displacement = currentSpeed;
        let currentTop = parseFloat(reelElement.style.top) || 0;
        reelElement.style.top = (currentTop - displacement) + "px";

        // Decelerate
        currentSpeed -= deceleration;
        if (currentSpeed < 5) currentSpeed = 5; // Minimum speed

        requestAnimationFrame(animate);
      } else {
        if (forceJackpot && jackpotImage) {
          reelElement.innerHTML = "";
          for (let i = 0; i < 13; i++) {
            const img = document.createElement("img");
            img.src = jackpotImage;
            reelElement.appendChild(img);
          }
          reelElement.style.top = "0px";
          const finalIndex = Math.floor(Math.random() * raccoonImages.length);
          reelElement.style.top = (-finalIndex * 100) + "px";
          callback(finalIndex);
        } else {
          const finalIndex = getMiddleImageIndex(reelElement);
          reelElement.style.top = (-finalIndex * 100) + "px";
          callback(finalIndex);
        }
      }
    }

    requestAnimationFrame(animate);
  } catch (error) {
    console.error("Error in spin animation:", error);
  }
}

// Function to find the index of the middle image
function getMiddleImageIndex(reelElement) {
  const currentTop = parseFloat(reelElement.style.top) || 0;
  const reelHeight = reelElement.parentElement.clientHeight; // 300px
  const middlePixel = -currentTop + (reelHeight / 2);
  const imgHeight = 100;
  let index = Math.floor(middlePixel / imgHeight);

  const totalImages = reelElement.querySelectorAll("img").length;
  if (index < 0) index = 0;
  if (index >= totalImages) index = totalImages - 1;

  index = index % raccoonImages.length;

  return index;
}

// Function to show gold animation
function showGoldAnimation() {
  const goldAnimation = document.getElementById("goldAnimation");

  const particles = 100; 
  for (let i = 0; i < particles; i++) {
    const particle = document.createElement("div");
    particle.classList.add("gold-particle");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    const size = Math.random() * 15 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
    particle.style.animationTimingFunction = 'linear';
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    goldAnimation.appendChild(particle);
  }

  goldAnimation.classList.add("active");
  setTimeout(() => {
    goldAnimation.classList.remove("active");
    goldAnimation.innerHTML = "";
  }, 3500);
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  const reel1Content = document.getElementById("reel1-content");
  const reel2Content = document.getElementById("reel2-content");
  const reel3Content = document.getElementById("reel3-content");

  const spinBtn = document.getElementById("spinBtn");
  const resultDiv = document.getElementById("result");

  const spinSound = document.getElementById("spinSound");
  const jackpotSound = document.getElementById("jackpotSound");

  const repeatCount = 10;
  populateReel(reel1Content, repeatCount);
  populateReel(reel2Content, repeatCount);
  populateReel(reel3Content, repeatCount);

  spinBtn.addEventListener("click", () => {
    resultDiv.classList.remove("jackpot");
    resultDiv.textContent = "";
    spinCount++;

    spinBtn.disabled = true;

    populateReel(reel1Content, repeatCount);
    populateReel(reel2Content, repeatCount);
    populateReel(reel3Content, repeatCount);

    const spinDuration = 2000;

    let finalIndexes = [null, null, null];
    const isJackpotSpin = (spinCount % 3 === 0);
    let jackpotImage = null;
    if (isJackpotSpin) {
      jackpotImage = raccoonImages[Math.floor(Math.random() * raccoonImages.length)];
    }

    spinSound.play();

    spinReel(reel1Content, spinDuration, (finalIndex1) => {
      finalIndexes[0] = finalIndex1;
      checkFinal();
    }, isJackpotSpin, jackpotImage);

    spinReel(reel2Content, spinDuration + 500, (finalIndex2) => {
      finalIndexes[1] = finalIndex2;
      checkFinal();
    }, isJackpotSpin, jackpotImage);

    spinReel(reel3Content, spinDuration + 1000, (finalIndex3) => {
      finalIndexes[2] = finalIndex3;
      checkFinal();
    }, isJackpotSpin, jackpotImage);

    function checkFinal() {
      if (finalIndexes.every(idx => idx !== null)) {
        if (isJackpotSpin || finalIndexes.every((val, i, arr) => val === arr[0])) {
          resultDiv.textContent = "JACKPOT!";
          jackpotSound.play();
          showGoldAnimation();
        } else {
          resultDiv.textContent = "Try Again!";
        }
        spinBtn.disabled = false;
        finalIndexes = [null, null, null];
      }
    }
  });
});
