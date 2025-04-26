const navButtons = document.querySelectorAll('.nav-button');
const contentArea = document.getElementById('content-area');

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    loadSection(target);
  });
});

function loadSection(section) {
  contentArea.innerHTML = `<h2 class="text-xl font-bold mb-4 capitalize">${section}</h2><p>Conteúdo de ${section} em construção...</p>`;
}

