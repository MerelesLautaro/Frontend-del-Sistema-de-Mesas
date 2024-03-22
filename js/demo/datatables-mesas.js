function formatDate(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

$(document).ready(async function () {
    await traerMesas();
    $('#dataTable').DataTable();

    $("#editarMesaBtn").click(function (event) {
            event.preventDefault();
            editarMesa();
    });

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
                    <form name="delete">
                        <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-mesa-id="${mesa.id}" style="background-color: red; margin-right: 5px">
                            <i class="fas fa-solid fa-trash"></i> Eliminar
                        </button>
                        <input type="hidden" name="id">
                    </form>
                    <form name="edit">
                        <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-mesa-id="${mesa.id}" style="margin-left: 5px">
                            <i class="fas fa-pencil-alt"></i> Editar
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


async function eliminarMesa(mesaId) {
    try {
        const response = await fetch(`http://localhost:8080/mesa/eliminar/${mesaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el rol');
        }

        await traerMesas();
    } catch (error) {
        console.error(error);
    }
}

async function crearMesa() {
    try {
        let datos = {};
        datos.propuesta = document.getElementById('txtPropuesta').value;
        datos.nombre_materia = document.getElementById('txtMateria').value;
        datos.fecha_primer_llamado = document.getElementById('txtPrimerLlamado').value;
        datos.fecha_segundo_llamado = document.getElementById('txtSegundoLlamado').value;
        datos.presidente = document.getElementById('txtPresidente').value;
        datos.primer_vocal = document.getElementById('txtPrimerVocal').value;
        datos.segundo_vocal = document.getElementById('txtSegundoVocal').value;


        const request = await fetch('http://localhost:8080/mesa/crear', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        await traerMesas();
        const mesa = await request.json();

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
    } catch (error) {
        console.error(error);
    }
}


async function editarMesa() {
    try {
        let datos = {};
        datos.id = document.getElementById('txtIdMesa').value;
        datos.propuesta = document.getElementById('txtPropuesta').value;
        datos.nombre_materia = document.getElementById('txtMateria').value;
        datos.fecha_primer_llamado = document.getElementById('txtPrimerLlamado').value;
        datos.fecha_segundo_llamado = document.getElementById('txtSegundoLlamado').value;
        datos.presidente = document.getElementById('txtPresidente').value;
        datos.primer_vocal = document.getElementById('txtPrimerVocal').value;
        datos.segundo_vocal = document.getElementById('txtSegundoVocal').value;

        const response = await fetch(`http://localhost:8080/mesa/editar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error al editar la mesa');
        }

        await traerMesas();
    } catch (error) {
        console.error(error);
    }
}