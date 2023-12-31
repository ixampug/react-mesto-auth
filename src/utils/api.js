class Api {
  constructor({ baseUrl, headers, backUrl }) {
    this._baseUrl = baseUrl;
    this._backUrl = backUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getUserInformation() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  patchInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(this._checkResponse);
  }

  patchAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then(this._checkResponse);
  }

  postCard(card) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(card),
    }).then(this._checkResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  toggleLike(cardId, isLiked) {
    const method = isLiked ? "DELETE" : "PUT";

    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: method,
      headers: this._headers,
    })
      .then(this._checkResponse)
      .then((data) => {
        console.log("Ответ от API при переключении лайка:", data);
        return data;
      })
      .catch((error) => {
        console.error("Ошибка при переключении лайка:", error);
        throw error;
      });
  }

  login(email, password) {
    const data = { email, password }; 
    return fetch(`${this._backUrl}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), 
    }).then(this._checkResponse);
  }
  

  register(email, password) {
    const data = { email, password };
    return fetch(`${this._backUrl}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(this._checkResponse);
  }

  token(token) {
    return fetch(`${this._backUrl}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(this._checkResponse);
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-62",
  backUrl: "https://auth.nomoreparties.co",
  headers: {
    authorization: "cd983aab-0173-48f8-ad97-5923b000f4c3",
    "Content-Type": "application/json",
  },
});

export default api;
