<?php
// Permitir respuestas JSON limpias
header('Content-Type: application/json; charset=utf-8');

// Desactivar impresión de errores HTML para no romper el JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
    // 1. Conexión segura con MySQL
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión con la base de datos: " . $e->getMessage() . ". Asegúrate de que MySQL esté activo en XAMPP y la BD 'nutrimundo' exista."
    ]);
    exit();
}

$correo = trim($_POST['correo'] ?? '');
$contrasena = trim($_POST['contrasena'] ?? '');

if (empty($correo) || empty($contrasena)) {
    echo json_encode([
        "status" => "error", 
        "message" => "Por favor ingresa tu correo y contraseña."
    ]);
    exit();
}

try {
    // 2. Consulta con sentencia preparada
    $stmt = $conexion->prepare("SELECT id_usuario, nombre_apellidos, email, contrasena, rol FROM usuario WHERE email = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($usuario = $resultado->fetch_assoc()) {
        // Comprobar contraseña (encriptada con password_hash o texto plano)
        $passwordValida = false;
        if (password_verify($contrasena, $usuario['contrasena']) || $contrasena === $usuario['contrasena']) {
            $passwordValida = true;
        }

        if ($passwordValida) {
            session_start();
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['usuario_rol'] = $usuario['rol'];
            $_SESSION['usuario_nombre'] = $usuario['nombre_apellidos'];

            echo json_encode([
                "status" => "success",
                "rol" => strtolower(trim($usuario['rol'])),
                "nombre" => $usuario['nombre_apellidos']
            ]);
            exit();
        }
    }

    // Si no encontró el usuario o la clave no coincide
    echo json_encode([
        "status" => "error", 
        "message" => "Correo o contraseña incorrectos."
    ]);

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error en la consulta SQL: " . $e->getMessage()
    ]);
}
?>