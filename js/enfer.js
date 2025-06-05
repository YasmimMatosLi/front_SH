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
  const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';
  const triagemTableBody = document.querySelector('.tabela-triagens tbody');

  if (!triagemTableBody) {
    console.error('Erro: Elemento .tabela-triagens tbody não encontrado no DOM.');
    //showModal('Erro: Tabela de triagens não encontrada na página.', true);
    return;
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
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: left; max-width: 500px; max-height: 80vh; overflow-y: auto;">
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

  // Função para formatar a pressão arterial
  function formatarPressao(sistolica, diastolica) {
    return sistolica && diastolica ? `${sistolica}/${diastolica} mmHg` : 'N/A';
  }

  // Função para formatar a data
  function formatarData(data) {
    if (!data) return 'N/A';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // Função para listar triagens usando IDs individuais
  async function listarTriagens() {
    const token = localStorage.getItem('token');
    if (!token) {
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    // Substitua com IDs de triagem válidos
    const triagemIds = ['<id1>', '<id2>', '<id3>']; // Forneça IDs reais aqui
    const triagens = [];

    for (const id of triagemIds) {
      try {
        const response = await fetch(`${API_BASE_URL}/triagens/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const contentType = response.headers.get('Content-Type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Resposta para triagem ${id} não é JSON válido.`);
          }
          const triagem = await response.json();
          triagens.push(triagem);
        } else {
          const contentType = response.headers.get('Content-Type');
          let errorMessage = response.statusText;
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || response.statusText;
          }
          console.warn(`Erro ao buscar triagem ${id} (Status ${response.status}):`, errorMessage);
        }
      } catch (error) {
        console.error(`Erro ao buscar triagem ${id}:`, error);
      }
    }

    if (triagens.length === 0) {
      showModal('Nenhuma triagem encontrada. Forneça IDs válidos ou verifique o endpoint.', false);
      triagemTableBody.innerHTML = '';
      return;
    }

    preencherTabela(triagens);
  }

  // Função para preencher a tabela com triagens
  function preencherTabela(triagens) {
    triagemTableBody.innerHTML = '';
    triagens.forEach(triagem => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${triagem.id || 'N/A'}</td>
        <td>${triagem.paciente?.nome || 'N/A'}</td>
        <td>${formatarData(triagem.dataTriagem)}</td>
        <td>${formatarPressao(triagem.sinaisVitais?.pressaoArterialSistolica, triagem.sinaisVitais?.pressaoArterialDiastolica)}</td>
        <td>${triagem.sinaisVitais?.temperatura ? `${triagem.sinaisVitais.temperatura} °C` : 'N/A'}</td>
        <td>${triagem.peso ? `${triagem.peso} kg` : 'N/A'}</td>
        <td>${triagem.queixaPrincipal || 'N/A'}</td>
        <td>
          <button class="btn-view" data-id="${triagem.id}">Ver</button>
          <button class="btn-edit" data-id="${triagem.id}">Editar</button>
          <button class="btn-delete" data-id="${triagem.id}">Excluir</button>
        </td>
      `;
      triagemTableBody.appendChild(tr);
    });

    // Adiciona eventos aos botões com verificação
    const viewButtons = document.querySelectorAll('.btn-view');
    if (viewButtons.length > 0) {
      viewButtons.forEach(button => {
        button.addEventListener('click', () => {
          const triagemId = button.getAttribute('data-id');
          mostrarDetalhesTriagem(triagemId);
        });
      });
    } else {
      console.warn('Nenhum botão .btn-view encontrado.');
    }

    const editButtons = document.querySelectorAll('.btn-edit');
    if (editButtons.length > 0) {
      editButtons.forEach(button => {
        button.addEventListener('click', () => {
          showModal('Funcionalidade de edição ainda não implementada.', true);
        });
      });
    } else {
      console.warn('Nenhum botão .btn-edit encontrado.');
    }

    const deleteButtons = document.querySelectorAll('.btn-delete');
    if (deleteButtons.length > 0) {
      deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
          showModal('Funcionalidade de exclusão ainda não implementada.', true);
        });
      });
    } else {
      console.warn('Nenhum botão .btn-delete encontrado.');
    }
  }

  // Função para buscar detalhes de uma triagem específica
async function mostrarDetalhesTriagem(triagemId) {
  const token = localStorage.getItem('token');
  if (!token) {
    showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
    setTimeout(() => window.location.href = 'index.html', 2000);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/triagens/${triagemId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta não é JSON válido.');
      }

      const triagem = await response.json();
      const detalhes = `
        <h3>Detalhes da Triagem</h3>
        <p><strong>ID:</strong> ${triagem.id || 'N/A'}</p>
        <p><strong>Paciente:</strong> ${triagem.paciente?.nome || 'N/A'}</p>
        <p><strong>Data:</strong> ${formatarData(triagem.dataTriagem)}</p>
        <p><strong>Pressão Arterial:</strong> ${formatarPressao(triagem.sinaisVitais?.pressaoArterialSistolica, triagem.sinaisVitais?.pressaoArterialDiastolica)}</p>
        <p><strong>Temperatura:</strong> ${triagem.sinaisVitais?.temperatura ? `${triagem.sinaisVitais.temperatura} °C` : 'N/A'}</p>
        <p><strong>Frequência Cardíaca:</strong> ${triagem.sinaisVitais?.frequenciaCardiaca ? `${triagem.sinaisVitais.frequenciaCardiaca} bpm` : 'N/A'}</p>
        <p><strong>Frequência Respiratória:</strong> ${triagem.sinaisVitais?.frequenciaRespiratoria ? `${triagem.sinaisVitais.frequenciaRespiratoria} rpm` : 'N/A'}</p>
        <p><strong>Saturação de Oxigênio:</strong> ${triagem.sinaisVitais?.saturacaoOxigenio ? `${triagem.sinaisVitais.saturacaoOxigenio}%` : 'N/A'}</p>
        <p><strong>Nível de Dor:</strong> ${triagem.sinaisVitais?.nivelDor ?? 'N/A'}</p>
        <p><strong>Estado Consciente:</strong> ${triagem.sinaisVitais?.estadoConsciente ? 'Sim' : 'Não'}</p>
        <p><strong>Peso:</strong> ${triagem.peso ? `${triagem.peso} kg` : 'N/A'}</p>
        <p><strong>Queixa Principal:</strong> ${triagem.queixaPrincipal || 'N/A'}</p>
        <p><strong>Unidade de Saúde ID:</strong> ${triagem.unidadeSaudeId || 'N/A'}</p>
        <p><strong>Enfermeiro ID:</strong> ${triagem.enfermeiroId || 'N/A'}</p>
      `;
      showModal(detalhes, false);
    } else {
      const contentType = response.headers.get('Content-Type');
      let errorMessage = response.statusText;
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || response.statusText;
      }
      console.error(`Erro ao buscar triagem ${triagemId} (Status ${response.status}):`, errorMessage);
      showModal(`Erro ao buscar triagem: ${errorMessage}`, true);
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes da triagem:', error);
    showModal(`Erro ao buscar detalhes da triagem: ${error.message || 'Tente novamente.'}`, true);
  }
}

// Função para listar triagens
async function listarTriagens() {
  const token = localStorage.getItem('token');
  if (!token) {
    showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
    setTimeout(() => window.location.href = 'index.html', 2000);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/triagens/pacientes/63498562-d037-403d-89ce-9e970070e025`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const triagens = await response.json();
    console.log('Dados das triagens:', triagens);
    preencherTabela(triagens);
  } catch (error) {
    console.error('Erro ao buscar triagens:', error);
    showModal('Não foi possível carregar as triagens. Verifique a rede ou o token.', true);
  }
}

// Função para preencher a tabela com os dados
function preencherTabela(triagens) {
  const tabela = document.querySelector('.tabela-triagens');
  if (!tabela) {
    console.error('Tabela .tabela-triagens não encontrada no DOM.');
    showModal('Erro: Tabela de triagens não encontrada.', true);
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
  triagens.forEach(triagem => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${triagem.id || 'N/A'}</td>
      <td>${triagem.paciente?.nome || 'N/A'}</td>
      <td>${formatarData(triagem.dataTriagem)}</td>
      <td>${formatarPressao(triagem.sinaisVitais?.pressaoArterialSistolica, triagem.sinaisVitais?.pressaoArterialDiastolica)}</td>
      <td>${triagem.sinaisVitais?.temperatura ? `${triagem.sinaisVitais.temperatura} °C` : 'N/A'}</td>
      <td>${triagem.peso ? `${triagem.peso} kg` : 'N/A'}</td>
      <td>${triagem.queixaPrincipal || 'N/A'}</td>
      <td>
        <button class="detalhes" onclick="mostrarDetalhesTriagem('${triagem.id}')">Detalhes</button>
        <button class="editar" onclick="editarTriagem('${triagem.id}')">Editar</button>
        <button class="excluir" onclick="excluirTriagem('${triagem.id}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Funções para editar e excluir triagem
window.editarTriagem = function (id) {
  window.location.href = `PaginaEnferTriagemEditar.html?id=${id}`;
};

window.excluirTriagem = async function (id) {
  if (confirm('Tem certeza que deseja excluir esta triagem?')) {
    const token = localStorage.getItem('token');
    if (!token) {
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/triagens/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir triagem: ${response.status}`);
      }

      showModal('Triagem excluída com sucesso!');
      listarTriagens(); // Recarrega a tabela
    } catch (error) {
      console.error('Erro ao excluir triagem:', error);
      showModal('Erro ao excluir triagem: Tente novamente.', true);
    }
  }
};

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se o botão de adicionar triagem existe
  const botaoAdicionar = document.querySelector('.adicionar');
  if (botaoAdicionar) {
    botaoAdicionar.addEventListener('click', () => {
      window.location.href = 'PaginaEnferTriagemCriar.html';
    });
  } else {
    console.warn('Botão .adicionar não encontrado no DOM.');
  }

  // Carrega a lista de triagens
  listarTriagens();
});
})