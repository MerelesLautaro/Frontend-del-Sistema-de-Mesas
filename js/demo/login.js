$(document).ready(function () {
});

async function iniciarSesion() {       
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

    let email = document.getElementById('txtEmail').value;
    let contrasenia = document.getElementById('txtContrasenia').value;

    for (const usuario of usuarios){
        if(usuario.nombre_usuario == email && usuario.contrasenia_usuario == contrasenia){
                //LocalStorage para guardar id y nombre del usuario para buscar mesas por ID o actualizar el nombre en la pagina.
                localStorage.idUsuario = usuario.id;
                localStorage.nombre_usuario = usuario.nombre_usuario;
            if(usuario.rol.nombre_rol == 'Admin'){
                window.location.href = 'rol.html';
            } else if (usuario.rol.nombre_rol == 'Estudiante'){
                window.location.href = 'mesaestudiante.html';
            }
            return;
        }
    }
}
