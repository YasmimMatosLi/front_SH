const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.ubs-table tbody');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');
  const cadastrarBtn = document.querySelector('.cadastrar-btn');
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const sidebarItems = document.querySelectorAll('.sidebar--items li');

  if (!tableBody) {
    console.error('Elemento .ubs-table tbody não encontrado no DOM');
    return;
  }
  console.log('Tabela e tbody encontrados:', tableBody);

  // Função para exibir um modal centralizado (para mensagens de erro ou sucesso)
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
          <button class="btn-view" data-id="${unidade.id}">Ver</button>
          <button class="btn-edit" data-id="${unidade.id}">Editar</button>
          <button class="btn-delete" data-id="${unidade.id}">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Adiciona evento de clique ao botão "Ver"
    document.querySelectorAll('.btn-view').forEach(button => {
      button.addEventListener('click', () => {
        const unidadeId = button.getAttribute('data-id');
        const unidade = unidades.find(u => u.id === unidadeId);
        if (unidade) {
          showUnitDetailsModal(unidade);
        } else {
          showModal('Unidade de saúde não encontrada.', true);
        }
      });
    });

    // Adiciona evento de clique ao botão "Editar"
    document.querySelectorAll('.btn-edit').forEach(button => {
      button.addEventListener('click', () => {
        const unidadeId = button.getAttribute('data-id');
        const unidade = unidades.find(u => u.id === unidadeId);
        if (unidade) {
          showEditModal(unidade);
        } else {
          showModal('Unidade de saúde não encontrada.', true);
        }
      });
    });

    // Adiciona evento de clique ao botão "Excluir"
    document.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', () => {
        const unidadeId = button.getAttribute('data-id');
        const unidade = unidades.find(u => u.id === unidadeId);
        if (unidade) {
          showDeleteConfirmModal(unidade);
        } else {
          showModal('Unidade de saúde não encontrada.', true);
        }
      });
    });
  }

  // Função para exibir o modal com detalhes da unidade
  function showUnitDetailsModal(unidade) {
    let modal = document.getElementById('unitModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'unitModal';
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
      document.body.appendChild(modal);
    }

    const endereco = `${unidade.endereco?.logradouro || ''}, ${unidade.endereco?.numero || ''}, ${unidade.endereco?.bairro || ''}, ${unidade.endereco?.cidade || ''} - ${unidade.endereco?.estado || ''}, CEP: ${unidade.endereco?.cep || ''}`.replace(/, ,/g, ',').replace(/^,|,$/g, '');
    const servicosEssenciais = Array.isArray(unidade.servicosEssenciais) ? unidade.servicosEssenciais : [];
    const servicosAmpliados = Array.isArray(unidade.servicosAmpliados) ? unidade.servicosAmpliados : [];

    modal.innerHTML = `
      <div style="background-color: #fff; padding: 20px; border-radius: 12px; width: 400px; max-width: 90%; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #007bff; font-size: 1.5em; text-align: center;">Detalhes da Unidade</h3>
        <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
          <p><strong>ID:</strong> ${unidade.id || 'N/A'}</p>
          <p><strong>Nome:</strong> ${unidade.nome || 'N/A'}</p>
          <p><strong>Tipo:</strong> ${unidade.tipo || 'N/A'}</p>
          <p><strong>CNES:</strong> ${unidade.cnes || 'N/A'}</p>
          <p><strong>Endereço:</strong> ${endereco || 'N/A'}</p>
          <p><strong>Telefone:</strong> ${unidade.telefone || 'N/A'}</p>
          <p><strong>Serviços Essenciais:</strong> ${servicosEssenciais.length > 0 ? servicosEssenciais.join(', ') : 'Nenhum'}</p>
          <p><strong>Serviços Ampliados:</strong> ${servicosAmpliados.length > 0 ? servicosAmpliados.join(', ') : 'Nenhum'}</p>
        </div>
        <button id="closeUnitModal" style="display: block; margin: 15px auto 0; padding: 8px 16px; background-color: #007bff; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Fechar</button>
      </div>
    `;

    modal.style.display = 'flex';

    const closeButton = modal.querySelector('#closeUnitModal');
    closeButton.onclick = () => modal.style.display = 'none';
    modal.onclick = (event) => {
      if (event.target === modal) modal.style.display = 'none';
    };
  }

  // Função para exibir o modal de edição
  function showEditModal(unidade) {
    let modal = document.getElementById('editModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'editModal';
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
      document.body.appendChild(modal);
    }

    const servicosEssenciais = Array.isArray(unidade.servicosEssenciais) ? unidade.servicosEssenciais.join(', ') : '';
    const servicosAmpliados = Array.isArray(unidade.servicosAmpliados) ? unidade.servicosAmpliados.join(', ') : '';

    modal.innerHTML = `
      <div style="background-color: #fff; padding: 20px; border-radius: 12px; width: 450px; max-width: 90%; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #007bff; font-size: 1.5em; text-align: center;">Editar Unidade</h3>
        <form id="editForm" style="max-height: 400px; overflow-y: auto; padding: 10px;">
          <div class="form-group">
            <label for="editNome">Nome:</label>
            <input type="text" id="editNome" value="${unidade.nome || ''}" required>
          </div>
          <div class="form-group">
            <label for="editTipo">Tipo:</label>
            <select id="editTipo" required>
              <option value="UBS" ${unidade.tipo === 'UBS' ? 'selected' : ''}>UBS</option>
              <option value="HOSPITAL" ${unidade.tipo === 'HOSPITAL' ? 'selected' : ''}>Hospital</option>
              <option value="UPA" ${unidade.tipo === 'UPA' ? 'selected' : ''}>UPA</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editCnes">CNES:</label>
            <input type="text" id="editCnes" value="${unidade.cnes || ''}" required>
          </div>
          <div class="form-group">
            <label for="editLogradouro">Logradouro:</label>
            <input type="text" id="editLogradouro" value="${unidade.endereco?.logradouro || ''}" required>
          </div>
          <div class="form-group">
            <label for="editNumero">Número:</label>
            <input type="text" id="editNumero" value="${unidade.endereco?.numero || ''}" required>
          </div>
          <div class="form-group">
            <label for="editBairro">Bairro:</label>
            <input type="text" id="editBairro" value="${unidade.endereco?.bairro || ''}" required>
          </div>
          <div class="form-group">
            <label for="editCidade">Cidade:</label>
            <input type="text" id="editCidade" value="${unidade.endereco?.cidade || ''}" required>
          </div>
          <div class="form-group">
            <label for="editEstado">Estado:</label>
            <input type="text" id="editEstado" value="${unidade.endereco?.estado || ''}" maxlength="2" required>
          </div>
          <div class="form-group">
            <label for="editCep">CEP:</label>
            <input type="text" id="editCep" value="${unidade.endereco?.cep || ''}" required>
          </div>
          <div class="form-group">
            <label for="editTelefone">Telefone:</label>
            <input type="text" id="editTelefone" value="${unidade.telefone || ''}" required>
          </div>
          <div class="form-group">
            <label for="editServicosEssenciais">Serviços Essenciais:</label>
            <textarea id="editServicosEssenciais" rows="2">${servicosEssenciais || ''}</textarea>
          </div>
          <div class="form-group">
            <label for="editServicosAmpliados">Serviços Ampliados:</label>
            <textarea id="editServicosAmpliados" rows="2">${servicosAmpliados || ''}</textarea>
          </div>
          <button type="submit" style="display: block; margin: 15px auto 0; padding: 8px 16px; background-color: #007bff; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Salvar</button>
        </form>
        <button id="closeEditModal" style="display: block; margin: 10px auto 0; padding: 8px 16px; background-color: #ccc; color: #000; border: none; border-radius: 6px; cursor: pointer;">Fechar</button>
      </div>
    `;

    modal.style.display = 'flex';

    const editForm = modal.querySelector('#editForm');
    editForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await updateUnidade(unidade.id);
    });

    const closeButton = modal.querySelector('#closeEditModal');
    closeButton.onclick = () => modal.style.display = 'none';
    modal.onclick = (event) => {
      if (event.target === modal) modal.style.display = 'none';
    };
  }

  // Função para atualizar unidade de saúde
  async function updateUnidade(unidadeId) {
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imorc1l4RmljVjBqenZmL0kiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2djeXNyaHZ0Ym9iZWt1enBzZnd1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2Y2ZkZWFkNS1jMTI4LTRlMDEtYjQwMC01YWI5NzRlZTFlOGEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ2OTg4NzQ4LCJpYXQiOjE3NDY5ODUxNDgsImVtYWlsIjoicXVlaXJvemRvdWdsYXM0NjZAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InF1ZWlyb3pkb3VnbGFzNDY2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJub21lIjoiRG91Z2xhcyBRdWVpcm96IiwicGFwZWwiOiJBRE1JTklTVFJBRE9SX1BSSU5DSVBBTCIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiNmNmZGVhZDUtYzEyOC00ZTAxLWI0MDAtNWFiOTc0ZWUxZThhIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDY5ODUxNDh9XSwic2Vzc2lvbl9pZCI6Ijc0OGQyNDk1LTU5YmUtNDQzZC05YjNjLTMxZTk1YTUzNDg4OSIsImlzX2Fub255bW91cyI6ZmFsc2V9.PFiHuQ96B5SwaezfSjOWgUZGf_Zum-9EGCix5E9yYqU';
    const unidadeData = {
      nome: document.querySelector('#editNome').value,
      tipo: document.querySelector('#editTipo').value,
      cnes: document.querySelector('#editCnes').value.replace(/\D/g, ''),
      endereco: {
        logradouro: document.querySelector('#editLogradouro').value,
        numero: document.querySelector('#editNumero').value,
        bairro: document.querySelector('#editBairro').value,
        cidade: document.querySelector('#editCidade').value,
        estado: document.querySelector('#editEstado').value.toUpperCase(),
        cep: document.querySelector('#editCep').value.replace(/\D/g, '')
      },
      telefone: document.querySelector('#editTelefone').value.replace(/\D/g, ''),
      servicosEssenciais: document.querySelector('#editServicosEssenciais').value.split(',').map(s => s.trim()).filter(s => s),
      servicosAmpliados: document.querySelector('#editServicosAmpliados').value.split(',').map(s => s.trim()).filter(s => s)
    };

    console.log('Dados atualizados:', JSON.stringify(unidadeData, null, 2));

    // Validação básica
    const requiredFields = [
      unidadeData.nome, unidadeData.tipo, unidadeData.cnes, unidadeData.endereco.logradouro,
      unidadeData.endereco.numero, unidadeData.endereco.bairro, unidadeData.endereco.cidade,
      unidadeData.endereco.estado, unidadeData.endereco.cep, unidadeData.telefone
    ];
    if (requiredFields.some(field => !field)) {
      showModal('Preencha todos os campos obrigatórios', true);
      return;
    }
    if (unidadeData.cnes.length !== 7) {
      showModal('CNES deve ter 7 dígitos', true);
      return;
    }
    if (unidadeData.endereco.estado.length !== 2) {
      showModal('Estado deve ter 2 letras (ex.: SP)', true);
      return;
    }
    if (unidadeData.endereco.cep.length < 8) {
      showModal('CEP inválido (mínimo 8 dígitos)', true);
      return;
    }
    if (unidadeData.telefone.length < 10) {
      showModal('Telefone inválido (mínimo 10 dígitos)', true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/unidades-saude/${unidadeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(unidadeData)
      });

      console.log('Resposta do servidor (status):', response.status);
      const responseText = await response.text();
      console.log('Resposta do servidor (texto):', responseText);

      if (!response.ok) {
        let errorMessage = 'Erro ao atualizar unidade de saúde';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage += `: Resposta inválida - ${responseText}`;
        }
        showModal(errorMessage, true);
        return;
      }

      showModal('Unidade de saúde atualizada com sucesso!');
      const editModal = document.getElementById('editModal');
      if (editModal) editModal.style.display = 'none';
      fetchUnidades().then(unidades => populateTable(unidades)); // Atualiza a tabela
    } catch (error) {
      console.error('Erro capturado:', error.message);
      showModal('Erro ao conectar com o servidor (verifique a rede ou token)', true);
    }
  }

  // Função para exibir o modal de confirmação de exclusão
  function showDeleteConfirmModal(unidade) {
    let modal = document.getElementById('deleteConfirmModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'deleteConfirmModal';
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
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background-color: #fff; padding: 20px; border-radius: 12px; width: 350px; max-width: 90%; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #d32f2f; font-size: 1.3em; text-align: center;">Confirmação de Exclusão</h3>
        <p style="text-align: center;">Tem certeza que deseja excluir a unidade de saúde <strong>${unidade.nome || 'N/A'}</strong>?</p>
        <div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">
          <button id="confirmDeleteBtn" style="padding: 8px 16px; background-color: #d32f2f; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Excluir</button>
          <button id="cancelDeleteBtn" style="padding: 8px 16px; background-color: #ccc; color: #000; border: none; border-radius: 6px; cursor: pointer;">Cancelar</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    const confirmButton = modal.querySelector('#confirmDeleteBtn');
    const cancelButton = modal.querySelector('#cancelDeleteBtn');

    confirmButton.onclick = async () => {
      await deleteUnidade(unidade.id);
      modal.style.display = 'none';
    };
    cancelButton.onclick = () => modal.style.display = 'none';
    modal.onclick = (event) => {
      if (event.target === modal) modal.style.display = 'none';
    };
  }

  // Função para deletar unidade de saúde
  async function deleteUnidade(unidadeId) {
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imorc1l4RmljVjBqenZmL0kiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2djeXNyaHZ0Ym9iZWt1enBzZnd1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2Y2ZkZWFkNS1jMTI4LTRlMDEtYjQwMC01YWI5NzRlZTFlOGEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ2OTg4NzQ4LCJpYXQiOjE3NDY5ODUxNDgsImVtYWlsIjoicXVlaXJvemRvdWdsYXM0NjZAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InF1ZWlyb3pkb3VnbGFzNDY2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJub21lIjoiRG91Z2xhcyBRdWVpcm96IiwicGFwZWwiOiJBRE1JTklTVFJBRE9SX1BSSU5DSVBBTCIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiNmNmZGVhZDUtYzEyOC00ZTAxLWI0MDAtNWFiOTc0ZWUxZThhIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDY5ODUxNDh9XSwic2Vzc2lvbl9pZCI6Ijc0OGQyNDk1LTU5YmUtNDQzZC05YjNjLTMxZTk1YTUzNDg4OSIsImlzX2Fub255bW91cyI6ZmFsc2V9.PFiHuQ96B5SwaezfSjOWgUZGf_Zum-9EGCix5E9yYqU';
    
    try {
      const response = await fetch(`${API_BASE_URL}/unidades-saude/${unidadeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Resposta do servidor (status):', response.status);
      const responseText = await response.text();
      console.log('Resposta do servidor (texto):', responseText);

      if (!response.ok) {
        let errorMessage = 'Erro ao deletar unidade de saúde';
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
        return;
      }

      showModal('Unidade de saúde deletada com sucesso!');
      fetchUnidades().then(unidades => populateTable(unidades)); // Atualiza a tabela
    } catch (error) {
      console.error('Erro capturado:', error.message);
      showModal('Erro ao conectar com o servidor (verifique a rede ou token)', true);
    }
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

  // Sidebar
  if (menu && sidebar && mainContent) {
    menu.onclick = function () {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('active');
    };
  } else {
    console.error('Elementos do sidebar não encontrados');
  }

  if (sidebarItems) {
    sidebarItems.forEach(item => {
      item.onclick = function () {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      };
    });
  } else {
    console.error('Itens do sidebar não encontrados');
  }
});
