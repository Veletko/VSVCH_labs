import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

   const handleReadMore = () => {
    navigate(`/services/${id}`); 
  };
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
          <Button size="small" onClick={handleReadMore}>Read More</Button>
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