<?php
// php/enviar_correo.php - Envío de Correo REAL vía Gmail SMTP
header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Cargar PHPMailer
require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
    exit;
}

$nombre   = trim($_POST['nombre'] ?? '');
$email    = trim($_POST['email'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$asunto   = trim($_POST['asunto'] ?? '');
$mensaje  = trim($_POST['mensaje'] ?? '');

if (empty($nombre) || empty($email) || empty($telefono) || empty($asunto) || empty($mensaje)) {
    echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios.']);
    exit;
}

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP de Gmail
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'juancarloscastanonavarrete356@gmail.com'; // Tu correo Gmail
    $mail->Password   = 'TU_CONTRASEÑA_DE_APLICACION'; // <-- Las 16 letras generadas en Google
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // Destinatarios
    $mail->setFrom('juancarloscastanonavarrete356@gmail.com', 'NutriMundo Web');
    $mail->addAddress('juancarloscastanonavarrete356@gmail.com', 'Juan Carlos Castaño'); // Tu correo que recibe
    $mail->addReplyTo($email, $nombre); // Para responderle directo al usuario

    // Contenido del Correo
    $mail->isHTML(true);
    $mail->Subject = '📩 Nuevo contacto: ' . $asunto;
    $mail->Body    = "
        <h2>Nuevo mensaje recibido desde FreshFood</h2>
        <p><strong>Nombre:</strong> {$nombre}</p>
        <p><strong>Correo:</strong> {$email}</p>
        <p><strong>Teléfono:</strong> {$telefono}</p>
        <p><strong>Asunto:</strong> {$asunto}</p>
        <hr>
        <p><strong>Mensaje:</strong><br>" . nl2br(htmlspecialchars($mensaje)) . "</p>
    ";

    $mail->send();

    echo json_encode([
        'status' => 'success',
        'message' => '¡Correo REAL enviado exitosamente a juancarloscastanonavarrete356@gmail.com!'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al enviar el correo: ' . $mail->ErrorInfo
    ]);
}
?>