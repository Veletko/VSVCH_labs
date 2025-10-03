import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

class NotFoundBanner extends React.Component {
  render() {
    return (
      <Box>
        <Paper>
          <Container>
            <Box textAlign="center" py={8}>
              <Typography 
                variant="h5" 
                gutterBottom
                data-i18n="404.banner.subtitle"
              >
                page not found
              </Typography>
              <Typography 
                variant="h3" 
                component="h1"
                data-i18n="404.banner.title"
              >
                404 Error Page
              </Typography>
            </Box>
          </Container>
        </Paper>

        <Container>
          <Grid container spacing={4} alignItems="center" py={8}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h1" 
                component="h2"
                textAlign="center"
                data-i18n="404.mainSection.errorCode"
              >
                404
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box textAlign={{ xs: 'center', md: 'left' }}>
                <Typography 
                  variant="h4" 
                  component="h3"
                  gutterBottom
                  data-i18n="404.mainSection.title"
                >
                  Page not Found!!!
                </Typography>
                <Typography variant="body1" data-i18n="404.mainSection.description">
                  The page you are looking for doesn't exist.
                  Please try searching for some other page,
                  or return to the website's homepage to
                  find what you're looking for.
                </Typography>
                <Button variant="contained" component={Link} to="/"
                  startIcon={<HomeIcon />}
                  data-i18n="404.mainSection.button">
                  Back to home
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }
}

export default NotFoundBanner;