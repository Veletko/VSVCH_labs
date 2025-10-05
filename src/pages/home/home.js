import React, { useEffect, useState } from 'react';
import Header from '../../components/header/header.js'; 
import Footer from '../../components/footer/footer.js';
import Banner from '../../components/banner/banner.js';
import CardSection from '../../components/cardSection/cardSection.js';
import AboutUs from '../../components/aboutUs/aboutUs.js';

const Home = () => {
    const [cardInfo, setCardInfo] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:3000/cards')
            .then((response) => response.json())
            .then((data) => setCardInfo(data))
            .catch((error) => console.error("error with db", error));
    }, []);

    const updateCard = (updatedCard) => {  
        setCardInfo((previous) =>
            previous.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );
        console.log (updatedCard.id)
        fetch(`http://localhost:3000/cards/${updatedCard.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCard),
        })
            .then((response) => response.json())
            .catch((error) => console.error("error with card update", error));
    };

    const limitedCardInfo = cardInfo.slice(0, 3);

    return (
        <div>
            <Header /> 
            <Banner />
            <CardSection cardInfo={limitedCardInfo} updateCard={updateCard}/>
            <AboutUs />
            <Footer />
        </div>
    );
};

export default Home