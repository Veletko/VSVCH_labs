import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box
} from '@mui/material';
import Modal from '../modal/modal';

const ServiceCard = ({ id, title, description, image, updateCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Box>
      <Card>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
        />
        
        <CardContent>
          <Typography gutterBottom variant="h5" component="h3">
            {title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        
        <CardActions>
          <Button size="small">Read More</Button>
          <Button size="small" onClick={handleOpenModal}>
            Edit
          </Button>
        </CardActions>
      </Card>

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
    </Box>
  );
};

export default ServiceCard;