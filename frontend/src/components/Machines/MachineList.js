import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachines, deleteMachine } from '../../store/slices/machinesSlice';
import MachineForm from './MachineForm';

const MachineList = () => {
  const dispatch = useDispatch();
  const { items: machines, loading, error } = useSelector(state => state.machines);
  const [openForm, setOpenForm] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    setOpenForm(true);
  };

  const handleDelete = (machine) => {
    setDeleteConfirm(machine);
  };

  const confirmDelete = async () => {
    try {
      // Используем Redux action для удаления (правильный baseURL через API сервис)
      await dispatch(deleteMachine(deleteConfirm.id)).unwrap();
      
      // Показываем уведомление об успехе
      setSnackbar({
        open: true,
        message: 'Машина успешно удалена',
        severity: 'success'
      });
      
      // Обновляем список
      await dispatch(fetchMachines());
    } catch (error) {
      // Обрабатываем ошибку
      console.error('Error deleting machine:', error);
      
      let errorMessage = 'Ошибка при удалении машины';
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleCreate = () => {
    setEditingMachine(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingMachine(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredMachines = machines.filter(machine => {
    const searchLower = searchTerm.toLowerCase();
    // РАСКОММЕНТИРУЙТЕ ПОСЛЕ ВЫПОЛНЕНИЯ МИГРАЦИИ 20260108032710-add-machine-fields.js
    // Поиск по ID, серийному номеру и названию
    // return (
    //   machine?.id?.toString().includes(searchLower) ||
    //   machine?.serial_number?.toLowerCase().includes(searchLower) ||
    //   machine?.name?.toLowerCase().includes(searchLower)
    // );
    // ТЕКУЩИЙ КОД (до миграции):
    return machine?.id?.toString().includes(searchTerm);
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Машины
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Добавить машину
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          // РАСКОММЕНТИРУЙТЕ ПОСЛЕ ВЫПОЛНЕНИЯ МИГРАЦИИ 20260108032710-add-machine-fields.js
          // placeholder="Поиск по ID, серийному номеру или названию..."
          // ТЕКУЩИЙ КОД (до миграции):
          placeholder="Поиск по ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {/* РАСКОММЕНТИРУЙТЕ ПОСЛЕ ВЫПОЛНЕНИЯ МИГРАЦИИ 20260108032710-add-machine-fields.js */}
              {/* <TableCell>Серийный номер</TableCell> */}
              {/* <TableCell>Название</TableCell> */}
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMachines.length === 0 ? (
              <TableRow>
                {/* РАСКОММЕНТИРУЙТЕ ПОСЛЕ ВЫПОЛНЕНИЯ МИГРАЦИИ 20260108032710-add-machine-fields.js */}
                {/* colSpan должно быть 4 если раскомментированы колонки серийного номера и названия */}
                {/* <TableCell colSpan={4} align="center"> */}
                {/* ТЕКУЩИЙ КОД (до миграции): */}
                <TableCell colSpan={2} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Машины не найдены
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredMachines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.id}</TableCell>
                  {/* РАСКОММЕНТИРУЙТЕ ПОСЛЕ ВЫПОЛНЕНИЯ МИГРАЦИИ 20260108032710-add-machine-fields.js */}
                  {/* <TableCell>{machine.serial_number || '-'}</TableCell> */}
                  {/* <TableCell>{machine.name || '-'}</TableCell> */}
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(machine)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(machine)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredMachines.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 3 }}>
          Машины не найдены
        </Typography>
      )}

      {/* Форма создания/редактирования */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMachine ? 'Редактировать машину' : 'Добавить машину'}
        </DialogTitle>
        <DialogContent>
          <MachineForm
            machine={editingMachine}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить машину с ID {deleteConfirm?.id}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Все связанные записи обслуживания также будут удалены.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Отмена</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомление */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default MachineList;