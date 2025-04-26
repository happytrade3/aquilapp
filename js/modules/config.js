import { gerarModalQRCode } from '../utils/qr-utils.js';

function configurarEventos() {
  document.getElementById('btn-alterar-senha').addEventListener('click', alterarSenha);
  document.getElementById('btn-exportar').addEventListener('click', exportarDados);
  document.getElementById('btn-resetar').addEventListener('click', resetarAplicacao);
  document.getElementById('btn-gerar-qr').addEventListener('click', gerarQRCodeSenha);
}

function gerarQRCodeSenha() {
  const senha = localStorage.getItem('aquilapp-senha');
  if (!senha) {
    alert('Nenhuma senha salva para gerar QR Code.');
    return;
  }
  gerarModalQRCode(senha);
}

