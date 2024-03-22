$(document).ready(async function () {
    await traerInscripciones();
    $('#dataTable').DataTable();

});

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

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

        inscripciopnesDto.forEach(inscripcionDto => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${inscripcionDto.id}</td>
                    <td>${inscripcionDto.propuesta}</td>
                    <td>${inscripcionDto.nombreMateria}</td>
                    <td>${inscripcionDto.nombre_alumno} ${inscripcionDto.apellido_alumno}</td>
                    <td>${inscripcionDto.fechaLlamado}</td>
                    <td>${inscripcionDto.presidente}</td>
                    <td>${inscripcionDto.primerVocal}</td>
                    <td>${inscripcionDto.segundoVocal}</td>
                    `;
        tableBody.appendChild(newRow);
    });
    } catch (error) {
        console.error(error);
    }
}
