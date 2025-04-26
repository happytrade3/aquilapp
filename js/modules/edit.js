import { categorias } from '../data/categorias.js';

const contentArea = document.getElementById('content-area');

export function renderEditar() {
  contentArea.innerHTML = `
    <h2 class="text-xl font-bold mb-4 text-emerald-400">Registrar Novo Ciclo</h2>
    <form id="edit-form" class="flex flex-col gap-6">
      <input type="datetime-local" id="registro-data" class="p-3 rounded bg-gray-800 text-gray-100" value="${new Date().toISOString().slice(0,16)}">
      
      <div id="categorias-lista" class="flex flex-col gap-4">
        ${categorias.map(categoria => `
          <div class="bg-gray-800 p-4 rounded shadow">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="toggle-categoria" data-id="${categoria.id}">
              <span class="text-lg">${categoria.nome}</span>
            </label>
            <div class="inputs-categoria mt-2 hidden" id="inputs-${categoria.id}">
              ${gerarInputs(categoria)}
            </div>
          </div>
        `).join('')}
      </div>

      <button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded font-bold transition">Salvar Registro</button>
    </form>
  `;

  configurarToggles();
}

function gerarInputs(categoria) {
  if (categoria.tipo === 'nota') {
    return `
      <label class="block mb-2">Avaliação:
        <input type="range" min="1" max="5" value="3" class="w-full mt-2">
      </label>
      <textarea class="w-full p-2 rounded bg-gray-700 text-gray-100" placeholder="Observações..."></textarea>
    `;
  } else if (categoria.tipo === 'binario') {
    return `
      <label class="block mb-2">Resposta:
        <select class="w-full p-2 rounded bg-gray-700 text-gray-100 mt-2">
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>
      </label>
      <textarea class="w-full p-2 rounded bg-gray-700 text-gray-100" placeholder="Observações..."></textarea>
    `;
  }
  return '';
}

function configurarToggles() {
  const toggles = document.querySelectorAll('.toggle-categoria');
  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      const inputs = document.getElementById(`inputs-${toggle.dataset.id}`);
      if (toggle.checked) {
        inputs.classList.remove('hidden');
      } else {
        inputs.classList.add('hidden');
      }
    });
  });
}

// Função para montar e salvar registro no LocalStorage
function configurarFormulario() {
  const editForm = document.getElementById('edit-form');
  
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const dataHora = document.getElementById('registro-data').value;
    const registros = {};

    const categoriasAtivas = document.querySelectorAll('.toggle-categoria:checked');
    categoriasAtivas.forEach(toggle => {
      const categoriaId = toggle.dataset.id;
      const inputsCategoria = document.getElementById(`inputs-${categoriaId}`);
      
      let registro = {};
      const range = inputsCategoria.querySelector('input[type="range"]');
      const select = inputsCategoria.querySelector('select');
      const observacao = inputsCategoria.querySelector('textarea')?.value || '';

      if (range) {
        registro = { nota: parseInt(range.value), observacao };
      } else if (select) {
        registro = { resposta: select.value, observacao };
      }

      const nomeCategoria = categorias.find(cat => cat.id == categoriaId).nome;
      registros[nomeCategoria] = registro;
    });

    const novoRegistro = {
      dataHora,
      categorias: registros
    };

    salvarRegistro(novoRegistro);
    alert('Registro salvo com sucesso! ✔️');
    editForm.reset(); // Reseta o formulário
    ocultarTodosInputs(); // Esconde campos após reset
  });
}

function ocultarTodosInputs() {
  const allInputs = document.querySelectorAll('.inputs-categoria');
  allInputs.forEach(div => div.classList.add('hidden'));
}

// Função para salvar no LocalStorage
function salvarRegistro(registro) {
  let historico = JSON.parse(localStorage.getItem('aquilapp-historico')) || [];
  historico.push(registro);
  localStorage.setItem('aquilapp-historico', JSON.stringify(historico));
}

