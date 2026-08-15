form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (isValid) {
    const formData = new FormData(form);

    try {
      const response = await fetch('./php/register.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Muestra el modal con los datos guardados
        successModal.classList.add('show');
        form.reset();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error de conexión con el servidor PHP.');
    }
  }
});