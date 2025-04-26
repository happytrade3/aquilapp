const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const mainSection = document.getElementById('main-section');
const loginMessage = document.getElementById('login-message');

// Simulação de senha salva (depois puxamos do LocalStorage)
const senhaSalva = "1234";

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const senhaDigitada = document.getElementById('password').value;

  if (senhaDigitada === senhaSalva) {
    loginSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
  } else {
    loginMessage.textContent = "Senha incorreta. Tente novamente.";
  }
});

