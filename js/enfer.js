// Função para mostrar ou diminuir o sidebar
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const sidebarItems = document.querySelectorAll('.sidebar--items li'); // Seleciona todos os itens da lista

  if (menu && sidebar && mainContent) {
    menu.onclick = function () {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('active');
    };
  } else {
    console.error('Elementos do sidebar não encontrados');
  }

  // Adiciona evento de clique para cada item do sidebar
  if (sidebarItems) {
    sidebarItems.forEach(item => {
      item.onclick = function () {
        // Remove 'active' de todos os itens
        sidebarItems.forEach(i => i.classList.remove('active'));
        // Adiciona 'active' ao item clicado
        item.classList.add('active');
      };
    });
  } else {
    console.error('Itens do sidebar não encontrados');
  }

  //adiciona paciente

  document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';
  const formularioPaciente = document.querySelector('.formulario-paciente');

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

  // Função para cadastrar paciente
  async function cadastrarPaciente(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    // Coleta os dados do formulário
    const formData = new FormData(formularioPaciente);
    const gruposRisco = Array.from(formularioPaciente.querySelectorAll('input[name="gruposRisco"]:checked')).map(input => input.value);

    const pacienteData = {
      nome: formData.get('nome'),
      cpf: formData.get('cpf'),
      cns: formData.get('cns'),
      dataNascimento: formData.get('dataNascimento'),
      sexo: formData.get('sexo'),
      racaCor: formData.get('racaCor'),
      escolaridade: formData.get('escolaridade'),
      endereco: {
        logradouro: formData.get('logradouro'),
        numero: formData.get('numero'),
        bairro: formData.get('bairro'),
        cidade: formData.get('cidade'),
        estado: formData.get('estado'),
        cep: formData.get('cep')
      },
      telefone: formData.get('telefone'),
      email: formData.get('email'),
      gruposRisco: gruposRisco,
      unidadeSaudeId: formData.get('unidadeSaudeId'),
      consentimentoLGPD: formData.get('consentimentoLGPD') === 'on'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pacienteData)
      });

      if (response.ok) {
        showModal('Paciente cadastrado com sucesso!');
        formularioPaciente.reset(); // Limpa o formulário
      } else {
        const errorData = await response.json();
        console.error(`Erro da API (Status ${response.status}):`, errorData); // Loga o erro com status
        showModal(`Erro ao cadastrar paciente: ${errorData.message || response.statusText}`, true);
      }
    } catch (error) {
      console.error('Erro ao enviar requisição:', error); // Loga o erro no console
      showModal('Erro ao cadastrar paciente. Tente novamente.', true);
    }
  }

  // Adiciona o evento de submissão ao formulário
  formularioPaciente.addEventListener('submit', cadastrarPaciente);
});


document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';
  const patientTableBody = document.querySelector('.patient-table tbody');
  const searchInput = document.querySelector('#searchInput');
  const searchBtn = document.querySelector('#searchBtn');

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
      modal.innerHTML = `
        <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: left; max-width: 400px; max-height: 80vh; overflow-y: auto;">
          <p id="modalMessage" style="margin: 0 0 15px 0;"></p>
          <button id="closeModal" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modalMessage = modal.querySelector('#modalMessage');
    const closeButton = modal.querySelector('#closeModal');

    modalMessage.innerHTML = message; // Usa innerHTML para suportar HTML nos detalhes do paciente
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


//para fazer uma triagem
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';
  const formTriagem = document.querySelector('#formTriagem');

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
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: left; max-width: 400px;">
        <p id="modalMessage" style="margin: 0 0 15px 0; color: ${isError ? '#d32f2f' : '#2e7d32'};">${message}</p>
        <button id="closeModal" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
      </div>
    `;

    modal.style.display = 'flex';
    modal.querySelector('div').style.backgroundColor = isError ? '#ffe6e6' : '#e6ffe6';

    const closeButton = modal.querySelector('#closeModal');
    closeButton.onclick = () => modal.style.display = 'none';
    modal.onclick = (event) => {
      if (event.target === modal) modal.style.display = 'none';
    };
  }

  // Evento de envio do formulário
  formTriagem.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    const formData = new FormData(formTriagem);
    const triagemData = {
      pacienteId: formData.get('pacienteId'),
      unidadeSaudeId: formData.get('unidadeSaudeId'),
      enfermeiroId: formData.get('enfermeiroId'),
      sinaisVitais: {
        pressaoArterialSistolica: parseInt(formData.get('pressaoArterialSistolica')),
        pressaoArterialDiastolica: parseInt(formData.get('pressaoArterialDiastolica')),
        frequenciaCardiaca: parseInt(formData.get('frequenciaCardiaca')),
        frequenciaRespiratoria: parseInt(formData.get('frequenciaRespiratoria')),
        saturacaoOxigenio: parseInt(formData.get('saturacaoOxigenio')),
        temperatura: parseFloat(formData.get('temperatura')),
        nivelDor: parseInt(formData.get('nivelDor')),
        estadoConsciente: formData.get('estadoConsciente') === 'true'
      },
      queixaPrincipal: formData.get('queixaPrincipal')
    };

    try {
      const response = await fetch(`${API_BASE_URL}/triagens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(triagemData)
      });

      if (response.ok) {
        showModal('Triagem criada com sucesso!', false);
        formTriagem.reset(); // Limpa o formulário
      } else {
        const errorData = await response.json();
        console.error(`Erro ao criar triagem (Status ${response.status}):`, errorData);
        showModal(`Erro ao criar triagem: ${errorData.message || response.statusText}`, true);
      }
    } catch (error) {
      console.error('Erro ao enviar triagem:', error);
      showModal('Erro ao criar triagem. Tente novamente.', true);
    }
  });
});

//ver os dados da triagem

document.addEventListener('DOMContentLoaded', () => {
  console.log('enfer.js loaded'); // Debug to confirm script runs once

  // Function to fetch triagens from the API
  async function fetchTriagens() {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      if (!token) {
        console.error('No authentication token found');
        alert('Por favor, faça login para acessar as triagens.');
        return;
      }

      const response = await fetch('https://sistema-hospitalar.onrender.com/api', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const triagens = await response.json();
      populateTable(triagens);
    } catch (error) {
      console.error('Error fetching triagens:', error);
      alert('Erro ao carregar triagens. Verifique o console para detalhes.');
    }
  }

  // Function to populate the table with triagem data
  function populateTable(triagens) {
    const tbody = document.getElementById('triagens-tbody');
    if (!tbody) {
      console.error('Table body element not found');
      return;
    }

    // Clear existing rows
    tbody.innerHTML = '';

    // Check if triagens is an array and not empty
    if (!Array.isArray(triagens) || triagens.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8">Nenhuma triagem encontrada</td></tr>';
      return;
    }

    // Iterate over triagens and create table rows
    triagens.forEach(triagem => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${triagem.id}</td>
        <td>${triagem.pacienteId}</td>
        <td>${new Date(triagem.data).toLocaleDateString('pt-BR')}</td>
        <td>${triagem.pressao}</td>
        <td>${triagem.temperatura}</td>
        <td>${triagem.peso}</td>
        <td>${triagem.observacoes}</td>
        <td>
          <button class="btn-view" onclick="viewTriagem('${triagem.id}')">Ver</button>
          <button class="btn-edit" onclick="editTriagem('${triagem.id}')">Editar</button>
          <button class="btn-delete" onclick="deleteTriagem('${triagem.id}')">Excluir</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // Placeholder functions for action buttons
  function viewTriagem(id) {
    window.location.href = `PaginaEnferTriagemDetalhe.html?id=${id}`;
  }

  function editTriagem(id) {
    window.location.href = `PaginaEnferTriagemEditar.html?id=${id}`;
  }

  async function deleteTriagem(id) {
    if (confirm('Tem certeza que deseja excluir esta triagem?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://sistema-hospitalar.onrender.com/api/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Triagem excluída com sucesso!');
          fetchTriagens(); // Refresh the table
        } else {
          throw new Error('Erro ao excluir triagem');
        }
      } catch (error) {
        console.error('Error deleting triagem:', error);
        alert('Erro ao excluir triagem. Verifique o console para detalhes.');
      }
    }
  }

  // Fetch triagens when the page loads
  fetchTriagens();
});