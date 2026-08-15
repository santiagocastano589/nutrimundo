document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  // 1. Filtrar al hacer clic en los botones de categoría
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Cambiar botón activo visualmente
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      ejecutarFiltro();
    });
  });

  // 2. Filtrar en tiempo real al escribir en el buscador
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      ejecutarFiltro();
    });
  }

  // Función principal de filtrado
  function ejecutarFiltro() {
    const btnActivo = document.querySelector('.filter-btn.active');
    const categoriaSeleccionada = btnActivo ? btnActivo.getAttribute('data-category') : 'todos';
    const textoBusqueda = searchInput ? searchInput.value.toLowerCase().trim() : '';

    productCards.forEach(card => {
      const categoriaProducto = card.getAttribute('data-category');
      const contenidoTexto = card.textContent.toLowerCase();

      // Comprobar si coincide la categoría
      const coincideCategoria = (categoriaSeleccionada === 'todos' || categoriaProducto === categoriaSeleccionada);

      // Comprobar si coincide la búsqueda por texto
      const coincideBusqueda = (textoBusqueda === '' || contenidoTexto.includes(textoBusqueda));

      // Mostrar u ocultar la tarjeta según los filtros
      if (coincideCategoria && coincideBusqueda) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
});