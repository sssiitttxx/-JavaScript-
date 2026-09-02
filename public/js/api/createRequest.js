/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const {
    url,
    data = {},
    method = 'GET',
    callback = () => {}
  } = options;

  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  let requestUrl = url;
  let requestData = null;
  if (method === 'GET') {
    const queryParams = new URLSearchParams(data).toString();
    if (queryParams) {
      requestUrl += `?${queryParams}`;
    }
  } else {
    requestData = new FormData();
    for (const key in data) {
      requestData.append(key, data[key]);
    }
  }

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, xhr.response);
    } else {
      callback(new Error(`Ошибка ${xhr.status}: ${xhr.statusText}`), null);
    }
  });
  xhr.addEventListener('error', () => {
    callback(new Error(`Сетевая ошибка`), null);
  });

  try {
    xhr.open(method, requestUrl);
    xhr.send(requestData);
  } catch (e) {
    callback(e, null);
  }
};
