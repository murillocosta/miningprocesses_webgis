document.addEventListener("DOMContentLoaded", function () {
  // Obter o elemento do select de ano
  const searchAnoSelect = document.getElementById("search-ano");

  // Obter o ano atual
  const currentYear = new Date().getFullYear();

  // Adicionar opção vazia
  let optionEmpty = document.createElement("option");
  optionEmpty.value = "";
  optionEmpty.textContent = "     "; // Texto que será exibido para escolher vazio
  searchAnoSelect.appendChild(optionEmpty);

  // Adicionar as opções de ano de 1930 até o ano atual
  for (let year = 1930; year <= currentYear; year++) {
    let option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    searchAnoSelect.appendChild(option);
  }
});
