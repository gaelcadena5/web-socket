# Usa la imagen oficial de Node.js como base
FROM node:20

# Crea un directorio en el contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY . /app

# Instala las dependencias definidas en package.json
RUN npm install

# Expone el puerto que usará el servidor
EXPOSE 8080

# Comando para ejecutar el servidor
CMD ["npm", "start"]





