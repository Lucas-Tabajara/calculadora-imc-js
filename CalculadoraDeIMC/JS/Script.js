/**
 * DATA: Tabela de referência para classificação de IMC.
 * Facilita a manutenção: se as normas da OMS mudarem, basta alterar este array.
 */
const data = [
  { min: 0, max: 18.4, classification: "Menor que 18,5", info: "Magreza", obesity: "0", color: "low" },
  { min: 18.5, max: 24.9, classification: "Entre 18,5 e 24,9", info: "Normal", obesity: "0", color: "good" },
  { min: 25, max: 29.9, classification: "Entre 25,0 e 29,9", info: "Sobrepeso", obesity: "I", color: "low" },
  { min: 30, max: 39.9, classification: "Entre 30,0 e 39,9", info: "Obesidade", obesity: "II", color: "medium" },
  { min: 40, max: 99, classification: "Maior que 40,0", info: "Obesidade Grave", obesity: "III", color: "high" },
];

/* --- SELEÇÃO DE ELEMENTOS --- */
const imcTable = document.querySelector("#imc-table");
const heightInput = document.querySelector("#height");
const weightInput = document.querySelector("#weight");
const calcBtn = document.querySelector("#calc-btn");
const clearBtn = document.querySelector("#clear-btn");
const backBtn = document.querySelector("#back-btn");

const calcContainer = document.querySelector("#calc-container");
const resultContainer = document.querySelector("#result-container");

const imcNumber = document.querySelector("#imc-number span");
const imcInfo = document.querySelector("#imc-info span");

/* --- FUNÇÕES --- */

/**
 * Renderiza a tabela de classificações dinamicamente no HTML.
 */
function createTable(data) {
    data.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("table-data");

        div.innerHTML = `
            <p>${item.classification}</p>
            <p>${item.info}</p>
            <p>${item.obesity}</p>
        `;

        imcTable.appendChild(div);
    });
}

/**
 * Remove valores dos inputs e reseta classes de estilo dos resultados.
 */
function clearInputs() {
    heightInput.value = "";
    weightInput.value = "";
    imcNumber.innerText = "";
    imcInfo.innerText = "";
    // Reseta as classes de cores para evitar acúmulo de estilos de cálculos anteriores
    imcNumber.className = ""; 
    imcInfo.className = "";
}

/**
 * Sanitização de input: permite apenas números e uma vírgula.
 * @param {string} text 
 */
function validDigits(text) {
    return text.replace(/[^0-9,]/g, "");
}

/**
 * Realiza o cálculo matemático do IMC.
 * IMC = peso / (altura * altura)
 */
function calcImc(weight, height) {
    return (weight / (height * height)).toFixed(1);
}

/**
 * Toggle entre a tela de formulário e a tela de resultados.
 */
function showOrHideResults() {
    calcContainer.classList.toggle("hide");
    resultContainer.classList.toggle("hide");
}

/* --- INICIALIZAÇÃO --- */

// Preenche a tabela assim que o script é carregado
createTable(data);

/* --- EVENTOS --- */

// Filtro de entrada em tempo real para os campos de texto
[heightInput, weightInput].forEach((el) => {
    el.addEventListener("input", (e) => {
        e.target.value = validDigits(e.target.value);
    });
});

/**
 * Lógica principal de cálculo e atualização da interface.
 */
calcBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Normalização de dados (vírgula para ponto)
    const weight = +weightInput.value.replace(",", ".");
    const height = +heightInput.value.replace(",", ".");

    // Early return: se os campos estiverem vazios ou inválidos, interrompe a execução
    if (!weight || !height) return;

    const imc = calcImc(weight, height);

    // Busca a categoria correspondente no array de dados
    const result = data.find(item => imc >= item.min && imc <= item.max);

    if (!result) return;

    // Atualiza o conteúdo visual
    imcNumber.innerText = imc;
    imcInfo.innerText = result.info;

    // Aplica a classe de cor correspondente definida no CSS (low, good, medium, high)
    imcNumber.classList.add(result.color);
    imcInfo.classList.add(result.color);

    showOrHideResults();
});

// Reseta o formulário
clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearInputs();
});

// Volta para a tela inicial limpando os dados
backBtn.addEventListener("click", () => {
    clearInputs();
    showOrHideResults();
});