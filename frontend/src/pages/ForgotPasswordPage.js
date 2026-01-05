import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
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
          <ForgotPasswordForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;