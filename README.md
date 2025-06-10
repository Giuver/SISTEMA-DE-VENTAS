# Sistema de Ventas Meto

## Descripción
Sistema de gestión de ventas desarrollado para Meto, que permite administrar productos, realizar ventas, gestionar inventario y generar reportes detallados. El sistema está diseñado para optimizar el proceso de ventas y proporcionar una visión clara del rendimiento del negocio.

## Tabla de Contenidos
- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características](#características)
- [Autores](#autores)
- [Licencia](#licencia)

## Instalación

### Requisitos Previos
- Node.js (versión 14 o superior)
- MongoDB
- npm o yarn

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias del backend:
```bash
cd server
npm install
```

3. Instalar dependencias del frontend:
```bash
cd client
npm install
```

4. Configurar variables de entorno:
   - Crear archivo `.env` en la carpeta `server`
   - Agregar las siguientes variables:
     ```
     MONGODB_URI=tu_url_de_mongodb
     JWT_SECRET=tu_secreto_jwt
     PORT=5000
     ```

5. Iniciar el servidor:
```bash
cd server
node server.js
```

6. Iniciar el cliente:
```bash
cd client
npm start
```

## Uso

El sistema se divide en varios módulos principales:

### Dashboard
- Vista general de ventas
- Gráficos de rendimiento
- Indicadores clave de rendimiento

### Ventas
- Registro de nuevas ventas
- Historial de transacciones
- Gestión de clientes

### Inventario
- Control de stock
- Gestión de productos
- Alertas de inventario bajo

### Reportes
- Reportes de ventas
- Análisis de productos más vendidos
- Estadísticas de rendimiento

## Tecnologías Utilizadas

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- React Router
- Chart.js
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT para autenticación
- Bcrypt para encriptación

### Herramientas de Desarrollo
- Git
- npm
- Visual Studio Code

## Características
- Interfaz responsiva y moderna
- Modo oscuro/claro
- Autenticación segura
- Gestión de roles y permisos
- Reportes en tiempo real
- Exportación de datos
- Notificaciones en tiempo real

## Autores
- Equipo de Desarrollo Meto

## Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Para más información o soporte, contactar al equipo de desarrollo. 