import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteService } from '../../store/Slices/servicesSlice.js';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import Modal from '../modal/modal.js';

function CardService({ id, title, description, image }) { 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleReadMore = () => {
    navigate(`/services/${id}`);
  };

  const handleDelete = () => {
    dispatch(deleteService(id));
  };

  return (
    <Box>
      <Card>
        <CardMedia component="img" height="140" image={image} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h3">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleReadMore}>
            Read More
          </Button>
          <Button size="small" onClick={handleOpenModal}>
            Edit
          </Button>
          <Button size="small" onClick={handleDelete}>
            Delete
          </Button>
        </CardActions>
      </Card>

      {isModalOpen && (
        <Modal
          id={id}
          title={title}
          description={description}
          image={image}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
}

export default CardService; 