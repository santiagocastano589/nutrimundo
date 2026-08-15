<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["status" => "error", "message" => "Sesión no iniciada"]);
    exit();
}

$id = $_SESSION['usuario_id'];
$nombre = trim($_POST['nombre_apellidos'] ?? '');
$correo = trim($_POST['correo'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$direccion = trim($_POST['direccion'] ?? '');
$preferencia = trim($_POST['preferencia'] ?? '');

if (empty($nombre) || empty($correo) || empty($telefono) || empty($direccion)) {
    echo json_encode(["status" => "error", "message" => "Todos los campos obligatorios deben estar llenos."]);
    exit();
}

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

    // Verificar si el nuevo correo ya le pertenece a otro usuario
    $check = $conexion->prepare("SELECT id_usuario FROM usuario WHERE email = ? AND id_preferencia != ?");
    $check->bind_param("si", $correo, $id);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "El correo electrónico ya está registrado por otro usuario."]);
        exit();
    }
    $check->close();

    // Actualizar datos
    $stmt = $conexion->prepare("UPDATE usuario SET nombre_apellidos = ?, email = ?, telefono = ?, direccion = ?, preferencia = ? WHERE id_usuario = ?");
    $stmt->bind_param("sssssi", $nombre, $correo, $telefono, $direccion, $preferencia, $id);
    $stmt->execute();

    $_SESSION['usuario_nombre'] = $nombre;

    echo json_encode(["status" => "success", "message" => "Perfil actualizado correctamente."]);

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Error al actualizar: " . $e->getMessage()]);
}
?>