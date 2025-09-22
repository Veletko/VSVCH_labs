import React from 'react';
import '../../pages/home/home.css'
import Card from '../card/card';

const CardSection = ({cardInfo, updateCard}) => {
    return(
        <section class="cards-container">
            {cardInfo.map((item) => (
                <Card 
                id={item.id}
                title={item.title}
                description={item.description}
                image ={item.image}
                updateCard = {updateCard}/>
            ))}
        </section>
    )
}


export default CardSection