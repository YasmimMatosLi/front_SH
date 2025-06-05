
const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const formPrescricao = document.getElementById('formPrescricao');

  console.log('menu:', menu);
  console.log('sidebar:', sidebar);
  console.log('mainContent:', mainContent);
  console.log('formPrescricao:', formPrescricao);

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

  // Função para criar uma prescrição
  async function criarPrescricao(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    const pacienteId = document.getElementById('pacienteId').value.trim();
    const unidadeSaudeId = document.getElementById('unidadeSaudeId').value.trim();
    const detalhesPrescricao = document.getElementById('detalhesPrescricao').value.trim();
    const cid10 = document.getElementById('cid10').value.trim();

    // Validação básica
    if (!pacienteId || !unidadeSaudeId || !detalhesPrescricao || !cid10) {
      showModal('Todos os campos são obrigatórios.', true);
      return;
    }

    const payload = {
      pacienteId,
      unidadeSaudeId,
      detalhesPrescricao,
      cid10
    };

    console.log('Payload enviado:', payload); // Log para depuração

    try {
      const response = await fetch(`${API_BASE_URL}/prescricoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json(); // Captura a resposta completa
      console.log('Resposta da API:', responseData); // Log para depuração

      if (response.ok) {
        showModal(`Prescrição criada com sucesso! ID: ${responseData.id || 'N/A'}`);
        formPrescricao.reset(); // Limpa o formulário após sucesso
      } else if (response.status === 401) {
        console.error('Erro: Token inválido');
        showModal('Erro: Token inválido. Faça login novamente.', true);
        setTimeout(() => window.location.href = 'index.html', 2000);
      } else {
        console.error(`Erro ao criar prescrição: Status ${response.status}, Detalhes: ${JSON.stringify(responseData)}`);
        showModal(`Erro ao criar prescrição: Status ${response.status}. Verifique os dados ou contate o suporte.`, true);
      }
    } catch (error) {
      console.error('Erro ao processar requisição:', error.message);
      showModal('Erro ao criar prescrição. Tente novamente.', true);
    }
  }

  // Adiciona o evento de submit ao formulário
  if (formPrescricao) {
    formPrescricao.addEventListener('submit', criarPrescricao);
  } else {
    console.error('Formulário de prescrição não encontrado');
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
});