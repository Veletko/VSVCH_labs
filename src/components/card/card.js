import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../modal/modal';
import Button from '../ui/Button';
import Card, { CardImage, CardTitle, CardDescription, CardActions } from '../ui/Card';

const StyledCard = styled(Card)`
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const ServiceCard = ({ id, title, description, image, updateCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <StyledCard>
        <CardImage src={image} alt={title} />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardActions>
          <Button variant="secondary" size="medium">
            Read More
          </Button>
          <Button variant="primary" size="medium" onClick={handleOpenModal}>
            Edit
          </Button>
        </CardActions>
      </StyledCard>

      {isModalOpen && (
        <Modal
          id={id}
          title={title}
          description={description}
          image={image}
          updateCard={updateCard}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ServiceCard;