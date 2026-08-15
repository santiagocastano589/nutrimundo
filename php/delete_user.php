<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

    $id = intval($_POST['id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(["status" => "error", "message" => "ID de usuario inválido."]);
        exit();
    }

    $stmt = $conexion->prepare("DELETE FROM usuario WHERE id_usuario = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Usuario eliminado correctamente."]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se encontró el usuario a eliminar."]);
    }

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error al eliminar: " . $e->getMessage()
    ]);
}
?>