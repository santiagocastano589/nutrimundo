<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

if (!isset($_SESSION['usuario_rol']) || $_SESSION['usuario_rol'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso no autorizado."]);
    exit();
}

$id = intval($_POST['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(["status" => "error", "message" => "ID inválido."]);
    exit();
}

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

    $stmt = $conexion->prepare("DELETE FROM platillos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Platillo eliminado del menú."]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se encontró el platillo."]);
    }

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>