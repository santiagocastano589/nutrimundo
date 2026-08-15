<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexion = new mysqli("localhost", "root", "", "nutrimundo");
    $conexion->set_charset("utf8mb4");

    // 1. Crear tabla de platillos si no existe
    $conexion->query("CREATE TABLE IF NOT EXISTS platillos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        descripcion TEXT NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        tag VARCHAR(100) DEFAULT 'Saludable',
        img VARCHAR(500) DEFAULT '',
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 2. Si la tabla está vacía, insertar platillos iniciales de demostración
    $countRes = $conexion->query("SELECT COUNT(*) as total FROM platillos");
    if ($countRes->fetch_assoc()['total'] == 0) {
        $conexion->query("INSERT INTO platillos (nombre, categoria, descripcion, precio, tag, img) VALUES
        ('Bowl de Salmón & Quinoa Silvestre', 'Fitness', 'Salmón a la plancha, quinoa orgánica, aguacate hass, espinaca baby y vinagreta cítrica.', 28500, '🥗 Alto en Proteína', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'),
        ('Bandeja Típica Campesina', 'Tipico', 'Corte magro de res, frijoles desgrasados, arroz integral, plátano asado y huevo pochado.', 32000, '🍲 Tradicional', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600'),
        ('Lasaña de Berenjena Vegana', 'Vegano', 'Láminas de berenjena, salsa pomodoro casera, queso de almendras y albahaca fresca.', 24000, '🌱 100% Vegano', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600'),
        ('Lomo Fino con Risotto de Setas', 'Gourmet', 'Medallón de lomo fino en reducción de vino tinto y risotto cremoso.', 36500, '🥩 Especialidad Chef', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600')");
    }

    // 3. Consultar todos los platillos
    $resultado = $conexion->query("SELECT id_usuario, nombre, categoria, descripcion as `desc`, precio, tag, img FROM platillos ORDER BY id DESC");
    
    $platillos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $platillos[] = $fila;
    }

    echo json_encode([
        "status" => "success",
        "total" => count($platillos),
        "data" => $platillos
    ]);

    $conexion->close();

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>