document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // 1. SEGURIDAD: VERIFICAR QUE SEA ADMINISTRADOR
  // =========================================================
  const rol = sessionStorage.getItem("usuario_rol");
  const nombreAdmin = sessionStorage.getItem("usuario_nombre") || "Admin";

  if (rol !== "admin") {
    alert("Acceso restringido. Debes iniciar sesión como Administrador.");
    window.location.href = "login.html"; // o acceder.html
    return;
  }

  // Colocar el nombre del admin en la barra superior
  const nombreAdminEl = document.getElementById("nombreAdmin");
  if (nombreAdminEl) nombreAdminEl.textContent = nombreAdmin;

  // =========================================================
  // 2. REFERENCIAS AL DOM
  // =========================================================
  const usersTableBody = document.getElementById("usersTableBody");
  const searchInput = document.getElementById("searchInput");
  const btnClearSearch = document.getElementById("btnClearSearch");
  const filterRole = document.getElementById("filterRole");
  const filterPref = document.getElementById("filterPref");
  const btnRefresh = document.getElementById("btnRefresh");
  const refreshIcon = document.getElementById("refreshIcon");
  const btnLogout = document.getElementById("btnLogout");
  const showingCount = document.getElementById("showingCount");

  // KPIs
  const statTotalUsers = document.getElementById("statTotalUsers");
  const statClients = document.getElementById("statClients");
  const statAdmins = document.getElementById("statAdmins");
  const statTopPref = document.getElementById("statTopPref");

  // Modal
  const modalUserDetails = document.getElementById("modalUserDetails");
  const modalDetailsContent = document.getElementById("modalDetailsContent");
  const closeDetailModal = document.getElementById("closeDetailModal");
  const btnAceptarDetalle = document.getElementById("btnAceptarDetalle");

  let usuariosOriginales = [];

  // =========================================================
  // 3. CARGAR USUARIOS DESDE PHP / MYSQL
  // =========================================================
  async function cargarUsuarios() {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="loading-state">
          <i class="fa-solid fa-spinner fa-spin"></i> Cargando usuarios registrados...
        </td>
      </tr>
    `;

    if (refreshIcon) refreshIcon.classList.add("fa-spin");

    try {
      const response = await fetch("./php/get_users.php");
      
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: No se pudo cargar el listado.`);
      }

      const result = await response.json();

      if (result.status === "success") {
        usuariosOriginales = result.data || [];
        actualizarKPIs(usuariosOriginales);
        filtrarYRenderizar();
      } else {
        throw new Error(result.message || "Error al obtener usuarios.");
      }

    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <i class="fa-solid fa-triangle-exclamation" style="color: #d32f2f;"></i>
            <strong>${error.message}</strong>
            <p style="font-size: 0.8rem; margin-top: 0.3rem;">Verifica que XAMPP esté encendido y que exista 'php/get_usuarios.php'.</p>
          </td>
        </tr>
      `;
    } finally {
      if (refreshIcon) {
        setTimeout(() => refreshIcon.classList.remove("fa-spin"), 500);
      }
    }
  }

  // =========================================================
  // 4. ACTUALIZAR TARJETAS DE ESTADÍSTICAS (KPIS)
  // =========================================================
  function actualizarKPIs(lista) {
    const total = lista.length;
    const admins = lista.filter(u => (u.rol || "").toLowerCase() === "admin").length;
    const clientes = total - admins;

    if (statTotalUsers) statTotalUsers.textContent = total;
    if (statClients) statClients.textContent = clientes;
    if (statAdmins) statAdmins.textContent = admins;

    // Calcular preferencia más popular
    const conteoPref = {};
    lista.forEach(u => {
      if (u.preferencia) {
        conteoPref[u.preferencia] = (conteoPref[u.preferencia] || 0) + 1;
      }
    });

    let topPref = "-";
    let max = 0;
    for (const [pref, count] of Object.entries(conteoPref)) {
      if (count > max) {
        max = count;
        topPref = pref;
      }
    }
    if (statTopPref) statTopPref.textContent = topPref;
  }

  // =========================================================
  // 5. FILTRAR Y RENDERIZAR TABLA
  // =========================================================
  function filtrarYRenderizar() {
    const query = searchInput.value.trim().toLowerCase();
    const roleVal = filterRole.value.toLowerCase();
    const prefVal = filterPref.value;

    const filtrados = usuariosOriginales.filter(user => {
      // Búsqueda de texto
      const nombre = (user.nombre_apellidos || "").toLowerCase();
      const correo = (user.email || "").toLowerCase();
      const doc = (user.documento || "").toLowerCase();
      const tel = (user.telefono || "").toLowerCase();

      const matchSearch = nombre.includes(query) || correo.includes(query) || doc.includes(query) || tel.includes(query);

      // Filtro por Rol
      const userRol = (user.rol || "usuario").toLowerCase();
      const matchRole = roleVal === "all" || userRol === roleVal;

      // Filtro por Preferencia
      const matchPref = prefVal === "all" || user.preferencia === prefVal;

      return matchSearch && matchRole && matchPref;
    });

    renderizarTabla(filtrados);
  }

  function getPrefClass(pref) {
    if (!pref) return "";
    const p = pref.toLowerCase();
    if (p.includes("vege")) return "veg";
    if (p.includes("típic") || p.includes("tipic")) return "tipico";
    if (p.includes("repost") || p.includes("postre")) return "reposteria";
    if (p.includes("gourmet") || p.includes("internac")) return "gourmet";
    if (p.includes("fit") || p.includes("balance")) return "fit";
    return "";
  }

  function renderizarTabla(lista) {
    if (lista.length === 0) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <i class="fa-solid fa-user-slash"></i>
            <strong>No se encontraron usuarios</strong>
            <p style="font-size: 0.8rem;">Prueba modificando los filtros de búsqueda.</p>
          </td>
        </tr>
      `;
      if (showingCount) showingCount.textContent = "Mostrando 0 usuarios";
      return;
    }

    usersTableBody.innerHTML = lista.map(user => {
      const inicial = (user.nombre_apellidos || "U").charAt(0).toUpperCase();
      const rolUser = (user.rol || "usuario").toLowerCase();
      const badgeRol = rolUser === "admin"
        ? `<span class="badge-role admin"><i class="fa-solid fa-shield-halved"></i> Admin</span>`
        : `<span class="badge-role usuario"><i class="fa-solid fa-user"></i> Cliente</span>`;

      const prefClass = getPrefClass(user.preferencia);
      const badgePref = user.preferencia
        ? `<span class="badge-pref ${prefClass}"><i class="fa-solid fa-utensils"></i> ${user.preferencia}</span>`
        : `<span style="color: #9e9e9e;">No definida</span>`;

      return `
        <tr>
          <td><strong>#${user.id_usuario}</strong></td>
          <td>
            <div class="user-cell">
              <div class="user-avatar">${inicial}</div>
              <div class="user-info-text">
                <span class="user-name">${user.nombre_apellidos || 'Sin nombre'}</span>
                <span class="user-email">${user.email || ''}</span>
              </div>
            </div>
          </td>
          <td>
            <strong>${user.tipo_documento || 'CC'}:</strong> ${user.documento || 'N/A'}
          </td>
          <td>
            <div class="contact-cell">
              <span><i class="fa-solid fa-phone"></i> ${user.telefono || 'Sin tel.'}</span>
              <span><i class="fa-solid fa-location-dot"></i> ${user.direccion || 'Sin dir.'}</span>
            </div>
          </td>
          <td>${badgePref}</td>
          <td>${badgeRol}</td>
          <td>
            <div class="action-buttons">
              <button type="button" class="btn-action view" onclick="verDetallesUsuario(${user.id_usuario})" title="Ver Ficha Completa">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button type="button" class="btn-action delete" onclick="eliminarUsuario(${user.id_usuario}, '${user.nombre_apellidos}')" title="Eliminar Usuario">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    if (showingCount) {
      showingCount.textContent = `Mostrando ${lista.length} de ${usuariosOriginales.length} usuarios registrados`;
    }
  }

  // =========================================================
  // 6. DETALLES Y MODAL
  // =========================================================
  window.verDetallesUsuario = function (id_usuario) {
    const user = usuariosOriginales.find(u => u.id_usuario == id_usuario);
    if (!user) return;

    modalDetailsContent.innerHTML = `
      <div class="detail-row"><span class="detail-key">ID:</span><span class="detail-val">#${user.id_usuario}</span></div>
      <div class="detail-row"><span class="detail-key">DOCUMENTO:</span><span class="detail-val">${user.tipo_documento || 'CC'} - ${user.documento || 'N/A'}</span></div>
      <div class="detail-row"><span class="detail-key">NOMBRE:</span><span class="detail-val">${user.nombre_apellidos}</span></div>
      <div class="detail-row"><span class="detail-key">CORREO:</span><span class="detail-val">${user.email}</span></div>
      <div class="detail-row"><span class="detail-key">TELÉFONO:</span><span class="detail-val">${user.telefono || 'N/A'}</span></div>
      <div class="detail-row"><span class="detail-key">DIRECCIÓN:</span><span class="detail-val">${user.direccion || 'N/A'}</span></div>
      <div class="detail-row"><span class="detail-key">PREFERENCIA:</span><span class="detail-val">${user.preferencia || 'N/A'}</span></div>
      <div class="detail-row"><span class="detail-key">ROL:</span><span class="detail-val" style="text-transform: uppercase; font-weight: 700; color: #476a21;">${user.rol || 'usuario'}</span></div>
      <div class="detail-row"><span class="detail-key">FECHA REGISTRO:</span><span class="detail-val">${user.fecha_registro || 'Reciente'}</span></div>
    `;

    modalUserDetails.classList.add("show");
  };

  // =========================================================
  // 7. ELIMINAR USUARIO
  // =========================================================
  window.eliminarUsuario = async function (id_usuario, nombre) {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}" (ID: ${id_usuario})? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", id_usuario);

      const response = await fetch("./php/delete_user.php", {
        method: "POST",
        body: formData
      });

      const res = await response.json();

      if (res.status === "success") {
        alert("Usuario eliminado correctamente.");
        cargarUsuarios(); // Recargar lista
      } else {
        alert("Error: " + res.message);
      }
    } catch (err) {
      alert("No se pudo eliminar el usuario: " + err.message);
    }
  };

  // Cerrar Modal
  function cerrarModalDetalles() {
    modalUserDetails.classList.remove("show");
  }
  if (closeDetailModal) closeDetailModal.addEventListener("click", cerrarModalDetalles);
  if (btnAceptarDetalle) btnAceptarDetalle.addEventListener("click", cerrarModalDetalles);
  if (modalUserDetails) {
    modalUserDetails.addEventListener("click", (e) => {
      if (e.target === modalUserDetails) cerrarModalDetalles();
    });
  }

  // =========================================================
  // 8. EVENTOS DE BÚSQUEDA Y FILTROS
  // =========================================================
  searchInput.addEventListener("input", () => {
    btnClearSearch.style.display = searchInput.value.length > 0 ? "block" : "none";
    filtrarYRenderizar();
  });

  btnClearSearch.addEventListener("click", () => {
    searchInput.value = "";
    btnClearSearch.style.display = "none";
    filtrarYRenderizar();
  });

  filterRole.addEventListener("change", filtrarYRenderizar);
  filterPref.addEventListener("change", filtrarYRenderizar);
  btnRefresh.addEventListener("click", cargarUsuarios);

  // =========================================================
  // 9. CERRAR SESIÓN (LOGOUT)
  // =========================================================
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
  cargarUsuarios();
});







document.addEventListener("DOMContentLoaded", () => {

  // 1. Verificación de Seguridad Admin
  const rol = sessionStorage.getItem("usuario_rol");
  const nombreAdmin = sessionStorage.getItem("usuario_nombre") || "Admin";

  if (rol !== "admin") {
    alert("Acceso restringido: Debes iniciar sesión como Administrador.");
    window.location.replace("login.html");
    return;
  }

  const nombreAdminEl = document.getElementById("nombreAdmin");
  if (nombreAdminEl) nombreAdminEl.textContent = nombreAdmin;

  // 2. Control de Pestañas
  const tabBtns = document.querySelectorAll(".admin-tab-btn");
  const tabPanes = document.querySelectorAll(".admin-tab-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPane = document.getElementById(btn.dataset.tab);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // =========================================================
  // 3. GESTIÓN DE PLATILLOS (CRUD)
  // =========================================================
  let platillosList = [];
  const dishesTableBody = document.getElementById("dishesTableBody");
  const searchDishInput = document.getElementById("searchDishInput");
  const filterDishCategory = document.getElementById("filterDishCategory");
  const dishesCount = document.getElementById("dishesCount");

  // Modal Platillo
  const modalDishForm = document.getElementById("modalDishForm");
  const btnOpenCreateDish = document.getElementById("btnOpenCreateDish");
  const btnCloseDishModal = document.getElementById("btnCloseDishModal");
  const formDish = document.getElementById("formDish");
  const modalDishTitle = document.getElementById("modalDishTitle");
  const dishIdInput = document.getElementById("dish_id");

  async function cargarPlatillos() {
    dishesTableBody.innerHTML = `<tr><td colspan="6" class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Cargando platillos...</td></tr>`;

    try {
      const response = await fetch("./php/get_platillos.php");
      const result = await response.json();

      if (result.status === "success") {
        platillosList = result.data || [];
        filtrarYRenderizarPlatillos();
      }
    } catch (e) {
      console.error(e);
      dishesTableBody.innerHTML = `<tr><td colspan="6" class="empty-state">Error al cargar platillos.</td></tr>`;
    }
  }

  function filtrarYRenderizarPlatillos() {
    const q = searchDishInput.value.trim().toLowerCase();
    const cat = filterDishCategory.value;

    const filtrados = platillosList.filter(d => {
      const matchText = d.nombre.toLowerCase().includes(q) || (d.desc && d.desc.toLowerCase().includes(q));
      const matchCat = cat === "all" || d.categoria === cat;
      return matchText && matchCat;
    });

    if (filtrados.length === 0) {
      dishesTableBody.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fa-solid fa-bowl-food"></i><strong>No se encontraron platillos</strong></td></tr>`;
      dishesCount.textContent = "0 platillos encontrados";
      return;
    }

    dishesTableBody.innerHTML = filtrados.map(d => `
      <tr>
        <td><img src="${d.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'}" class="table-dish-img" alt="${d.nombre}"></td>
        <td>
          <strong>${d.nombre}</strong>
          <p style="font-size: 0.75rem; color: #6b7c58; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${d.desc}</p>
        </td>
        <td><span class="badge-role usuario">${d.categoria}</span></td>
        <td><strong style="color: #476a21;">$${Number(d.precio).toLocaleString('es-CO')}</strong></td>
        <td><span class="badge-pref fit">${d.tag || 'Saludable'}</span></td>
        <td>
          <div class="action-buttons">
            <button type="button" class="btn-action edit" onclick="abrirEditarPlatillo(${d.id})" title="Editar Platillo">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action delete" onclick="eliminarPlatillo(${d.id}, '${d.nombre}')" title="Eliminar Platillo">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    dishesCount.textContent = `Mostrando ${filtrados.length} de ${platillosList.length} platillos`;
  }

  searchDishInput.addEventListener("input", filtrarYRenderizarPlatillos);
  filterDishCategory.addEventListener("change", filtrarYRenderizarPlatillos);

  // Abrir Modal Crear
  btnOpenCreateDish.addEventListener("click", () => {
    formDish.reset();
    dishIdInput.value = "";
    modalDishTitle.textContent = "Nuevo Platillo Gastronómico";
    modalDishForm.classList.add("show");
  });

  // Abrir Modal Editar
  window.abrirEditarPlatillo = function (id) {
    const dish = platillosList.find(d => d.id == id);
    if (!dish) return;

    dishIdInput.value = dish.id;
    document.getElementById("dish_nombre").value = dish.nombre;
    document.getElementById("dish_categoria").value = dish.categoria;
    document.getElementById("dish_precio").value = dish.precio;
    document.getElementById("dish_tag").value = dish.tag || "";
    document.getElementById("dish_img").value = dish.img || "";
    document.getElementById("dish_desc").value = dish.desc || "";

    modalDishTitle.textContent = "Editar Platillo #" + dish.id;
    modalDishForm.classList.add("show");
  };

  btnCloseDishModal.addEventListener("click", () => {
    modalDishForm.classList.remove("show");
  });

  // Guardar Platillo (Crear o Editar)
  formDish.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btnSave = document.getElementById("btnSaveDish");
    btnSave.disabled = true;
    btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

    const formData = new FormData(formDish);

    try {
      const response = await fetch("./php/guardar_platillo.php", {
        method: "POST",
        body: formData
      });

      const res = await response.json();

      if (res.status === "success") {
        alert(res.message);
        modalDishForm.classList.remove("show");
        cargarPlatillos();
      } else {
        alert("Error: " + res.message);
      }
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      btnSave.disabled = false;
      btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Platillo';
    }
  });

  // Eliminar Platillo
  window.eliminarPlatillo = async function (id, nombre) {
    if (!confirm(`¿Eliminar el platillo "${nombre}"? Esta acción lo retirará del menú de clientes.`)) return;

    try {
      const fd = new FormData();
      fd.append("id", id);

      const res = await (await fetch("./php/eliminar_platillo.php", { method: "POST", body: fd })).json();

      if (res.status === "success") {
        alert("Platillo eliminado.");
        cargarPlatillos();
      } else {
        alert("Error: " + res.message);
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // =========================================================
  // 4. DIRECTORIO DE USUARIOS
  // =========================================================
  let usuariosOriginales = [];
  const usersTableBody = document.getElementById("usersTableBody");
  const searchInput = document.getElementById("searchInput");
  const filterRole = document.getElementById("filterRole");
  const btnRefreshUsers = document.getElementById("btnRefreshUsers");

  async function cargarUsuarios() {
    try {
      const response = await fetch("./php/get_usuarios.php");
      const result = await response.json();

      if (result.status === "success") {
        usuariosOriginales = result.data || [];
        actualizarKPIsUsuarios(usuariosOriginales);
        filtrarYRenderizarUsuarios();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function actualizarKPIsUsuarios(lista) {
    const total = lista.length;
    const admins = lista.filter(u => (u.rol || "").toLowerCase() === "admin").length;
    document.getElementById("statTotalUsers").textContent = total;
    document.getElementById("statClients").textContent = total - admins;
    document.getElementById("statAdmins").textContent = admins;
  }

  function filtrarYRenderizarUsuarios() {
    const query = searchInput.value.trim().toLowerCase();
    const roleVal = filterRole.value.toLowerCase();

    const filtrados = usuariosOriginales.filter(u => {
      const nombre = (u.nombre_apellidos || "").toLowerCase();
      const correo = (u.correo || "").toLowerCase();
      const matchSearch = nombre.includes(query) || correo.includes(query);
      const matchRole = roleVal === "all" || (u.rol || "").toLowerCase() === roleVal;
      return matchSearch && matchRole;
    });

    usersTableBody.innerHTML = filtrados.map(user => `
      <tr>
        <td><strong>#${user.id}</strong></td>
        <td><strong>${user.nombre_apellidos}</strong><br><span style="font-size:0.75rem; color:#6b7c58;">${user.correo}</span></td>
        <td>${user.tipo_documento || 'CC'} - ${user.documento}</td>
        <td>${user.telefono || 'Sin tel.'}</td>
        <td><span class="badge-pref fit">${user.preferencia || 'General'}</span></td>
        <td><span class="badge-role ${user.rol}">${user.rol}</span></td>
        <td style="text-align: center;">
          <button type="button" class="btn-action delete" onclick="eliminarUsuario(${user.id}, '${user.nombre_apellidos}')"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join("");

    document.getElementById("showingCount").textContent = `Mostrando ${filtrados.length} usuarios`;
  }

  searchInput.addEventListener("input", filtrarYRenderizarUsuarios);
  filterRole.addEventListener("change", filtrarYRenderizarUsuarios);
  btnRefreshUsers.addEventListener("click", cargarUsuarios);

  window.eliminarUsuario = async function (id, nombre) {
    if (!confirm(`¿Eliminar al usuario "${nombre}"?`)) return;
    const fd = new FormData();
    fd.append("id", id);
    const res = await (await fetch("./php/eliminar_usuario.php", { method: "POST", body: fd })).json();
    if (res.status === "success") cargarUsuarios();
  };

  // 5. Cerrar Sesión
  document.getElementById("btnLogout").addEventListener("click", async () => {
    if (confirm("¿Cerrar sesión de administrador?")) {
      try { await fetch("./php/logout.php"); } catch (e) {}
      sessionStorage.clear();
      window.location.replace("login.html");
    }
  });

  // Inicializar
  cargarPlatillos();
  cargarUsuarios();
});