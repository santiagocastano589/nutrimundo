<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (isset($_SESSION['usuario_id']) && isset($_SESSION['usuario_rol'])) {
    echo json_encode([
        "autenticado" => true,
        "id" => $_SESSION['usuario_id'],
        "rol" => strtolower(trim($_SESSION['usuario_rol'])), // 'admin' o 'usuario'
        "nombre" => $_SESSION['usuario_nombre'] ?? 'Usuario'
    ]);
} else {
    echo json_encode([
        "autenticado" => false,
        "rol" => null,
        "nombre" => null
    ]);
}
?>