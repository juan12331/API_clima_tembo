const apiUrl = "http://127.0.0.1:80/climatempo/";

function fade(element, callback) {
    let op = 1;
    let timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
            if (typeof callback === 'function') {
                callback();
            }
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function updateElementText(elementId, text, text2) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = text + text2;
    }
}

function updateElementImg(elementId, src) {
    const element = document.getElementById(elementId);
    if (element) {
        element.src = src;
    }
}

function displayData(data) {
    if (!data) return;
    console.log(data);
    const imgUrl = `https://flagsapi.com/${data.pais}/flat/64.png`;
    updateElementText("temperatura", data.temperatura, "ºC");
    updateElementText("umidade", data.umidade, "%");
    updateElementText("veloVento", data.velocidadeDoVento, "km/h");
    updateElementText("clima", data.clima, "");
    updateElementText("nome", data.nome, "");
    updateElementImg("iconClima", data.iconUrl);
    updateElementImg("iconPais", imgUrl);
}

function handleError(errorMsg) {
    const toast = document.createElement("div");
    const icon = document.createElement("i");
    icon.className = "bx bxs-shield-x";
    toast.classList.add("toast");
    toast.innerText = errorMsg;
    toast.appendChild(icon);
    document.body.appendChild(toast);

    setTimeout(() => {
        fade(toast, function() {
            toast.remove();
        });
    }, 3000);
}

async function getData(cidade) {
    const url = apiUrl + cidade;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao se conectar!');
        }
        return await response.json();
    } catch (error) {
        handleError("Cidade não encontrada!");
        return null;
    }
}

window.addEventListener("load", async () => {
    const informacoes = await getData("marília");
    displayData(informacoes);
});

const pesquisarCampo = document.getElementById("pesquisar");

pesquisarCampo.addEventListener("keyup", async (e) => {
    if (e.key === 'Enter') {
        const informacoes = await getData(pesquisarCampo.value.toLowerCase());
        displayData(informacoes);
    }
});
