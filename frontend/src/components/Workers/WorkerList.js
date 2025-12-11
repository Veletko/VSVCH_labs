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
  Chip
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkers, deleteWorker } from '../../store/slices/workersSlice';
import WorkerForm from './WorkerForm';

const WorkerList = () => {
  const dispatch = useDispatch();
  const { items: workers, loading, error } = useSelector(state => state.workers);
  const [openForm, setOpenForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setOpenForm(true);
  };

  const handleDelete = (worker) => {
    setDeleteConfirm(worker);
  };

  const confirmDelete = () => {
    dispatch(deleteWorker(deleteConfirm.id));
    setDeleteConfirm(null);
  };

  const handleCreate = () => {
    setEditingWorker(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingWorker(null);
  };

  const filteredWorkers = workers.filter(worker =>
    worker.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (worker.middle_name && worker.middle_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (worker.master && worker.master.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
          Рабочие
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Добавить рабочего
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по ФИО или мастеру..."
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
              <TableCell>Фамилия</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Отчество</TableCell>
              <TableCell>Мастер</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWorkers.map((worker) => (
              <TableRow key={worker.id}>
                <TableCell>{worker.id}</TableCell>
                <TableCell>{worker.last_name}</TableCell>
                <TableCell>{worker.first_name}</TableCell>
                <TableCell>{worker.middle_name || '-'}</TableCell>
                <TableCell>
                  {worker.master ? (
                    <Chip 
                      label={`${worker.master.last_name} ${worker.master.first_name}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ) : (
                    <Chip 
                      label="Не назначен"
                      size="small"
                      color="default"
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(worker)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(worker)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredWorkers.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 3 }}>
          Рабочие не найдены
        </Typography>
      )}

      {/* Форма создания/редактирования */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingWorker ? 'Редактировать рабочего' : 'Добавить рабочего'}
        </DialogTitle>
        <DialogContent>
          <WorkerForm
            worker={editingWorker}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить рабочего {deleteConfirm?.last_name} {deleteConfirm?.first_name}?
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

export default WorkerList;