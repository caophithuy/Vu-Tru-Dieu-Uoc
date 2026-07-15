const welcomeScreen = document.getElementById("welcomeScreen");
const planet = document.getElementById("planet");
planet.classList.remove("show");

window.addEventListener("welcomeStarted", () => {
  setTimeout(() => {
    welcomeScreen.style.opacity = "0";

    setTimeout(() => {
      welcomeScreen.style.display = "none";
      planet.classList.add("show");
    }, 1500);
  }, 8000);
});
const planetCore = document.querySelector(".planet-core");
const travelScreen = document.getElementById("travelScreen");

const whiteFlash = document.getElementById("whiteFlash");
const warpCanvas = document.getElementById("warpCanvas");
const wishPlanetScreen = document.getElementById("wishPlanetScreen");

const solarSystemScreen = document.getElementById("solarSystemScreen");
planetCore.addEventListener("click", () => {
  // Hành tinh phóng lớn
  planet.classList.add("zooming");

  // Flash trắng
  setTimeout(() => {
    whiteFlash.classList.add("flash");
  }, 1500);

  // Chuyển sang màn hình thông báo
  setTimeout(() => {
    planet.style.display = "none";
    travelScreen.classList.add("show");

    travelScreen.querySelector("p").textContent =
      "🚀 Chuẩn bị bắt đầu hành trình...";
  }, 2000);

  // Bắt đầu bay xuyên không gian
  setTimeout(() => {
    travelScreen.classList.remove("show");
    startWarpSpeed();
  }, 4000);
});
function startWarpSpeed() {
  warpCanvas.classList.add("show");

  const ctx = warpCanvas.getContext("2d");

  let width;
  let height;
  let centerX;
  let centerY;
  let animationId;
  let warpFinished = false;

  const stars = [];
  const starCount = 500;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    warpCanvas.width = width;
    warpCanvas.height = height;

    centerX = width / 2;
    centerY = height / 2;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  for (let i = 0; i < starCount; i++) {
    stars.push(createWarpStar());
  }

  function createWarpStar() {
    return {
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: Math.random() * width,
      previousZ: width,
    };
  }

  function resetStar(star) {
    star.x = (Math.random() - 0.5) * width;
    star.y = (Math.random() - 0.5) * height;
    star.z = width;
    star.previousZ = width;
  }

  function animateWarp() {
    if (warpFinished) {
      return;
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(0, 0, width, height);

    stars.forEach((star) => {
      star.previousZ = star.z;
      star.z -= 14;

      if (star.z < 1) {
        resetStar(star);
      }

      const x = (star.x / star.z) * width + centerX;
      const y = (star.y / star.z) * height + centerY;

      const previousX = (star.x / star.previousZ) * width + centerX;

      const previousY = (star.y / star.previousZ) * height + centerY;

      const size = Math.max(1, (1 - star.z / width) * 4);

      ctx.beginPath();
      ctx.moveTo(previousX, previousY);
      ctx.lineTo(x, y);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = size;
      ctx.stroke();
    });

    animationId = requestAnimationFrame(animateWarp);
  }

  animateWarp();

  // Sau 8 giây: chớp sáng rồi chuyển cảnh
  setTimeout(() => {
    warpFinished = true;
    cancelAnimationFrame(animationId);

    whiteFlash.classList.remove("flash", "arrival-flash");
    void whiteFlash.offsetWidth;
    whiteFlash.classList.add("arrival-flash");

    setTimeout(() => {
      warpCanvas.classList.remove("show");
      warpCanvas.style.display = "none";

      showSolarSystemSequence();
    }, 650);
  }, 8000);
  function showSolarSystemSequence() {
    const introTitle = document.getElementById("introTitle");

    const centralPlanet = document.querySelector(
      "#solarSystemScreen .central-planet",
    );

    const orbits = document.querySelectorAll("#solarSystemScreen .orbit");

    // Hiện nền vũ trụ
    solarSystemScreen.classList.add("show");

    // Xóa các class chuyển cảnh cũ gây mờ
    solarSystemScreen.classList.remove(
      "reveal-title",
      "reveal-center",
      "zoom-out",
      "focus-mode",
      "paused",
    );

    // Đặt lại tiêu đề
    if (introTitle) {
      introTitle.style.display = "block";
      introTitle.classList.remove("title-visible");
    }

    // Giấu hành tinh trung tâm lúc đầu
    if (centralPlanet) {
      centralPlanet.classList.remove("planet-visible");
    }

    // Giấu năm hành tinh nhỏ
    orbits.forEach((orbit) => {
      orbit.classList.remove("cinematic-reveal", "orbit-visible");
    });

    createSpaceDust();
    spaceDust.classList.add("show");
    fadeInMusic();

    // Chữ xuất hiện rõ
    setTimeout(() => {
      if (introTitle) {
        introTitle.classList.add("title-visible");
      }
    }, 300);

    // Sau 3 giây chữ biến mất
    setTimeout(() => {
      if (introTitle) {
        introTitle.classList.remove("title-visible");
      }
    }, 5000);

    // Chữ mất hẳn rồi hành tinh lớn xuất hiện
    setTimeout(() => {
      if (introTitle) {
        introTitle.style.display = "none";
      }

      if (centralPlanet) {
        centralPlanet.classList.add("planet-visible");
      }
    }, 4000);

    // Năm hành tinh nhỏ xuất hiện lần lượt
    orbits.forEach((orbit, index) => {
      setTimeout(
        () => {
          orbit.classList.add("orbit-visible");

          const planet = orbit.querySelector(".mini-planet");

          const directions = [
            { x: "-260px", y: "-180px" },
            { x: "260px", y: "-120px" },
            { x: "-240px", y: "200px" },
            { x: "280px", y: "180px" },
            { x: "0px", y: "-300px" },
          ];

          const start = directions[index];

          planet.animate(
            [
              {
                transform: `translate(
            calc(-50% + ${start.x}),
            calc(-50% + ${start.y})
          ) scale(0.2)`,
                opacity: 0,
                filter: "blur(10px) brightness(2)",
              },
              {
                transform: "translate(-50%, -50%) scale(1.3)",
                opacity: 1,
                filter: "blur(0) brightness(1.4)",
                offset: 0.8,
              },
              {
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 1,
                filter: "blur(0) brightness(1)",
              },
            ],
            {
              duration: 1400,
              easing: "cubic-bezier(.16,.84,.3,1)",
              fill: "forwards",
            },
          );
        },
        5200 + index * 700,
      );
    });

    // Sao băng xuất hiện sau cùng
    setTimeout(() => {
      launchRandomShootingStar();
    }, 9000);
  }
}

const wishModal = document.getElementById("wishModal");
const shootingStar = document.getElementById("shootingStar");
const introTitle = document.getElementById("introTitle");
const bgMusic = document.getElementById("bgMusic");

bgMusic.volume = 0;
const spaceDust = document.getElementById("spaceDust");
const wishTitle = document.getElementById("wishTitle");
const wishText = document.getElementById("wishText");
const wishPhoto = document.getElementById("wishPhoto");
const photoDots = document.querySelectorAll(".photo-dot");

const photoList = [
  "images/bao-uyen-6.jpg",
  "images/bao-uyen-2.jpg",
  "images/bao-uyen-3.jpg",
  "images/bao-uyen-4.jpg",
  "images/bao-uyen-5.jpg",
];

let photoIndex = 0;
let slideshowTimer = null;
const closeWishBtn = document.getElementById("closeWishBtn");

const wishPlanets = document.querySelectorAll(".central-planet, .mini-planet");

wishPlanets.forEach((wishPlanet) => {
  wishPlanet.addEventListener("click", () => {
    const isCentralPlanet = wishPlanet.classList.contains("central-planet");
    if (isCentralPlanet) {
      wishModal.classList.add("central-open");
      startPhotoSlideshow();
    } else {
      wishModal.classList.remove("central-open");
      stopPhotoSlideshow();
    }
    // Dừng toàn bộ hệ hành tinh
    solarSystemScreen.classList.add("paused");

    // Đánh dấu hành tinh được chọn
    wishPlanet.classList.add("selected-planet");
    solarSystemScreen.classList.add("focus-mode");
    solarSystemScreen.style.transformOrigin = "center center";

    // Lấy nội dung lời chúc
    wishTitle.textContent = wishPlanet.dataset.title || "Bảo Uyên";
    wishText.textContent = "";

    const text = wishPlanet.dataset.wish || "";
    let i = 0;

    const typing = setInterval(() => {
      wishText.textContent += text.charAt(i);
      i++;

      if (i >= text.length) {
        clearInterval(typing);
      }
    }, 35);
    // Hiện popup sau khi hành tinh phóng to
    setTimeout(() => {
      wishModal.classList.add("show");
      shootingStar.classList.remove("fly");
      void shootingStar.offsetWidth;
      shootingStar.classList.add("fly");
    }, 650);
  });
});

function closeWishModal() {
  const finishedPlanet = document.querySelector(".selected-planet");

  wishModal.classList.remove("show");

  dissolvePlanet(finishedPlanet);

  solarSystemScreen.classList.remove("focus-mode");
  solarSystemScreen.style.transformOrigin = "";

  document.querySelectorAll(".selected-planet").forEach((planet) => {
    planet.classList.remove("selected-planet");
  });

  setTimeout(() => {
    solarSystemScreen.classList.remove("paused");
  }, 400);
}

closeWishBtn.addEventListener("click", closeWishModal);

wishModal.addEventListener("click", (event) => {
  if (event.target === wishModal) {
    closeWishModal();
  }
});
function launchRandomShootingStar() {
  if (!solarSystemScreen.classList.contains("show")) {
    return;
  }

  if (!shootingStar) return;

  shootingStar.classList.remove("fly");
  void shootingStar.offsetWidth;
  shootingStar.classList.add("fly");

  const nextDelay = 6000 + Math.random() * 6000;
  setTimeout(launchRandomShootingStar, nextDelay);
}
function createSpaceDust() {
  if (!spaceDust || spaceDust.children.length > 0) return;

  const particleCount = 250;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");

    particle.classList.add("dust-particle");

    particle.style.left = Math.random() * 100 + "%";

    particle.style.top = Math.random() * 120 + "%";

    particle.style.setProperty("--size", 1 + Math.random() * 2.5 + "px");

    particle.style.setProperty("--alpha", 0.2 + Math.random() * 0.55);

    particle.style.setProperty("--duration", 18 + Math.random() * 22 + "s");

    particle.style.setProperty("--twinkle", 1.5 + Math.random() * 3 + "s");

    particle.style.setProperty("--drift", -40 + Math.random() * 80 + "px");

    particle.style.animationDelay = -Math.random() * 30 + "s";

    spaceDust.appendChild(particle);
  }
}
function fadeInMusic() {
  bgMusic.muted = false;

  // Nhạc đã chạy im lặng từ lần bấm đầu tiên.
  // Ở đây chỉ tăng âm lượng, không phát lại từ đầu.
  let volume = bgMusic.volume;

  const fade = setInterval(() => {
    volume += 0.02;

    if (volume >= 0.6) {
      volume = 0.6;
      clearInterval(fade);
    }

    bgMusic.volume = volume;
  }, 120);
}
function updatePhotoDots() {
  photoDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === photoIndex);
  });
}

function showNextPhoto() {
  wishPhoto.classList.add("changing");

  setTimeout(() => {
    photoIndex = (photoIndex + 1) % photoList.length;

    wishPhoto.src = photoList[photoIndex];

    updatePhotoDots();

    wishPhoto.classList.remove("changing");
  }, 550);
}

function startPhotoSlideshow() {
  clearInterval(slideshowTimer);

  photoIndex = 0;
  wishPhoto.src = photoList[photoIndex];
  updatePhotoDots();

  slideshowTimer = setInterval(showNextPhoto, 3000);
}

function stopPhotoSlideshow() {
  clearInterval(slideshowTimer);
  slideshowTimer = null;
}
function dissolvePlanet(planet) {
  if (!planet || planet.dataset.finished === "true") {
    return;
  }

  planet.dataset.finished = "true";

  const rect = planet.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  // Báo cho final.js biết một hành tinh vừa tan biến
  window.dispatchEvent(
    new CustomEvent("planetDissolved", {
      detail: {
        x: centerX,
        y: centerY,
      },
    }),
  );
  // Tạo bụi sao quanh vị trí hành tinh
  for (let i = 0; i < 35; i++) {
    const dust = document.createElement("span");

    dust.classList.add("planet-dust-particle");

    dust.style.left = "${centerX}px";
    dust.style.top = "${centerY}px";

    const angle = Math.random() * Math.PI * 2;
    const distance = 45 + Math.random() * 110;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    dust.style.setProperty("--dust-x", "${moveX}px");
    dust.style.setProperty("--dust-y", "${moveY}px");
    dust.style.setProperty("--dust-size", "${2 + Math.random() * 4}px");

    document.body.appendChild(dust);

    setTimeout(() => {
      dust.remove();
    }, 1300);
  }

  // Hành tinh lóe sáng rồi biến mất
  planet.classList.add("planet-dissolving");

  setTimeout(() => {
    planet.style.display = "none";

    // Nếu là hành tinh nhỏ thì giấu luôn đường quỹ đạo của nó
    const orbit = planet.closest(".orbit");

    if (orbit) {
      orbit.style.display = "none";
    }
  }, 900);
}
