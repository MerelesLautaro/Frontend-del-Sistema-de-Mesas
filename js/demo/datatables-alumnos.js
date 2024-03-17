$(document).ready(async function () {
    await traerAlumnos();
    $('#dataTable').DataTable();

    $("#editarUsuarioBtn").click(function (event) {
        event.preventDefault();
        editarAlumno();
    });

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const alumnoId = $(this).data('alumno-id');
        eliminarAlumno(alumnoId);
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        const alumnoId = $(this).data('alumno-id');
        findAlumno(alumnoId);
    });


    $(document).ready(function () {
        $.ajax({
            url: 'http://localhost:8080/usuario',
            type: 'GET',
            success: async function (data) {
                $('#txtUsuario').empty();
                for (let i = 0; i < data.length; i++) {
                    const usuario = data[i];
                    if (typeof usuario.rol === 'number') {
                        try {
                            const rolRequest = await fetch(`http://localhost:8080/rol/${usuario.rol}`, {
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json'
                                }
                            });
    
                            if (!rolRequest.ok) {
                                throw new Error('Error al obtener el rol');
                            }
    
                            const rolData = await rolRequest.json();
                            usuario.rol = rolData;
                        } catch (error) {
                            console.error('Error al obtener el rol:', error);
                            continue;
                        }
                    }
                    if (usuario.rol && usuario.rol.nombre_rol === 'Estudiante') {
                        $('#txtUsuario').append('<option value="' + usuario.id + '">' + usuario.nombre_usuario + '</option>');
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error al obtener los usuarios:', errorThrown);
            }
        });
    });
});

async function traerAlumnos(){
    try {
        const request = await fetch('http://localhost:8080/alumno', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener los alumnos');
        }

        const alumnos = await request.json();
        console.log(alumnos);

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

      
        alumnos.forEach(alumnos => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${alumnos.id}</td>
                    <td class="alumno-nombre">${alumnos.nombre}</td>
                    <td class="usuario-contrasenia">${alumnos.apellido}</td>
                    <td class="usuario-rol">${alumnos.dni}</td>
                    <td classsuario-rol">${alumnos.telefono}</td>
                    <td class="usuario-rol">${alumnos.usuario.nombre_usuario}</td>
                    <td style="display: flex; width: 230px">
                        <form name="delete">
                            <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-alumno-id="${alumnos.id}" style="background-color: red; margin-right: 5px">
                                <i class="fas fa-solid fa-trash"></i> Eliminar
                            </button>
                            <input type="hidden" name="id">
                        </form>
                        <form name="edit">
                            <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-alumno-id="${alumnos.id}" style="margin-left: 5px">
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


async function eliminarAlumno(alumnoId) {
    try {
        const response = await fetch(`http://localhost:8080/alumno/eliminar/${alumnoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el rol');
        }

        await traerAlumnos();
    } catch (error) {
        console.error(error);
    }
}

async function crearAlumno() {
    try {
        let datos = {};
        datos.nombre = document.getElementById('txtNombre').value;
        datos.apellido = document.getElementById('txtApellido').value;
        datos.dni= document.getElementById('txtDni').value;
        datos.telefono = document.getElementById('txtTelefono').value;
        let usuarioSeleccionado = {
            id: document.getElementById('txtUsuario').value,
        };
        datos.usuario = usuarioSeleccionado;

        const request = await fetch('http://localhost:8080/alumno/crear', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        await traerAlumnos();
        const usuario = await request.json();

    } catch (error) {
        console.error(error);
    }
}

async function findAlumno(alumnoId) {
    try {
        const request = await fetch(`http://localhost:8080/alumno/${alumnoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener el usuario');
        }

        const alumnoSeleccionado = await request.json();
        document.getElementById('txtIdAlumno').value = alumnoSeleccionado.id;
        document.getElementById('txtNombre').value = alumnoSeleccionado.nombre;
        document.getElementById('txtApellido').value = alumnoSeleccionado.apellido;
        document.getElementById('txtDni').value = alumnoSeleccionado.dni;
        document.getElementById('txtTelefono').value = alumnoSeleccionado.telefono;
    } catch (error) {
        console.error(error);
    }
}

async function editarAlumno() {
    try {
        let datos = {};
        datos.id = document.getElementById('txtIdAlumno').value;
        datos.nombre = document.getElementById('txtNombre').value;
        datos.apellido = document.getElementById('txtApellido').value;
        datos.dni= document.getElementById('txtDni').value;
        datos.telefono = document.getElementById('txtTelefono').value;
        let usuarioSeleccionado = {
            id: document.getElementById('txtUsuario').value,
        };
        datos.usuario = usuarioSeleccionado;
        
        const response = await fetch(`http://localhost:8080/alumno/editar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error al editar el usuario');
        }

        await traerAlumnos();
        console.log('Usuario editado correctamente');
    } catch (error) {
        console.error(error);
    }
}