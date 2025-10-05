import React, { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import CardSection from '../../components/cardSection/cardSection';

const Services = () => {
  const [cardInfo, setCardInfo] = useState([]);


  useEffect(() => {
    fetch('http://localhost:3000/cards')
      .then((response) => response.json())
      .then((data) => setCardInfo(data))
      .catch((error) => console.error('Ошибка при загрузке данных:', error));
  }, []); 

  const updateCard = (updatedCard) => {
    setCardInfo((previous) =>
      previous.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
    console.log('Обновление карточки с ID:', updatedCard.id);
    fetch(`http://localhost:3000/cards/${updatedCard.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCard),
    })
      .then((response) => response.json())
      .catch((error) => console.error('Ошибка при обновлении карточки:', error));
  };

  return (
    <div>
      <Header />
      <CardSection cardInfo={cardInfo} updateCard={updateCard} />
      <Footer />
    </div>
  );
};

export default Services;