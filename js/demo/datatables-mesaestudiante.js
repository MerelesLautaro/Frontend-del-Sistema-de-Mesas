$(document).ready(async function () {
    await traerMesas();
    $('#dataTable').DataTable();

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const mesaId = $(this).data('mesa-id');
        eliminarMesa(mesaId);
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        const mesaId = $(this).data('mesa-id');
        findMesa(mesaId);
    });


});

function formatDate(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function mostrarModalInscripcionExitosa() {
    $('#inscripcionExitosaModal').modal('show');
}

async function traerMesas() {
    try {
        const request = await fetch('http://localhost:8080/mesa', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener las mesas');
        }

        const mesas = await request.json();
        console.log(mesas);

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

        function formatDate(dateTimeString) {
            const dateTime = new Date(dateTimeString);
            const year = dateTime.getFullYear();
            const month = String(dateTime.getMonth() + 1).padStart(2, '0');
            const day = String(dateTime.getDate()).padStart(2, '0');
            const hours = String(dateTime.getHours()).padStart(2, '0');
            const minutes = String(dateTime.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
        
        // Cargar mesas en la tabla
        mesas.forEach(mesa => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${mesa.id}</td>
                <td>${mesa.propuesta}</td>
                <td>${mesa.nombre_materia}</td>
                <td>${mesa.fecha_primer_llamado}</td>
                <td>${mesa.fecha_segundo_llamado}</td>
                <td>${mesa.presidente}</td>
                <td>${mesa.primer_vocal}</td>
                <td>${mesa.segundo_vocal}</td>
                <td style="display: flex; width: 230px">
                    <form name="edit">
                        <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-mesa-id="${mesa.id}" style="margin-left: 5px">
                            <i class="fas fa-solid fa-pen-nib"></i> Seleccionar
                        </button>
                        <input type="hidden" name="id">
                    </form>
                </td>
            `;
            tableBody.appendChild(newRow);
        });
    } catch (error) {
        console.error(error);
    }
}


async function inscribirMesa() {
    try {
        let datos = {};
        let mesaSeleccionada = {
            id: document.getElementById('txtIdMesa').value,
        };
     
        datos.mesa = mesaSeleccionada;
        
        let numMesa = document.getElementById('txtIdMesa').value;
        const mesaInscripcion = await findMesa(numMesa);

        let fechaLlamadoSeleccionada = document.getElementById('txtFechaLlamado').value;
        let fechaLlamado;
        if (fechaLlamadoSeleccionada === 'Primer Llamado') {
            fechaLlamado = mesaInscripcion.fecha_primer_llamado;
        } else if (fechaLlamadoSeleccionada === 'Segundo Llamado') {
            fechaLlamado = mesaInscripcion.fecha_segundo_llamado;
        } else {
            throw new Error('Por favor selecciona un llamado válido.');
        }
        
        datos.fecha_llamado = fechaLlamado;
        

        const alumnoSeleccionado = await findAlumno();
        datos.alumno = alumnoSeleccionado;

        /*console.log(fechaLlamado)
        console.log(mesaInscripcion)*/
                   
        if (!alumnoSeleccionado) {
            throw new Error('No se encontró al alumno.');
        }

        const request = await fetch('http://localhost:8080/inscripcion/crear', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        mostrarModalInscripcionExitosa();
        /*await traerMesas();
        const mesa = await request.json();*/

    } catch (error) {
        console.error(error);
    }
}

async function findAlumno() {
    try {
        const request = await fetch(`http://localhost:8080/alumno`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener el usuario');
        }

        const alumnos = await request.json();
        let idUsuario = localStorage.idUsuario;

        for (const alumno of alumnos) {
            if (alumno.usuario.id == idUsuario) {
                return alumno;
            }
        }
        
        return null;
        

    } catch (error) {
        console.error(error);
    }
}

async function findMesa(mesaId) {
    try {
        const request = await fetch(`http://localhost:8080/mesa/${mesaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener la mesa');
        }

        const mesaSeleccionada = await request.json();
        document.getElementById('txtIdMesa').value = mesaSeleccionada.id;
        document.getElementById('txtPropuesta').value = mesaSeleccionada.propuesta;
        document.getElementById('txtMateria').value = mesaSeleccionada.nombre_materia;
        document.getElementById('txtPresidente').value = mesaSeleccionada.presidente;
        document.getElementById('txtPrimerVocal').value = mesaSeleccionada.primer_vocal;
        document.getElementById('txtSegundoVocal').value = mesaSeleccionada.segundo_vocal;

        return mesaSeleccionada;
    } catch (error) {
        console.error(error);
    }
}


