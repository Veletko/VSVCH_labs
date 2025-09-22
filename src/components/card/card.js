import React, { useState } from 'react';
import '../../pages/home/home.css'
import Modal from '../modal/modal';

const Card = ({id, title, description, image, updateCard}) =>{

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOpenModal =  () => setIsModalOpen(true)
    const handleCloseModal =  () => setIsModalOpen(false)

    return ( 
        <div className="card">
            <img src={image} alt="service"/>
            <h3>{title}</h3>
            <p>{description}</p>
            <button className="card-button" data-i18n="homepage.services.button">Read More</button>
            <button className='card-button' onClick={handleOpenModal}>Edit</button>

            {isModalOpen && (
                <Modal 
                id={id}
                title= {title}
                description={description}
                image={image}
                updateCard={updateCard}
                onClose={handleCloseModal}/>
            )}
        </div>
    )
    
}

export default Card