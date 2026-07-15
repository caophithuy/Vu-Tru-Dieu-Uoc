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
    if (alreadyUnlocked) return;

    alreadyUnlocked = true;

    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    updateNumber(daysElement, 0);
    updateNumber(hoursElement, 0);
    updateNumber(minutesElement, 0);
    updateNumber(secondsElement, 0);

    if (countdownTip) {
      countdownTip.textContent = "💌 Món quà đã sẵn sàng...";

      countdownTip.style.opacity = "1";
      countdownTip.style.color = "#ffd7f2";
      countdownTip.style.textShadow = "0 0 18px rgba(255, 100, 220, 0.9)";
    }

    countdownScreen.style.transition = "opacity 1.4s ease, filter 1.4s ease";

    countdownScreen.style.filter = "brightness(1.😎 blur(2px)";

    setTimeout(() => {
      countdownScreen.style.opacity = "0";
      countdownScreen.style.filter = "brightness(2.5) blur(10px)";
      countdownScreen.style.pointerEvents = "none";
    }, 1500);

    setTimeout(() => {
      countdownScreen.style.display = "none";
    }, 3000);
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

  if (SKIP_COUNTDOWN) {
    countdownScreen.style.display = "none";
    return;
  }

  countdownScreen.style.display = "flex";
  countdownScreen.style.opacity = "1";
  countdownScreen.style.pointerEvents = "auto";

  if (countdownTip && TEST_MODE) {
    countdownTip.textContent = "🧪 Chế độ kiểm tra: sẽ mở sau 15 giây";
  }

  updateCountdown();

  countdownInterval = setInterval(updateCountdown, 1000);
})();
