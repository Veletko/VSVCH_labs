import React from 'react';
import '../../pages/home/home.css'
import Card from '../card/card';
class CardSection extends React.Component {

    render(){
        const {cardInfo} = this.props
        return(
             <section class="cards-container">
                {cardInfo.map((item, index) => (
                    <Card key={index} title={item.title} description={item.description}/>
                )
                ) }
             </section>
        )
    }
}

export default CardSection