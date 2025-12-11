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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaintenanceDetailed, deleteMaintenance } from '../../store/slices/maintenanceSlice';
import MaintenanceForm from './MaintenanceForm';

const stateLabels = {
  planned: 'Запланировано',
  in_progress: 'В процессе',
  completed: 'Завершено',
  cancelled: 'Отменено'
};

const stateColors = {
  planned: 'default',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error'
};

const MaintenanceList = () => {
  const dispatch = useDispatch();
  const { itemsDetailed: maintenanceItems, loading, error } = useSelector(state => state.maintenance);
  const [openForm, setOpenForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchMaintenanceDetailed());
  }, [dispatch]);

  const handleEdit = (maintenance) => {
    setEditingMaintenance(maintenance);
    setOpenForm(true);
  };

  const handleDelete = (maintenance) => {
    setDeleteConfirm(maintenance);
  };

  const confirmDelete = async () => {
    await dispatch(deleteMaintenance(deleteConfirm.id)).unwrap();
    // Обновляем список после удаления
    dispatch(fetchMaintenanceDetailed());
    setDeleteConfirm(null);
  };

  const handleCreate = () => {
    setEditingMaintenance(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingMaintenance(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMaintenance = maintenanceItems.filter(item => {
    const matchesSearch = 
      item.id.toString().includes(searchTerm) ||
      (item.machine && item.machine.id.toString().includes(searchTerm)) ||
      (item.master && (
        item.master.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.master.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesState = !stateFilter || item.state === stateFilter;
    
    return matchesSearch && matchesState;
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
          История обслуживания
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Добавить запись обслуживания
        </Button>
      </Box>

      <Box mb={3} display="flex" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по ID, машине или мастеру..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={stateFilter}
            label="Статус"
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {Object.keys(stateLabels).map((state) => (
              <MenuItem key={state} value={state}>
                {stateLabels[state]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              <TableCell>Машина</TableCell>
              <TableCell>Мастер</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата начала</TableCell>
              <TableCell>Дата окончания</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaintenance.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {item.machine ? `Машина #${item.machine.id}` : `ID: ${item.machine_id}`}
                </TableCell>
                <TableCell>
                  {item.master 
                    ? `${item.master.last_name} ${item.master.first_name} ${item.master.middle_name || ''}`.trim()
                    : `ID: ${item.master_id}`
                  }
                </TableCell>
                <TableCell>
                  <Chip 
                    label={stateLabels[item.state] || item.state}
                    color={stateColors[item.state] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(item.start_date)}</TableCell>
                <TableCell>{formatDate(item.end_date)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredMaintenance.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 3 }}>
          Записи обслуживания не найдены
        </Typography>
      )}

      {/* Форма создания/редактирования */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMaintenance ? 'Редактировать запись обслуживания' : 'Добавить запись обслуживания'}
        </DialogTitle>
        <DialogContent>
          <MaintenanceForm
            maintenance={editingMaintenance}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить запись обслуживания с ID {deleteConfirm?.id}?
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

export default MaintenanceList;

