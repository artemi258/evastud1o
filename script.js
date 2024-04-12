window.addEventListener("DOMContentLoaded", async () => {
  const images = [];
  let currentIndex = 0;
  let interval;

  await fetch("images.txt")
    .then((response) => response.text())
    .then((text) => {
      const lines = text.split("\n");
      lines.forEach((line) => {
        const parts = line.split("|");
        if (parts.length === 2) {
          const fileName = parts[0].trim();
          const title = parts[1].trim().replace(/<br>/g, "\n");
          images.push({ src: "src/" + fileName, title: title });
        }
      });
      console.log(images);
    });

  const imageElement = document.getElementById("image-display");
  const titleElement = document.getElementById("image-title");

  function displayImage() {
    if (!images.length) return;
    if (images[currentIndex]) {
      imageElement.src = images[currentIndex].src;
      titleElement.innerHTML = images[currentIndex].title.replace(
        /\n/g,
        "<br>"
      );
      titleElement.hidden = true;
    }
    currentIndex = (currentIndex + 1) % images.length;
  }

  function showDarkOverlay() {
    document.getElementById("dark-overlay").style.display = "block";
  }

  function hideDarkOverlay() {
    document.getElementById("dark-overlay").style.display = "none";
  }

  function stopSlideShow() {
    clearInterval(interval);
    document.getElementById("image-title").hidden = false;
    showDarkOverlay();
  }

  function resumeSlideShow() {
    document.getElementById("image-title").hidden = true;
    hideDarkOverlay();
    clearInterval(interval);
    interval = setInterval(displayImage, 250);
  }

  document.getElementById("openButton").addEventListener("click", function () {
    var infoBlock = document.getElementById("infoBlock");
    infoBlock.style.display =
      infoBlock.style.display === "block" ? "none" : "block";
  });

  setTimeout(() => {
    document
      .getElementById("image-container")
      .addEventListener("mousedown", stopSlideShow);
    document.addEventListener("mouseup", resumeSlideShow);

    document.addEventListener("touchstart", stopSlideShow, false);
    document.addEventListener("touchend", resumeSlideShow, false);

    document.addEventListener("keydown", stopSlideShow);
    document.addEventListener("keyup", resumeSlideShow);
    interval = setInterval(displayImage, 250);
  }, 4000);

  setTimeout(function () {
    document.getElementById("intro-modal").style.display = "none";
  }, 4500);

  document.addEventListener(
    "contextmenu",
    function (event) {
      event.preventDefault();
    },
    false
  );

  // Инициализируем счётчик кликов правой кнопкой мыши по кнопке
  let rightClickCount = 0;

  // Находим кнопку по ID
  const openButton = document.getElementById("openButton");

  // Функция для показа модального окна
  function showModal() {
    const modalOverlay = document.getElementById("modal-overlay");
    const modalContent = document.getElementById("modal-content");
    modalOverlay.style.display = "block";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Устанавливаем черный фон с небольшой прозрачностью
    modalOverlay.style.width = "100vw";
    modalOverlay.style.height = "100vh";
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.zIndex = "1000";
    modalContent.innerHTML =
      '<img src="https://ebosh.im/img/logo-g.svg" alt="Лого" width="400px">';
  }

  // Обработчик события нажатия правой кнопкой мыши на кнопку
  openButton.addEventListener("contextmenu", function (event) {
    event.preventDefault(); // Предотвращаем стандартное контекстное меню
    rightClickCount++; // Увеличиваем счётчик
    if (rightClickCount === 5) {
      // Проверяем, достиг ли счётчик 5
      showModal(); // Показываем модальное окно
      rightClickCount = 0; // Сбрасываем счётчик
    }
  });

  //отключение события удержания пальцем на телефонах.Для убирания всплывающего меню браузеров.
  const htmlElement = document.getElementById("image-display");

  htmlElement.addEventListener(
    "touchstart",
    function (event) {
      event.preventDefault();
    },
    false
  );
});
