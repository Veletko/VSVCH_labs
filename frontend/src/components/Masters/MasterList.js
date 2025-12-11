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
import { fetchMasters, deleteMaster } from '../../store/slices/mastersSlice';
import MasterForm from './MasterForm';

const MasterList = () => {
  const dispatch = useDispatch();
  const { items: masters, loading, error } = useSelector(state => state.masters);
  const [openForm, setOpenForm] = useState(false);
  const [editingMaster, setEditingMaster] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchMasters());
  }, [dispatch]);

  const handleEdit = (master) => {
    setEditingMaster(master);
    setOpenForm(true);
  };

  const handleDelete = (master) => {
    setDeleteConfirm(master);
  };

  const confirmDelete = () => {
    dispatch(deleteMaster(deleteConfirm.id));
    setDeleteConfirm(null);
  };

  const handleCreate = () => {
    setEditingMaster(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingMaster(null);
  };

  const filteredMasters = masters.filter(master =>
    master.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    master.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (master.middle_name && master.middle_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
          Мастера
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Добавить мастера
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по ФИО..."
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
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMasters.map((master) => (
              <TableRow key={master.id}>
                <TableCell>{master.id}</TableCell>
                <TableCell>{master.last_name}</TableCell>
                <TableCell>{master.first_name}</TableCell>
                <TableCell>{master.middle_name || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(master)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(master)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredMasters.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 3 }}>
          Мастеры не найдены
        </Typography>
      )}

      {/* Форма создания/редактирования */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMaster ? 'Редактировать мастера' : 'Добавить мастера'}
        </DialogTitle>
        <DialogContent>
          <MasterForm
            master={editingMaster}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить мастера {deleteConfirm?.last_name} {deleteConfirm?.first_name}?
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

export default MasterList;