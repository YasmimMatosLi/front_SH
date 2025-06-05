const API_BASE = 'https://sistema-hospitalar.onrender.com/api';
const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
  // Elementos da sidebar
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content'); // Corrigido para camelCase
  const sidebarItems = document.querySelector('.sidebar--items'); // Corrigido para usar a classe
  const sidebarItemElements = document.querySelectorAll('.sidebar--item'); // Usando querySelectorAll para pegar todos

  // Elemento para o nome do médico
  const welcomeTitle = document.querySelector('.profile-info h2');

  // Logs de depuração
  console.log('menu:', menu);
  console.log('sidebar:', sidebar);
  console.log('mainContent:', mainContent);
  console.log('sidebarItems:', sidebarItems);
  console.log('sidebarItemElements:', sidebarItemElements);
  console.log('welcomeTitle:', welcomeTitle);

  // Função para exibir modal de mensagem
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

    const modalMessage = modal.querySelector('#modalMessage');
    const closeButton = modal.querySelector('#closeModal');

    modalMessage.textContent = message;
    modal.style.display = 'flex';
    modal.querySelector('div').style.backgroundColor = isError ? '#ffe6e6' : '#e6ffe6';
    modalMessage.style.color = isError ? '#d32f2f' : '#2e7d32';

    closeButton.onclick = () => modal.style.display = 'none';
    modal.onclick = (event) => {
      if (event.target === modal) modal.style.display = 'none';
    };
  }

  // Funcionalidade da sidebar
  if (menu && sidebar && mainContent) {
    menu.onclick = function() {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('active');
    };
  } else {
    console.error('Elementos da sidebar não encontrados:', { menu, sidebar, mainContent });
  }

  // Funcionalidade dos itens da sidebar
  if (sidebarItems && sidebarItemElements.length > 0) {
    sidebarItems.onclick = function() {
      sidebarItemElements.forEach(item => {
        item.classList.toggle('active');
      });
    };
  } else {
    console.error('Elementos sidebar--items ou sidebar--item não encontrados:', { sidebarItems, sidebarItemElements });
  }

  // Função para obter o nome do médico logado
  async function getLoggedInMedicoName() {
    const token = localStorage.getItem('token') || localStorage.getItem('medico_token'); // Suporte para ambos os nomes
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      // Extrai o medicoId do token (assumindo que está no payload JWT, campo 'sub')
      const payload = JSON.parse(atob(token.split('.')[1]));
      const medicoId = payload.sub; // 'sub' geralmente contém o ID do usuário no JWT
      if (!medicoId) {
        throw new Error('ID do médico não encontrado no token');
      }

      // Faz a requisição para listar todos os médicos
      const response = await fetch(`${API_BASE_URL}/medicos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const medicos = await response.json();
        // Encontra o médico logado comparando o ID
        const loggedInMedico = medicos.find(medico => medico.id === medicoId || medico._id === medicoId);
        if (loggedInMedico) {
          const medicoName = loggedInMedico.nome || loggedInMedico.nomeCompleto || 'Médico';
          welcomeTitle.textContent = `Bem-vindo, Dr. ${medicoName}!`;
          console.log(`Médico logado: ${medicoName}`);
        } else {
          throw new Error('Médico logado não encontrado na lista');
        }
      } else if (response.status === 401) {
        console.error('Erro: Token inválido');
        //showModal('Erro: Token inválido. Faça login novamente.', true);
        //setTimeout(() => window.location.href = 'index.html', 2000);
      } else {
        console.error(`Erro ao listar médicos: Status ${response.status}`);
        showModal(`Erro ao listar médicos: Status ${response.status}.`, true);
      }
    } catch (error) {
      console.error('Erro ao processar token ou requisição:', error.message);
      //showModal('Erro ao obter informações do médico. Faça login novamente.', true);
      //setTimeout(() => window.location.href = 'index.html', 2000);
    }
  }

  // Chama a função para obter o nome do médico logado
  getLoggedInMedicoName();

  // Funções de consultas
  async function buscarConsulta() {
    const token = localStorage.getItem('medico_token') || localStorage.getItem('token');
    const id = document.getElementById('pesquisarConsulta')?.value;
    if (!id) return showModal('Digite o ID da consulta.', true);

    try {
      const res = await fetch(`${API_BASE}/consultas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return showModal('Consulta não encontrada.', true);
      const data = await res.json();
      mostrarDetalhes(data);
    } catch (error) {
      console.error('Erro ao buscar consulta:', error.message);
      showModal('Erro ao buscar consulta.', true);
    }
  }

  function mostrarDetalhes(data) {
    const detalhesConsulta = document.getElementById('detalhesConsulta');
    if (detalhesConsulta) {
      detalhesConsulta.style.display = 'block';
      document.getElementById('detalhe-id').textContent = data.id || 'N/A';
      document.getElementById('detalhe-paciente').textContent = data.pacienteId || 'N/A';
      document.getElementById('detalhe-unidade').textContent = data.unidadeSaudeId || 'N/A';
      document.getElementById('detalhe-observacoes').textContent = data.observacoes || 'N/A';
      document.getElementById('detalhe-cid').textContent = data.cid10 || 'N/A';
    } else {
      console.error('Elemento detalhesConsulta não encontrado');
    }
  }

  function abrirFormularioCriacao() {
    const formNovaConsulta = document.getElementById('formNovaConsulta');
    const detalhesConsulta = document.getElementById('detalhesConsulta');
    if (formNovaConsulta && detalhesConsulta) {
      formNovaConsulta.style.display = 'block';
      detalhesConsulta.style.display = 'none';
    } else {
      console.error('Elementos formNovaConsulta ou detalhesConsulta não encontrados');
    }
  }

  async function criarConsulta(event) {
    event.preventDefault();
    const token = localStorage.getItem('medico_token') || localStorage.getItem('token');
    const payload = {
      pacienteId: document.getElementById('novoPacienteId')?.value || '',
      unidadeSaudeId: document.getElementById('novaUnidadeId')?.value || '',
      observacoes: document.getElementById('novaObservacao')?.value || '',
      cid10: document.getElementById('novoCid')?.value || ''
    };

    try {
      const res = await fetch(`${API_BASE}/consultas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) return showModal('Erro ao criar consulta.', true);
      const data = await res.json();
      showModal(`Consulta criada com ID: ${data.id}`);
      const form = document.getElementById('formNovaConsulta');
      if (form) {
        form.reset();
        form.style.display = 'none';
      }
    } catch (error) {
      console.error('Erro ao criar consulta:', error.message);
      showModal('Erro ao criar consulta.', true);
    }
  }

  // Expor funções globais, se necessário
  window.buscarConsulta = buscarConsulta;
  window.abrirFormularioCriacao = abrirFormularioCriacao;
  window.criarConsulta = criarConsulta;
});


//mostrar os pcientes no modulo medico

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';
  const patientTable = document.querySelector('.patient-table');
  const searchInput = document.querySelector('#searchInput');
  const searchBtn = document.querySelector('#searchBtn');

  // Adiciona o tbody à tabela, se não estiver presente
  let patientTableBody = patientTable.querySelector('tbody');
  if (!patientTableBody) {
    patientTableBody = document.createElement('tbody');
    patientTable.appendChild(patientTableBody);
  }

  // Função para exibir modal de mensagem ou detalhes
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
      document.body.appendChild(modal); // Append first to avoid race conditions
    }

    // Create or update modal content
    modal.innerHTML = `
      <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: left; max-width: 400px; max-height: 80vh; overflow-y: auto;">
        <p id="modalMessage" style="margin: 0 0 15px 0;"></p>
        <button id="closeModal" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
      </div>
    `;

    const modalMessage = modal.querySelector('#modalMessage');
    const closeButton = modal.querySelector('#closeModal');

    if (!modalMessage) {
      console.error('Erro: Não foi possível encontrar o elemento #modalMessage');
      return;
    }

    modalMessage.innerHTML = message; // Use innerHTML for HTML content
    modal.style.display = 'flex';
    modal.querySelector('div').style.backgroundColor = isError ? '#ffe6e6' : '#e6ffe6';
    modalMessage.style.color = isError ? '#d32f2f' : '#2e7d32';

    closeButton.onclick = () => modal.style.display = 'none';
    modal.onclick = (event) => {
      if (event.target === modal) modal.style.display = 'none';
    };
  }

  // Função para calcular a idade com base na data de nascimento
  function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesDiff = hoje.getMonth() - nascimento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  // Função para buscar lista de pacientes
  async function listarPacientes() {
    const token = localStorage.getItem('token');
    if (!token) {
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const pacientes = await response.json();
        if (!Array.isArray(pacientes) || pacientes.length === 0) {
          showModal('Nenhum paciente encontrado.', false);
          patientTableBody.innerHTML = '';
          return;
        }

        // Preenche a tabela com os pacientes
        preencherTabela(pacientes);
      } else {
        const errorData = await response.json();
        console.error(`Erro ao listar pacientes (Status ${response.status}):`, errorData);
        showModal(`Erro ao listar pacientes: ${errorData.message || response.statusText}`, true);
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      showModal('Erro ao listar pacientes. Tente novamente.', true);
    }
  }

  // Função para preencher a tabela com pacientes
  function preencherTabela(pacientes) {
    patientTableBody.innerHTML = '';
    pacientes.forEach(paciente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${paciente.nome || 'Sem Nome'}</td>
        <td>${paciente.dataNascimento ? calcularIdade(paciente.dataNascimento) : 'N/A'}</td>
        <td>${paciente.sexo || 'N/A'}</td>
        <td>${paciente.cpf || 'N/A'}</td>
        <td>
          <button class="btn-view" data-id="${paciente.id}">Ver</button>
        </td>
      `;
      patientTableBody.appendChild(tr);
    });

    // Adiciona eventos aos botões "Ver"
    document.querySelectorAll('.btn-view').forEach(button => {
      button.addEventListener('click', () => {
        const pacienteId = button.getAttribute('data-id');
        mostrarDetalhesPaciente(pacienteId);
      });
    });
  }

  // Função para buscar e exibir detalhes de um paciente
  async function mostrarDetalhesPaciente(pacienteId) {
    const token = localStorage.getItem('token');
    if (!token) {
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const paciente = await response.json();
        const detalhes = `
          <h3>Detalhes do Paciente</h3>
          <p><strong>Nome:</strong> ${paciente.nome || 'N/A'}</p>
          <p><strong>CPF:</strong> ${paciente.cpf || 'N/A'}</p>
          <p><strong>Cartão SUS (CNS):</strong> ${paciente.cns || 'N/A'}</p>
          <p><strong>Data de Nascimento:</strong> ${paciente.dataNascimento || 'N/A'}</p>
          <p><strong>Idade:</strong> ${paciente.dataNascimento ? calcularIdade(paciente.dataNascimento) : 'N/A'}</p>
          <p><strong>Sexo:</strong> ${paciente.sexo || 'N/A'}</p>
          <p><strong>Raça/Cor:</strong> ${paciente.racaCor || 'N/A'}</p>
          <p><strong>Escolaridade:</strong> ${paciente.escolaridade || 'N/A'}</p>
          <p><strong>Endereço:</strong> ${paciente.endereco ? 
            `${paciente.endereco.logradouro || ''} ${paciente.endereco.numero || ''}, ${paciente.endereco.bairro || ''}, ${paciente.endereco.cidade || ''} - ${paciente.endereco.estado || ''}, ${paciente.endereco.cep || ''}` : 'N/A'}</p>
          <p><strong>Telefone:</strong> ${paciente.telefone || 'N/A'}</p>
          <p><strong>E-mail:</strong> ${paciente.email || 'N/A'}</p>
          <p><strong>Grupos de Risco:</strong> ${paciente.gruposRisco && paciente.gruposRisco.length > 0 ? paciente.gruposRisco.join(', ') : 'Nenhum'}</p>
          <p><strong>Unidade de Saúde ID:</strong> ${paciente.unidadeSaudeId || 'N/A'}</p>
          <p><strong>Consentimento LGPD:</strong> ${paciente.consentimentoLGPD ? 'Sim' : 'Não'}</p>
        `;
        showModal(detalhes, false);
      } else {
        const errorData = await response.json();
        console.error(`Erro ao buscar paciente (Status ${response.status}):`, errorData);
        showModal(`Erro ao buscar paciente: ${errorData.message || response.statusText}`, true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do paciente:', error);
      showModal('Erro ao buscar detalhes do paciente. Tente novamente.', true);
    }
  }

  // Função para filtrar pacientes por CPF
  function filtrarPacientes() {
    const termo = searchInput.value.toLowerCase();
    const rows = patientTableBody.querySelectorAll('tr');
    rows.forEach(row => {
      const cpf = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
      row.style.display = cpf.includes(termo) ? '' : 'none';
    });
  }

  // Adiciona eventos à barra de pesquisa
  searchBtn.addEventListener('click', filtrarPacientes);
  searchInput.addEventListener('input', filtrarPacientes);

  // Carrega a lista de pacientes ao iniciar
  listarPacientes();
});

//prescricoesssss


// Função para exibir mensagens de erro ou sucesso
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

  const modalMessage = modal.querySelector('#modalMessage');
  const closeButton = modal.querySelector('#closeModal');

  if (modalMessage) {
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    modal.querySelector('div').style.backgroundColor = isError ? '#ffe6e6' : '#e6ffe6';
    modalMessage.style.color = isError ? '#d32f2f' : '#2e7d32';

    closeButton.onclick = () => modal.style.display = 'none';
    modal.onclick = (event) => {
      if (event.target === modal) modal.style.display = 'none';
    };
  } else {
    console.error('Elemento #modalMessage não encontrado no modal.');
  }
}

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  // Função para buscar prescrições da API
  async function fetchPrescricoes() {
    try {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imorc1l4RmljVjBqenZmL0kiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2djeXNyaHZ0Ym9iZWt1enBzZnd1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhNDQ0Y2ZmZS1jZDQxLTQwMTEtYjc0Yi04M2U2ZjBjZjc3MTAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ2OTk3MzA2LCJpYXQiOjE3NDY5OTM3MDYsImVtYWlsIjoiZGV2LnF1ZWlyb3owNUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiZGV2LnF1ZWlyb3owNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibm9tZSI6Ikpvw6NvIFNhbnRvcyIsInBhcGVsIjoiRU5GRVJNRUlSTyIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYTQ0NGNmZmUtY2Q0MS00MDExLWI3NGItODNlNmYwY2Y3NzEwIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDY5OTM3MDZ9XSwic2Vzc2lvbl9pZCI6ImIwZDE3ZmE5LTkwMGItNGQxMy04MDVmLTNjODcyNmVkZDFiOSIsImlzX2Fub255bW91cyI6ZmFsc2V9.gP7sqV6bvSZiM-8gglaRA88v1uDKfOgSl46ZMuGuUso';
      if (!token) {
        showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/prescricoes/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const prescricoes = await response.json();
      preencherTabela(prescricoes);
    } catch (error) {
      console.error('Erro ao buscar prescrições:', error);
      //showModal('Não foi possível carregar as prescrições. Verifique a rota da API ou o token.', true);
    }
  }

  // Função para preencher a tabela com os dados
  function preencherTabela(prescricoes) {
    const tabela = document.querySelector('.tabela-prescricoes');
    if (!tabela) {
      console.error('Tabela .tabela-prescricoes não encontrada no DOM.');
      showModal('Erro: Tabela de prescrições não encontrada.', true);
      return;
    }

    const tbody = tabela.querySelector('tbody');
    if (!tbody) {
      console.error('Elemento tbody não encontrado na tabela.');
      showModal('Erro: Estrutura da tabela inválida.', true);
      return;
    }

    // Limpa o conteúdo existente
    tbody.innerHTML = '';

    // Preenche a tabela com os dados
    prescricoes.forEach(prescricao => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${prescricao.id || 'N/A'}</td>
        <td>${prescricao.paciente?.nome || 'N/A'}</td>
        <td>${prescricao.medico?.nome || 'N/A'}</td>
        <td>${prescricao.data ? new Date(prescricao.data).toLocaleDateString('pt-BR') : 'N/A'}</td>
        <td>${prescricao.descricao || 'N/A'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Chama a função para carregar as prescrições
  fetchPrescricoes();
});