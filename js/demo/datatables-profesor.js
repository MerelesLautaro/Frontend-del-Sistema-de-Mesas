$(document).ready(async function () {
    await traerProfesores();
    $('#dataTable').DataTable();
   
    $("#editarProfesorBtn").click(function (event) {
      event.preventDefault();
      editarProfesor();
    });
    
    $('#dataTable').on('click', 'button.delete-btn', function () {
      const profesorId = $(this).data('profesor-id');
      eliminarProfesor(profesorId);
    });
  
    $('#dataTable').on('click', 'button.edit-btn', function () {
      event.preventDefault();
      const profesorId = $(this).data('profesor-id');
      findProfesor(profesorId); 
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

                    if (usuario.rol && usuario.rol.nombre_rol === 'Profesor') {
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
  
  async function traerProfesores() {
    try {
      const request = await fetch('http://localhost:8080/profesor', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener los profesores');
      }
  
      const profesores = await request.json();
      console.log(profesores);
  
      const tableBody = document.querySelector('#dataTable tbody');
  
      tableBody.innerHTML = '';
  
      profesores.forEach(profesor => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${profesor.id}</td>
          <td class="rol-nombre">${profesor.usuario.nombre_usuario}</td>
          <td style="display: flex; width: 230px">
            <form name="delete"><!-- Llama al Servelets encargado de eliminar -->
              <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-profesor-id="${profesor.id}" style="background-color: red; margin-right: 5px">
                <i class="fas fa-solid fa-trash"></i> Eliminar
              </button>
              <input type="hidden" name="id">
            </form>
            <form name="edit"><!-- Llama al Servelets encargado de editar -->
              <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-profesor-id="${profesor.id}" style="margin-left: 5px">
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
  
  async function eliminarProfesor(profesorId) {
    try {
      const response = await fetch(`http://localhost:8080/profesor/eliminar/${profesorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el profesor');
      }
  
      await traerProfesores();
    } catch (error) {
      console.error(error);
    }
  }
  
  async function crearProfesor() {
    try {
        let datos = {}
        let usuarioSeleccionado = {
            id: document.getElementById('txtUsuario').value,
        };
        datos.usuario = usuarioSeleccionado;
  
      const request = await fetch('http://localhost:8080/profesor/crear', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      await traerProfesores();
  
      const profesor = await request.json();
  
    } catch (error) {
      console.error(error);
    }
  }
  
  async function findProfesor(profesorId) {
    try {
      const request = await fetch(`http://localhost:8080/profesor/${profesorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener el rol');
      }
  
      const profesorSeleccionado = await request.json();
      document.getElementById('txtIdProfesor').value = profesorId;
    } catch (error) {
      console.error(error);
    }
  }
  
  async function editarProfesor() {
    try {
      let datosProfesor = {};
      document.getElementById('txtIdProfesor').value = profesorId;
      let usuarioSeleccionado = {
        id: document.getElementById('txtUsuario').value,
        };
        datosProfesor.usuario = usuarioSeleccionado;
  
      const response = await fetch(`http://localhost:8080/profesor/editar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosProfesor)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar el profesor');
      }
  
      await traerProfesores();
      console.log('profesor editado correctamente');
    } catch (error) {
      console.error(error);
    }
  }
  
  
  