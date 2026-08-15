/* =========================================
   CAMBIAR INFORMACIÓN
========================================= */

function mostrarContenido(id) {

    // Obtener todos los paneles
    const paneles = document.querySelectorAll(
        ".contenido-panel"
    );


    // Ocultar todos los paneles
    paneles.forEach(function(panel) {

        panel.classList.remove("activo");

    });


    // Buscar el panel seleccionado
    const panelSeleccionado =
        document.getElementById(id);


    // Mostrar el panel
    if (panelSeleccionado) {

        panelSeleccionado.classList.add("activo");

    }

}


/* =========================================
   BUSCADOR
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const botonBuscar =
            document.getElementById("btnBuscar");

        const campoBusqueda =
            document.getElementById("busqueda");


        if (botonBuscar) {

            botonBuscar.addEventListener(
                "click",
                function() {

                    const texto =
                        campoBusqueda.value
                        .trim()
                        .toLowerCase();


                    if (texto === "") {

                        alert(
                            "Escribe algo para buscar."
                        );

                        return;

                    }


                    alert(
                        "Buscando: " + texto
                    );

                }
            );

        }


        /* También permite buscar presionando Enter */

        if (campoBusqueda) {

            campoBusqueda.addEventListener(
                "keypress",
                function(event) {

                    if (event.key === "Enter") {

                        botonBuscar.click();

                    }

                }
            );

        }

    }
);