const WebSocket = require('ws');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const mysql = require('mysql');

// Configurar puerto serie para Arduino
const arduinoPort = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const parser = arduinoPort.pipe(new Readline({ delimiter: '\n' }));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // Cambia por tu contraseña
  database: 'arduino_data'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

// Configurar servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado al WebSocket');
});

// Procesar datos del Arduino
parser.on('data', (data) => {
  const distance = parseInt(data.trim());
  console.log('Distancia recibida:', distance);

  // Guardar en la base de datos
  const query = 'INSERT INTO sensor_readings (reading) VALUES (?)';
  db.query(query, [distance], (err) => {
    if (err) throw err;
    console.log('Dato guardado en la base de datos');
  });

  // Enviar a los clientes conectados vía WebSocket
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ distance, timestamp: new Date() }));
    }
  });
});
