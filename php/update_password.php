<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["status" => "error", "message" => "Sesión no iniciada"]);
    exit();
}

$id = $_SESSION['usuario_id'];
$pass_actual = trim($_POST['pass_actual'] ?? '');
$pass_nueva = trim($_POST['pass_nueva'] ?? '');

if (empty($pass_actual) || empty($pass_nueva)) {
    echo json_encode(["status" => "error", "message" => "Debes ingresar tu contraseña actual y la nueva."]);
    exit();
}

if (strlen($pass_nueva) < 8) {
    echo json_encode(["status" => "error", "message" => "La nueva contraseña debe tener mínimo 8 caracteres."]);
    exit();
}

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

    // Consultar contraseña actual en BD
    $stmt = $conexion->prepare("SELECT contrasena FROM usuario WHERE id_usuario = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($usuario = $res->fetch_assoc()) {
        $dbPass = $usuario['contrasena'];
        $valida = password_verify($pass_actual, $dbPass) || $pass_actual === $dbPass;

        if (!$valida) {
            echo json_encode(["status" => "error", "message" => "La contraseña actual es incorrecta."]);
            exit();
        }

        // Encriptar nueva contraseña
        $hashNuevo = password_hash($pass_nueva, PASSWORD_DEFAULT);
        $update = $conexion->prepare("UPDATE usuario SET contrasena = ? WHERE id_usuario = ?");
        $update->bind_param("si", $hashNuevo, $id);
        $update->execute();

        echo json_encode(["status" => "success", "message" => "Contraseña actualizada exitosamente."]);
        $update->close();
    }

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Error al actualizar contraseña: " . $e->getMessage()]);
}
?>