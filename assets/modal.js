document.addEventListener('DOMContentLoaded', () => {
  // Создание структуры модального окна
  const modal = document.createElement('figure');
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

  // Закрытие модального окна с анимацией
  const closeModal = () => {
      // modal.classList.add('fade-out');
      var animation = modal.animate([
        {opacity: '0'}
      ], 290);


      setTimeout(() => {
          modal.style.display = 'none';
      }, 290); // Задержка должна совпадать с длительностью анимации fadeOut
  };

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
      if (e.target === modal) {
          closeModal();
      }
  });
    // Закрытие модального окна при нажатии клавиши Esc
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal) {
    closeModal();
  }
});
});
