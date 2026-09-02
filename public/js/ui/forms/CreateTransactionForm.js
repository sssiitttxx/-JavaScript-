/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.modalId = element.closest(".modal").dataset.modalId;
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const select = this.element.querySelector(".accounts-select");
    if (!select) return;
    Account.list({}, (err, response) => {
      if (response && response.success) {
      select.innerHTML = '';
      response.data.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = account.name;
        select.appendChild(option);
      });
      }
    });
  }
  

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {  
      if (response && response.success) {
        this.element.reset();
        App.getModal(this.modalId).close();
        App.update();
      } else {
        console.error(err || response.error)
      }
    });
  }
}
