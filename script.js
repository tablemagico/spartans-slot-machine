// script.js

document.addEventListener("DOMContentLoaded", function() {
    const reel1Content = document.getElementById("reel1-content");
    const reel2Content = document.getElementById("reel2-content");
    const reel3Content = document.getElementById("reel3-content");
    
    const spinBtn = document.getElementById("spinBtn");
    const resultDiv = document.getElementById("result");
    
    // Kullanacağımız rakun resimleri (13 tane)
    const racoonImages = [
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
  
    // Bir makaraya (ör: reel1Content) birçok kez bu resimleri ekle
    function populateReel(reelElement) {
        reelElement.innerHTML = "";
        for (let i = 0; i < 13; i++) {
            const randomIndex = Math.floor(Math.random() * racoonImages.length);
            const imgSrc = racoonImages[randomIndex];
            
            const img = document.createElement("img");
            img.src = imgSrc;
            reelElement.appendChild(img);
        }
    }
  
    // Başlangıçta makaraları doldur
    populateReel(reel1Content);
    populateReel(reel2Content);
    populateReel(reel3Content);
  
    // Bir reel'i döndürme fonksiyonu
    function spinReel(reelElement, duration, callback) {
        reelElement.style.top = "0px";
        const speed = 25; // px per frame
        let startTime = null;
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
    
            let currentTop = parseFloat(reelElement.style.top) || 0;
            reelElement.style.top = (currentTop - speed) + "px";
    
            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                callback();
            }
        }
    
        requestAnimationFrame(animate);
    }
  
    // Orta resmin index'ini bulma
    function getMiddleImageIndex(reelElement) {
        const currentTop = parseFloat(reelElement.style.top) || 0;
        const singleImageHeight = reelElement.querySelector("img").offsetHeight || 100;
        const middlePixel = -currentTop + 75;
        let index = Math.floor(middlePixel / singleImageHeight);
      
        const totalImages = reelElement.querySelectorAll("img").length;
        if (index < 0) index = 0;
        if (index >= totalImages) index = totalImages - 1;
    
        return index;
    }
  
    // Spin butonu tıklama olayı
    spinBtn.addEventListener("click", function() {
        resultDiv.textContent = "";
      
        const durations = [
            2000 + Math.random() * 1000,
            2000 + Math.random() * 1000,
            2000 + Math.random() * 1000
        ];
    
        let finalIndexes = [null, null, null];
        
        spinReel(reel1Content, durations[0], () => {
            finalIndexes[0] = getMiddleImageIndex(reel1Content);
            checkResult();
        });
    
        spinReel(reel2Content, durations[1], () => {
            finalIndexes[1] = getMiddleImageIndex(reel2Content);
            checkResult();
        });
    
        spinReel(reel3Content, durations[2], () => {
            finalIndexes[2] = getMiddleImageIndex(reel3Content);
            checkResult();
        });
    
        function checkResult() {
            if (finalIndexes.every(idx => idx !== null)) {
                const reel1Images = reel1Content.querySelectorAll("img");
                const reel2Images = reel2Content.querySelectorAll("img");
                const reel3Images = reel3Content.querySelectorAll("img");
    
                const src1 = reel1Images[finalIndexes[0]].src;
                const src2 = reel2Images[finalIndexes[1]].src;
                const src3 = reel3Images[finalIndexes[2]].src;
    
                if (src1 === src2 && src2 === src3) {
                    resultDiv.textContent = "Jackpot!";
                } else {
                    resultDiv.textContent = "Tekrar dene!";
                }
            }
        }
    });
});
