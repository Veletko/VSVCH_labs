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
  CircularProgress
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
    await dispatch(deleteMachine(deleteConfirm.id)).unwrap();
    // Обновляем список после удаления
    dispatch(fetchMachines());
    setDeleteConfirm(null);
  };

  const handleCreate = () => {
    setEditingMachine(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingMachine(null);
  };

  const filteredMachines = machines.filter(machine =>
    machine.id.toString().includes(searchTerm)
  );

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
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMachines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell>{machine.id}</TableCell>
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
            ))}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Отмена</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MachineList;

