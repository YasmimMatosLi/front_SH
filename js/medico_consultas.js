const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
  const formConsulta = document.getElementById('formConsulta');

  if (!formConsulta) {
    console.error('Formulário #formConsulta não encontrado no DOM');
    return;
  }

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

  // Função para criar consulta
  async function createConsulta(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Nenhum token encontrado em localStorage');
      showModal('Erro: Você precisa estar logado. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    const consultaData = {
      pacienteId: document.getElementById('pacienteId').value,
      unidadeSaudeId: document.getElementById('unidadeSaudeId').value,
      observacoes: document.getElementById('observacoes').value,
      //cid10: document.getElementById('cid10').value
      MedicoId: document.getElementById('MedicoId').value
    };

    console.log('Dados da consulta:', JSON.stringify(consultaData, null, 2));

    try {
      const response = await fetch(`${API_BASE_URL}/consultas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(consultaData)
      });

      console.log('Resposta do servidor (status):', response.status);
      const responseText = await response.text();
      console.log('Resposta do servidor (texto):', responseText);

      if (!response.ok) {
        let errorMessage = 'Erro ao criar consulta';
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

      showModal('Consulta criada com sucesso!');
      formConsulta.reset(); // Limpa o formulário
    } catch (error) {
      console.error('Erro capturado:', error.message);
      showModal('Erro ao conectar com o servidor (verifique a rede ou token).', true);
    }
  }

  // Adiciona evento ao formulário
  formConsulta.addEventListener('submit', createConsulta);
});


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