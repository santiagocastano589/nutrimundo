<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

    // Seleccionamos todos los campos excepto la contraseña por seguridad
    $sql = "SELECT id_usuario, tipo_documento, documento, nombre_apellidos, telefono, email, direccion, preferencia, rol, fecha_registro FROM usuario ORDER BY id_usuario DESC";
    
    $resultado = $conexion->query($sql);

    $usuarios = [];
    while ($fila = $resultado->fetch_assoc()) {
        $usuarios[] = $fila;
    }

    echo json_encode([
        "status" => "success",
        "total" => count($usuarios),
        "data" => $usuarios
    ]);

    $conexion->close();

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error al consultar la base de datos: " . $e->getMessage()
    ]);
}
?>