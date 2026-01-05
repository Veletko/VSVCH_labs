import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;