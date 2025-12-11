import React from 'react';
import { Typography, Paper, Box, Grid, Card, CardContent } from '@mui/material';
import { People, Engineering, Build, History } from '@mui/icons-material';

const HomePage = () => {
  const stats = [
    { icon: <People />, label: 'Мастера', path: '/masters' },
    { icon: <Engineering />, label: 'Рабочие', path: '/workers' },
    { icon: <Build />, label: 'Машины', path: '/machines' },
    { icon: <History />, label: 'Обслуживание', path: '/maintenance' },
  ];

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Система управления фабрикой
      </Typography>
      
      <Typography variant="h6" color="textSecondary" align="center" sx={{ mb: 4 }}>
        Управление персоналом и оборудованием предприятия
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ color: 'primary.main', fontSize: 48, mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h6" component="div">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default HomePage;