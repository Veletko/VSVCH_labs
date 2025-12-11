import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Alert,
  DialogActions,
  Typography
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createMachine, updateMachine, fetchMachines } from '../../store/slices/machinesSlice';

const MachineForm = ({ machine, onClose }) => {
  const dispatch = useDispatch();
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    try {
      if (machine) {
        // Для машины нет полей для редактирования, только ID
        // Но на случай если в будущем появятся поля
        await dispatch(updateMachine({ id: machine.id, data: {} })).unwrap();
      } else {
        // Создание новой машины - просто пустой объект, ID генерируется на сервере
        await dispatch(createMachine({})).unwrap();
      }
      // Обновляем список машин
      await dispatch(fetchMachines());
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Произошла ошибка при сохранении');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {submitError && (
          <Alert severity="error">{submitError}</Alert>
        )}

        {machine ? (
          <Typography variant="body1">
            Машина с ID {machine.id}. В данный момент модель машины не содержит дополнительных полей для редактирования.
          </Typography>
        ) : (
          <Typography variant="body1">
            Будет создана новая машина. ID будет присвоен автоматически.
          </Typography>
        )}
      </Box>

      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" variant="contained">
          {machine ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default MachineForm;

