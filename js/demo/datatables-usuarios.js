$(document).ready(async function () {
    await traerUsuarios();
    $('#dataTable').DataTable();

    $("#editarUsuarioBtn").click(function (event) {
            event.preventDefault();
            editarUsuario();
    });

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const usuarioId = $(this).data('usuario-id');
        eliminarUsuario(usuarioId);
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        const usuarioId = $(this).data('usuario-id');
        findUsuario(usuarioId);
    });

    $(document).ready(function () {
        $.ajax({
            url: 'http://localhost:8080/rol',
            type: 'GET',
            success: function (data) {
                $('#txtRol').empty();
                $.each(data, function (index, rol) {
                    $('#txtRol').append('<option value="' + rol.id + '">' + rol.nombre_rol + '</option>');
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error al obtener los roles:', errorThrown);
            }
        });
    });
});

async function traerUsuarios() {
    try {
        const request = await fetch('http://localhost:8080/usuario', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener los usuarios');
        }

        const usuarios = await request.json();
        console.log(usuarios);

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

        for (const usuario of usuarios) {
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
                }
            }

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${usuario.id}</td>
                <td class="usuario-nombre">${usuario.nombre_usuario}</td>
                <td class="usuario-contrasenia">${usuario.contrasenia_usuario}</td>
                <td class="usuario-rol">${usuario.rol.nombre_rol}</td>
                <td style="display: flex; width: 230px">
                    <form name="delete">
                        <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-usuario-id="${usuario.id}" style="background-color: red; margin-right: 5px">
                            <i class="fas fa-solid fa-trash"></i> Eliminar
                        </button>
                        <input type="hidden" name="id">
                    </form>
                    <form name="edit">
                        <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-usuario-id="${usuario.id}" style="margin-left: 5px">
                            <i class="fas fa-pencil-alt"></i> Editar
                        </button>
                        <input type="hidden" name="id">
                    </form>
                </td>
            `;
            tableBody.appendChild(newRow);
        }

    } catch (error) {
        console.error(error);
    }
}


async function eliminarUsuario(usuarioId) {
    try {
        const response = await fetch(`http://localhost:8080/usuario/eliminar/${usuarioId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el rol');
        }

        await traerUsuarios();
        console.log('Rol eliminado correctamente');
    } catch (error) {
        console.error(error);
    }
}

async function crearUsuario() {
    try {
        let datos = {};
        datos.nombre_usuario = document.getElementById('txtNombreUsuario').value;
        datos.contrasenia_usuario = document.getElementById('txtContrasenia').value;
        let rolSeleccionado = {
            id: document.getElementById('txtRol').value,
        };

        datos.rol = rolSeleccionado;

        const request = await fetch('http://localhost:8080/usuario/crear', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        await traerUsuarios();
        const usuario = await request.json();

    } catch (error) {
        console.error(error);
    }
}

async function findUsuario(usuarioId) {
    try {
        const request = await fetch(`http://localhost:8080/usuario/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener el usuario');
        }

        const usuarioSeleccionado = await request.json();
        document.getElementById('txtIdUsuario').value = usuarioSeleccionado.id;
        document.getElementById('txtNombreUsuario').value = usuarioSeleccionado.nombre_usuario;
        document.getElementById('txtContrasenia').value = usuarioSeleccionado.contrasenia_usuario;
    } catch (error) {
        console.error(error);
    }
}


async function editarUsuario() {
    try {
        let datos = {};
        datos.id = document.getElementById('txtIdUsuario').value;
        datos.nombre_usuario = document.getElementById('txtNombreUsuario').value;
        datos.contrasenia_usuario = document.getElementById('txtContrasenia').value;
        let rolSeleccionado = {
            id: document.getElementById('txtRol').value,
        };

        datos.rol = rolSeleccionado;

        const response = await fetch(`http://localhost:8080/usuario/editar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error al editar el usuario');
        }

        await traerUsuarios();
        console.log('Usuario editado correctamente');
    } catch (error) {
        console.error(error);
    }
}