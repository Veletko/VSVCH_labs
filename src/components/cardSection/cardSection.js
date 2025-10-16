import React from 'react';
import CardService from '../card/cardService';

function CardSection({ cardInfo }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {cardInfo.map((service) => (
        <CardService
          key={service.id}
          id={service.id}
          title={service.title}
          description={service.description}
          image={service.image}
        />
      ))}
    </div>
  );
}

export default CardSection;