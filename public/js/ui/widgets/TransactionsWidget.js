class TransactionsWidget {
  constructor(element) {
    if (!element) throw new Error("Пустой элемент");
    this.element = element;
    this.registerEvents();
  }

  registerEvents() {
    const incomeButton = this.element.querySelector(".create-income-button");
    const expenseButton = this.element.querySelector(".create-expense-button");

    if (incomeButton) {
      incomeButton.addEventListener("click", () => {
        App.getModal("newIncome").open();
      });
    }

    if (expenseButton) {
      expenseButton.addEventListener("click", () => {
        App.getModal("newExpense").open();
      });
    }
  }
}
