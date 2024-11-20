const express = require('express');
const mysql = require('mysql');
const WebSocket = require('ws');
const path = require('path'); // Importar path para manejar rutas

// Configurar conexión a la base de datos
const db = mysql.createConnection({
  host: 'database',
  user: 'root',
  password: '12345',
  database: 'arduino_data',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

// Configurar servidor WebSocket
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Configurar ruta para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado al WebSocket');

  ws.on('message', (message) => {
    const distance = parseInt(message, 10);
    console.log(`Distancia recibida: ${distance}`);

    // Guardar en la base de datos
    const query = 'INSERT INTO sensor_readings (reading) VALUES (?)';
    db.query(query, [distance], (err) => {
      if (err) throw err;
      console.log('Dato guardado en la base de datos');
    });

    // Enviar datos de vuelta al cliente
    ws.send(distance);
  });
});

// Iniciar el servidor
server.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
});

