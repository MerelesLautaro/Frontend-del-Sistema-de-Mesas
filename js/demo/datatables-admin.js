$(document).ready(async function () {
    await traerAdmins();
    $('#dataTable').DataTable();
   
    $("#editarAdminBtn").click(function (event) {
      event.preventDefault();
      editarAdmin();
    });
    
    $('#dataTable').on('click', 'button.delete-btn', function () {
      const adminId = $(this).data('admin-id');
      eliminarAdmin(adminId);
    });
  
    $('#dataTable').on('click', 'button.edit-btn', function () {
      event.preventDefault();
      const adminId = $(this).data('admin-id');
      findAdmin(adminId); 
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

                    if (usuario.rol && usuario.rol.nombre_rol === 'Admin') {
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
  
  async function traerAdmins() {
    try {
      const request = await fetch('http://localhost:8080/admin', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener los admins');
      }
  
      const administradores = await request.json();
      console.log(administradores);
  
      const tableBody = document.querySelector('#dataTable tbody');
  
      tableBody.innerHTML = '';
  
      administradores.forEach(admin => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${admin.id}</td>
          <td class="rol-nombre">${admin.usuario.nombre_usuario}</td>
          <td style="display: flex; width: 230px">
            <form name="delete"><!-- Llama al Servelets encargado de eliminar -->
              <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-admin-id="${admin.id}" style="background-color: red; margin-right: 5px">
                <i class="fas fa-solid fa-trash"></i> Eliminar
              </button>
              <input type="hidden" name="id">
            </form>
            <form name="edit"><!-- Llama al Servelets encargado de editar -->
              <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-admin-id="${admin.id}" style="margin-left: 5px">
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
  
  async function eliminarAdmin(adminId) {
    try {
      const response = await fetch(`http://localhost:8080/admin/eliminar/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el admin');
      }
  
      await traerAdmins();
    } catch (error) {
      console.error(error);
    }
  }
  
  async function crearAdmin() {
    try {
        let datos = {}
        let usuarioSeleccionado = {
            id: document.getElementById('txtUsuario').value,
        };
        datos.usuario = usuarioSeleccionado;
  
      const request = await fetch('http://localhost:8080/admin/crear', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      await traerAdmins();
  
      const admin = await request.json();
  
    } catch (error) {
      console.error(error);
    }
  }
  
  async function findAdmin(adminId) {
    try {
      const request = await fetch(`http://localhost:8080/admin${adminId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener el admin');
      }
  
      const adminSeleccionado = await request.json();
      document.getElementById('txtIdAdmin').value = adminId;
    } catch (error) {
      console.error(error);
    }
  }
  
  async function editarAdmin() {
    try {
      let datosAdmin = {};
      document.getElementById('txtIdAdmin').value = adminId;
      let usuarioSeleccionado = {
        id: document.getElementById('txtUsuario').value,
        };
        datosAdmin.usuario = usuarioSeleccionado;
  
      const response = await fetch(`http://localhost:8080/admin/editar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosAdmin)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar el admin');
      }
  
      await traerAdmins();
      console.log('admin editado correctamente');
    } catch (error) {
      console.error(error);
    }
  }
  
  
  