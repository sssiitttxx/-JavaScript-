/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    if (!element) {
      throw new Error('Пустой объект');
    }
    this.element = element;
    this.registerEvents(); 
  }
  open() {
    this.element.style.display = 'block';
  }
  close() {
    this.element.style.display = '';
  }
  onClose() {
    this.close();
  }


  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    const dismissElements = this.element.querySelectorAll('[data-dismiss="modal"]');
    dismissElements.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.onClose();
      });
    });
  }
}