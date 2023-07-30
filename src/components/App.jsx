import React, { useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import api from "../utils/api";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup";

import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";

export default function App() {
  const [isEditProfilePopupOpen, openEditProfilePopup] = useState(false);
  const [isAddPlacePopupOpen, openAddPlacePopup] = useState(false);
  const [isEditAvatarPopupOpen, openEditAvatarPopup] = useState(false);
  const [selectedCard, openCardPopup] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getUserInformation(), api.getInitialCards()])
      .then(([userData, cards]) => {
        setCurrentUser(userData);
        setCards(cards);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }, []);

  function handleEditAvatarClick() {
    openEditAvatarPopup(true);
  }

  function handleEditProfileClick() {
    openEditProfilePopup(true);
  }

  function handleAddPlaceClick() {
    openAddPlacePopup(true);
  }

  function closeAllPopups() {
    openEditProfilePopup(false);
    openAddPlacePopup(false);
    openEditAvatarPopup(false);
    openCardPopup(null);
  }

  function handleCardClick(card) {
    openCardPopup(card);
  }
  
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
  
    api.toggleLike(card._id, !isLiked)
      .then((newCard) => {
        console.log("Обновленные данные карточки:", newCard);
        setCards((cards) => cards.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((error) => {
        console.error("Ошибка при переключении лайка:", error);
      });
  }
  

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .patchAvatar({ avatar })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleAddPlaceSubmit(card) {
    api
      .postCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleUpdateUser({ name, about }) {
    api
      .patchInfo({ name, about })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          cards={cards}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <Footer />

        <PopupWithForm
          name="card-delete"
          title="Вы уверены?"
          buttonName="Да"
          onClose={closeAllPopups}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <p />
      </div>
    </CurrentUserContext.Provider>
  );
}
