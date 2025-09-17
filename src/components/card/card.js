import React from 'react';
import '../../pages/home/home.css'
import cardImage from '../../img/card-image1.png'
class Card extends React.Component {
    render () {
        const {title, description} = this.props
        return ( 
             <div class="card">
                <img src={cardImage} alt="service"/>
                <h3>{title}</h3>
                <p>{description}</p>
                <button class="card-button" data-i18n="homepage.services.button" onclick="window.location.href='./services.html'">Read More</button>
            </div>
        )
    }
}

export default Card