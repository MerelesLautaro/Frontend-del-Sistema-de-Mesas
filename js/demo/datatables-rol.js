$(document).ready(async function () {
  await traerRoles();
  $('#dataTable').DataTable();
 
  $("#editarRolBtn").click(function (event) {
    event.preventDefault();
    editarRol();
  });
  
  $('#dataTable').on('click', 'button.delete-btn', function () {
    const rolId = $(this).data('rol-id');
    eliminarRol(rolId);
  });

  $('#dataTable').on('click', 'button.edit-btn', function () {
    event.preventDefault();
    const rolId = $(this).data('rol-id');
    findRol(rolId); 
  });
});

async function traerRoles() {
  try {
    const request = await fetch('http://localhost:8080/rol', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!request.ok) {
      throw new Error('Error al obtener los roles');
    }

    const roles = await request.json();
    console.log(roles);

    const tableBody = document.querySelector('#dataTable tbody');

    tableBody.innerHTML = '';

    roles.forEach(rol => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${rol.id}</td>
        <td class="rol-nombre">${rol.nombre_rol}</td>
        <td style="display: flex; width: 230px">
          <form name="delete"><!-- Llama al Servelets encargado de eliminar -->
            <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-rol-id="${rol.id}" style="background-color: red; margin-right: 5px">
              <i class="fas fa-solid fa-trash"></i> Eliminar
            </button>
            <input type="hidden" name="id">
          </form>
          <form name="edit"><!-- Llama al Servelets encargado de editar -->
            <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-rol-id="${rol.id}" style="margin-left: 5px">
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

async function eliminarRol(rolId) {
  try {
    const response = await fetch(`http://localhost:8080/rol/eliminar/${rolId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el rol');
    }

    await traerRoles();
    console.log('Rol eliminado correctamente');
  } catch (error) {
    console.error(error);
  }
}

async function crearRol() {
  try {
    let datos = {};
    datos.nombre_rol = document.getElementById('txtNombreRol').value;

    const request = await fetch('http://localhost:8080/rol/crear', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });
    await traerRoles();

    const rol = await request.json();

  } catch (error) {
    console.error(error);
  }
}

async function findRol(rolId) {
  try {
    const request = await fetch(`http://localhost:8080/rol/${rolId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!request.ok) {
      throw new Error('Error al obtener el rol');
    }

    const rolSeleccionado = await request.json();
    document.getElementById('txtIdRol').value = rolId;
    document.getElementById('txtNombreRol').value = rolSeleccionado.nombre_rol;
  } catch (error) {
    console.error(error);
  }
}

async function editarRol() {
  try {
    let datosRol = {};
    datosRol.id = document.getElementById('txtIdRol').value;
    datosRol.nombre_rol = document.getElementById('txtNombreRol').value;

    const response = await fetch(`http://localhost:8080/rol/editar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosRol)
    });

    if (!response.ok) {
      throw new Error('Error al editar el rol');
    }

    await traerRoles();
    console.log('Rol editado correctamente');
  } catch (error) {
    console.error(error);
  }
}


