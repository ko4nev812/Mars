document.addEventListener('DOMContentLoaded', () => {
  // Создание структуры модального окна
  const modal = document.createElement('div');
  modal.className = 'modal';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close';
  closeBtn.innerHTML = '&times;';

  const modalImg = document.createElement('img');
  modalImg.className = 'modal-content noselect';

  const caption = document.createElement('div');
  caption.className = 'caption';

  modal.appendChild(closeBtn);
  modal.appendChild(modalImg);
  modal.appendChild(caption);
  document.body.appendChild(modal);

  // Добавление обработчиков событий для изображений
  const images = document.querySelectorAll('.modal-image');
  images.forEach(img => {
      img.addEventListener('click', () => {
          modal.style.display = 'block';
          modal.classList.remove('fade-out'); // Снимаем класс fade-out, если он есть
          modalImg.src = img.src;
          caption.textContent = img.alt || ''; // Используем alt-текст
      });
  });
  // Закрытие модального окна при нажатии клавиши Esc
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal) {
    modal.classList.add('fade-out');
    setTimeout(() => {
      modal.style.display = 'none';
  }, 300); // Задержка должна совпадать с длительностью анимации fadeOut
  }
});
  // Закрытие модального окна с анимацией
  const closeModal = () => {
      modal.classList.add('fade-out');
      setTimeout(() => {
          modal.style.display = 'none';
      }, 300); // Задержка должна совпадать с длительностью анимации fadeOut
  };

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
      if (e.target === modal) {
          closeModal();
      }
  });
});
