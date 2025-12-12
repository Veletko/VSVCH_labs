import React, { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Banner from '../../components/banner/Banner';
import CardSection from '../../components/cardSection/cardSection';
import AboutUs from '../../components/aboutUs/aboutUs';
import { lightTheme, darkTheme } from '../../theme/theme';

const Home = ({ toggleTheme }) => {
  const [cardInfo, setCardInfo] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setCurrentTheme(savedTheme === 'dark' ? darkTheme : lightTheme);
    
    fetch('http://localhost:3000/cards')
      .then((response) => response.json())
      .then((data) => setCardInfo(data))
      .catch((error) => console.error("Error fetching cards:", error));
  }, []);


  const updateCard = (updatedCard) => {  
    setCardInfo((previous) =>
      previous.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
    
    fetch(`http://localhost:3000/cards/${updatedCard.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCard),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error updating card:", error));
  };

  return (
    <div>
      <Header theme={currentTheme} />
      <Banner />
      <CardSection cardInfo={cardInfo} updateCard={updateCard} />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default Home;