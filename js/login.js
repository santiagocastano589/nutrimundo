document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // ELEMENTOS DEL LOGIN
  // ==========================================
  const formulario = document.getElementById("formAcceder");
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const recordar = document.getElementById("recordar");
  const mensaje = document.getElementById("mensaje");
  const btnAcceder = document.getElementById("btnAcceder") || formulario.querySelector("button[type='submit']");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");

  // ==========================================
  // ELEMENTOS DE RECUPERACIÓN DE CONTRASEÑA
  // ==========================================
  const olvidaste = document.getElementById("olvidaste");
  const modal = document.getElementById("modalRecuperar");
  const cerrarModal = document.getElementById("cerrarModal");
  const formularioRecuperar = document.getElementById("formRecuperar");
  const correoRecuperar = document.getElementById("correoRecuperacion") || document.getElementById("correoRecuperar");
  const mensajeRecuperar = document.getElementById("mensajeRecuperacion") || document.getElementById("mensajeRecuperar");

  // ==========================================
  // 1. CARGAR CORREO RECORDADO
  // ==========================================
  const correoGuardado = localStorage.getItem("nutrimundo_correo");
  if (correoGuardado && correo) {
    correo.value = correoGuardado;
    if (recordar) recordar.checked = true;
  }

  // ==========================================
  // 2. MOSTRAR / OCULTAR CONTRASEÑA
  // ==========================================
  if (togglePasswordBtn && contrasena && eyeIcon) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPassword = contrasena.type === "password";
      contrasena.type = isPassword ? "text" : "password";
      eyeIcon.className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    });
  }

  // ==========================================
  // 3. ENVÍO DEL FORMULARIO CON DIAGNÓSTICO
  // ==========================================
  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Comprobación de protocolo (si abrió con doble clic)
    if (window.location.protocol === "file:") {
      mostrarMensaje("⚠️ Estás abriendo el archivo con doble clic. Debes ingresar desde: http://localhost/nutrimundo/login.html", "error");
      return;
    }

    const correoValor = correo.value.trim();
    const contrasenaValor = contrasena.value.trim();

    limpiarMensaje();

    if (correoValor === "") {
      mostrarMensaje("Por favor, ingresa tu correo electrónico.", "error");
      correo.focus();
      return;
    }

    if (contrasenaValor === "") {
      mostrarMensaje("Por favor, ingresa tu contraseña.", "error");
      contrasena.focus();
      return;
    }

    if (recordar && recordar.checked) {
      localStorage.setItem("nutrimundo_correo", correoValor);
    } else {
      localStorage.removeItem("nutrimundo_correo");
    }

    if (btnAcceder) {
      btnAcceder.disabled = true;
      btnAcceder.innerHTML = '<span>Verificando...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    }

    const formData = new FormData(formulario);

    try {
      const response = await fetch("./php/login.php", {
        method: "POST",
        body: formData
      });

      // Si el archivo no existe (404) o hay error fatal en PHP (500)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No se encontró el archivo './php/login.php'. Verifica que la carpeta 'php' exista.");
        } else {
          const errorText = await response.text();
          throw new Error(`Error en el servidor (${response.status}): ${errorText.substring(0, 100)}`);
        }
      }

      const result = await response.json();

      if (result.status === "success") {
        const rol = (result.rol || "").toLowerCase();
        const nombre = result.nombre || "Usuario";

        sessionStorage.setItem("usuario_rol", rol);
        sessionStorage.setItem("usuario_nombre", nombre);

        if (rol === "admin") {
          mostrarMensaje(`¡Bienvenido Administrador ${nombre}! Redirigiendo al panel...`, "exito");
          setTimeout(() => {
            window.location.href = "admin.html";
          }, 1400);
        } else {
          mostrarMensaje(`¡Inicio de sesión exitoso! Bienvenido ${nombre}. Redirigiendo...`, "exito");
          setTimeout(() => {
            window.location.href = "menu.html";
          }, 1400);
        }

      } else {
        mostrarMensaje(result.message || "Correo o contraseña incorrectos.", "error");
      }

    } catch (error) {
      console.error("Detalle del error:", error);
      mostrarMensaje(error.message, "error");
    } finally {
      if (btnAcceder) {
        btnAcceder.disabled = false;
        btnAcceder.innerHTML = '<span>Iniciar Sesión</span> <i class="fa-solid fa-arrow-right"></i>';
      }
    }
  });

  // ==========================================
  // FUNCIONES DE MENSAJE
  // ==========================================
  function mostrarMensaje(texto, tipo) {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo} show`;
  }

  function limpiarMensaje() {
    if (!mensaje) return;
    mensaje.textContent = "";
    mensaje.className = "mensaje";
  }

  // ==========================================
  // MODAL RECUPERACIÓN
  // ==========================================
  if (olvidaste && modal) {
    olvidaste.addEventListener("click", function (e) {
      e.preventDefault();
      modal.classList.add("show");
      if (mensajeRecuperar) mensajeRecuperar.textContent = "";
      if (correoRecuperar) {
        correoRecuperar.value = correo.value;
        setTimeout(() => correoRecuperar.focus(), 200);
      }
    });
  }

  if (cerrarModal && modal) cerrarModal.addEventListener("click", cerrarRecuperacion);

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) cerrarRecuperacion();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("show")) {
      cerrarRecuperacion();
    }
  });

  function cerrarRecuperacion() {
    if (!modal) return;
    modal.classList.remove("show");
    if (formularioRecuperar) formularioRecuperar.reset();
    if (mensajeRecuperar) {
      mensajeRecuperar.textContent = "";
      mensajeRecuperar.className = "mensaje";
    }
  }

  if (formularioRecuperar) {
    formularioRecuperar.addEventListener("submit", function (e) {
      e.preventDefault();
      if (mensajeRecuperar) {
        mensajeRecuperar.textContent = "Solicitud enviada. Revisa tu correo.";
        mensajeRecuperar.className = "mensaje exito show";
      }
      setTimeout(() => {
        if (correoRecuperar) correoRecuperar.value = "";
      }, 1200);
    });
  }

});