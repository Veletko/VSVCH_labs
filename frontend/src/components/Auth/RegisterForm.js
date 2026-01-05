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
import { register, clearError } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
    email: '',
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
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Фамилия обязательна';
    }
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'Имя обязательно';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный формат email';
    }
    
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
    
    const { confirmPassword, ...userData } = formData;
    
    try {
      await dispatch(register(userData)).unwrap();
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
        Регистрация мастера
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Фамилия *"
        value={formData.last_name}
        onChange={handleChange('last_name')}
        error={!!formErrors.last_name}
        helperText={formErrors.last_name}
        margin="normal"
        disabled={loading}
      />
      
      <TextField
        fullWidth
        label="Имя *"
        value={formData.first_name}
        onChange={handleChange('first_name')}
        error={!!formErrors.first_name}
        helperText={formErrors.first_name}
        margin="normal"
        disabled={loading}
      />
      
      <TextField
        fullWidth
        label="Отчество"
        value={formData.middle_name}
        onChange={handleChange('middle_name')}
        margin="normal"
        disabled={loading}
      />
      
      <TextField
        fullWidth
        label="Email *"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={!!formErrors.email}
        helperText={formErrors.email}
        margin="normal"
        disabled={loading}
      />
      
      <TextField
        fullWidth
        label="Пароль *"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        error={!!formErrors.password}
        helperText={formErrors.password}
        margin="normal"
        disabled={loading}
      />
      
      <TextField
        fullWidth
        label="Подтверждение пароля *"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={!!formErrors.confirmPassword}
        helperText={formErrors.confirmPassword}
        margin="normal"
        disabled={loading}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
      </Button>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Link href="/login" variant="body2">
          Уже есть аккаунт? Войти
        </Link>
      </Box>
    </Box>
  );
};

export default RegisterForm;