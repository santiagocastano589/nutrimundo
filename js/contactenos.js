document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const btnEnviar = document.getElementById('btnEnviar');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        btnEnviar.disabled = true;
        btnEnviar.innerText = 'ENVIANDO...';

        const formData = new FormData(contactForm);

        try {
            // Enviar correo REAL usando FormSubmit a tu Gmail
            const response = await fetch('https://formsubmit.co/ajax/juancarloscastanonavarrete356@gmail.com', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('¡Mensaje REAL enviado exitosamente a juancarloscastanonavarrete356@gmail.com!');
                contactForm.reset();
            } else {
                alert('Ocurrió un error al enviar el correo.');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión al enviar el correo.');
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.innerText = 'ENVIAR MENSAJE';
        }
    });
});