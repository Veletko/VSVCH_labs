import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Paper, Button, Select, MenuItem, FormControl, InputLabel, 
  Typography, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Alert
} from '@mui/material';
import { Canvas, Rect, Text, Group } from 'fabric';
import { Delete, Save, Clear, Add, Factory } from '@mui/icons-material';
import { fetchMachines } from '../../store/slices/machinesSlice';
import { 
  fetchWorkshops, 
  fetchWorkshopById, 
  createWorkshop, 
  saveWorkshopLayout,
  updateWorkshop 
} from '../../store/slices/workshopsSlice';

const WorkshopPlanner = () => {
  const canvasRef = useRef(null);
  const canvasInstanceRef = useRef(null);
  const dispatch = useDispatch();
  const { items: machines, loading: machinesLoading } = useSelector(state => state.machines);
  const { items: workshops, currentWorkshop, loading: workshopsLoading } = useSelector(state => state.workshops);
  
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [workshopId, setWorkshopId] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [workshopName, setWorkshopName] = useState('');
  const [workshopDescription, setWorkshopDescription] = useState('');
  const [error, setError] = useState('');

  // Инициализация canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: '#f5f5f5',
      selection: true,
    });

    canvasInstanceRef.current = canvas;

    // Загрузка машин и цехов при монтировании
    dispatch(fetchMachines());
    dispatch(fetchWorkshops());

    // Обработчик изменения объектов (перемещение, изменение размера)
    canvas.on('object:modified', () => {
      saveCanvasToWorkshop();
    });
    
    // Обработчик перемещения объектов (во время перемещения)
    canvas.on('object:moved', () => {
      saveCanvasToWorkshop();
    });

    return () => {
      canvas.dispose();
    };
  }, [dispatch]);

  // Загрузка схемы цеха на canvas
  useEffect(() => {
    if (!canvasInstanceRef.current || !currentWorkshop || !currentWorkshop.elements) return;

    const canvas = canvasInstanceRef.current;
    
    // Очищаем canvas
    canvas.clear();
    canvas.backgroundColor = '#f5f5f5';
    canvas.width = currentWorkshop.canvasWidth || 1200;
    canvas.height = currentWorkshop.canvasHeight || 800;

    // Добавляем элементы на canvas
    currentWorkshop.elements.forEach((element, index) => {
      let fabricObject = null;

      if (element.elementType === 'wall') {
        fabricObject = new Rect({
          left: element.position.x,
          top: element.position.y,
          width: element.position.width,
          height: element.position.height,
          angle: element.position.angle || 0,
          fill: element.fill || '#424242',
          stroke: element.stroke || '#212121',
          strokeWidth: element.strokeWidth || 2,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          lockRotation: false,
          elementIndex: index,
          elementType: 'wall',
        });
      } else if (element.elementType === 'door') {
        fabricObject = new Rect({
          left: element.position.x,
          top: element.position.y,
          width: element.position.width,
          height: element.position.height,
          angle: element.position.angle || 0,
          fill: element.fill || '#8B4513',
          stroke: element.stroke || '#654321',
          strokeWidth: element.strokeWidth || 2,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          lockRotation: false,
          elementIndex: index,
          elementType: 'door',
        });
      } else if (element.elementType === 'machine' && element.machine_id) {
        const rect = new Rect({
          left: 0,
          top: 0,
          width: element.position.width,
          height: element.position.height,
          fill: '#2196F3',
          stroke: '#1976D2',
          strokeWidth: 2,
          rx: 5,
          ry: 5,
          selectable: false,
          originX: 'left',
          originY: 'top',
        });

        const machineText = new Text(element.machine_id._id ? element.machine_id._id.substring(0, 8) : 'Machine', {
          left: element.position.width / 2,
          top: element.position.height / 2,
          fontSize: 12,
          fill: '#fff',
          originX: 'center',
          originY: 'center',
          selectable: false,
        });

        fabricObject = new Group([rect, machineText], {
          left: element.position.x,
          top: element.position.y,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          lockRotation: true,
          elementIndex: index,
          elementType: 'machine',
          machineId: element.machine_id._id || element.machine_id,
        });
      }

      if (fabricObject) {
        canvas.add(fabricObject);
      }
    });

    canvas.renderAll();
  }, [currentWorkshop]);

  // Сохранение схемы из canvas в цех
  const saveCanvasToWorkshop = async () => {
    if (!canvasInstanceRef.current || !workshopId) return;

    const canvas = canvasInstanceRef.current;
    const objects = canvas.getObjects();
    const elements = [];

    objects.forEach((obj) => {
      const elementType = obj.elementType || 'wall';
      
      // Получаем актуальные размеры и угол поворота
      // Для объектов с поворотом нужно использовать оригинальные размеры
      let width = obj.width || 100;
      let height = obj.height || 100;
      let angle = obj.angle || 0;
      
      // Если объект был масштабирован, учитываем масштаб
      if (obj.scaleX !== undefined && obj.scaleX !== 1) {
        width = width * obj.scaleX;
      }
      if (obj.scaleY !== undefined && obj.scaleY !== 1) {
        height = height * obj.scaleY;
      }
      
      // Для повернутых объектов сохраняем оригинальные размеры и угол
      const position = {
        x: obj.left,
        y: obj.top,
        width: width,
        height: height,
        angle: angle
      };

      const element = {
        elementType,
        position,
        fill: obj.fill || '#424242',
        stroke: obj.stroke || '#212121',
        strokeWidth: obj.strokeWidth || 2,
        machine_id: obj.machineId || null
      };

      elements.push(element);
    });

    try {
      await dispatch(saveWorkshopLayout({
        id: workshopId,
        elements,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })).unwrap();
    } catch (error) {
      console.error('Error saving layout:', error);
      setError('Ошибка при сохранении схемы');
    }
  };

  // Загрузка цеха
  const handleLoadWorkshop = async (id) => {
    try {
      await dispatch(fetchWorkshopById(id)).unwrap();
      setWorkshopId(id);
      setError('');
    } catch (error) {
      console.error('Error loading workshop:', error);
      setError('Ошибка при загрузке цеха');
    }
  };

  // Создание нового цеха
  const handleCreateWorkshop = async () => {
    if (!workshopName.trim()) {
      setError('Введите название цеха');
      return;
    }

    try {
      const result = await dispatch(createWorkshop({
        name: workshopName,
        description: workshopDescription
      })).unwrap();
      
      setWorkshopId(result._id || result.data?._id);
      setCreateDialogOpen(false);
      setWorkshopName('');
      setWorkshopDescription('');
      setError('');
      
      // Очищаем canvas
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.clear();
        canvasInstanceRef.current.backgroundColor = '#f5f5f5';
        canvasInstanceRef.current.renderAll();
      }
    } catch (error) {
      console.error('Error creating workshop:', error);
      setError(error.message || 'Ошибка при создании цеха');
    }
  };

  // Добавление стены
  const addWall = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas || !workshopId) {
      setError('Сначала создайте или загрузите цех');
      return;
    }

    const wall = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 20,
      fill: '#424242',
      stroke: '#212121',
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: false,
      elementType: 'wall',
    });

    canvas.add(wall);
    canvas.setActiveObject(wall);
    canvas.renderAll();
    saveCanvasToWorkshop();
  };

  // Добавление двери
  const addDoor = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas || !workshopId) {
      setError('Сначала создайте или загрузите цех');
      return;
    }

    const door = new Rect({
      left: 100,
      top: 100,
      width: 80,
      height: 20,
      fill: '#8B4513',
      stroke: '#654321',
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: false,
      elementType: 'door',
    });

    canvas.add(door);
    canvas.setActiveObject(door);
    canvas.renderAll();
    saveCanvasToWorkshop();
  };

  // Добавление станка
  const addMachine = () => {
    if (!selectedMachine) {
      setError('Выберите станок из списка');
      return;
    }

    const canvas = canvasInstanceRef.current;
    if (!canvas || !workshopId) {
      setError('Сначала создайте или загрузите цех');
      return;
    }

    const machine = machines.find(m => m._id === selectedMachine);
    if (!machine) return;

    // Проверяем, не добавлен ли уже этот станок
    const existingMachine = canvas.getObjects().find(obj => {
      const machineId = obj.machineId || (obj.type === 'group' && obj.machineId);
      return machineId === selectedMachine;
    });
    
    if (existingMachine) {
      setError('Этот станок уже добавлен на схему');
      canvas.setActiveObject(existingMachine);
      canvas.renderAll();
      return;
    }

    const rect = new Rect({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      fill: '#2196F3',
      stroke: '#1976D2',
      strokeWidth: 2,
      rx: 5,
      ry: 5,
      selectable: false,
      originX: 'left',
      originY: 'top',
    });

    const text = new Text(machine._id.substring(0, 8), {
      left: 50,
      top: 50,
      fontSize: 12,
      fill: '#fff',
      originX: 'center',
      originY: 'center',
      selectable: false,
    });

    const group = new Group([rect, text], {
      left: 100,
      top: 100,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: true,
      machineId: machine._id,
      elementType: 'machine',
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
    saveCanvasToWorkshop();
    setSelectedMachine('');
  };

  // Удаление выбранного объекта
  const deleteSelected = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
      setError('Выберите элемент для удаления');
      return;
    }

    canvas.remove(activeObject);
    canvas.renderAll();
    saveCanvasToWorkshop();
    setError('');
  };

  // Очистка canvas
  const clearCanvas = () => {
    if (!window.confirm('Вы уверены, что хотите очистить всю схему? Это действие нельзя отменить.')) {
      return;
    }

    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = '#f5f5f5';
    canvas.renderAll();
    saveCanvasToWorkshop();
    setError('');
  };

  // Сохранение всей схемы (явное)
  const saveWorkshop = async () => {
    if (!workshopId) {
      setError('Сначала создайте или загрузите цех');
      return;
    }

    await saveCanvasToWorkshop();
    setError('');
    alert('Схема цеха сохранена!');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ mr: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Factory /> Планировщик цеха
          </Typography>

          {/* Выбор/создание цеха */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Выберите цех</InputLabel>
            <Select
              value={workshopId || ''}
              onChange={(e) => handleLoadWorkshop(e.target.value)}
              label="Выберите цех"
            >
              {workshops && workshops.map((workshop) => (
                <MenuItem key={workshop._id} value={workshop._id}>
                  {workshop.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => setCreateDialogOpen(true)}
            startIcon={<Add />}
          >
            Создать цех
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {workshopId && (
          <>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
              <Button
                variant={selectedTool === 'wall' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedTool('wall');
                  addWall();
                }}
              >
                <Add sx={{ mr: 1 }} />
                Стена
              </Button>
              
              <Button
                variant={selectedTool === 'door' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedTool('door');
                  addDoor();
                }}
              >
                <Add sx={{ mr: 1 }} />
                Дверь
              </Button>
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Выберите станок</InputLabel>
                <Select
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                  label="Выберите станок"
                >
                  {machines && machines.map((machine) => (
                    <MenuItem key={machine._id} value={machine._id}>
                      Станок {machine._id.substring(0, 8)} ({machine.status})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                onClick={addMachine}
                disabled={!selectedMachine || machinesLoading}
              >
                <Add sx={{ mr: 1 }} />
                Добавить станок
              </Button>
              
              <Tooltip title="Удалить выбранный элемент">
                <IconButton
                  color="error"
                  onClick={deleteSelected}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Очистить схему">
                <IconButton
                  color="warning"
                  onClick={clearCanvas}
                >
                  <Clear />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                color="primary"
                onClick={saveWorkshop}
                startIcon={<Save />}
              >
                Сохранить схему
              </Button>
            </Box>
            
            <Typography variant="body2" color="textSecondary">
              💡 Подсказка: Выберите элемент на схеме и перетащите его. Схема автоматически сохраняется при изменении.
            </Typography>
          </>
        )}

        {!workshopId && (
          <Alert severity="info">
            Создайте новый цех или выберите существующий для начала работы с планировщиком.
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 2, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <canvas ref={canvasRef} />
        </Box>
      </Paper>

      {/* Диалог создания цеха */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Создать новый цех</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название цеха"
            fullWidth
            variant="outlined"
            value={workshopName}
            onChange={(e) => setWorkshopName(e.target.value)}
            required
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={workshopDescription}
            onChange={(e) => setWorkshopDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleCreateWorkshop} variant="contained">Создать</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkshopPlanner;
