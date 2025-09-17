import React from 'react';
import '../../pages/home/home.css'

class Card extends React.Component {
    render (title, description) {
        return ( 
             <div class="card">
                <img src="/img/card-image1.png" alt="service"/>
                <h3>{title}</h3>
                <p>{description}</p>
                <button class="card-button" data-i18n="homepage.services.button" onclick="window.location.href='./services.html'">Read More</button>
            </div>
        )
    }
}

export default Card