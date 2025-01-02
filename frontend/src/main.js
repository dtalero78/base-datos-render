const apiUrl = import.meta.env.VITE_API_URL;
console.log('🛠️ URL de la API:', `${apiUrl}/usuarios`);

async function loadData() {
  try {
    const response = await fetch(`${apiUrl}/usuarios`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Datos cargados:', data); // Log para depurar

    const tableBody = document.getElementById('dataBody');
    tableBody.innerHTML = ''; // Limpiar contenido previo

    data.forEach(user => {
      const row = `
        <tr>
          <td>${user.id}</td>
          <td>${user.idgeneral || user.idGeneral}</td>
          <td>${user.primernombre || user.primerNombre}</td>
          <td>${user.encuestasalud || user.encuestaSalud}</td>
          <td>${user.antecedentesfamiliares || user.antecedentesFamiliares}</td>
          <td>${user.edad}</td>
          <td>${user.profesionuoficio || user.profesionUOficio}</td>
          <td>${user.genero}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('❌ Error al cargar datos:', error.message);
    alert('❌ Error al cargar datos');
  }
}


document.querySelector('#app').innerHTML = `
  <h1>📋 Datos de Usuarios</h1>
  <button id="loadDataBtn">🔄 Cargar Datos</button>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Salud</th>
        <th>Antecedentes</th>
        <th>Edad</th>
        <th>Profesión</th>
        <th>Género</th>
      </tr>
    </thead>
    <tbody id="dataBody"></tbody>
  </table>
`;

document.getElementById('loadDataBtn').addEventListener('click', loadData);
