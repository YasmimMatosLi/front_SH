// URL base do backend
const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

// Função para mostrar/esconder o loading screen
function toggleLoading(show) {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.display = show ? 'flex' : 'none';
  }
}

// Função para validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Função para validar data de nascimento
function validateDate(dateStr) {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date) && date < new Date(); // Deve ser no passado
}

// Função para criar e exibir a caixa flutuante de erro
function showErrorModal(message) {
  let modal = document.getElementById('errorModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'errorModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">×</span>
        <p id="modalMessage"></p>
        <button onclick="document.getElementById('errorModal').style.display='none'">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  document.getElementById('modalMessage').textContent = message;
  modal.style.display = 'block';

  document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
  };
}

// Função para cadastrar administrador
async function registerAdmin(event) {
  event.preventDefault();

  // Captura os valores do formulário
  const adminData = {
    nome: document.querySelector('input[name="nome"]').value,
    email: document.querySelector('input[name="email"]').value,
    password: document.querySelector('input[name="password"]').value,
    adminSecret: document.querySelector('input[name="adminSecret"]').value, // Senha especial, confirme o valor com o backend
    cpf: document.querySelector('input[name="cpf"]').value.replace(/\D/g, ''),
    cns: document.querySelector('input[name="cns"]').value.replace(/\D/g, ''),
    dataNascimento: document.querySelector('input[name="dataNascimento"]').value,
    sexo: document.querySelector('select[name="sexo"]').value,
    racaCor: document.querySelector('select[name="racaCor"]').value,
    escolaridade: document.querySelector('select[name="escolaridade"]').value,
    telefone: document.querySelector('input[name="telefone"]').value.replace(/\D/g, ''),
    endereco: {
      logradouro: document.querySelector('input[name="logradouro"]').value,
      numero: document.querySelector('input[name="numero"]').value,
      bairro: document.querySelector('input[name="bairro"]').value,
      cidade: document.querySelector('input[name="cidade"]').value,
      estado: document.querySelector('input[name="estado"]').value.toUpperCase(),
      cep: document.querySelector('input[name="cep"]').value.replace(/\D/g, '')
    }
  };

  console.log('Dados enviados:', adminData);

  // Validação básica
  if (!adminData.nome || !adminData.email || !adminData.password || !adminData.cpf || !adminData.adminSecret) {
    showErrorModal('Preencha todos os campos obrigatórios');
    return;
  }
  if (!validateEmail(adminData.email)) {
    showErrorModal('Email inválido');
    return;
  }
  if (adminData.cpf.length !== 11) {
    showErrorModal('CPF deve ter 11 dígitos');
    return;
  }
  if (adminData.password.length < 8) {
    showErrorModal('A senha deve ter pelo menos 8 caracteres');
    return;
  }
  if (!adminData.dataNascimento || !validateDate(adminData.dataNascimento)) {
    showErrorModal('Data de nascimento inválida ou no futuro');
    return;
  }
  if (!adminData.sexo || adminData.sexo === 'Selecione') {
    showErrorModal('Selecione um sexo');
    return;
  }
  if (!adminData.racaCor || adminData.racaCor === 'Selecione') {
    showErrorModal('Selecione uma raça/cor');
    return;
  }
  if (!adminData.escolaridade || adminData.escolaridade === 'Selecione') {
    showErrorModal('Selecione uma escolaridade');
    return;
  }
  if (adminData.telefone.length < 10) {
    showErrorModal('Telefone inválido (mínimo 10 dígitos)');
    return;
  }
  if (!adminData.endereco.logradouro || !adminData.endereco.numero || !adminData.endereco.bairro ||
    !adminData.endereco.cidade || !adminData.endereco.estado || !adminData.endereco.cep) {
    showErrorModal('Preencha todos os campos de endereço');
    return;
  }

  toggleLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminData)
    });

    console.log('Resposta do servidor (status):', response.status);
    const responseText = await response.text();
    console.log('Resposta do servidor (texto):', responseText);

    if (!response.ok) {
      let errorMessage = 'Erro ao cadastrar administrador';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage; // Ajustado para capturar "error"
      } catch (e) {
        errorMessage += `: Resposta inválida - ${responseText}`;
        showErrorModal(errorMessage + '. Confirme a "senha especial" com o backend.');
      }
      return;
    }

    const data = JSON.parse(responseText);
    toggleLoading(false);
    alert('Administrador cadastrado com sucesso! Redirecionando...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Erro capturado:', error.message);
    showErrorModal('Erro ao conectar com o servidor (verifique CORS ou backend)');
    toggleLoading(false);
  }
}

// Vincula o evento ao formulário
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminForm');
  if (form) {
    form.addEventListener('submit', registerAdmin);
  } else {
    console.error('Formulário com id "adminForm" não encontrado');
  }
});