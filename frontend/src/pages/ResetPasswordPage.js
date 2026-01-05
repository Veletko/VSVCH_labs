import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';

const ResetPasswordPage = () => {
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
          <ResetPasswordForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;