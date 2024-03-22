$(document).ready(async function () {
    await traerInscripciones();
    $('#dataTable').DataTable();

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const inscripcionId = $(this).data('inscripcion-id');
        eliminarInscripcion(inscripcionId);
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        const inscripcionId = $(this).data('inscripcion-id');
        findInscripcion(inscripcionId);
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

function edicionExitosaModalLabel() {
    $('#inscripcionExitosaModal').modal('show');
}

async function traerInscripciones() {
    try {
        const request = await fetch('http://localhost:8080/inscripcion/inscripcionesDTO', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
    
        if (!request.ok) {
            throw new Error('Error');
        }

        const inscripciopnesDto = await request.json();

        const alumnoSeleccionado = await findAlumno();

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

        inscripciopnesDto.forEach(inscripcionDto => {
            if(inscripcionDto.id_alumno == alumnoSeleccionado.id){
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${inscripcionDto.id}</td>
                    <td>${inscripcionDto.propuesta}</td>
                    <td>${inscripcionDto.nombreMateria}</td>
                    <td>${inscripcionDto.fechaLlamado}</td>
                    <td>${inscripcionDto.presidente}</td>
                    <td>${inscripcionDto.primerVocal}</td>
                    <td>${inscripcionDto.segundoVocal}</td>
                    <td style="display: flex; width: 230px">
                    <form name="delete">
                        <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-inscripcion-id="${inscripcionDto.id}" style="background-color: red; margin-right: 5px">
                            <i class="fas fa-solid fa-trash"></i> Baja
                        </button>
                        <input type="hidden" name="id">
                    </form>
                    <form name="edit">
                        <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-inscripcion-id="${inscripcionDto.id}" style="margin-left: 5px">
                            <i class="fas fa-pencil-alt"></i> Editar
                        </button>
                        <input type="hidden" name="id">
                    </form>
                    </td>
                    `;
        tableBody.appendChild(newRow);
    }});
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


async function findInscripcion(inscripcionId) {
    try {
        const request = await fetch(`http://localhost:8080/inscripcion/inscripcionesDTO/${inscripcionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener la inscripcion');
        }

        const inscripcionSeleccionada = await request.json();
        document.getElementById('txtIdInscripcion').value = inscripcionSeleccionada.id;
        document.getElementById('txtIdMesa').value = inscripcionSeleccionada.id_mesa;
        document.getElementById('txtIdAlumno').value = inscripcionSeleccionada.id_alumno;
        document.getElementById('txtPropuesta').value = inscripcionSeleccionada.propuesta;
        document.getElementById('txtMateria').value = inscripcionSeleccionada.nombreMateria;
        document.getElementById('txtPresidente').value = inscripcionSeleccionada.presidente;
        document.getElementById('txtPrimerVocal').value = inscripcionSeleccionada.primerVocal;
        document.getElementById('txtSegundoVocal').value = inscripcionSeleccionada.segundoVocal;

        return inscripcionSeleccionada ;
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

async function eliminarInscripcion(inscripcionId) {
    try {
        const response = await fetch(`http://localhost:8080/inscripcion/eliminar/${inscripcionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar la inscrpcion');
        }

        await traerInscripciones();
    } catch (error) {
        console.error(error);
    }
}

async function editarInscripcion() {
    try {
        let numMesa = document.getElementById('txtIdMesa').value;
        const mesaSeleccionada = await findMesa(numMesa); 
        let fechaLlamadoSeleccionada = document.getElementById('txtFechaLlamado').value;
        let fechaLlamado;
        if (fechaLlamadoSeleccionada === 'Primer Llamado') {
            fechaLlamado = mesaSeleccionada.fecha_primer_llamado;
        } else if (fechaLlamadoSeleccionada === 'Segundo Llamado') {
            fechaLlamado = mesaSeleccionada.fecha_segundo_llamado;
        } else {
            throw new Error('Error al corrovorar la fecha');
        }

        const inscripcionId = document.getElementById('txtIdInscripcion').value;
        const inscripcion = {
            id: parseInt(inscripcionId),
            fecha_llamado : fechaLlamado,
            mesa: { id: parseInt(document.getElementById('txtIdMesa').value) },
            alumno: { id: parseInt(document.getElementById('txtIdAlumno').value) },
            propuesta: document.getElementById('txtPropuesta').value,
        };

        const response = await fetch(`http://localhost:8080/inscripcion/editar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inscripcion)
        });

        if (!response.ok) {
            throw new Error('Error al editar la inscripción');
        }

        edicionExitosaModalLabel();
        await traerInscripciones();
    } catch (error) {
        console.error(error);
    }
}


