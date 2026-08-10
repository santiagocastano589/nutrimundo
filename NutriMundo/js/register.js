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
      if (input.closest('.form-group').classList.contains('has-error')) {
        validateField(input);
      }
    });
  });

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
      if (termsError) termsError.style.display = 'block';
      isValid = false;
    } else {
      if (termsError) termsError.style.display = 'none';
    }

    // Si la validación del navegador es correcta, enviamos los datos
    if (isValid) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'GUARDANDO...';

      const formData = new FormData(form);

      try {
        // Petición asíncrona al backend en PHP
        const response = await fetch('./php/register.php', {
          method: 'POST',
          body: formData
        });

        // Verificar si la respuesta fue un error HTTP (como 404 o 500)
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}: No se encontró el archivo 'register.php' en la carpeta de NutriMundo.`);
        }

        const result = await response.json();

        if (result.status === 'success') {
          // Llenar datos de resumen en la ventana modal de éxito
          const data = result.data;
          modalSummary.innerHTML = `
            <div class="modal-summary-row"><span class="modal-summary-key">TIPO DOC:</span><span>${data.tipo_documento}</span></div>
            <div class="modal-summary-row"><span class="modal-summary-key">DOCUMENTO:</span><span>${data.documento}</span></div>
            <div class="modal-summary-row"><span class="modal-summary-key">NOMBRE:</span><span>${data.nombre_apellidos}</span></div>
            <div class="modal-summary-row"><span class="modal-summary-key">TELÉFONO:</span><span>${data.telefono}</span></div>
            <div class="modal-summary-row"><span class="modal-summary-key">EMAIL:</span><span>${data.email}</span></div>
            <div class="modal-summary-row"><span class="modal-summary-key">PREFERENCIA:</span><span>${data.preferencia}</span></div>
          `;

          // Mostrar modal de éxito y limpiar formulario
          successModal.classList.add('show');
          form.reset();
        } else {
          alert('Atención: ' + result.message);
        }

      } catch (error) {
        console.error('Error durante el envío:', error);
        alert(error.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'COMPLETAR REGISTRO';
      }
    }
  });

  // 7. Evento para cerrar la ventana modal
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('show');
    });
  }
});