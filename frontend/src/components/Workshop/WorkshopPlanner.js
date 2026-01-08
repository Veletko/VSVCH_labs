import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  Chip
} from '@mui/material';
import {
  Save,
  Delete,
  Add,
  Wall,
  Door,
  Build,
  Clear,
  VerticalAlignCenter
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWorkshopById,
  createWorkshop,
  updateWorkshop
} from '../../store/slices/workshopsSlice';
import { fetchMachines } from '../../store/slices/machinesSlice';
import { fetchMaintenance } from '../../store/slices/maintenanceSlice';

const WorkshopPlanner = ({ workshopId }) => {
  const canvasRef = useRef(null);
  const canvasInstanceRef = useRef(null);
  const dispatch = useDispatch();
  
  const { currentWorkshop, loading: workshopLoading } = useSelector(state => state.workshops);
  const { items: machines } = useSelector(state => state.machines);
  const { items: maintenance } = useSelector(state => state.maintenance);
  
  const [workshopName, setWorkshopName] = useState('Новая схема цеха');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [elementDialogOpen, setElementDialogOpen] = useState(false);
  const [selectedElementType, setSelectedElementType] = useState('wall');
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [error, setError] = useState(null);

  // Получаем цвет станка в зависимости от последнего обслуживания
  const getMachineColor = (machineId) => {
    if (!machineId) return '#4caf50'; // Зеленый по умолчанию
    
    // Находим последнее обслуживание для станка
    const machineMaintenance = maintenance
      .filter(m => m.machine_id === machineId)
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    
    if (machineMaintenance.length === 0) {
      return '#ff9800'; // Оранжевый - нет обслуживания
    }
    
    const lastMaintenance = machineMaintenance[0];
    switch (lastMaintenance.state) {
      case 'completed':
        return '#4caf50'; // Зеленый - обслуживание завершено
      case 'in_progress':
        return '#2196f3'; // Синий - обслуживание в процессе
      case 'planned':
        return '#ffc107'; // Желтый - запланировано
      case 'cancelled':
        return '#f44336'; // Красный - отменено
      default:
        return '#9e9e9e'; // Серый - неизвестно
    }
  };

  // Инициализация canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: '#f5f5f5',
      selection: true
    });

    canvasInstanceRef.current = canvas;

    // Обработчик удаления выбранного объекта
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
        canvas.remove(canvas.getActiveObject());
        canvas.renderAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, []);

  // Загрузка схемы цеха
  useEffect(() => {
    if (workshopId) {
      dispatch(fetchWorkshopById(workshopId));
    }
  }, [workshopId, dispatch]);

  // Загрузка машин и обслуживания
  useEffect(() => {
    dispatch(fetchMachines());
    dispatch(fetchMaintenance());
  }, [dispatch]);

  // Загрузка схемы на canvas
  useEffect(() => {
    if (!canvasInstanceRef.current || !currentWorkshop || !currentWorkshop.layout_data) return;

    const canvas = canvasInstanceRef.current;
    canvas.clear();

    const layoutData = currentWorkshop.layout_data;
    if (layoutData.elements && Array.isArray(layoutData.elements)) {
      layoutData.elements.forEach((element) => {
        let fabricObject = null;

        switch (element.type) {
          case 'wall':
            fabricObject = new fabric.Rect({
              left: element.left || 0,
              top: element.top || 0,
              width: element.width || 100,
              height: element.height || 20,
              fill: '#757575',
              stroke: '#424242',
              strokeWidth: 2,
              selectable: true,
              hasControls: true,
              hasBorders: true
            });
            break;

          case 'door':
            fabricObject = new fabric.Rect({
              left: element.left || 0,
              top: element.top || 0,
              width: element.width || 80,
              height: element.height || 20,
              fill: '#8d6e63',
              stroke: '#5d4037',
              strokeWidth: 2,
              selectable: true,
              hasControls: true,
              hasBorders: true
            });
            break;

          case 'machine':
            const color = element.machineId ? getMachineColor(element.machineId) : '#4caf50';
            const machine = machines.find(m => m.id === element.machineId);
            const label = machine ? `Станок #${machine.id}` : 'Станок';
            
            fabricObject = new fabric.Rect({
              left: element.left || 0,
              top: element.top || 0,
              width: element.width || 100,
              height: element.height || 100,
              fill: color,
              stroke: '#212121',
              strokeWidth: 2,
              selectable: true,
              hasControls: true,
              hasBorders: true,
              rx: 5,
              ry: 5
            });

            // Добавляем текст с номером станка
            const text = new fabric.Text(label, {
              left: element.left || 0,
              top: (element.top || 0) + (element.height || 100) / 2,
              fontSize: 14,
              fill: '#ffffff',
              textAlign: 'center',
              originX: 'center',
              originY: 'center',
              selectable: false
            });

            // Группируем прямоугольник и текст
            const group = new fabric.Group([fabricObject, text], {
              left: element.left || 0,
              top: element.top || 0,
              selectable: true,
              hasControls: true,
              hasBorders: true
            });

            // Сохраняем метаданные
            group.set('elementType', 'machine');
            group.set('machineId', element.machineId);
            
            fabricObject = group;
            break;
        }

        if (fabricObject) {
          // Поворот если указан
          if (element.angle) {
            fabricObject.set('angle', element.angle);
          }
          
          // Сохраняем метаданные для всех элементов
          fabricObject.set('elementType', element.type);
          if (element.machineId) {
            fabricObject.set('machineId', element.machineId);
          }
          
          canvas.add(fabricObject);
        }
      });
    }

    canvas.renderAll();
  }, [currentWorkshop, machines, maintenance]);

  // Добавление элемента
  const handleAddElement = () => {
    if (!canvasInstanceRef.current) return;

    const canvas = canvasInstanceRef.current;
    let fabricObject = null;

    if (selectedElementType === 'wall') {
      fabricObject = new Rect({
        left: 100,
        top: 100,
        width: 200,
        height: 20,
        fill: '#757575',
        stroke: '#424242',
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true
      });
      fabricObject.set('elementType', 'wall');
    } else if (selectedElementType === 'door') {
      fabricObject = new Rect({
        left: 100,
        top: 100,
        width: 80,
        height: 20,
        fill: '#8d6e63',
        stroke: '#5d4037',
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true
      });
      fabricObject.set('elementType', 'door');
    } else if (selectedElementType === 'machine') {
      if (!selectedMachineId) {
        setError('Выберите станок');
        return;
      }

      const color = getMachineColor(parseInt(selectedMachineId));
      const machine = machines.find(m => m.id === parseInt(selectedMachineId));
      const label = machine ? `Станок #${machine.id}` : 'Станок';

      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: color,
        stroke: '#212121',
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        rx: 5,
        ry: 5
      });

      const text = new fabric.Text(label, {
        left: 100,
        top: 150,
        fontSize: 14,
        fill: '#ffffff',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: false
      });

      fabricObject = new fabric.Group([rect, text], {
        left: 100,
        top: 100,
        selectable: true,
        hasControls: true,
        hasBorders: true
      });

      fabricObject.set('elementType', 'machine');
      fabricObject.set('machineId', parseInt(selectedMachineId));
    }

    if (fabricObject) {
      canvas.add(fabricObject);
      canvas.setActiveObject(fabricObject);
      canvas.renderAll();
      setElementDialogOpen(false);
      setError(null);
    }
  };

  // Сохранение схемы
  const handleSave = async () => {
    if (!canvasInstanceRef.current) return;

    const canvas = canvasInstanceRef.current;
    const elements = canvas.getObjects().map((obj) => {
      const element = {
        type: obj.get('elementType') || 'unknown',
        left: obj.left,
        top: obj.top,
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY,
        angle: obj.angle || 0
      };

      if (obj.get('machineId')) {
        element.machineId = obj.get('machineId');
      }

      return element;
    });

    const layoutData = {
      elements
    };

    try {
      if (currentWorkshop && currentWorkshop.id) {
        await dispatch(updateWorkshop({
          id: currentWorkshop.id,
          data: {
            name: workshopName,
            layout_data: layoutData
          }
        })).unwrap();
      } else {
        await dispatch(createWorkshop({
          name: workshopName,
          layout_data: layoutData
        })).unwrap();
      }
      
      setSaveDialogOpen(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Ошибка при сохранении схемы');
    }
  };

  // Очистка схемы
  const handleClear = () => {
    if (!canvasInstanceRef.current) return;
    if (window.confirm('Вы уверены, что хотите очистить всю схему?')) {
      canvasInstanceRef.current.clear();
      canvasInstanceRef.current.backgroundColor = '#f5f5f5';
      canvasInstanceRef.current.renderAll();
    }
  };

  // Установка названия схемы при загрузке
  useEffect(() => {
    if (currentWorkshop && currentWorkshop.name) {
      setWorkshopName(currentWorkshop.name);
    }
  }, [currentWorkshop]);

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Планировщик цеха
        </Typography>
        <Box display="flex" gap={2}>
          <Tooltip title="Добавить элемент">
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setElementDialogOpen(true)}
            >
              Добавить элемент
            </Button>
          </Tooltip>
          <Tooltip title="Очистить схему">
            <IconButton color="error" onClick={handleClear}>
              <Clear />
            </IconButton>
          </Tooltip>
          <Tooltip title="Сохранить схему">
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => setSaveDialogOpen(true)}
            >
              Сохранить
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box
        border="1px solid #ddd"
        borderRadius={1}
        overflow="hidden"
        bgcolor="#fff"
      >
        <canvas ref={canvasRef} />
      </Box>

      {/* Диалог добавления элемента */}
      <Dialog open={elementDialogOpen} onClose={() => setElementDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить элемент</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Тип элемента</InputLabel>
              <Select
                value={selectedElementType}
                label="Тип элемента"
                onChange={(e) => setSelectedElementType(e.target.value)}
              >
                <MenuItem value="wall">
                  <Wall sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Стена
                </MenuItem>
                <MenuItem value="door">
                  <Door sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Дверь
                </MenuItem>
                <MenuItem value="machine">
                  <Build sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Станок
                </MenuItem>
              </Select>
            </FormControl>

            {selectedElementType === 'machine' && (
              <FormControl fullWidth>
                <InputLabel>Станок</InputLabel>
                <Select
                  value={selectedMachineId}
                  label="Станок"
                  onChange={(e) => setSelectedMachineId(e.target.value)}
                >
                  {machines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.id}>
                      Станок #{machine.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedElementType === 'machine' && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Цвет станка зависит от последнего обслуживания:
                </Typography>
                <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                  <Chip label="Завершено" size="small" sx={{ bgcolor: '#4caf50', color: '#fff' }} />
                  <Chip label="В процессе" size="small" sx={{ bgcolor: '#2196f3', color: '#fff' }} />
                  <Chip label="Запланировано" size="small" sx={{ bgcolor: '#ffc107', color: '#fff' }} />
                  <Chip label="Отменено" size="small" sx={{ bgcolor: '#f44336', color: '#fff' }} />
                  <Chip label="Нет обслуживания" size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setElementDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAddElement} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог сохранения */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Сохранить схему цеха</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Название схемы"
            value={workshopName}
            onChange={(e) => setWorkshopName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" disabled={!workshopName.trim()}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default WorkshopPlanner;
