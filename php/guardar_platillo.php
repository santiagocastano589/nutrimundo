<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

if (!isset($_SESSION['usuario_rol']) || $_SESSION['usuario_rol'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso restringido: Solo administradores."]);
    exit();
}

$id = intval($_POST['dish_id'] ?? 0);
$nombre = trim($_POST['nombre'] ?? '');
$categoria = trim($_POST['categoria'] ?? '');
$precio = floatval($_POST['precio'] ?? 0);
$tag = trim($_POST['tag'] ?? 'Saludable');
$img = trim($_POST['img'] ?? '');
$desc = trim($_POST['desc'] ?? '');

if (empty($nombre) || empty($categoria) || $precio <= 0 || empty($desc)) {
    echo json_encode(["status" => "error", "message" => "Todos los campos obligatorios deben completarse."]);
    exit();
}

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

    if ($id > 0) {
        // ACTUALIZAR (EDITAR)
        $stmt = $conexion->prepare("UPDATE platillos SET nombre = ?, categoria = ?, precio = ?, tag = ?, img = ?, descripcion = ? WHERE id = ?");
        $stmt->bind_param("ssdsssi", $nombre, $categoria, $precio, $tag, $img, $desc, $id);
        $stmt->execute();
        $msg = "Platillo actualizado correctamente.";
    } else {
        // CREAR NUEVO
        $stmt = $conexion->prepare("INSERT INTO platillos (nombre, categoria, precio, tag, img, descripcion) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdsss", $nombre, $categoria, $precio, $tag, $img, $desc);
        $stmt->execute();
        $msg = "Nuevo platillo agregado al menú.";
    }

    echo json_encode(["status" => "success", "message" => $msg]);

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>