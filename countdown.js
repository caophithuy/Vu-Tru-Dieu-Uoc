(() => {
  "use strict";

  /* =========================================
     CHẾ ĐỘ KIỂM TRA
     ========================================= */

  // true  = test: đếm 15 giây rồi tự mở website
  // false = thật: khóa đến 00:00 ngày 01/08/2026 giờ Việt Nam
  const TEST_MODE = false;

  // Đổi thành true nếu muốn bỏ qua đồng hồ và vào web ngay
  const SKIP_COUNTDOWN = false;

  // Thời gian mở khóa thật: 00:00 ngày 01/08/2026, giờ Việt Nam UTC+7
  const REAL_UNLOCK_TIME = new Date("2026-08-01T00:00:00+07:00").getTime();

  // Khi test, mỗi lần tải trang sẽ đếm 15 giây
  const TEST_UNLOCK_TIME = Date.now() + 15 * 1000;

  const unlockTime = TEST_MODE ? TEST_UNLOCK_TIME : REAL_UNLOCK_TIME;

  /* =========================================
     LẤY CÁC PHẦN TỬ HTML
     ========================================= */

  const countdownScreen = document.getElementById("countdownScreen");
  const countdownContent = document.querySelector(".countdown-content");

  const countdownDustCanvas = document.getElementById("countdownDustCanvas");

  const unlockMessage = document.getElementById("unlockMessage");

  const daysElement = document.getElementById("cdDays");

  const hoursElement = document.getElementById("cdHours");

  const minutesElement = document.getElementById("cdMinutes");

  const secondsElement = document.getElementById("cdSeconds");

  const countdownTip = document.querySelector(".countdown-tip");

  if (
    !countdownScreen ||
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    console.error("Không tìm thấy đầy đủ phần tử của màn hình đếm ngược.");
    return;
  }

  let countdownInterval = null;
  let alreadyUnlocked = false;

  /* =========================================
     HÀM HỖ TRỢ
     ========================================= */

  function formatNumber(number) {
    return String(number).padStart(2, "0");
  }

  function updateNumber(element, value) {
    const newValue = formatNumber(value);

    if (element.textContent !== newValue) {
      element.textContent = newValue;

      element.animate(
        [
          {
            transform: "translateY(-6px) scale(1.08)",
            opacity: 0.45,
          },
          {
            transform: "translateY(0) scale(1)",
            opacity: 1,
          },
        ],
        {
          duration: 320,
          easing: "ease-out",
        },
      );
    }
  }

  /* =========================================
     MỞ KHÓA WEBSITE
     ========================================= */

  function unlockWebsite() {
    if (alreadyUnlocked) {
      return;
    }

    alreadyUnlocked = true;

    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    updateNumber(daysElement, 0);
    updateNumber(hoursElement, 0);
    updateNumber(minutesElement, 0);
    updateNumber(secondsElement, 0);

    countdownScreen.classList.remove("last-seconds");
    countdownScreen.classList.add("countdown-ending");

    if (countdownTip) {
      countdownTip.style.opacity = "0";
    }

    // Sau một nhịp, toàn bộ đồng hồ vỡ thành bụi sao
    setTimeout(() => {
      createCountdownDust();
    }, 450);

    // Hiện lời nhắn
    setTimeout(() => {
      if (unlockMessage) {
        unlockMessage.classList.add("show");
      }
    }, 1350);

    // Lời nhắn mờ đi
    setTimeout(() => {
      if (unlockMessage) {
        unlockMessage.classList.remove("show");
      }
    }, 3400);

    // Màn đếm ngược biến mất
    setTimeout(() => {
      countdownScreen.classList.add("screen-leaving");
    }, 3900);

    // Hiện hoàn toàn trang Vũ Trụ Điều Ước phía sau
    setTimeout(() => {
      localStorage.setItem("giftOpened", "true");

      countdownScreen.style.display = "none";
    }, 5250);
  }
  function createCountdownDust() {
    if (!countdownContent) {
      return;
    }

    const rect = countdownContent.getBoundingClientRect();

    const particleCount = window.innerWidth < 700 ? 170 : 300;

    for (let i = 0; i < particleCount; i++) {
      const dust = document.createElement("span");

      dust.classList.add("countdown-dust");

      /*
      Hạt được sinh ra trong vùng
      chứa tiêu đề và đồng hồ
    */
      const startX = rect.left + Math.random() * rect.width;

      const startY = rect.top + Math.random() * rect.height;

      dust.style.left = "${startX}px";
      dust.style.top = "${startY}px";

      const angle = Math.random() * Math.PI * 2;

      const distance = 100 + Math.random() * 320;

      const moveX = Math.cos(angle) * distance;

      const moveY = Math.sin(angle) * distance - 40 - Math.random() * 130;

      dust.style.setProperty("--dust-x", "${moveX}px");

      dust.style.setProperty("--dust-y", "${moveY}px");

      dust.style.setProperty("--dust-size", "${1.5 + Math.random() * 4}px");

      dust.style.setProperty(
        "--dust-duration",
        "${1.25 + Math.random() * 1.15}s",
      );

      dust.style.setProperty(
        "--dust-rotate",
        "${Math.random() * 540 - 270}deg",
      );

      document.body.appendChild(dust);

      setTimeout(() => {
        dust.remove();
      }, 2600);
    }
  }
  /* =========================================
     CẬP NHẬT ĐỒNG HỒ
     ========================================= */

  function updateCountdown() {
    const remainingTime = unlockTime - Date.now();

    if (remainingTime <= 0) {
      unlockWebsite();
      return;
    }

    const totalSeconds = Math.floor(remainingTime / 1000);
    if (totalSeconds <= 3) {
      countdownScreen.classList.add("last-seconds");
    } else {
      countdownScreen.classList.remove("last-seconds");
    }

    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor((totalSeconds % 86400) / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    updateNumber(daysElement, days);
    updateNumber(hoursElement, hours);
    updateNumber(minutesElement, minutes);
    updateNumber(secondsElement, seconds);
  }

  /* =========================================
   KHỞI ĐỘNG
========================================= */
  /* =========================================
     KHỞI ĐỘNG
  ========================================= */

  // Muốn bỏ qua đồng hồ để kiểm tra trang web
  if (SKIP_COUNTDOWN) {
    countdownScreen.style.display = "none";
    return;
  }

  const now = Date.now();
  const giftOpened = localStorage.getItem("giftOpened") === "true";

  // Chế độ test luôn chạy đồng hồ test
  if (TEST_MODE) {
    countdownScreen.style.display = "flex";
    countdownScreen.style.opacity = "1";
    countdownScreen.style.pointerEvents = "auto";

    if (countdownTip) {
      countdownTip.textContent =
        "🧪 Chế độ kiểm tra: món quà sẽ mở sau 15 giây";
    }

    updateCountdown();

    countdownInterval = setInterval(updateCountdown, 1000);

    return;
  }

  // Chưa tới sinh nhật: luôn hiện đồng hồ thật
  if (now < REAL_UNLOCK_TIME) {
    countdownScreen.style.display = "flex";
    countdownScreen.style.opacity = "1";
    countdownScreen.style.pointerEvents = "auto";

    updateCountdown();

    countdownInterval = setInterval(updateCountdown, 1000);

    return;
  }

  // Đã tới sinh nhật và đã mở quà trước đó
  if (giftOpened) {
    countdownScreen.style.display = "none";
    return;
  }

  // Đã tới sinh nhật nhưng đây là lần mở đầu tiên
  countdownScreen.style.display = "flex";
  countdownScreen.style.opacity = "1";
  countdownScreen.style.pointerEvents = "auto";

  updateCountdown();

  countdownInterval = setInterval(updateCountdown, 1000);
})();
