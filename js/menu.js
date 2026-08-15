document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // 1. BASE DE DATOS DE PLATILLOS GASTRONÓMICOS
  // =========================================================
  const PLATILLOS = [
    {
      id: 1,
      nombre: "Bowl de Salmón & Quinoa Silvestre",
      categoria: "Fitness",
      desc: "Salmón a la plancha, quinoa orgánica, aguacate hass, espinaca baby y vinagreta cítrica.",
      precio: 28500,
      tag: "🥗 Alto en Proteína",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      nombre: "Bandeja Típica Campesina Nutrimundo",
      categoria: "Tipico",
      desc: "Corte magro de res, frijoles desgrasados, arroz integral, plátano asado y huevo pochado.",
      precio: 32000,
      tag: "🍲 Tradicional",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      nombre: "Lasaña de Berenjena & Zucchini Vegana",
      categoria: "Vegano",
      desc: "Láminas de berenjena, salsa pomodoro casera, queso de almendras y albahaca fresca.",
      precio: 24000,
      tag: "🌱 100% Vegano",
      img: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      nombre: "Lomo Fino al Romero con Risotto de Setas",
      categoria: "Gourmet",
      desc: "Medallón de lomo fino en reducción de vino tinto, risotto cremoso con champiñones portobello.",
      precio: 36500,
      tag: "🥩 Especialidad Chef",
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      nombre: "Cheesecake Horneado de Frutos Rojos",
      categoria: "Reposteria",
      desc: "Base de avena y almendras, queso crema light, endulzado con stevia y compota de moras silvestres.",
      precio: 14500,
      tag: "🍰 Sin Azúcar Añadida",
      img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      nombre: "Pechuga Grillé en Salsa de Maracuyá",
      categoria: "Fitness",
      desc: "Pechuga marinada en finas hierbas, puré de camote amarillo y vegetales al vapor.",
      precio: 26000,
      tag: "🥗 Bajo en Grasa",
      img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 7,
      nombre: "Tacos Veganos de Champiñones al Pastor",
      categoria: "Vegano",
      desc: "Tortillas de maíz nixtamalizado, setas marinadas en achiote, piña asada y cilantro fresco.",
      precio: 22000,
      tag: "🌱 Vegano Gourmet",
      img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 8,
      nombre: "Ceviche Mixto Peruano con Camote Glaseado",
      categoria: "Gourmet",
      desc: "Pescado blanco y camarones marinados en leche de tigre, maíz chulpe y cebolla morada.",
      precio: 34000,
      tag: "🥩 Internacional",
      img: "https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const COSTO_ENVIO = 5000; // COP

  // =========================================================
  // 2. ESTADO DEL CARRITO (PERSISTENCIA LOCALSTORAGE)
  // =========================================================
  let carrito = JSON.parse(localStorage.getItem("nutrimundo_cart")) || [];

  // =========================================================
  // 3. REFERENCIAS AL DOM
  // =========================================================
  const dishesGrid = document.getElementById("dishesGrid");
  const menuSearch = document.getElementById("menuSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  
  // Carrito Drawer
  const btnOpenCart = document.getElementById("btnOpenCart");
  const btnCloseCart = document.getElementById("btnCloseCart");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartCountBadge = document.getElementById("cartCountBadge");
  const cartDrawerItemsCount = document.getElementById("cartDrawerItemsCount");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartTotal = document.getElementById("cartTotal");
  const btnProceedCheckout = document.getElementById("btnProceedCheckout");
  const btnClearCart = document.getElementById("btnClearCart");

  // Modales
  const modalCheckout = document.getElementById("modalCheckout");
  const btnCloseCheckout = document.getElementById("btnCloseCheckout");
  const formCheckout = document.getElementById("formCheckout");
  const checkoutTotalAmount = document.getElementById("checkoutTotalAmount");
  const modalOrderSuccess = document.getElementById("modalOrderSuccess");
  const orderReceipt = document.getElementById("orderReceipt");
  const btnAcceptSuccess = document.getElementById("btnAcceptSuccess");
  const btnLogout = document.getElementById("btnLogout");

  // =========================================================
  // 4. RENDERIZAR PLATILLOS
  // =========================================================
  function renderDishes(lista) {
    if (lista.length === 0) {
      dishesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #6b7c58;">
          <i class="fa-solid fa-utensils" style="font-size: 2.5rem; margin-bottom: 0.5rem; display: block; opacity: 0.4;"></i>
          <strong>No encontramos platillos con ese filtro</strong>
        </div>
      `;
      return;
    }

    dishesGrid.innerHTML = lista.map(dish => `
      <article class="dish-card">
        <div class="dish-img-wrapper">
          <img src="${dish.img}" alt="${dish.nombre}" class="dish-img" loading="lazy">
          <span class="dish-tag">${dish.tag}</span>
        </div>
        <div class="dish-content">
          <h3 class="dish-title">${dish.nombre}</h3>
          <p class="dish-desc">${dish.desc}</p>
          <div class="dish-footer">
            <span class="dish-price">$${dish.precio.toLocaleString('es-CO')}</span>
            <button type="button" class="btn-add-cart" onclick="agregarAlCarrito(${dish.id})">
              <i class="fa-solid fa-plus"></i>
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </article>
    `).join("");
  }

  // =========================================================
  // 5. FUNCIONES DEL CARRITO
  // =========================================================
  window.agregarAlCarrito = function (id) {
    const dish = PLATILLOS.find(d => d.id === id);
    if (!dish) return;

    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
      itemEnCarrito.cantidad++;
    } else {
      carrito.push({
        id: dish.id,
        nombre: dish.nombre,
        precio: dish.precio,
        img: dish.img,
        cantidad: 1
      });
    }

    guardarYActualizarCarrito();
    abrirCarrito();
  };

  window.modificarCantidad = function (id, delta) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;

    item.cantidad += delta;
    if (item.cantidad <= 0) {
      carrito = carrito.filter(i => i.id !== id);
    }

    guardarYActualizarCarrito();
  };

  window.eliminarItem = function (id) {
    carrito = carrito.filter(i => i.id !== id);
    guardarYActualizarCarrito();
  };

  function guardarYActualizarCarrito() {
    localStorage.setItem("nutrimundo_cart", JSON.stringify(carrito));
    renderCarrito();
  }

  function renderCarrito() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const total = subtotal > 0 ? subtotal + COSTO_ENVIO : 0;

    cartCountBadge.textContent = totalItems;
    cartDrawerItemsCount.textContent = `(${totalItems} platillos)`;

    if (carrito.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-cart-arrow-down"></i>
          <p><strong>Tu carrito está vacío</strong></p>
          <span style="font-size: 0.8rem;">Agrega platillos deliciosos desde nuestro menú.</span>
        </div>
      `;
      btnProceedCheckout.disabled = true;
      cartSubtotal.textContent = "$0 COP";
      cartTotal.textContent = "$0 COP";
      return;
    }

    btnProceedCheckout.disabled = false;
    cartSubtotal.textContent = `$${subtotal.toLocaleString('es-CO')} COP`;
    cartTotal.textContent = `$${total.toLocaleString('es-CO')} COP`;

    cartItemsContainer.innerHTML = carrito.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.nombre}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.nombre}</h4>
          <span class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString('es-CO')} COP</span>
          <div class="cart-qty-control">
            <button type="button" class="btn-qty" onclick="modificarCantidad(${item.id}, -1)">-</button>
            <span class="qty-val">${item.cantidad}</span>
            <button type="button" class="btn-qty" onclick="modificarCantidad(${item.id}, 1)">+</button>
          </div>
        </div>
        <button type="button" class="btn-remove-item" onclick="eliminarItem(${item.id})" title="Eliminar">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `).join("");
  }

  // =========================================================
  // 6. CONTROL DEL DRAWER DEL CARRITO
  // =========================================================
  function abrirCarrito() {
    cartOverlay.classList.add("show");
  }

  function cerrarCarrito() {
    cartOverlay.classList.remove("show");
  }

  btnOpenCart.addEventListener("click", abrirCarrito);
  btnCloseCart.addEventListener("click", cerrarCarrito);
  cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) cerrarCarrito();
  });

  btnClearCart.addEventListener("click", () => {
    if (confirm("¿Deseas vaciar todo el carrito?")) {
      carrito = [];
      guardarYActualizarCarrito();
    }
  });

  // =========================================================
  // 7. CHECKOUT Y FINALIZAR PEDIDO
  // =========================================================
  btnProceedCheckout.addEventListener("click", async () => {
    cerrarCarrito();

    // Precargar datos del usuario logueado
    try {
      const res = await fetch("./php/get_perfil.php");
      const data = await res.json();

      if (data.status === "success" && data.data) {
        document.getElementById("checkoutNombre").value = data.data.nombre_apellidos || "";
        document.getElementById("checkoutTelefono").value = data.data.telefono || "";
        document.getElementById("checkoutDireccion").value = data.data.direccion || "";
      }
    } catch (e) {
      console.warn("No se pudieron precargar datos automáticos:", e);
    }

    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    checkoutTotalAmount.textContent = `$${(subtotal + COSTO_ENVIO).toLocaleString('es-CO')} COP`;

    modalCheckout.classList.add("show");
  });

  btnCloseCheckout.addEventListener("click", () => {
    modalCheckout.classList.remove("show");
  });

  // Enviar Pedido
  formCheckout.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btnConfirm = document.getElementById("btnConfirmOrder");
    btnConfirm.disabled = true;
    btnConfirm.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando Pedido...';

    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const total = subtotal + COSTO_ENVIO;

    const datosOrden = {
      direccion: document.getElementById("checkoutDireccion").value,
      telefono: document.getElementById("checkoutTelefono").value,
      metodo_pago: document.getElementById("checkoutMetodoPago").value,
      notas: document.getElementById("checkoutNotas").value,
      items: carrito,
      subtotal: subtotal,
      envio: COSTO_ENVIO,
      total: total
    };

    try {
      const response = await fetch("./php/crear_pedido.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosOrden)
      });

      const res = await response.json();

      if (res.status === "success") {
        const orderId = res.pedido_id || "NM-" + Math.floor(1000 + Math.random() * 9000);

        // Mostrar recibo
        orderReceipt.innerHTML = `
          <div class="receipt-row"><strong>N° DE ORDEN:</strong><span>#${orderId}</span></div>
          <div class="receipt-row"><strong>ENTREGA EN:</strong><span>${datosOrden.direccion}</span></div>
          <div class="receipt-row"><strong>MÉTODO DE PAGO:</strong><span>${datosOrden.metodo_pago}</span></div>
          <div class="receipt-row"><strong>TOTAL PAGADO:</strong><span style="color: #476a21; font-weight: 800;">$${total.toLocaleString('es-CO')} COP</span></div>
          <div class="receipt-row"><strong>TIEMPO ESTIMADO:</strong><span>35 - 45 minutos</span></div>
        `;

        modalCheckout.classList.remove("show");
        modalOrderSuccess.classList.add("show");

        // Vaciar carrito
        carrito = [];
        guardarYActualizarCarrito();

      } else {
        alert("Error al procesar el pedido: " + res.message);
      }
    } catch (err) {
      alert("Error de conexión al guardar el pedido: " + err.message);
    } finally {
      btnConfirm.disabled = false;
      btnConfirm.innerHTML = '<i class="fa-solid fa-circle-check"></i> Confirmar y Realizar Pedido';
    }
  });

  btnAcceptSuccess.addEventListener("click", () => {
    modalOrderSuccess.classList.remove("show");
  });

  // =========================================================
  // 8. BÚSQUEDA Y FILTRADO DE PLATILLOS
  // =========================================================
  let categoriaActual = "all";

  function filtrarPlatillos() {
    const q = menuSearch.value.trim().toLowerCase();

    const filtrados = PLATILLOS.filter(dish => {
      const matchCat = categoriaActual === "all" || dish.categoria === categoriaActual;
      const matchText = dish.nombre.toLowerCase().includes(q) || dish.desc.toLowerCase().includes(q);
      return matchCat && matchText;
    });

    renderDishes(filtrados);
  }

  menuSearch.addEventListener("input", filtrarPlatillos);

  categoryFilter.querySelectorAll(".cat-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      categoryFilter.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      categoriaActual = pill.dataset.cat;
      filtrarPlatillos();
    });
  });

  // =========================================================
  // 9. CERRAR SESIÓN
  // =========================================================
  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      if (confirm("¿Deseas cerrar tu sesión?")) {
        try { await fetch("./php/logout.php"); } catch (e) {}
        sessionStorage.clear();
        window.location.replace("login.html");
      }
    });
  }

  // Inicialización
  renderDishes(PLATILLOS);
  renderCarrito();
});


  // Reemplazar la lista fija por la carga desde MySQL
  let PLATILLOS = [];

  async function cargarPlatillosDesdeBD() {
    try {
      const response = await fetch("./php/get_platillos.php");
      const result = await response.json();

      if (result.status === "success" && result.data.length > 0) {
        PLATILLOS = result.data.map(d => ({
          id: parseInt(d.id),
          nombre: d.nombre,
          categoria: d.categoria,
          desc: d.desc,
          precio: parseFloat(d.precio),
          tag: d.tag || "🥗 Saludable",
          img: d.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
        }));
      }
    } catch (e) {
      console.warn("Cargando platillos de respaldo local:", e);
    }
    renderDishes(PLATILLOS);
  }

  // Llamar al iniciar la página
  cargarPlatillosDesdeBD();