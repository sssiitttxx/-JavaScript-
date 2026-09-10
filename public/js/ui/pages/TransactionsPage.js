/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Пустой элемент");
    }
    this.element = element;
    this.registerEvents();
    this.lastOptions = null;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update(options) {
    if (options) {
      this.lastOptions = options;
    }
    if (!this.lastOptions) return;
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeCountButton = this.element.querySelector(".remove-account");
    if (removeCountButton) {
      removeCountButton.addEventListener("click", () => this.removeAccount());
    }

    this.element.addEventListener("click", (e) => {
      const removeTransactionBtn = e.target.closest(".transaction__remove");
      if (removeTransactionBtn) {
        const id = removeTransactionBtn.dataset.id;
        this.removeTransaction(id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) return;
    if (!confirm("Вы действительно хотите удалить счет?")) return;

    Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
      if (response && response.success) {
        App.updateWidgets();
        App.updateForms();
        this.clear();
      }
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (!confirm("Вы действительно хотите удалить эту транзакцию?")) return;

    Transaction.remove({ id }, (err, response) => {
      if (response && response.success) {
        App.update();
      }
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options || !options.account_id) return;
    this.lastOptions = options;
    const accoundId = options.account_id;

    Account.get(accoundId, (err, response) => {
      if (response && response.success) {
        this.renderTitle(response.data);
      }
    });

    Transaction.list({ account_id: accoundId }, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    const title = this.element.querySelector(".content-title");
    if (title) title.textContent = "Название счета";
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(account) {
    const titleElement = this.element.querySelector(".content-title");
    if (titleElement && account) {
      titleElement.textContent = account.name;
    }
  }

  renderTransactions(transactions) {
    const content = this.element.querySelector(".content");
    if (!content) return;
    content.innerHTML = "";
    transactions.forEach((item) => {
      content.insertAdjacentHTML("beforeend", this.getTransactionHTML(item));
    });
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(dataString) {
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const date = new Date(dataString.replace(" ", "T"));
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const typeClass =
      item.type === "income" ? "transaction_income" : "transaction_expense";
    const formattedDate = this.formatDate(item.created_at);
    return `
      <div class="transaction ${typeClass} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${formattedDate}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }
}
