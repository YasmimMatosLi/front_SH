const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.ubs-table tbody');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');
  const cadastrarBtn = document.querySelector('.cadastrar-btn');

  if (!tableBody) {
    console.error('Elemento .ubs-table tbody não encontrado no DOM');
    return;
  }
  console.log('Tabela e tbody encontrados:', tableBody);

  // Função para exibir um modal centralizado
  function showModal(message, isError = false) {
    let modal = document.getElementById('customModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'customModal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';
      modal.innerHTML = `
        <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; width: 300px;">
          <p id="modalMessage" style="margin: 0 0 15px 0;"></p>
          <button id="closeModal" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modalContent = modal.querySelector('div');
    const modalMessage = modal.querySelector('#modalMessage');
    const closeButton = modal.querySelector('#closeModal');

    modalMessage.textContent = message;
    modalContent.style.backgroundColor = isError ? '#ffe6e6' : '#e6ffe6';
    modalMessage.style.color = isError ? '#d32f2f' : '#2e7d32';
    modal.style.display = 'flex';

    closeButton.onclick = () => modal.style.display = 'none';
    modal.onclick = (event) => {
      if (event.target === modal) modal.style.display = 'none';
    };
  }

  // Função para buscar e exibir unidades de saúde
  async function fetchUnidades() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado para listar unidades. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return [];
    }
    console.log('Token usado:', token);

    try {
      const response = await fetch(`${API_BASE_URL}/unidades-saude`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Resposta do servidor (status):', response.status);
      const responseText = await response.text();
      console.log('Resposta bruta do servidor:', responseText);

      if (!response.ok) {
        let errorMessage = 'Erro ao listar unidades de saúde';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
          if (errorMessage === 'Token inválido') {
            errorMessage += '. Faça login novamente.';
            setTimeout(() => window.location.href = 'index.html', 2000);
          }
        } catch (e) {
          errorMessage += `: Resposta inválida - ${responseText}`;
        }
        showModal(errorMessage, true);
        return [];
      }

      const unidades = JSON.parse(responseText);
      console.log('Unidades parseadas:', unidades);
      if (!Array.isArray(unidades)) {
        console.error('A resposta não é um array:', unidades);
        showModal('Erro: Resposta do servidor não contém uma lista de unidades.', true);
        return [];
      }
      return unidades;
    } catch (error) {
      console.error('Erro capturado:', error.message);
      showModal('Erro ao conectar com o servidor (verifique a rede ou token).', true);
      return [];
    }
  }

  // Função para preencher a tabela com os dados
  function populateTable(unidades) {
    console.log('Populando tabela com:', unidades);
    tableBody.innerHTML = ''; // Limpa a tabela
    if (unidades.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="5">Nenhuma unidade de saúde cadastrada.</td>`;
      tableBody.appendChild(row);
      return;
    }
    unidades.forEach(unidade => {
      const endereco = `${unidade.endereco?.logradouro || ''}, ${unidade.endereco?.numero || ''}, ${unidade.endereco?.bairro || ''}, ${unidade.endereco?.cidade || ''} - ${unidade.endereco?.estado || ''}, ${unidade.endereco?.cep || ''}`.replace(/, ,/g, ',').replace(/^,|,$/g, '');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${unidade.nome || 'N/A'}</td>
        <td>${unidade.tipo || 'N/A'}</td>
        <td>${endereco || 'N/A'}</td>
        <td>${unidade.telefone || 'N/A'}</td>
        <td>
          <button class="btn-view">Ver</button>
          <button class="btn-edit">Editar</button>
          <button class="btn-delete">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Função para filtrar unidades por nome
  async function filterUnidades() {
    const searchTerm = searchInput.value.toLowerCase();
    const unidades = await fetchUnidades();
    const rows = tableBody.getElementsByTagName('tr');
    Array.from(rows).forEach(row => {
      const nome = row.cells[0].textContent.toLowerCase();
      row.style.display = nome.includes(searchTerm) ? '' : 'none';
    });
  }

  // Eventos
  if (searchBtn) {
    searchBtn.addEventListener('click', filterUnidades);
  } else {
    console.error('Botão .search-btn não encontrado');
  }

  if (cadastrarBtn) {
    cadastrarBtn.addEventListener('click', () => {
      window.location.href = 'PaginaAdminCriarUBS.html';
    });
  } else {
    console.error('Botão .cadastrar-btn não encontrado');
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterUnidades);
  } else {
    console.error('Input #searchInput não encontrado');
  }

  // Carrega as unidades ao iniciar
  fetchUnidades().then(unidades => populateTable(unidades));
});
