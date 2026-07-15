(() => {
  // ===== MÀN KẾT: 6 LUỒNG SÁNG HỢP THÀNH TRÁI TIM =====

  const canvas = document.getElementById("heartCanvas");
  const message = document.getElementById("heartMessage");
  const solarSystem = document.getElementById("solarSystemScreen");

  if (!canvas || !message) {
    console.error("Không tìm thấy heartCanvas hoặc heartMessage");
    return;
  }

  const ctx = canvas.getContext("2d");

  const dissolvedPositions = [];

  let finalStarted = false;
  let animationId = null;
  let animationStart = 0;

  const lightStreams = [];
  const heartParticles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.style.width = "${window.innerWidth}px";
    canvas.style.height = "${window.innerHeight}px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  window.addEventListener("resize", resizeCanvas);

  // Mỗi lần một hành tinh tan biến
  window.addEventListener("planetDissolved", (event) => {
    if (finalStarted) return;

    dissolvedPositions.push({
      x: event.detail.x,
      y: event.detail.y,
    });

    console.log("Đã thu thập ${dissolvedPositions.length}/6 luồng sáng");

    // Khi hành tinh thứ 6 biến mất
    if (dissolvedPositions.length === 6) {
      setTimeout(startFinalSequence, 1100);
    }
  });

  function startFinalSequence() {
    if (finalStarted) return;

    finalStarted = true;

    resizeCanvas();

    canvas.classList.add("show");

    // Hệ hành tinh mờ dần
    if (solarSystem) {
      solarSystem.classList.add("final-universe-fade");
    }

    createLightStreams();
    createHeartParticles();

    animationStart = performance.now();
    animateFinalScene(animationStart);

    // Giấu hẳn hệ hành tinh sau khi đã mờ
    setTimeout(() => {
      if (solarSystem) {
        solarSystem.style.display = "none";
      }
    }, 1800);

    // Trái tim đã hình thành rồi mới hiện chữ
    setTimeout(showFinalMessage, 11300);
  }

  function createLightStreams() {
    lightStreams.length = 0;

    dissolvedPositions.forEach((position, index) => {
      lightStreams.push({
        startX: position.x,
        startY: position.y,

        x: position.x,
        y: position.y,

        progress: 0,
        delay: index * 0.08,

        hue: 305 + index * 8,

        trail: [],
      });
    });
  }

  function createHeartParticles() {
    heartParticles.length = 0;

    const total = 650;

    for (let i = 0; i < total; i++) {
      const angle = Math.random() * Math.PI * 2;

      // Công thức hình trái tim
      const heartX = 16 * Math.pow(Math.sin(angle), 3);

      const heartY =
        13 * Math.cos(angle) -
        5 * Math.cos(2 * angle) -
        2 * Math.cos(3 * angle) -
        Math.cos(4 * angle);

      // Một ít hạt nằm bên trong để trái tim không bị rỗng
      const inside = 0.55 + Math.random() * 0.45;

      heartParticles.push({
        targetX: heartX * inside,
        targetY: -heartY * inside,

        x: 0,
        y: 0,

        size: 0.8 + Math.random() * 2.3,
        opacity: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function drawBackground() {
    ctx.fillStyle = "rgba(2, 0, 10, 0.25)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function drawLightStreams(elapsed) {
    if (elapsed >= 3000) {
      return;
    }
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    lightStreams.forEach((stream) => {
      const rawProgress = elapsed / 2100 - stream.delay;

      stream.progress = Math.min(Math.max(rawProgress, 0), 1);

      const eased = easeInOutCubic(stream.progress);

      // Đường cong bay về tâm
      const curveX =
        Math.sin(eased * Math.PI) * (stream.startY < centerY ? 100 : -100);

      const curveY =
        Math.sin(eased * Math.PI) * (stream.startX < centerX ? -80 : 80);

      stream.x = stream.startX + (centerX - stream.startX) * eased + curveX;

      stream.y = stream.startY + (centerY - stream.startY) * eased + curveY;

      stream.trail.push({
        x: stream.x,
        y: stream.y,
      });

      if (stream.trail.length > 24) {
        stream.trail.shift();
      }

      // Vẽ đuôi sáng
      stream.trail.forEach((point, index) => {
        const alpha =
          (index / stream.trail.length) * (1 - stream.progress * 0.25);

        const size = 1 + (index / stream.trail.length) * 4;

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);

        ctx.fillStyle = "hsla(${stream.hue}, 100%, 75%, ${alpha})";

        ctx.shadowBlur = 18;
        ctx.shadowColor = "hsla(${stream.hue}, 100%, 65%, 1)";

        ctx.fill();
      });

      // Đầu luồng sáng
      ctx.beginPath();
      ctx.arc(stream.x, stream.y, 7, 0, Math.PI * 2);

      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.shadowBlur = 28;
      ctx.shadowColor = "hsla(${stream.hue}, 100%, 70%, 1)";

      ctx.fill();
    });

    ctx.shadowBlur = 0;
  }
  function drawHeart(elapsed) {
    if (elapsed < 2200) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 25;

    // Trái tim hình thành
    const appearProgress = Math.min((elapsed - 2200) / 1900, 1);

    const eased = easeInOutCubic(appearProgress);

    /*
    Khoảng thời gian:
    2.2s - 4.1s: trái tim hình thành
    4.1s - 9.1s: trái tim đập khoảng 5 giây
    9.1s - 10.6s: trái tim tan dần
  */

    const dissolveStart = 9100;
    const dissolveDuration = 1500;

    const dissolveProgress =
      elapsed < dissolveStart
        ? 0
        : Math.min((elapsed - dissolveStart) / dissolveDuration, 1);
    const flashStart = dissolveStart + dissolveDuration - 250;

    const flashProgress =
      elapsed < flashStart ? 0 : Math.min((elapsed - flashStart) / 500, 1);

    const baseScale = Math.min(canvas.width / 48, canvas.height / 42);

    // Nhịp đập chỉ chạy trước khi trái tim tan
    const heartbeat =
      appearProgress >= 1 && dissolveProgress === 0
        ? 1 + Math.max(0, Math.sin(elapsed * 0.006)) * 0.04
        : 1;

    heartParticles.forEach((particle) => {
      /*
      Khi tan:
      các hạt phóng nhẹ ra ngoài
      rồi mờ dần
    */
      const scatter = 1 + dissolveProgress * 0.55;

      const targetX =
        centerX + particle.targetX * baseScale * heartbeat * scatter;

      const targetY =
        centerY + particle.targetY * baseScale * heartbeat * scatter;

      particle.x = centerX + (targetX - centerX) * eased;

      particle.y = centerY + (targetY - centerY) * eased;

      particle.phase += 0.04;

      const twinkle = 0.72 + Math.sin(particle.phase) * 0.28;

      const fadeOut = 1 - dissolveProgress;
      // Khi trái tim gần tan hết thì bỏ luôn hạt ở chính giữa
      if (
        dissolveProgress > 0.94 &&
        Math.abs(particle.x - centerX) < 8 &&
        Math.abs(particle.y - centerY) < 8
      ) {
        return;
      }
      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.size * (1 + dissolveProgress * 0.5),
        0,
        Math.PI * 2,
      );

      ctx.fillStyle = `rgba(255, 184, 233, ${
        particle.opacity * twinkle * eased * fadeOut
      })`;

      ctx.shadowBlur = 12 + dissolveProgress * 12;

      ctx.shadowColor = "rgba(255, 75, 205, 0.95)";

      ctx.fill();
    });
    // Vụ nổ ánh sáng cuối cùng trước khi hiện chữ
    if (flashProgress > 0 && flashProgress < 1) {
      const flashRadius = 12 + flashProgress * 170;
      const flashOpacity = 1 - flashProgress;

      ctx.beginPath();
      ctx.arc(centerX, centerY, flashRadius, 0, Math.PI * 2);

      ctx.strokeStyle = "rgba(255, 170, 235, ${flashOpacity})";

      ctx.lineWidth = 5;
      ctx.shadowBlur = 40;
      ctx.shadowColor = "#ff5fd2";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 18 + flashProgress * 35, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity * 0.9})`;

      ctx.shadowBlur = 55;
      ctx.shadowColor = "#ff76dc";
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }
  function drawCenterExplosion(elapsed) {
    if (elapsed < 1900 || elapsed > 3500) {
      return;
    }

    const centerX = canvas.innerWidth / 2;
    const centerY = canvas.innerHeight / 2;

    const progress = Math.min((elapsed - 1900) / 1000, 1);

    const radius = 20 + progress * 230;
    const opacity = 1 - progress;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

    ctx.strokeStyle = "rgba(255, 154, 235, ${opacity})";

    ctx.lineWidth = 4;
    ctx.shadowBlur = 35;
    ctx.shadowColor = "#ff68d9";

    ctx.stroke();

    ctx.shadowBlur = 0;
  }

  function animateFinalScene(timestamp) {
    const elapsed = timestamp - animationStart;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    drawBackground();
    drawLightStreams(elapsed);
    drawCenterExplosion(elapsed);
    drawHeart(elapsed);

    animationId = requestAnimationFrame(animateFinalScene);
  }
  async function showFinalMessage() {
    const replayButton = document.getElementById("replayUniverseBtn");
    const title = message.querySelector("h1");
    const name = message.querySelector("h2");
    const text = message.querySelector("p:not(#finalExtraText)");
    const extraText = document.getElementById("finalExtraText");

    if (!title || !name || !text) return;

    // Lưu lại nội dung gốc
    const titleContent = title.textContent.trim();
    const nameContent = name.textContent.trim();
    const textContent = text.textContent.trim();

    // Làm rỗng để chuẩn bị gõ chữ
    title.textContent = "";
    name.textContent = "";
    text.textContent = "";

    title.classList.add("final-line-show");
    name.classList.add("final-line-show");
    text.classList.add("final-line-show");

    message.classList.add("show");

    // Gõ từng dòng theo thứ tự
    await typeFinalText(title, titleContent, 90);

    await waitFinal(700);

    await typeFinalText(name, nameContent, 110);

    await waitFinal(800);

    await typeFinalText(text, textContent, 55);
    await waitFinal(1200);

    if (extraText) {
      extraText.classList.add("extra-visible");
      await waitFinal(1800);

      if (replayButton) {
        replayButton.classList.add("replay-visible");
      }
    }
  }
  function waitFinal(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  function typeFinalText(element, content, speed) {
    return new Promise((resolve) => {
      let index = 0;

      element.classList.add("typing");

      const typingTimer = setInterval(() => {
        element.textContent += content.charAt(index);

        index++;

        if (index >= content.length) {
          clearInterval(typingTimer);

          element.classList.remove("typing");

          resolve();
        }
      }, speed);
    });
  }
  const replayUniverseButton = document.getElementById("replayUniverseBtn");

  if (replayUniverseButton) {
    replayUniverseButton.addEventListener("click", () => {
      window.location.reload();
    });
  }
  function checkOrientation() {
    const rotateScreen = document.getElementById("rotateScreen");

    if (window.innerHeight > window.innerWidth) {
      rotateScreen.style.display = "flex";
    } else {
      rotateScreen.style.display = "none";
    }
  }

  window.addEventListener("resize", checkOrientation);

  window.addEventListener("orientationchange", checkOrientation);

  checkOrientation();
})();
