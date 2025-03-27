const express = require("express");
const cors = require("cors");
const conectarDB = require("./Config/db");
require("dotenv").config();

const TerrarioRoutes = require("./routes/TerrarioRoutes");

const app = express();
const port = process.env.PORT || 4000;

// Configurar CORS con soporte para múltiples orígenes
const corsOptions = {
  origin: ['http://localhost:3000', 'https://tu-dominio-frontend.com'], // Ajusta al origen real de tu frontend
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// Middleware para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors(corsOptions));

// Conectar a la base de datos
conectarDB();

// Ruta raíz básica para evitar errores 404
app.get("/", (req, res) => {
  res.send("Bienvenido a mi servidor!");
});

// Rutas API existentes
app.use("/api/usuarios", require("./routes/userRoutes"));
app.use("/api/misiones", require("./routes/MisionRoutes"));
app.use("/api/visiones", require("./routes/VisionRoutes"));
app.use("/api/terminos", require("./routes/TerminoRoutes"));
app.use("/api/politicas", require("./routes/PoliticaRoutes"));
app.use("/api/preguntas", require("./routes/PreguntaRoutes"));
app.use("/api/contactos", require("./routes/ContactoRoutes"));
app.use("/api/informaciones", require("./routes/InformacionRoutes"));
app.use("/api/terrario", TerrarioRoutes);
app.use("/api/productos", require("./routes/ProductoRoutes"));

// Nueva ruta para el control de actuadores con validación estricta
app.post("/api/control", (req, res) => {
  const { actuador, accion } = req.body;

  // Valores válidos para actuadores y acciones
  const validActuadores = ['fan', 'lamp'];
  const validAcciones = ['on', 'off'];

  if (!actuador || !accion) {
    return res.status(400).json({ message: "Datos incompletos: faltan actuador o acción." });
  }

  if (!validActuadores.includes(actuador) || !validAcciones.includes(accion)) {
    return res.status(400).json({ message: "Actuador o acción no válidos." });
  }

  console.log(`Recibido: Actuador - ${actuador}, Acción - ${accion}`);

  // Lógica de control de actuadores
  switch (actuador) {
    case "fan":
      accion === "on" 
        ? console.log("Encendiendo el ventilador...") 
        : console.log("Apagando el ventilador...");
      break;
    case "lamp":
      accion === "on" 
        ? console.log("Encendiendo la lámpara...") 
        : console.log("Apagando la lámpara...");
      break;
    default:
      console.error("Actuador no reconocido.");
  }

  res.status(200).json({ message: "Acción realizada con éxito." });
});

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error interno del servidor");
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
