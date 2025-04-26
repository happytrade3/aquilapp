export function gerarModalQRCode(senha) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';

  const modalContent = document.createElement('div');
  modalContent.className = 'bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-6 w-80';

  const titulo = document.createElement('h2');
  titulo.className = 'text-emerald-400 text-xl font-bold';
  titulo.innerText = 'Salve sua senha';

  const qrContainer = document.createElement('div');
  qrContainer.id = 'qrcode';

  const botaoFechar = document.createElement('button');
  botaoFechar.className = 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded';
  botaoFechar.innerText = 'Fechar';
  botaoFechar.addEventListener('click', () => {
    modalOverlay.remove();
  });

  modalContent.appendChild(titulo);
  modalContent.appendChild(qrContainer);
  modalContent.appendChild(botaoFechar);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  new QRCode(qrContainer, {
    text: senha,
    width: 200,
    height: 200,
    colorDark: "#ffffff",
    colorLight: "#1f2937",
    correctLevel: QRCode.CorrectLevel.H
  });
}

