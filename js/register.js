document.addEventListener('DOMContentLoaded', () => {
  // 1. Obtención de referencias a los elementos del DOM
  const form = document.getElementById('registerForm');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('contrasena');
  const eyeIcon = document.getElementById('eyeIcon');
  const phoneInput = document.getElementById('telefono');
  const termsCheckbox = document.getElementById('terms');
  const termsError = document.getElementById('termsError');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalSummary = document.getElementById('modalSummary');
  const submitBtn = form.querySelector('.btn-submit');

  let countdownTimer = null; // Para controlar la cuenta regresiva

  // 2. Restringir el campo de teléfono a solo números en tiempo real
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // 3. Botón para Mostrar / Ocultar Contraseña
  if (togglePasswordBtn && passwordInput && eyeIcon) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeIcon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    });
  }

  // 4. Función para validar cada campo individualmente
  function validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;

    if (!input.checkValidity()) {
      group.classList.add('has-error');
      return false;
    } else {
      group.classList.remove('has-error');
      return true;
    }
  }

  // 5. Escuchar eventos de validación dinámica en los campos
  const inputs = form.querySelectorAll('input:not([type="checkbox"]), select');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-group') && input.closest('.form-group').classList.contains('has-error')) {
        validateField(input);
      }
    });
  });

  // Función para redirigir a Iniciar Sesión
  function irAIniciarSesion() {
    if (countdownTimer) clearInterval(countdownTimer);
    window.location.href = 'login.html'; // <-- Redirección
  }

  // 6. Manejador de envío del formulario a PHP / XAMPP
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    // Validar casilla de términos y políticas
    if (termsCheckbox && !termsCheckbox.checked) {
      if (termsError) termsError.style.display = 'flex';
      isValid = false;
    } else {
      if (termsError) termsError.style.display = 'none';
    }

    // Si la validación es correcta, enviamos los datos
    if (isValid) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Guardando...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

      const formData = new FormData(form);

      try {
        // Petición asíncrona al backend en PHP
        const response = await fetch('./php/register.php', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}: No se encontró 'register.php' o hubo un fallo en el servidor.`);
        }

        const result = await response.json();

        if (result.status === 'success') {
          // Llenar datos de resumen en el modal
          const data = result.data;
          modalSummary.innerHTML = `
            <div class="modal-summary-row"><span class="modal-summary-key">DOCUMENTO:</span><span class="modal-summary-val">${data.tipo_documento} - ${data.documento}</span></div>
            <div class="modal-summary-row"><span class="modal-summary-key">NOMBRE:</span><span class="modal-summary-val">${data.nombre_apellidos}</span></div>
            <div class="modal-summary-row"><span class="modal-summary-key">TELÉFONO:</span><span class="modal-summary-val">${data.telefono}</span></div>
            <div class="modal-summary-row"><span class="modal-summary-key">EMAIL:</span><span class="modal-summary-val">${data.email}</span></div>
            <div class="modal-summary-row"><span class="modal-summary-key">PREFERENCIA:</span><span class="modal-summary-val">${data.preferencia}</span></div>
          `;

          // Mostrar modal de éxito
          successModal.classList.add('show');
          form.reset();

          // Cuenta regresiva automática de 4 segundos
          let secondsLeft = 4;
          closeModalBtn.innerHTML = `Iniciar Sesión (${secondsLeft}s) <i class="fa-solid fa-arrow-right"></i>`;

          countdownTimer = setInterval(() => {
            secondsLeft--;
            if (secondsLeft > 0) {
              closeModalBtn.innerHTML = `Iniciar Sesión (${secondsLeft}s) <i class="fa-solid fa-arrow-right"></i>`;
            } else {
              irAIniciarSesion();
            }
          }, 1000);

        } else {
          alert('Atención: ' + result.message);
        }

      } catch (error) {
        console.error('Error durante el envío:', error);
        alert(error.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Completar Registro</span> <i class="fa-solid fa-arrow-right"></i>';
      }
    }
  });

  // 7. Evento para redirigir inmediatamente al hacer clic en el botón del modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', irAIniciarSesion);
  }
});