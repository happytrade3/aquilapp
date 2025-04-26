import { categorias } from '../data/categorias.js';

let myChart = null;

export function renderRelatorio() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = `
    <div class="flex gap-4 justify-center mb-6">
      <button id="btn-linha" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition">Tendência</button>
      <button id="btn-radar" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition">Radar</button>
    </div>
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
      <canvas id="grafico" height="150"></canvas>
    </div>
    <div class="text-center mt-4">
      <button id="download-button" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded transition">📥 Baixar Gráfico</button>
    </div>
  `;

  gerarGraficoLinha(); // inicia com linha

  document.getElementById('btn-linha').addEventListener('click', gerarGraficoLinha);
  document.getElementById('btn-radar').addEventListener('click', gerarGraficoRadar);
  document.getElementById('download-button').addEventListener('click', baixarGrafico);
}

function carregarHistorico() {
  return JSON.parse(localStorage.getItem('aquilapp-historico')) || [];
}

function agruparPorData(historico) {
  const agrupado = {};

  historico.forEach(registro => {
    const data = registro.dataHora.split('T')[0]; // só yyyy-mm-dd
    if (!agrupado[data]) agrupado[data] = [];

    agrupado[data].push(registro);
  });

  return agrupado;
}

function calcularMediasPorDia(agrupado) {
  const datas = Object.keys(agrupado).sort();
  const medias = {};

  categorias.forEach(cat => {
    medias[cat.nome] = datas.map(data => {
      const registrosDoDia = agrupado[data];
      const valores = registrosDoDia.map(r => {
        const info = r.categorias[cat.nome];
        return info ? (info.nota || (info.resposta === 'sim' ? 5 : 1)) : null;
      }).filter(v => v !== null);

      if (valores.length === 0) return null;
      const media = valores.reduce((acc, v) => acc + v, 0) / valores.length;
      return parseFloat(media.toFixed(2));
    });
  });

  return { datas, medias };
}

function gerarGraficoLinha() {
  const historico = carregarHistorico();
  const agrupado = agruparPorData(historico);
  const { datas, medias } = calcularMediasPorDia(agrupado);

  const ctx = document.getElementById('grafico').getContext('2d');

  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datas,
      datasets: categorias.map((cat, idx) => ({
        label: cat.nome,
        data: medias[cat.nome],
        borderColor: coresCategorias[idx % coresCategorias.length],
        backgroundColor: 'transparent',
        tension: 0.4
      }))
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#fff' } }
      },
      scales: {
        x: { ticks: { color: '#ccc' } },
        y: { ticks: { color: '#ccc' }, min: 1, max: 5 }
      }
    }
  });
}

function gerarGraficoRadar() {
  const historico = carregarHistorico();
  const agrupado = agruparPorData(historico);
  const { medias } = calcularMediasPorDia(agrupado);

  const categoriasNomes = categorias.map(cat => cat.nome);
  const mediasGerais = categoriasNomes.map(nomeCat => {
    const valores = medias[nomeCat].filter(v => v !== null);
    if (valores.length === 0) return null;
    const media = valores.reduce((acc, v) => acc + v, 0) / valores.length;
    return parseFloat(media.toFixed(2));
  });

  const ctx = document.getElementById('grafico').getContext('2d');

  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: categoriasNomes,
      datasets: [{
        label: 'Perfil de Bem-Estar',
        data: mediasGerais,
        backgroundColor: 'rgba(80, 200, 120, 0.3)', // Verde Esmeralda translúcido
        borderColor: 'rgba(80, 200, 120, 1)',
        pointBackgroundColor: coresCategorias
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#fff' } }
      },
      scales: {
        r: {
          angleLines: { color: '#666' },
          grid: { color: '#666' },
          pointLabels: { color: '#ccc' },
          min: 1,
          max: 5
        }
      }
    }
  });
}

function baixarGrafico() {
  if (!myChart) return;
  const link = document.createElement('a');
  link.href = myChart.toBase64Image();
  link.download = 'grafico_aquilapp.png';
  link.click();
}

// Definimos algumas cores para as categorias
const coresCategorias = [
  '#34D399', // Verde Claro
  '#60A5FA', // Azul Claro
  '#FBBF24', // Laranja
  '#A78BFA', // Roxo
  '#F87171'  // Vermelho
];

