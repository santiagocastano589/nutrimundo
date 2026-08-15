document.addEventListener("DOMContentLoaded", () => {
  // 1. Verificación básica de sesión
  const rol = sessionStorage.getItem("usuario_rol");
  if (!rol) {
    alert("Debes iniciar sesión para acceder a tu perfil.");
    window.location.href = "login.html"; // o acceder.html
    return;
  }

  // 2. Referencias al DOM
  const formProfile = document.getElementById("formUpdateProfile");
  const formPassword = document.getElementById("formUpdatePassword");
  const alertMessage = document.getElementById("alertMessage");
  const btnLogout = document.getElementById("btnLogout");

  // Elementos del perfil (Izquierda)
  const avatarInitial = document.getElementById("avatarInitial");
  const userDisplayName = document.getElementById("userDisplayName");
  const userDisplayEmail = document.getElementById("userDisplayEmail");
  const displayDoc = document.getElementById("displayDoc");
  const displayPref = document.getElementById("displayPref");
  const displayFecha = document.getElementById("displayFecha");

  // Inputs del formulario
  const tipoDocInput = document.getElementById("tipo_documento");
  const docInput = document.getElementById("documento");
  const nombreInput = document.getElementById("nombre_apellidos");
  const correoInput = document.getElementById("correo");
  const telInput = document.getElementById("telefono");
  const dirInput = document.getElementById("direccion");
  const prefInput = document.getElementById("preferencia");

  // Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Control de Tabs
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");
      ocultarAlerta();
    });
  });

  // 3. Cargar datos del perfil desde PHP
  async function cargarPerfil() {
    try {
      const response = await fetch("./php/get_profile.php");
      if (!response.ok) throw new Error("No se pudo conectar al servidor.");

      const result = await response.json();

      if (result.status === "success" && result.data) {
        const u = result.data;

        // Llenar vista previa
        avatarInitial.textContent = (u.nombre_apellidos || "U").charAt(0).toUpperCase();
        userDisplayName.textContent = u.nombre_apellidos || "Usuario";
        userDisplayEmail.textContent = u.correo || "";
        displayDoc.textContent = `${u.tipo_documento || 'CC'} ${u.documento || ''}`;
        displayPref.textContent = u.preferencia || "No seleccionada";
        displayFecha.textContent = u.fecha_registro ? u.fecha_registro.split(" ")[0] : "Cliente Activo";

        // Llenar inputs
        tipoDocInput.value = u.tipo_documento || "CC";
        docInput.value = u.documento || "";
        nombreInput.value = u.nombre_apellidos || "";
        correoInput.value = u.correo || "";
        telInput.value = u.telefono || "";
        dirInput.value = u.direccion || "";
        if (u.preferencia) prefInput.value = u.preferencia;

      } else {
        mostrarAlerta(result.message || "Error al cargar datos del perfil.", "error");
      }
    } catch (err) {
      console.error(err);
      mostrarAlerta("Error al cargar la información: " + err.message, "error");
    }
  }

  // 4. Guardar Actualización de Datos Personales
  formProfile.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;
    [nombreInput, correoInput, telInput, dirInput].forEach(inp => {
      const group = inp.closest(".form-group");
      if (!inp.checkValidity()) {
        valid = false;
        if (group) group.classList.add("has-error");
      } else {
        if (group) group.classList.remove("has-error");
      }
    });

    if (!valid) return;

    const btn = document.getElementById("btnGuardarPerfil");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

    const formData = new FormData(formProfile);

    try {
      const res = await fetch("./php/update_profile.php", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.status === "success") {
        mostrarAlerta("¡Tus datos han sido actualizados correctamente!", "success");
        // Actualizar sesión y datos en pantalla
        sessionStorage.setItem("usuario_nombre", nombreInput.value);
        cargarPerfil();
      } else {
        mostrarAlerta(data.message || "No se pudo actualizar el perfil.", "error");
      }
    } catch (err) {
      mostrarAlerta("Error al guardar cambios: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios';
    }
  });

  // 5. Guardar Cambio de Contraseña
  formPassword.addEventListener("submit", async (e) => {
    e.preventDefault();

    const passActual = document.getElementById("pass_actual");
    const passNueva = document.getElementById("pass_nueva");
    const passConf = document.getElementById("pass_confirmar");
    const errorPassConfirm = document.getElementById("errorPassConfirm");

    if (passNueva.value !== passConf.value) {
      errorPassConfirm.style.display = "flex";
      return;
    } else {
      errorPassConfirm.style.display = "none";
    }

    const btn = document.getElementById("btnGuardarPassword");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Actualizando...';

    const formData = new FormData(formPassword);

    try {
      const res = await fetch("./php/update_password.php", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.status === "success") {
        mostrarAlerta("¡Contraseña actualizada con éxito!", "success");
        formPassword.reset();
      } else {
        mostrarAlerta(data.message || "Error al cambiar la contraseña.", "error");
      }
    } catch (err) {
      mostrarAlerta("Error en la solicitud: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-shield-check"></i> Actualizar Contraseña';
    }
  });

  // Funciones de Alerta
  function mostrarAlerta(msg, tipo) {
    alertMessage.textContent = msg;
    alertMessage.className = `alert-box show ${tipo}`;
    alertMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function ocultarAlerta() {
    alertMessage.className = "alert-box";
    alertMessage.textContent = "";
  }

  // 6. Cerrar Sesión
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      try {
        await fetch("./php/logout.php");
      } catch (e) {
        console.error(e);
      }
      sessionStorage.clear();
      localStorage.removeItem("nutrimundo_correo");
      window.location.replace("login.html");
    }
  });
}

  // Carga inicial
  cargarPerfil();
});