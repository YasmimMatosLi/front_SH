
document.addEventListener('DOMContentLoaded', () => {
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

  // Função para mostrar/esconder formulários com base no cargo
  function mostrarFormulario() {
    const cargo = document.getElementById('cargo').value;
    const formMedico = document.getElementById('formMedico');
    const formEnfermeiro = document.getElementById('formEnfermeiro');

    formMedico.style.display = 'none';
    formEnfermeiro.style.display = 'none';

    if (cargo === 'medico') {
      formMedico.style.display = 'block';
    } else if (cargo === 'enfermeiro') {
      formEnfermeiro.style.display = 'block';
    }
  }

  // Define a função globalmente para que o onchange do HTML funcione
  window.mostrarFormulario = mostrarFormulario;

  const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

  // Função para validar email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Função para validar data
  function validateDate(dateStr) {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && date < new Date(); // Deve ser no passado
  }

  // Função para exibir um modal centralizado
  function showModal(message, isError = false) {
    console.log('showModal chamado com mensagem:', message); // Log para depuração
    let modal = document.getElementById('customModal');
    if (!modal) {
      console.log('Criando novo modal');
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

    console.log('Modal criado, elementos encontrados:', { modalContent, modalMessage, closeButton });

    modalMessage.textContent = message;
    modalContent.style.backgroundColor = isError ? '#ffe6e6' : '#e6ffe6'; // Vermelho claro para erro, verde claro para sucesso
    modalMessage.style.color = isError ? '#d32f2f' : '#2e7d32'; // Texto vermelho escuro ou verde escuro
    modal.style.display = 'flex';

    // Associa os eventos
    closeButton.onclick = () => {
      console.log('Botão Fechar clicado');
      modal.style.display = 'none';
    };
    modal.onclick = (event) => {
      if (event.target === modal) {
        console.log('Clique fora do modal');
        modal.style.display = 'none';
      }
    };
  }

  // Função para cadastrar médico
  async function registerMedico(event) {
    event.preventDefault();

    // Pega o token do localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      showModal('Erro: Você precisa estar logado para cadastrar um médico. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    // Captura os valores do formulário
    const medicoData = {
      nome: document.querySelector('#formMedico input[name="nome"]').value,
      cpf: document.querySelector('#formMedico input[name="cpf"]').value.replace(/\D/g, ''),
      cns: document.querySelector('#formMedico input[name="cns"]').value.replace(/\D/g, ''),
      dataNascimento: document.querySelector('#formMedico input[name="dataNascimento"]').value,
      sexo: document.querySelector('#formMedico select[name="sexo"]').value,
      racaCor: document.querySelector('#formMedico select[name="racaCor"]').value,
      escolaridade: document.querySelector('#formMedico select[name="escolaridade"]').value,
      telefone: document.querySelector('#formMedico input[name="telefone"]').value.replace(/\D/g, ''),
      endereco: {
        logradouro: document.querySelector('#formMedico input[name="logradouro"]').value,
        numero: document.querySelector('#formMedico input[name="numero"]').value,
        bairro: document.querySelector('#formMedico input[name="bairro"]').value,
        cidade: document.querySelector('#formMedico input[name="cidade"]').value,
        estado: document.querySelector('#formMedico input[name="estado"]').value.toUpperCase(),
        cep: document.querySelector('#formMedico input[name="cep"]').value.replace(/\D/g, '')
      },
      email: document.querySelector('#formMedico input[name="email"]').value,
      senha: document.querySelector('#formMedico input[name="senha"]').value,
      dataContratacao: document.querySelector('#formMedico input[name="dataContratacao"]').value,
      crm: document.querySelector('#formMedico input[name="crm"]').value,
      unidadeSaudeId: document.querySelector('#formMedico input[name="unidadeSaudeId"]').value
    };

    console.log('Dados enviados:', medicoData);

    // Validação básica
    if (!medicoData.nome || !medicoData.cpf || !medicoData.cns || !medicoData.email || !medicoData.senha || !medicoData.crm || !medicoData.unidadeSaudeId) {
      showModal('Preencha todos os campos obrigatórios', true);
      return;
    }
    if (!validateEmail(medicoData.email)) {
      showModal('Email inválido', true);
      return;
    }
    if (medicoData.cpf.length !== 11) {
      showModal('CPF deve ter 11 dígitos', true);
      return;
    }
    if (medicoData.senha.length < 8) {
      showModal('A senha deve ter pelo menos 8 caracteres', true);
      return;
    }
    if (!medicoData.dataNascimento || !validateDate(medicoData.dataNascimento)) {
      showModal('Data de nascimento inválida ou no futuro', true);
      return;
    }
    if (!medicoData.sexo || medicoData.sexo === '') {
      showModal('Selecione um sexo', true);
      return;
    }
    if (!medicoData.racaCor || medicoData.racaCor === '') {
      showModal('Selecione uma raça/cor', true);
      return;
    }
    if (!medicoData.escolaridade || medicoData.escolaridade === '') {
      showModal('Selecione uma escolaridade', true);
      return;
    }
    if (medicoData.telefone.length < 10) {
      showModal('Telefone inválido (mínimo 10 dígitos)', true);
      return;
    }
    if (!medicoData.endereco.logradouro || !medicoData.endereco.numero || !medicoData.endereco.bairro ||
      !medicoData.endereco.cidade || !medicoData.endereco.estado || !medicoData.endereco.cep) {
      showModal('Preencha todos os campos de endereço', true);
      return;
    }
    if (!medicoData.dataContratacao) {
      showModal('Data de contratação é obrigatória', true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/medicos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicoData)
      });

      console.log('Resposta do servidor (status):', response.status);
      const responseText = await response.text();
      console.log('Resposta do servidor (texto):', responseText);

      if (!response.ok) {
        let errorMessage = 'Erro ao cadastrar médico';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage += `: Resposta inválida - ${responseText}`;
        }
        showModal(errorMessage, true);
        return;
      }

      showModal('Médico cadastrado com sucesso!');
      document.getElementById('formMedico').reset();
    } catch (error) {
      console.error('Erro capturado:', error.message);
      showModal('Erro ao conectar com o servidor (verifique a rede ou token)', true);
    }
  }

  // Vincula o evento ao formulário
  const formMedico = document.getElementById('formMedico');
  if (formMedico) {
    formMedico.addEventListener('submit', registerMedico);
  } else {
    console.error('Formulário com id "formMedico" não encontrado');
  }
});


//cadastra enfermeiro

const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Evento DOMContentLoaded disparado às:', new Date().toISOString());
  const form = document.getElementById('formEnfermeiro');

  if (!form) {
    console.error('Formulário com id "formEnfermeiro" não encontrado');
    return;
  }
  console.log('Formulário encontrado:', form);

  // Função para exibir modal centralizado
  function showModal(message, isError = false) {
    console.log('Exibindo modal:', message, 'isError:', isError);
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
        <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; width: 300px; max-width: 90%;">
          <p id="modalMessage" style="margin: 0 0 15px 0;"></p>
          <button id="closeModal" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; background-color: #ddd;">Fechar</button>
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

    closeButton.onclick = () => {
      console.log('Modal fechado pelo botão');
      modal.style.display = 'none';
    };
    modal.onclick = (event) => {
      if (event.target === modal) {
        console.log('Modal fechado clicando fora');
        modal.style.display = 'none';
      }
    };

    // Fecha automaticamente após 5 segundos
    setTimeout(() => {
      modal.style.display = 'none';
      console.log('Modal fechado automaticamente após 5 segundos');
    }, 5000);
  }

  // Funções de validação
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateCPF(cpf) {
    const re = /^\d{11}$/;
    return re.test(cpf.replace(/\D/g, ''));
  }

  function validateTelefone(telefone) {
    const re = /^\d{10,11}$/;
    return re.test(telefone.replace(/\D/g, ''));
  }

  function validateEstado(estado) {
    const re = /^[A-Z]{2}$/;
    return re.test(estado.toUpperCase());
  }

  function validateCEP(cep) {
    const re = /^\d{8}$/;
    return re.test(cep.replace(/\D/g, ''));
  }

  // Função para validar todos os campos antes do envio
  function validateForm() {
    const fields = {
      nome: document.getElementById('nome2').value.trim(),
      cpf: document.getElementById('cpf2').value.trim(),
      cns: document.getElementById('cns2').value.trim(),
      dataNascimento: document.getElementById('dataNascimento2').value,
      sexo: document.getElementById('sexo2').value,
      racaCor: document.getElementById('racaCor2').value,
      escolaridade: document.getElementById('escolaridade2').value,
      logradouro: document.getElementById('logradouro2').value.trim(),
      numero: document.getElementById('numero2').value.trim(),
      bairro: document.getElementById('bairro2').value.trim(),
      cidade: document.getElementById('cidade2').value.trim(),
      estado: document.getElementById('estado2').value.trim(),
      cep: document.getElementById('cep2').value.trim(),
      telefone: document.getElementById('telefone2').value.trim(),
      email: document.getElementById('email2').value.trim(),
      senha: document.getElementById('senha2').value,
      dataContratacao: document.getElementById('dataContratacao2').value,
      coren: document.getElementById('coren2').value.trim(),
      unidadeSaudeId: document.getElementById('unidadeSaudeId2').value.trim()
    };

    if (!fields.nome) {
      showModal('Nome é obrigatório', true);
      return false;
    }
    if (!validateCPF(fields.cpf)) {
      showModal('CPF inválido (deve ter 11 dígitos)', true);
      return false;
    }
    if (!fields.cns || fields.cns.length !== 15) {
      showModal('CNS inválido (deve ter 15 dígitos)', true);
      return false;
    }
    if (!fields.dataNascimento) {
      showModal('Data de Nascimento é obrigatória', true);
      return false;
    }
    if (!fields.sexo) {
      showModal('Sexo é obrigatório', true);
      return false;
    }
    if (!fields.racaCor) {
      showModal('Raça/Cor é obrigatória', true);
      return false;
    }
    if (!fields.escolaridade) {
      showModal('Escolaridade é obrigatória', true);
      return false;
    }
    if (!fields.logradouro || !fields.numero || !fields.bairro || !fields.cidade) {
      showModal('Todos os campos de endereço (exceto CEP) são obrigatórios', true);
      return false;
    }
    if (!validateEstado(fields.estado)) {
      showModal('Estado inválido (deve ter 2 letras)', true);
      return false;
    }
    if (!validateCEP(fields.cep)) {
      showModal('CEP inválido (deve ter 8 dígitos)', true);
      return false;
    }
    if (!validateTelefone(fields.telefone)) {
      showModal('Telefone inválido (deve ter 10 ou 11 dígitos)', true);
      return false;
    }
    if (!validateEmail(fields.email)) {
      showModal('Email inválido', true);
      return false;
    }
    if (fields.senha.length < 8) {
      showModal('A senha deve ter no mínimo 8 caracteres', true);
      return false;
    }
    if (!fields.dataContratacao) {
      showModal('Data de Contratação é obrigatória', true);
      return false;
    }
    if (!fields.coren) {
      showModal('COREN é obrigatório', true);
      return false;
    }
    if (!fields.unidadeSaudeId) {
      showModal('ID da Unidade de Saúde é obrigatório', true);
      return false;
    }

    return fields;
  }

  // Função para cadastrar enfermeiro
  async function cadastrarEnfermeiro(event) {
    event.preventDefault();
    console.log('Formulário enviado');

    const validatedData = validateForm();
    if (!validatedData) return; // Se a validação falhar, para aqui

    const enfermeiroData = {
      nome: validatedData.nome,
      cpf: validatedData.cpf,
      cns: validatedData.cns,
      dataNascimento: validatedData.dataNascimento,
      sexo: validatedData.sexo,
      racaCor: validatedData.racaCor,
      escolaridade: validatedData.escolaridade,
      endereco: {
        logradouro: validatedData.logradouro,
        numero: validatedData.numero,
        bairro: validatedData.bairro,
        cidade: validatedData.cidade,
        estado: validatedData.estado,
        cep: validatedData.cep
      },
      telefone: validatedData.telefone,
      email: validatedData.email,
      senha: validatedData.senha,
      dataContratacao: validatedData.dataContratacao,
      coren: validatedData.coren,
      unidadeSaudeId: validatedData.unidadeSaudeId
    };

    console.log('Dados validados e coletados:', enfermeiroData);

    const token = localStorage.getItem('token');
    if (!token) {
      showModal('Erro: Você precisa estar logado para cadastrar um enfermeiro. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }
    console.log('Token usado:', token);

    try {
      console.log('Enviando requisição para:', `${API_BASE_URL}/enfermeiros`);
      const response = await fetch(`${API_BASE_URL}/enfermeiros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(enfermeiroData)
      });

      console.log('Resposta do servidor (status):', response.status);
      const responseText = await response.text();
      console.log('Resposta bruta do servidor:', responseText);

      if (!response.ok) {
        let errorMessage = 'Erro ao cadastrar enfermeiro';
        if (response.status === 404) {
          errorMessage = 'Rota não encontrada (404). Verifique a URL do servidor ou contate o administrador.';
        } else {
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
        }
        showModal(errorMessage, true);
        return;
      }

      showModal('Enfermeiro cadastrado com sucesso!');
      form.reset(); // Limpa o formulário após sucesso
    } catch (error) {
      console.error('Erro capturado:', error.message);
      showModal('Erro ao conectar com o servidor (verifique a rede).', true);
    }
  }

  // Vincula o evento de submit ao formulário
  form.addEventListener('submit', cadastrarEnfermeiro);
});




document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const medicoCountElement = document.querySelector('.card-1 h1');

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

  // Função para contar médicos
  async function countMedicos() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/medicos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const medicos = await response.json();
        const medicoCount = medicos.length || 0;
        medicoCountElement.textContent = medicoCount;
        console.log(`Total de médicos encontrados: ${medicoCount}`);
      } else if (response.status === 401) {
        console.error('Erro: Token inválido');
        showModal('Erro: Token inválido. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
      } else {
        console.error(`Erro ao listar médicos: Status ${response.status}`);
        showModal(`Erro ao listar médicos: Status ${response.status}.`, true);
      }
    } catch (error) {
      console.error('Erro na requisição:', error.message);
      //showModal('Erro ao conectar com o servidor.', true);
    }
  }

  // Chama a função para contar médicos
  countMedicos();

  // Funcionalidade da sidebar
  if (menu && sidebar && mainContent) {
    menu.onclick = function () {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('active');
    };
  } else {
    console.error('Elementos do sidebar não encontrados');
  }
});





document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const medicoCountElement = document.querySelector('.card-1 h1');
  const pacienteCountElement = document.querySelector('.card-2 h1');

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

  // Função para contar médicos
  async function countMedicos() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/medicos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const medicos = await response.json();
        const medicoCount = medicos.length || 0;
        medicoCountElement.textContent = medicoCount;
        console.log(`Total de médicos encontrados: ${medicoCount}`);
      } else if (response.status === 401) {
        console.error('Erro: Token inválido');
        showModal('Erro: Token inválido. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
      } else {
        console.error(`Erro ao listar médicos: Status ${response.status}`);
        showModal(`Erro ao listar médicos: Status ${response.status}.`, true);
      }
    } catch (error) {
      console.error('Erro na requisição de médicos:', error.message);
      //showModal('Erro ao conectar com o servidor (médicos).', true);
    }
  }

  // Função para contar pacientes
  async function countPacientes() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const pacientes = await response.json();
        const pacienteCount = pacientes.length || 0;
        pacienteCountElement.textContent = pacienteCount;
        console.log(`Total de pacientes encontrados: ${pacienteCount}`);
      } else if (response.status === 401) {
        console.error('Erro: Token inválido');
        showModal('Erro: Token inválido. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
      } else {
        console.error(`Erro ao listar pacientes: Status ${response.status}`);
        showModal(`Erro ao listar pacientes: Status ${response.status}.`, true);
      }
    } catch (error) {
      console.error('Erro na requisição de pacientes:', error.message);
      //showModal('Erro ao conectar com o servidor (pacientes).', true);
    }
  }

  // Chama as funções para contar médicos e pacientes
  countMedicos();
  countPacientes();

  // Funcionalidade da sidebar
  if (menu && sidebar && mainContent) {
    menu.onclick = function () {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('active');
    };
  } else {
    console.error('Elementos do sidebar não encontrados');
  }
});





document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const medicoCountElement = document.querySelector('.card-1 h1');
  const pacienteCountElement = document.querySelector('.card-2 h1');
  const enfermeiroCountElement = document.querySelector('.card-3 h1');

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

  // Função para contar médicos
  async function countMedicos() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/medicos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const medicos = await response.json();
        const medicoCount = medicos.length || 0;
        medicoCountElement.textContent = medicoCount;
        console.log(`Total de médicos encontrados: ${medicoCount}`);
      } else if (response.status === 401) {
        console.error('Erro: Token inválido');
        showModal('Erro: Token inválido. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
      } else {
        console.error(`Erro ao listar médicos: Status ${response.status}`);
        showModal(`Erro ao listar médicos: Status ${response.status}.`, true);
      }
    } catch (error) {
      console.error('Erro na requisição de médicos:', error.message);
      //showModal('Erro ao conectar com o servidor (médicos).', true);
    }
  }

  // Função para contar pacientes
  async function countPacientes() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const pacientes = await response.json();
        const pacienteCount = pacientes.length || 0;
        pacienteCountElement.textContent = pacienteCount;
        console.log(`Total de pacientes encontrados: ${pacienteCount}`);
      } else if (response.status === 401) {
        console.error('Erro: Token inválido');
        showModal('Erro: Token inválido. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
      } else {
        console.error(`Erro ao listar pacientes: Status ${response.status}`);
        showModal(`Erro ao listar pacientes: Status ${response.status}.`, true);
      }
    } catch (error) {
      console.error('Erro na requisição de pacientes:', error.message);
      //showModal('Erro ao conectar com o servidor (pacientes).', true);
    }
  }

  // Função para contar enfermeiros
  async function countEnfermeiros() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/enfermeiros`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const enfermeiros = await response.json();
        const enfermeiroCount = enfermeiros.length || 0;
        enfermeiroCountElement.textContent = enfermeiroCount;
        console.log(`Total de enfermeiros encontrados: ${enfermeiroCount}`);
      } else if (response.status === 401) {
        console.error('Erro: Token inválido');
        showModal('Erro: Token inválido. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
      } else {
        console.error(`Erro ao listar enfermeiros: Status ${response.status}`);
        showModal(`Erro ao listar enfermeiros: Status ${response.status}.`, true);
      }
    } catch (error) {
      console.error('Erro na requisição de enfermeiros:', error.message);
      //showModal('Erro ao conectar com o servidor (enfermeiros).', true);
    }
  }

  // Chama as funções para contar médicos, pacientes e enfermeiros
  countMedicos();
  countPacientes();
  countEnfermeiros();

  // Funcionalidade da sidebar
  if (menu && sidebar && mainContent) {
    menu.onclick = function () {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('active');
    };
  } else {
    console.error('Elementos do sidebar não encontrados');
  }
});





document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const doctorsCards = document.querySelector('.doctors--cards');

  console.log('menu:', menu);
  console.log('sidebar:', sidebar);
  console.log('mainContent:', mainContent);
  console.log('doctorsCards:', doctorsCards);

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

  // Função para exibir modal com detalhes do médico
  function showDoctorDetails(medico) {
    let detailsModal = document.getElementById('doctorDetailsModal');
    if (!detailsModal) {
      detailsModal = document.createElement('div');
      detailsModal.id = 'doctorDetailsModal';
      detailsModal.style.position = 'fixed';
      detailsModal.style.top = '0';
      detailsModal.style.left = '0';
      detailsModal.style.width = '100%';
      detailsModal.style.height = '100%';
      detailsModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      detailsModal.style.display = 'flex';
      detailsModal.style.justifyContent = 'center';
      detailsModal.style.alignItems = 'center';
      detailsModal.style.zIndex = '1000';
      document.body.appendChild(detailsModal);
    }

    // Formata os dados do médico para exibição
    const medicoData = {
      id: medico.id || medico._id || 'N/A',
      nome: medico.nome || 'N/A',
      cpf: medico.cpf || 'N/A',
      cns: medico.cns || 'N/A',
      dataNascimento: medico.dataNascimento || 'N/A',
      sexo: medico.sexo || 'N/A',
      racaCor: medico.racaCor || 'N/A',
      escolaridade: medico.escolaridade || 'N/A',
      endereco: medico.endereco || { logradouro: 'N/A', numero: 'N/A', bairro: 'N/A', cidade: 'N/A', estado: 'N/A', cep: 'N/A' },
      telefone: medico.telefone || 'N/A',
      email: medico.email || 'N/A',
      //senha: medico.senha || 'N/A',
      //dataContratacao: medico.dataContratacao || 'N/A',
      //crm: medico.crm || 'N/A',
      //unidadeSaudeId: medico.unidadeSaudeId || 'N/A'
    };

    detailsModal.innerHTML = `
      <div style="background-color: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 80vh; overflow-y: auto;">
        <h3>Detalhes do Médico</h3>
        <form id="updateDoctorForm">
          <div style="margin-bottom: 10px;">
            <label><strong>ID:</strong></label>
            <input type="text" value="${medicoData.id}" readonly style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Nome:</strong></label>
            <input type="text" name="nome" value="${medicoData.nome}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>CPF:</strong></label>
            <input type="text" name="cpf" value="${medicoData.cpf}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>CNS:</strong></label>
            <input type="text" name="cns" value="${medicoData.cns}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Data de Nascimento:</strong></label>
            <input type="text" name="dataNascimento" value="${medicoData.dataNascimento}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Sexo:</strong></label>
            <input type="text" name="sexo" value="${medicoData.sexo}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Raça/Cor:</strong></label>
            <input type="text" name="racaCor" value="${medicoData.racaCor}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Escolaridade:</strong></label>
            <input type="text" name="escolaridade" value="${medicoData.escolaridade}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Logradouro:</strong></label>
            <input type="text" name="logradouro" value="${medicoData.endereco.logradouro}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Número:</strong></label>
            <input type="text" name="numero" value="${medicoData.endereco.numero}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Bairro:</strong></label>
            <input type="text" name="bairro" value="${medicoData.endereco.bairro}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Cidade:</strong></label>
            <input type="text" name="cidade" value="${medicoData.endereco.cidade}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Estado:</strong></label>
            <input type="text" name="estado" value="${medicoData.endereco.estado}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>CEP:</strong></label>
            <input type="text" name="cep" value="${medicoData.endereco.cep}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Telefone:</strong></label>
            <input type="text" name="telefone" value="${medicoData.telefone}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Email:</strong></label>
            <input type="email" name="email" value="${medicoData.email}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button type="button" id="updateButton" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #2196F3; color: white; cursor: pointer;">Atualizar</button>
            <button type="button" id="deleteButton" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #f44336; color: white; cursor: pointer;">Excluir</button>
            <button type="button" id="closeDetailsModal" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #ccc; color: black; cursor: pointer;">Fechar</button>
          </div>
        </form>
      </div>
    `;

    detailsModal.style.display = 'flex';

    const closeButton = detailsModal.querySelector('#closeDetailsModal');
    closeButton.onclick = () => detailsModal.style.display = 'none';
    detailsModal.onclick = (event) => {
      if (event.target === detailsModal) detailsModal.style.display = 'none';
    };

    // Função para atualizar médico
    const updateButton = detailsModal.querySelector('#updateButton');
    updateButton.onclick = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
      }

      const form = document.getElementById('updateDoctorForm');
      const updatedData = {
        nome: form.querySelector('input[name="nome"]').value,
        cpf: form.querySelector('input[name="cpf"]').value,
        cns: form.querySelector('input[name="cns"]').value,
        dataNascimento: form.querySelector('input[name="dataNascimento"]').value,
        sexo: form.querySelector('input[name="sexo"]').value,
        racaCor: form.querySelector('input[name="racaCor"]').value,
        escolaridade: form.querySelector('input[name="escolaridade"]').value,
        endereco: {
          logradouro: form.querySelector('input[name="logradouro"]').value,
          numero: form.querySelector('input[name="numero"]').value,
          bairro: form.querySelector('input[name="bairro"]').value,
          cidade: form.querySelector('input[name="cidade"]').value,
          estado: form.querySelector('input[name="estado"]').value,
          cep: form.querySelector('input[name="cep"]').value
        },
        telefone: form.querySelector('input[name="telefone"]').value,
        email: form.querySelector('input[name="email"]').value,
        senha: form.querySelector('input[name="senha"]').value,
        dataContratacao: form.querySelector('input[name="dataContratacao"]').value,
        crm: form.querySelector('input[name="crm"]').value,
        unidadeSaudeId: form.querySelector('input[name="unidadeSaudeId"]').value
      };

      try {
        const response = await fetch(`${API_BASE_URL}/medicos/${medicoData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        });

        if (response.ok) {
          showModal('Médico atualizado com sucesso!');
          detailsModal.style.display = 'none';
          listarMedicos(); // Atualiza a lista de médicos
        } else {
          const errorData = await response.json();
          showModal(`Erro ao atualizar médico: ${errorData.message || response.statusText}`, true);
        }
      } catch (error) {
        showModal('Erro ao atualizar médico. Tente novamente.', true);
      }
    };

    // Função para excluir médico
    const deleteButton = detailsModal.querySelector('#deleteButton');
    deleteButton.onclick = async () => {
      if (!confirm('Tem certeza que deseja excluir este médico?')) return;

      const token = localStorage.getItem('token');
      if (!token) {
        showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/medicos/${medicoData.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          showModal('Médico excluído com sucesso!');
          detailsModal.style.display = 'none';
          listarMedicos(); // Atualiza a lista de médicos
        } else {
          const errorData = await response.json();
          showModal(`Erro ao excluir médico: ${errorData.message || response.statusText}`, true);
        }
      } catch (error) {
        showModal('Erro ao excluir médico. Tente novamente.', true);
      }
    };
  }

  // Função para listar médicos e criar cards
  async function listarMedicos() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/medicos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const medicos = await response.json();
        console.log('Lista de médicos:', medicos);

        // Limpa os cards existentes
        doctorsCards.innerHTML = '';

        // Cria um card para cada médico
        medicos.forEach(medico => {
          const card = document.createElement('a');
          card.className = 'doctor--card';
          card.href = '#'; // Evita navegação padrão
          card.onclick = (event) => {
            event.preventDefault();
            showDoctorDetails(medico);
          };

          card.innerHTML = `
            <div class="img--box--cover">
              <div class="img--box">
                <img src="imgs/_no avatar pfp user_ version png transparent.jfif" alt="${medico.nome || 'Médico'}">
              </div>
            </div>
            <p class="doctor-name">${medico.nome || medico.nomeCompleto || 'Médico Sem Nome'}</p>
          `;

          doctorsCards.appendChild(card);
        });
      } else if (response.status === 401) {
        console.error('Erro: Token inválido');
        showModal('Erro: Token inválido. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
      } else {
        console.error(`Erro ao listar médicos: Status ${response.status}`);
        //showModal(`Erro ao listar médicos: Status ${response.status}.`, true);
      }
    } catch (error) {
      console.error('Erro ao processar requisição:', error.message);
      //showModal('Erro ao listar médicos. Tente novamente.', true);
    }
  }

  // Chama a função para listar médicos
  listarMedicos();

  // Funcionalidade da sidebar
  if (menu && sidebar && mainContent) {
    menu.onclick = function () {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('active');
    };
  } else {
    console.error('Elementos da sidebar não encontrados:', { menu, sidebar, mainContent });
  }
});








document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const nursesCards = document.querySelector('.enfermeiros .nurse--cards');

  console.log('menu:', menu);
  console.log('sidebar:', sidebar);
  console.log('mainContent:', mainContent);
  console.log('nursesCards:', nursesCards);

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

  // Função para exibir modal com detalhes do enfermeiro
  function showNurseDetails(enfermeiro) {
    let detailsModal = document.getElementById('nurseDetailsModal');
    if (!detailsModal) {
      detailsModal = document.createElement('div');
      detailsModal.id = 'nurseDetailsModal';
      detailsModal.style.position = 'fixed';
      detailsModal.style.top = '0';
      detailsModal.style.left = '0';
      detailsModal.style.width = '100%';
      detailsModal.style.height = '100%';
      detailsModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      detailsModal.style.display = 'flex';
      detailsModal.style.justifyContent = 'center';
      detailsModal.style.alignItems = 'center';
      detailsModal.style.zIndex = '1000';
      document.body.appendChild(detailsModal);
    }

    // Formata os dados do enfermeiro para exibição
    const enfermeiroData = {
      id: enfermeiro.id || enfermeiro._id || 'N/A',
      nome: enfermeiro.nome || 'N/A',
      cpf: enfermeiro.cpf || 'N/A',
      cns: enfermeiro.cns || 'N/A',
      dataNascimento: enfermeiro.dataNascimento || 'N/A',
      sexo: enfermeiro.sexo || 'N/A',
      racaCor: enfermeiro.racaCor || 'N/A',
      escolaridade: enfermeiro.escolaridade || 'N/A',
      endereco: enfermeiro.endereco || { logradouro: 'N/A', numero: 'N/A', bairro: 'N/A', cidade: 'N/A', estado: 'N/A', cep: 'N/A' },
      telefone: enfermeiro.telefone || 'N/A',
      email: enfermeiro.email || 'N/A',
      senha: enfermeiro.senha || 'N/A',
      dataContratacao: enfermeiro.dataContratacao || 'N/A',
      coren: enfermeiro.coren || 'N/A',
      unidadeSaudeId: enfermeiro.unidadeSaudeId || 'N/A'
    };

    detailsModal.innerHTML = `
      <div style="background-color: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 80vh; overflow-y: auto;">
        <h3>Detalhes do Enfermeiro</h3>
        <form id="updateNurseForm">
          <div style="margin-bottom: 10px;">
            <label><strong>ID:</strong></label>
            <input type="text" value="${enfermeiroData.id}" readonly style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Nome:</strong></label>
            <input type="text" name="nome" value="${enfermeiroData.nome}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>CPF:</strong></label>
            <input type="text" name="cpf" value="${enfermeiroData.cpf}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>CNS:</strong></label>
            <input type="text" name="cns" value="${enfermeiroData.cns}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Data de Nascimento:</strong></label>
            <input type="text" name="dataNascimento" value="${enfermeiroData.dataNascimento}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Sexo:</strong></label>
            <input type="text" name="sexo" value="${enfermeiroData.sexo}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Raça/Cor:</strong></label>
            <input type="text" name="racaCor" value="${enfermeiroData.racaCor}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Escolaridade:</strong></label>
            <input type="text" name="escolaridade" value="${enfermeiroData.escolaridade}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Logradouro:</strong></label>
            <input type="text" name="logradouro" value="${enfermeiroData.endereco.logradouro}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Número:</strong></label>
            <input type="text" name="numero" value="${enfermeiroData.endereco.numero}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Bairro:</strong></label>
            <input type="text" name="bairro" value="${enfermeiroData.endereco.bairro}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Cidade:</strong></label>
            <input type="text" name="cidade" value="${enfermeiroData.endereco.cidade}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Estado:</strong></label>
            <input type="text" name="estado" value="${enfermeiroData.endereco.estado}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>CEP:</strong></label>
            <input type="text" name="cep" value="${enfermeiroData.endereco.cep}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Telefone:</strong></label>
            <input type="text" name="telefone" value="${enfermeiroData.telefone}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Email:</strong></label>
            <input type="email" name="email" value="${enfermeiroData.email}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Senha:</strong></label>
            <input type="password" name="senha" value="${enfermeiroData.senha}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Data de Contratação:</strong></label>
            <input type="text" name="dataContratacao" value="${enfermeiroData.dataContratacao}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>COREN:</strong></label>
            <input type="text" name="coren" value="${enfermeiroData.coren}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="margin-bottom: 10px;">
            <label><strong>Unidade de Saúde ID:</strong></label>
            <input type="text" name="unidadeSaudeId" value="${enfermeiroData.unidadeSaudeId}" style="width: 100%; padding: 5px; margin-top: 5px;">
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button type="button" id="updateButton" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #2196F3; color: white; cursor: pointer;">Atualizar</button>
            <button type="button" id="deleteButton" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #f44336; color: white; cursor: pointer;">Excluir</button>
            <button type="button" id="closeDetailsModal" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #ccc; color: black; cursor: pointer;">Fechar</button>
          </div>
        </form>
      </div>
    `;

    detailsModal.style.display = 'flex';

    const closeButton = detailsModal.querySelector('#closeDetailsModal');
    closeButton.onclick = () => detailsModal.style.display = 'none';
    detailsModal.onclick = (event) => {
      if (event.target === detailsModal) detailsModal.style.display = 'none';
    };

    // Função para atualizar enfermeiro
    const updateButton = detailsModal.querySelector('#updateButton');
    updateButton.onclick = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
      }

      const form = document.getElementById('updateNurseForm');
      const updatedData = {
        nome: form.querySelector('input[name="nome"]').value,
        cpf: form.querySelector('input[name="cpf"]').value,
        cns: form.querySelector('input[name="cns"]').value,
        dataNascimento: form.querySelector('input[name="dataNascimento"]').value,
        sexo: form.querySelector('input[name="sexo"]').value,
        racaCor: form.querySelector('input[name="racaCor"]').value,
        escolaridade: form.querySelector('input[name="escolaridade"]').value,
        endereco: {
          logradouro: form.querySelector('input[name="logradouro"]').value,
          numero: form.querySelector('input[name="numero"]').value,
          bairro: form.querySelector('input[name="bairro"]').value,
          cidade: form.querySelector('input[name="cidade"]').value,
          estado: form.querySelector('input[name="estado"]').value,
          cep: form.querySelector('input[name="cep"]').value
        },
        telefone: form.querySelector('input[name="telefone"]').value,
        email: form.querySelector('input[name="email"]').value,
        senha: form.querySelector('input[name="senha"]').value,
        dataContratacao: form.querySelector('input[name="dataContratacao"]').value,
        coren: form.querySelector('input[name="coren"]').value,
        unidadeSaudeId: form.querySelector('input[name="unidadeSaudeId"]').value
      };

      try {
        const response = await fetch(`${API_BASE_URL}/enfermeiros/${enfermeiroData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        });

        if (response.ok) {
          showModal('Enfermeiro atualizado com sucesso!');
          detailsModal.style.display = 'none';
          listarEnfermeiros();
        } else {
          const errorData = await response.json();
          showModal(`Erro ao atualizar enfermeiro: ${errorData.message || response.statusText}`, true);
        }
      } catch (error) {
        showModal('Erro ao atualizar enfermeiro. Tente novamente.', true);
      }
    };

    // Função para excluir enfermeiro
    const deleteButton = detailsModal.querySelector('#deleteButton');
    deleteButton.onclick = async () => {
      if (!confirm('Tem certeza que deseja excluir este enfermeiro?')) return;

      const token = localStorage.getItem('token');
      if (!token) {
        showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/enfermeiros/${enfermeiroData.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          showModal('Enfermeiro excluído com sucesso!');
          detailsModal.style.display = 'none';
          listarEnfermeiros();
        } else {
          const errorData = await response.json();
          showModal(`Erro ao excluir enfermeiro: ${errorData.message || response.statusText}`, true);
        }
      } catch (error) {
        showModal('Erro ao excluir enfermeiro. Tente novamente.', true);
      }
    };
  }

  // Função para listar enfermeiros e criar cards

  // Defina a URL base da API, se ainda não estiver definida
const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

// Função para listar enfermeiros e criar cards
async function listarEnfermeiros() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('Nenhum token encontrado em localStorage');
    showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
    setTimeout(() => window.location.href = 'index.html', 2000);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/enfermeiros`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const enfermeiros = await response.json();
      console.log('Dados dos enfermeiros:', enfermeiros);

      // Limpa os cards existentes
      nursesCards.innerHTML = '';

      // Verifica se enfermeiros é um array e se não está vazio
      if (!Array.isArray(enfermeiros) || enfermeiros.length === 0) {
        showModal('Nenhum enfermeiro encontrado.', false);
        return;
      }

      // Itera sobre a lista de enfermeiros e cria um card para cada um
      enfermeiros.forEach(enfermeiro => {
        const card = document.createElement('a');
        card.className = 'nurse--card';
        card.href = '#';
        card.onclick = (event) => {
          event.preventDefault();
          showNurseDetails(enfermeiro);
        };

        card.innerHTML = `
          <div class="img--box--cover">
            <div class="img--box">
              <img src="imgs/_no avatar pfp user_ version png transparent.jfif" alt="${enfermeiro.nome || 'Enfermeiro'}">
            </div>
          </div>
          <p class="doctor-name">${enfermeiro.nome || enfermeiro.nomeCompleto || 'Enfermeiro Sem Nome'}</p>
        `;

        nursesCards.appendChild(card);
      });
    } else if (response.status === 401) {
      console.error('Erro: Token inválido');
      showModal('Erro: Token inválido. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
    } else {
      const errorData = await response.json();
      console.error(`Erro ao listar enfermeiros: Status ${response.status}`, errorData);
      //showModal(`Erro ao listar enfermeiros: ${errorData.message || response.statusText}`, true);
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error.message);
    //showModal('Erro ao listar enfermeiros. Tente novamente.', true);
  }
}
listarEnfermeiros();

  // Funcionalidade da sidebar
  if (menu && sidebar && mainContent) {
    menu.onclick = function () {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('active');
    };
  } else {
    console.error('Elementos da sidebar não encontrados:', { menu, sidebar, mainContent });
  }
});

//mostrar os pacientes existentes no modulo do admin

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';
  const patientTableBody = document.querySelector('.ubs-table tbody');
  const searchInput = document.querySelector('#searchInput');
  const searchBtn = document.querySelector('.search-btn');

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

  // Função para formatar o endereço
  function formatarEndereco(endereco) {
    if (!endereco) return 'N/A';
    return `${endereco.logradouro || ''} ${endereco.numero || ''}, ${endereco.bairro || ''}, ${endereco.cidade || ''} - ${endereco.estado || ''}, ${endereco.cep || ''}`.trim();
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
        <td>${paciente.cpf || 'N/A'}</td>
        <td>${formatarEndereco(paciente.endereco)}</td>
        <td>${paciente.telefone || 'N/A'}</td>
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
          <p><strong>Nome:</strong> ${paciente.id || 'N/A'}</p>
          <p><strong>Nome:</strong> ${paciente.nome || 'N/A'}</p>
          <p><strong>CPF:</strong> ${paciente.cpf || 'N/A'}</p>
          <p><strong>Cartão SUS (CNS):</strong> ${paciente.cns || 'N/A'}</p>
          <p><strong>Data de Nascimento:</strong> ${paciente.dataNascimento || 'N/A'}</p>
          <p><strong>Sexo:</strong> ${paciente.sexo || 'N/A'}</p>
          <p><strong>Raça/Cor:</strong> ${paciente.racaCor || 'N/A'}</p>
          <p><strong>Escolaridade:</strong> ${paciente.escolaridade || 'N/A'}</p>
          <p><strong>Endereço:</strong> ${formatarEndereco(paciente.endereco)}</p>
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
      const cpf = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
      row.style.display = cpf.includes(termo) ? '' : 'none';
    });
  }

  // Adiciona eventos à barra de pesquisa
  searchBtn.addEventListener('click', filtrarPacientes);
  searchInput.addEventListener('input', filtrarPacientes);

  // Carrega a lista de pacientes ao iniciar
  listarPacientes();
});