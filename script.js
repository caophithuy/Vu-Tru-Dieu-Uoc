const button = document.getElementById("startBtn");

const intro = document.querySelector(".intro");

const welcome = document.getElementById("welcomeScreen");

button.addEventListener("click", () => {
  const bgMusic = document.getElementById("bgMusic");

  bgMusic.volume = 0;
  bgMusic.muted = false;

  bgMusic.play().catch((error) => {
    console.log("Không mở được nhạc:", error);
  });

  intro.style.opacity = "0";

  setTimeout(() => {
    intro.style.display = "none";
    welcome.classList.add("show");

    window.dispatchEvent(new Event("welcomeStarted"));
  }, 1000);
});
const starsContainer = document.getElementById("stars");

// Tạo 200 ngôi sao

for (let i = 0; i < 200; i++) {
  const star = document.createElement("div");

  star.classList.add("star");

  // Vị trí ngẫu nhiên

  star.style.left = Math.random() * 100 + "%";

  star.style.top = Math.random() * 100 + "%";

  // Kích thước ngẫu nhiên

  const size = Math.random() * 3 + 1;

  star.style.width = size + "px";

  star.style.height = size + "px";

  // Thời gian nhấp nháy khác nhau

  star.style.animationDuration = Math.random() * 3 + 2 + "s";

  starsContainer.appendChild(star);
}
