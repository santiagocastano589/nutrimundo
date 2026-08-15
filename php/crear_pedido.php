<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["status" => "error", "message" => "Debes iniciar sesión para realizar compras."]);
    exit();
}

// Leer datos JSON del cuerpo de la petición
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['items'])) {
    echo json_encode(["status" => "error", "message" => "El carrito de compras está vacío."]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$direccion = trim($input['direccion'] ?? '');
$telefono = trim($input['telefono'] ?? '');
$metodo_pago = trim($input['metodo_pago'] ?? 'Contra Entrega');
$notas = trim($input['notas'] ?? '');
$total = floatval($input['total'] ?? 0);
$items_json = json_encode($input['items'], JSON_UNESCAPED_UNICODE);

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

    // 1. Crear tabla de pedidos automáticamente si no existe
    $conexion->query("CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        direccion VARCHAR(255) NOT NULL,
        telefono VARCHAR(50) NOT NULL,
        metodo_pago VARCHAR(100) NOT NULL,
        notas TEXT,
        items TEXT NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        estado VARCHAR(50) DEFAULT 'En Preparación',
        fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 2. Insertar el nuevo pedido
    $stmt = $conexion->prepare("INSERT INTO pedidos (usuario_id, direccion, telefono, metodo_pago, notas, items, total) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssssd", $usuario_id, $direccion, $telefono, $metodo_pago, $notas, $items_json, $total);
    $stmt->execute();
    $pedido_id = $stmt->insert_id;

    echo json_encode([
        "status" => "success",
        "message" => "Pedido guardado con éxito.",
        "pedido_id" => "NM-" . str_pad($pedido_id, 4, "0", STR_PAD_LEFT)
    ]);

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error al guardar el pedido: " . $e->getMessage()
    ]);
}
?>