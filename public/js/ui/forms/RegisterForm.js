class RegisterForm extends AsyncForm {
  onSubmit(data) {
    console.log("Данные формы:", data); // ← временный лог

    User.register(data, (err, response) => {
      console.log("Ответ сервера:", response); // ← что вернул сервер
      console.log("Ошибка:", err); // ← если есть

      if (response && response.success) {
        this.element.reset();
        App.setState("user-logged");
        App.getModal("register").close();
      } else {
        console.error("Ошибка регистрации:", err || response.error);
      }
    });
  }
}
