const express = require("express");
const { registerUser, loginUser, getUsuarios, updateRol, deleteUsuario, verificarCorreo, obtenerPregunta, verificarRespuesta, cambiarContrasena, obtenerPerfil } = require("../Controllers/userController");
// Agrega esta línea para importar los controladores de unión
const { vincularDispositivo, activarDispositivo, obtenerDispositivosUsuario } = require("../Controllers/unionControlle");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verificar-correo", verificarCorreo);
router.post("/obtener-pregunta", obtenerPregunta);
router.post("/verificar-respuesta", verificarRespuesta);
router.post("/cambiar-contrasena", cambiarContrasena);

// Ruta protegida para usuarios autenticados
router.get("/perfil", authMiddleware(), (req, res) => {
  res.json({ mensaje: "Bienvenido a tu perfil", usuario: req.user });
});

// Ruta para obtener el perfil de un usuario específico
router.get("/:id", authMiddleware(), obtenerPerfil);

// Rutas protegidas solo para administradores
router.get("/admin/usuarios", authMiddleware(["admin"]), getUsuarios);
router.put("/admin/usuarios/:id/rol", authMiddleware(["admin"]), updateRol);
router.delete("/admin/usuarios/:id", authMiddleware(["admin"]), deleteUsuario);

// Nuevas rutas para la unión usuario-dispositivo
router.post('/dispositivos/vincular', authMiddleware(), vincularDispositivo);
router.put('/dispositivos/:id/activar', authMiddleware(), activarDispositivo);
router.get('/dispositivos/mis-dispositivos', authMiddleware(), obtenerDispositivosUsuario);

module.exports = router;