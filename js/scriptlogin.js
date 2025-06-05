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

// Função para exibir mensagens
function showMessage(message, isError = false) {
  const messageDiv = document.getElementById('login-message');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'error' : 'success';
    setTimeout(() => messageDiv.textContent = '', 5000);
  }
}

// Função para determinar a página de redirecionamento com base no papel
function getRedirectPage(papel) {
  switch (papel) {
    case 'ADMINISTRADOR_PRINCIPAL':
    case 'ADMINISTRADOR':
      return 'PaginaAdmin.html';
    case 'MEDICO':
      return 'PaginaMedico.html';
    case 'ENFERMEIRO':
      return 'PaginaEnfermeiro.html';
    case 'PACIENTE':
      return 'PaginaPaciente.html';
    default:
      return null;
  }
}

// Função para realizar o login
async function login(event) {
  event.preventDefault();

  // Captura os valores do formulário
  const loginData = {
    email: document.getElementById('email').value,
    password: document.getElementById('senha').value
  };

  console.log('Dados enviados para login:', loginData);

  // Validação básica
  if (!loginData.email || !loginData.password) {
    showMessage('Preencha email e senha', true);
    return;
  }
  if (!validateEmail(loginData.email)) {
    showMessage('Email inválido', true);
    return;
  }
  if (loginData.password.length < 6) {
    showMessage('A senha deve ter pelo menos 6 caracteres', true);
    return;
  }

  toggleLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    console.log('Resposta do servidor (status):', response.status);
    const responseText = await response.text();
    console.log('Resposta do servidor (texto):', responseText);

    if (!response.ok) {
      let errorMessage = 'Erro ao fazer login';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
        if (errorMessage === 'Credenciais inválidas ou usuário inativo') {
          errorMessage += '. Verifique se o usuário foi ativado ou as credenciais estão corretas.';
        }
      } catch (e) {
        errorMessage += `: Resposta inválida - ${responseText}`;
      }
      showMessage(errorMessage, true);
      toggleLoading(false);
      return;
    }

    // Parse da resposta bem-sucedida
    const data = JSON.parse(responseText);
    toggleLoading(false);

    // Verifica se há um campo 'papel' na resposta
    if (!data.papel) {
      showMessage('Erro: Papel do usuário não retornado pelo servidor', true);
      return;
    }

    // Determina a página de redirecionamento com base no papel
    const redirectPage = getRedirectPage(data.papel);
    if (!redirectPage) {
      showMessage(`Erro: Papel "${data.papel}" não reconhecido`, true);
      return;
    }

    showMessage('Login realizado com sucesso! Redirecionando...');
    // Salva o token e o papel no localStorage
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('papel', data.papel);
    }
    // Redireciona para a página correspondente ao papel
    setTimeout(() => {
      window.location.href = redirectPage;
    }, 1000);
  } catch (error) {
    console.error('Erro capturado:', error.message);
    showMessage('Erro ao conectar com o servidor (verifique a rede)', true);
    toggleLoading(false);
  }
}

// Vincula o evento ao formulário
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', login);
  } else {
    console.error('Formulário com id "loginForm" não encontrado');
  }
});
