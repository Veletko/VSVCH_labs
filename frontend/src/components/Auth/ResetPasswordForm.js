import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  Link,
  CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError } from '../../store/slices/authSlice';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { loading, error, successMessage, isAuthenticated } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/masters');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(resetPassword({ 
        token, 
        password: formData.password 
      })).unwrap();
    } catch (error) {
      // Ошибка обрабатывается в слайсе
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Сброс пароля
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Новый пароль"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        error={!!formErrors.password}
        helperText={formErrors.password}
        margin="normal"
        autoComplete="new-password"
        disabled={loading}
      />
      
      <TextField
        fullWidth
        label="Подтверждение пароля"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={!!formErrors.confirmPassword}
        helperText={formErrors.confirmPassword}
        margin="normal"
        autoComplete="new-password"
        disabled={loading}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading || !token}
      >
        {loading ? <CircularProgress size={24} /> : 'Сбросить пароль'}
      </Button>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Link href="/login" variant="body2">
          Вернуться к входу
        </Link>
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;