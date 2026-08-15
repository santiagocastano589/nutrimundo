<?php
// php/register.php - Adaptado a la tabla 'usuario' de NutriMundo
ob_start();
header('Content-Type: application/json; charset=utf-8');

// Configurar zona horaria local
date_default_timezone_set('America/Bogota');

try {
    require_once __DIR__ . '/conexion.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
        exit;
    }

    // 1. Recibir datos del formulario
    $tipo_documento   = trim($_POST['tipo_documento'] ?? '');
    $documento        = trim($_POST['documento'] ?? '');
    $nombre_apellidos = trim($_POST['nombre_apellidos'] ?? '');
    $telefono         = trim($_POST['telefono'] ?? '');
    $email            = trim($_POST['email'] ?? '');
    $direccion        = trim($_POST['direccion'] ?? '');
    $preferencia      = trim($_POST['preferencia'] ?? '');
    $contrasena       = trim($_POST['contrasena'] ?? '');
    $fecha_registro   = date('Y-m-d'); // Formato DATE de tu BD: YYYY-MM-DD

    // 2. Validar campos requeridos
    if (empty($tipo_documento) || empty($documento) || empty($nombre_apellidos) || 
        empty($telefono) || empty($email) || empty($direccion) || 
        empty($preferencia) || empty($contrasena)) {
        echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios.']);
        exit;
    }

    // 3. Verificar si el documento o correo ya existen en la tabla 'usuario'
    $stmtCheck = $conexion->prepare("SELECT id_usuario FROM usuario WHERE documento = :documento OR email = :email LIMIT 1");
    $stmtCheck->execute([
        ':documento' => $documento,
        ':email'     => $email
    ]);

    if ($stmtCheck->rowCount() > 0) {
        echo json_encode(['status' => 'error', 'message' => 'El número de documento o correo electrónico ya se encuentra registrado.']);
        exit;
    }

    // 4. Encriptar la contraseña (compatible con varchar(120))
    $passwordHash = password_hash($contrasena, PASSWORD_BCRYPT);

    // 5. Insertar en la tabla 'usuario'
    $sql = "INSERT INTO usuario (tipo_documento, documento, nombre_apellidos, telefono, direccion, preferencia, fecha_registro, email, contrasena) 
            VALUES (:tipo_documento, :documento, :nombre_apellidos, :telefono, :direccion, :preferencia, :fecha_registro, :email, :contrasena)";
    
    $stmtInsert = $conexion->prepare($sql);
    $resultado = $stmtInsert->execute([
        ':tipo_documento'   => $tipo_documento,
        ':documento'        => $documento,
        ':nombre_apellidos' => $nombre_apellidos,
        ':telefono'         => $telefono,
        ':direccion'        => $direccion,
        ':preferencia'      => $preferencia,
        ':fecha_registro'   => $fecha_registro,
        ':email'            => $email,
        ':contrasena'       => $passwordHash
    ]);

    ob_end_clean();

    echo json_encode([
        'status' => 'success',
        'message' => '¡Usuario registrado exitosamente!',
        'data' => [
            'tipo_documento'   => $tipo_documento,
            'documento'        => $documento,
            'nombre_apellidos' => $nombre_apellidos,
            'telefono'         => $telefono,
            'email'            => $email,
            'direccion'        => $direccion,
            'preferencia'      => $preferencia
        ]
    ]);

} catch (Exception $e) {
    ob_end_clean();
    echo json_encode(['status' => 'error', 'message' => 'Error en base de datos: ' . $e->getMessage()]);
}
?>