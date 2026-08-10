document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTOS DEL LOGIN
    // ==========================================

    const formulario = document.getElementById("formAcceder");

    const correo = document.getElementById("correo");

    const contrasena = document.getElementById("contrasena");

    const recordar = document.getElementById("recordar");

    const mensaje = document.getElementById("mensaje");


    // ==========================================
    // ELEMENTOS DE RECUPERACIÓN
    // ==========================================

    const olvidaste = document.getElementById("olvidaste");

    const modal = document.getElementById("modalRecuperar");

    const cerrarModal = document.getElementById("cerrarModal");

    const formularioRecuperar =
        document.getElementById("formRecuperar");

    const correoRecuperar =
        document.getElementById("correoRecuperar");

    const mensajeRecuperar =
        document.getElementById("mensajeRecuperar");


    // ==========================================
    // CARGAR CORREO RECORDADO
    // ==========================================

    const correoGuardado =
        localStorage.getItem("nutrimundo_correo");

    if (correoGuardado) {

        correo.value = correoGuardado;

        recordar.checked = true;

    }


    // ==========================================
    // INICIAR SESIÓN
    // ==========================================

    formulario.addEventListener("submit", function (e) {

        e.preventDefault();


        const correoValor = correo.value.trim();

        const contrasenaValor = contrasena.value.trim();


        // Limpiar mensaje

        mensaje.textContent = "";

        mensaje.className = "mensaje";


        // ======================================
        // VALIDAR CORREO
        // ======================================

        if (correoValor === "") {

            mensaje.textContent =
                "Por favor, ingresa tu correo electrónico.";

            mensaje.classList.add("error");

            correo.focus();

            return;
        }


        // ======================================
        // VALIDAR CONTRASEÑA
        // ======================================

        if (contrasenaValor === "") {

            mensaje.textContent =
                "Por favor, ingresa tu contraseña.";

            mensaje.classList.add("error");

            contrasena.focus();

            return;
        }


        // ======================================
        // RECORDAR CORREO
        // ======================================

        if (recordar.checked) {

            localStorage.setItem(
                "nutrimundo_correo",
                correoValor
            );

        } else {

            localStorage.removeItem(
                "nutrimundo_correo"
            );

        }


        // ======================================
        // LOGIN
        // ======================================

        mensaje.textContent =
            "Inicio de sesión correcto.";

        mensaje.classList.add("exito");


        /*
         * AQUÍ POSTERIORMENTE PUEDES CONECTAR
         * EL LOGIN CON PHP Y MYSQL.
         *
         * Por ahora la interfaz funciona
         * correctamente en el navegador.
         */


        setTimeout(function () {

            // Puedes cambiar esta página
            // cuando tengas el sistema conectado.

            window.location.href = "index.html";

        }, 1200);

    });


    // ==========================================
    // ABRIR RECUPERACIÓN DE CONTRASEÑA
    // ==========================================

    olvidaste.addEventListener("click", function (e) {

        e.preventDefault();

        modal.classList.add("mostrar");

        mensajeRecuperar.textContent = "";

        correoRecuperar.value = correo.value;

        setTimeout(function () {

            correoRecuperar.focus();

        }, 200);

    });


    // ==========================================
    // CERRAR MODAL
    // ==========================================

    cerrarModal.addEventListener("click", function () {

        cerrarRecuperacion();

    });


    // ==========================================
    // CERRAR AL HACER CLIC AFUERA
    // ==========================================

    modal.addEventListener("click", function (e) {

        if (e.target === modal) {

            cerrarRecuperacion();

        }

    });


    // ==========================================
    // CERRAR CON ESC
    // ==========================================

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            if (modal.classList.contains("mostrar")) {

                cerrarRecuperacion();

            }

        }

    });


    // ==========================================
    // FUNCIÓN PARA CERRAR MODAL
    // ==========================================

    function cerrarRecuperacion() {

        modal.classList.remove("mostrar");

        formularioRecuperar.reset();

        mensajeRecuperar.textContent = "";

    }


    // ==========================================
    // RECUPERAR CONTRASEÑA
    // ==========================================

    formularioRecuperar.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const correoValor =
                correoRecuperar.value.trim();


            // ==================================
            // VALIDAR CORREO
            // ==================================

            if (correoValor === "") {

                mensajeRecuperar.textContent =
                    "Ingresa tu correo electrónico.";

                mensajeRecuperar.className =
                    "mensaje-recuperar error";

                correoRecuperar.focus();

                return;

            }


            // ==================================
            // VALIDAR FORMATO
            // ==================================

            if (!correoRecuperar.checkValidity()) {

                mensajeRecuperar.textContent =
                    "Ingresa un correo electrónico válido.";

                mensajeRecuperar.className =
                    "mensaje-recuperar error";

                correoRecuperar.focus();

                return;

            }


            // ==================================
            // MOSTRAR RESULTADO
            // ==================================

            mensajeRecuperar.textContent =
                "Solicitud enviada correctamente. Revisa tu correo para continuar.";

            mensajeRecuperar.className =
                "mensaje-recuperar exito";


            // ==================================
            // SIMULACIÓN DE ENVÍO
            // ==================================

            console.log(
                "Solicitud de recuperación para:",
                correoValor
            );


            /*
             * IMPORTANTE:
             *
             * Esto funciona en el frontend.
             *
             * Para enviar realmente un correo,
             * después conectaremos este formulario
             * con PHP y MySQL.
             */


            setTimeout(function () {

                correoRecuperar.value = "";

            }, 1000);

        }
    );

});