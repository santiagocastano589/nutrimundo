<?php

$host     = "localhost";
$usuario  = "root";     // Usuario por defecto en XAMPP
$password = "";         // Contraseña por defecto en XAMPP (vacía)
$db_name  = "nutrimundo";

try {
    $conexion = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $usuario, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    if (isset($conexion)) {
    echo "<div style='font-family: sans-serif; padding: 2rem; background: #e8efe0; border-radius: 10px; max-width: 500px; margin: 2rem auto; text-align: center;'>";
    echo "<h2 style='color: #5d8024;'>¡Conexión Exitosa a MySQL! 🎉</h2>";
    echo "<p style='color: #374b1c;'>Se estableció la conexión correctamente con la base de datos <strong>nutrimundo</strong> en XAMPP.</p>";
    echo "</div>";
}
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}



?>
