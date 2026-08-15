/**
 * NUTRIMUNDO - Auth Guard (Protección de Rutas por Rol)
 */
(function () {
  // 1. Ocultar el contenido inmediatamente mientras se valida la sesión
  const style = document.createElement("style");
  style.id = "auth-guard-style";
  style.innerHTML = "body { display: none !important; }";
  document.head.appendChild(style);

  // Función para mostrar el contenido si la autorización es válida
  function permitirAcceso() {
    const s = document.getElementById("auth-guard-style");
    if (s) s.remove();
  }

  // 2. Leer los requisitos de la página actual desde el atributo 'data-auth' del script
  const currentScript = document.currentScript || document.querySelector("script[data-auth]");
  const authTipo = currentScript ? currentScript.getAttribute("data-auth") : "auth"; 
  // Valores posibles de data-auth:
  // "admin"   -> Solo administradores
  // "usuario" -> Cualquier usuario logueado (admin o cliente)
  // "guest"   -> Solo visitantes NO logueados (para login y register)

  // 3. Consultar al backend en PHP
  fetch("./php/verificar_sesion.php")
    .then(res => res.json())
    .then(data => {
      const { autenticado, rol, nombre } = data;

      // Actualizar almacenamiento local para sincronización
      if (autenticado) {
        sessionStorage.setItem("usuario_rol", rol);
        sessionStorage.setItem("usuario_nombre", nombre);
      } else {
        sessionStorage.clear();
      }

      // ==========================================
      // CASO A: Páginas de Invitados (login / register)
      // ==========================================
      if (authTipo === "guest") {
        if (autenticado) {
          // Si ya inició sesión, redirigir a su panel correspondiente
          if (rol === "admin") {
            window.location.replace("admin.html");
          } else {
            window.location.replace("profile.html");
          }
          return;
        }
        permitirAcceso();
        return;
      }

      // ==========================================
      // CASO B: Requiere Sesión Iniciada
      // ==========================================
      if (!autenticado) {
        alert("⚠️ Acceso denegado: Debes iniciar sesión para ingresar.");
        window.location.replace("login.html");
        return;
      }

      // ==========================================
      // CASO C: Requiere Rol de ADMINISTRADOR
      // ==========================================
      if (authTipo === "admin") {
        if (rol !== "admin") {
          alert("⛔ Acceso restringido: No tienes permisos de Administrador.");
          window.location.replace("profile.html");
          return;
        }
      }

      // Si cumple todos los requisitos, se desbloquea la página
      permitirAcceso();
    })
    .catch(err => {
      console.error("Error validando permisos:", err);
      permitirAcceso(); // Permite acceso en caso de error de red para no bloquear la app
    });
})();