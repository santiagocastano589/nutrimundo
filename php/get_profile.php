<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["status" => "error", "message" => "Sesión no iniciada"]);
    exit();
}

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

    $id = $_SESSION['usuario_id'];
    $stmt = $conexion->prepare("SELECT id_usuario, tipo_documento, documento, nombre_apellidos, telefono, email, direccion, preferencia, rol, fecha_registro FROM usuario WHERE id_usuario = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($usuario = $resultado->fetch_assoc()) {
        echo json_encode([
            "status" => "success",
            "data" => $usuario
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    }

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>