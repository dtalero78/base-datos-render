// Importar los estilos CSS
import './style.css';

const apiUrl = import.meta.env.VITE_API_URL;
console.log('🛠️ URL de la API:', `${apiUrl}/usuarios`);

let usuarios = []; // Almacena los datos originales

// ✅ Función para cargar datos desde la API
async function loadData() {
  try {
    const response = await fetch(`${apiUrl}/usuarios`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Datos cargados:', data);

    // ✅ Guardar datos en la variable global
    usuarios = data;

    // ✅ Ordenar los datos por fecha (de más reciente a más antigua)
    usuarios.sort((a, b) => {
      const fechaA = new Date(a.creacion || a.Creacion || a.fecha_creacion).getTime();
      const fechaB = new Date(b.creacion || b.Creacion || b.fecha_creacion).getTime();
      return fechaB - fechaA; // Más reciente primero
    });

    renderTable(usuarios);
  } catch (error) {
    console.error('❌ Error al cargar datos:', error.message);
    alert('❌ Error al cargar datos');
  }
}

// ✅ Función para renderizar la tabla
function renderTable(data) {
  const tableBody = document.getElementById('dataBody');
  tableBody.innerHTML = ''; // Limpiar contenido previo

  if (data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="11" class="no-results">❌ No se encontraron resultados</td>
      </tr>
    `;
    return;
  }

  data.forEach(user => {
    const row = `
      <tr>
        <td>${user.id || '-'}</td>
        <td>${user.creacion ? new Date(user.creacion).toLocaleDateString() : '-'}</td>
        <td>${user.idgeneral || user.idGeneral || '-'}</td>
        <td>${user.primernombre || user.primerNombre || '-'}</td>
        <td>${user.encuestasalud || user.encuestaSalud || '-'}</td>
        <td>${user.antecedentesfamiliares || user.antecedentesFamiliares || '-'}</td>
        <td>${user.edad || '-'}</td>
        <td>${user.profesionuoficio || user.profesionUOficio || '-'}</td>
        <td>${user.genero || '-'}</td>
        <td>${user.celular || '-'}</td>
        <td class="actions-cell">
          <button class="edit-btn" onclick="editRecord('${user.id}')"></button>
          <button class="delete-btn" onclick="deleteRecord('${user.id}')"></button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}





// ✅ Función para Editar un Registro
// ✅ Función para Editar un Registro
function editRecord(id) {
  const user = usuarios.find(user => user.id == id);
  if (!user) {
    alert('❌ Registro no encontrado');
    return;
  }

  const nuevoNombre = prompt('📝 Ingresa el nuevo nombre:', user.primernombre || user.primerNombre);
  const nuevoCelular = prompt('📱 Ingresa el nuevo número de celular:', user.celular || '');

  if (nuevoNombre !== null && nuevoCelular !== null) {
    fetch(`${apiUrl}/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        primerNombre: nuevoNombre,
        celular: nuevoCelular
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('❌ Error al actualizar el registro');
        }
        return response.json();
      })
      .then(data => {
        console.log('✅ Registro actualizado:', data);
        loadData(); // Recargar datos
      })
      .catch(err => {
        console.error(err);
        alert('❌ Error al actualizar el registro');
      });
  }
}

// ✅ Función para Eliminar un Registro
function deleteRecord(id) {
  if (!confirm('⚠️ ¿Estás seguro de que deseas eliminar este registro?')) {
    return;
  }

  fetch(`${apiUrl}/delete/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.error || '❌ Error desconocido al eliminar');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Registro eliminado:', data);
      loadData(); // Recargar datos
    })
    .catch(err => {
      console.error(err);
      alert(err.message || '❌ Error al eliminar el registro');
    });
}


// ✅ Hacer funciones globales
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;



// ✅ Función para filtrar los datos por `idGeneral`
function searchByIdGeneral() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const filteredData = usuarios.filter(user =>
    (user.idgeneral || user.idGeneral || '').toLowerCase().includes(searchValue)
  );

  renderTable(filteredData);
}

// ✅ Estructura HTML principal
// ✅ Estructura HTML principal
document.querySelector('#app').innerHTML = `
 <div class="header-container">
   <h1>Datos de Usuarios</h1>
   <div class="search-container">
     <input type="text" id="searchInput" placeholder="Buscar por ID General" />
     <button id="searchButton">Buscar</button>
   </div>
 </div>
 <div class="button-container">
   <button id="loadDataBtn">Cargar Datos</button>
 </div>
 <div class="table-container">
   <table>
     <thead>
       <tr>
         <th>ID</th>
         <th>Creación</th>
         <th>ID General</th>
         <th>Nombre</th>
         <th>Salud</th>
         <th>Antecedentes</th>
         <th>Edad</th>
         <th>Profesión</th>
         <th>Género</th>
         <th>Celular</th>
         <th>Acciones</th> <!-- Nueva columna para los botones -->
       </tr>
     </thead>
     <tbody id="dataBody">
       <tr>
         <td colspan="11" style="text-align: center;">Cargando datos...</td>
       </tr>
     </tbody>
   </table>
 </div>
`;



// ✅ Eventos
document.getElementById('loadDataBtn').addEventListener('click', loadData);
document.getElementById('searchButton').addEventListener('click', searchByIdGeneral);
document.getElementById('searchInput').addEventListener('input', searchByIdGeneral);
