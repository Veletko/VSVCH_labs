import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardMedia,
  AppBar,
  Toolbar,
  Chip,
  Divider,
  Rating
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';

const AbooutService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [rating] = useState(4.5);

  useEffect(() => {
    fetch(`http://localhost:3000/cards/${id}`)
      .then(response => response.json())
      .then(data => setService(data))
      .catch(error => console.error('Error loading service:', error));
  }, [id]);

  if (!service) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back to Services
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Chip 
            icon={<FavoriteIcon />}
            label="Popular Service" 
            color="secondary" 
            variant="outlined"
          />
        </Toolbar>
      </AppBar>

      <Container>
        <Card elevation={3}>
          <CardMedia
            component="img"
            height="400"
            image={service.image}
            alt={service.title}
          />
          
          <Box sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              {service.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={rating}
                precision={0.5}
                readOnly
                sx={{ mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({rating}/5)
              </Typography>
            </Box>

              <Divider sx={{ my: 3 }} />
              
            <Typography variant="body1" paragraph>
              {service.description}
            </Typography>
            
          
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default AbooutService;