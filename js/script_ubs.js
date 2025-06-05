
// Função para mostrar ou diminuir o sidebar
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const sidebarItems = document.querySelectorAll('.sidebar--items li');

  if (menu && sidebar && mainContent) {
    menu.onclick = function () {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('active');
    };
  } else {
    console.error('Elementos do sidebar não encontrados:', { menu, sidebar, mainContent });
  }

  if (sidebarItems) {
    sidebarItems.forEach(item => {
      item.addEventListener('click', function () {
        sidebarItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      });
    });
  } else {
    console.error('Itens do sidebar não encontrados');
  }

  // Conectar a rota de cadastrar uma UBS
  const API_BASE_URL = 'https://sistema-hospitalar.onrender.com/api';

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

  // Função para cadastrar unidade de saúde
  async function registerUnidade(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      showModal('Erro: Você precisa estar logado para cadastrar uma unidade. Faça login novamente.', true);
      setTimeout(() => window.location.href = 'index.html', 2000);
      return;
    }

    const form = document.getElementById('formUnidade');
    const unidadeData = {
      nome: document.querySelector('#nome').value,
      tipo: document.querySelector('#tipo').value,
      cnes: document.querySelector('#cnes').value.replace(/\D/g, ''),
      endereco: {
        logradouro: document.querySelector('#logradouro').value,
        numero: document.querySelector('#numero').value,
        bairro: document.querySelector('#bairro').value,
        cidade: document.querySelector('#cidade').value,
        estado: document.querySelector('#estado').value.toUpperCase(),
        cep: document.querySelector('#cep').value.replace(/\D/g, '')
      },
      telefone: document.querySelector('#telefone').value.replace(/\D/g, ''),
      servicosEssenciais: document.querySelector('#servicosEssenciais').value.split(',').map(s => s.trim()).filter(s => s),
      servicosAmpliados: document.querySelector('#servicosAmpliados').value.split(',').map(s => s.trim()).filter(s => s)
    };

    console.log('Dados enviados:', JSON.stringify(unidadeData, null, 2));

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
      const response = await fetch(`${API_BASE_URL}/unidades-saude`, {
        method: 'POST',
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
        let errorMessage = 'Erro ao cadastrar unidade de saúde';
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

      showModal('Unidade de saúde cadastrada com sucesso!');
      form.reset(); // Reseta apenas em caso de sucesso
    } catch (error) {
      console.error('Erro capturado:', error.message);
      showModal('Erro ao conectar com o servidor (verifique a rede ou token)', true);
    }
  }

  // Vincula o evento ao formulário
  const formUnidade = document.getElementById('formUnidade');
  if (formUnidade) {
    formUnidade.addEventListener('submit', registerUnidade);
  } else {
    console.error('Formulário com id "formUnidade" não encontrado');
  }
});