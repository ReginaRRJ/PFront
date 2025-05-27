import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

function Dashboard() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchConToken = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    return await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };


  const fetchUsuarios = async () => {
    try {
      const response = await fetchConToken('http://localhost:4000/usuarios');
      const data = await response.json();
      if (response.ok) {
        setUsuarios(data);
      } else {
        toast.error(data.message || 'Error al obtener usuarios');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);
  
  const handleRowClick = (usuario) => {
    setSelectedUser(usuario);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    setSelectedUser({ nombre: '', correo_electronico: '', descripcion: '', contrasena: '' });
    setOpenDialog(true);
  };

  const handleSaveChanges = async () => {
  const { nombre, correo_electronico, contrasena, descripcion } = selectedUser;
  const isNewUser = !selectedUser.id;

  if (!nombre || !correo_electronico || !descripcion || (isNewUser && !contrasena)) {
    toast.error('Por favor completa todos los campos obligatorios');
    return;
  }

  const url = isNewUser
    ? 'http://localhost:4000/usuarios'
    : `http://localhost:4000/usuarios/${selectedUser.id}`;
  const method = isNewUser ? 'POST' : 'PUT';

  try {
    const response = await fetchConToken(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedUser),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success(isNewUser ? 'Usuario creado' : 'Usuario actualizado');
      fetchUsuarios();
      handleDialogClose();
    } else {
      toast.error(data.message || 'Error al guardar usuario');
    }
  } catch (error) {
    console.error(error);
    toast.error('Error de conexión con el servidor');
  }
};


  const handleDeleteUser = async () => {
    try {
      const response = await fetchConToken(`http://localhost:4000/usuarios/${selectedUser.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Usuario eliminado');
        fetchUsuarios();
        handleDialogClose();
      } else {
        toast.error(data.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor');
    }
  };


  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido al dashboard!</p>
      <button onClick={() => navigate('/')}>
        Volver a Login
      </button>
      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: 10, marginBottom: 10 }}
        onClick={handleAddUser}
      >
        Agregar Usuario
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}
                onClick={() => handleRowClick(usuario)}
                style={{ cursor: 'pointer' }}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.correo_electronico}</TableCell>
                <TableCell>{usuario.descripcion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedUser?.id ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            type="name"
            fullWidth
            value={selectedUser?.nombre || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, nombre: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            value={selectedUser?.contrasena || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, contrasena: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Correo Electrónico"
            fullWidth
            value={selectedUser?.correo_electronico || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, correo_electronico: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            value={selectedUser?.descripcion || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, descripcion: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteUser} color="error">
            Eliminar
          </Button>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button onClick={handleSaveChanges} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}

export default Dashboard;
