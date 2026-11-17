
// ======================================
// CONFIGURAÇÕES INICIAIS
// ======================================

let saldo = 1000;
let giros_totais = 0;

let multiplicador = 100;
let ganho = 0;

let time = 150;
let custo_melhoria1 = 200;
let custo_melhoria2 = 500;

let divida = 11000000000000;

let girando = false;
let jogoEncerrado = false;

let roletaAutomaticaDesbloqueada = false;
let roletaAutomaticaAtiva = false;
let custo_melhoria_auto = 5000;

const precoContratacao = 10000;

const codig = [
    "/static/alex.png",
    "/static/balao.png",
    "/static/biscoito.png",
    "/static/peixe.png",
    "/static/picareta.png"
];

const bancos = {
    imperial: {
        nome: "Nubanco",
        poupanca: 0.0008,
        juros: 0.0012,
        limite: 20000,
        taxa: 0.02
    },

    capital: {
        nome: "Ita Aí",
        poupanca: 0.0015,
        juros: 0.003,
        limite: 50000,
        taxa: 0.03
    },

    popular: {
        nome: "67 Resenhudos Bank",
        poupanca: 0.001,
        juros: 0.002,
        limite: 35000,
        taxa: 0.01
    }
};

let bancoAtual = null;
let dinheiroPoupanca = 0;
let dividaBanco = 0;
let quantidadeAcoes = 0;

let precoAcao = 100;
let variacaoAcao = 0;
let historicoAcoes = [100];


// ======================================
// ELEMENTOS HTML
// ======================================

const elementoSaldo = document.getElementById("saldo");
const elementoGiros = document.getElementById("giros_totais");
const elementoNumero = document.getElementById("numero");
const elementoMultiplicador = document.getElementById("multiplicador");
const elementoGanho = document.getElementById("ganho_giro");

const elementoAposta = document.getElementById("aposta");
const botaoGirar = document.getElementById("girar_roleta");
const elementoResultado = document.getElementById("resultado");

const imagem1 = document.getElementById("imagem1");
const imagem2 = document.getElementById("imagem2");
const imagem3 = document.getElementById("imagem3");

const elementoDivida = document.getElementById("divida");
const elementoEstado = document.getElementById("estado");

const botaoAbrirBancos = document.getElementById("contratar_banco");
const selecaoBancos = document.getElementById("selecao_bancos");
const painelBanco = document.getElementById("painel_banco");

const botaoMelhoriaAuto =
    document.getElementById("botao_melhoria_auto");

const botaoAtivarAuto =
    document.getElementById("ativar_auto");


// ======================================
// FUNÇÕES GERAIS
// ======================================

function dinheiro(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function verificarJogo() {
    return jogoEncerrado;
}

function atualizarTela() {
    elementoSaldo.textContent = dinheiro(saldo);
    elementoGiros.textContent = giros_totais;
    elementoMultiplicador.textContent = "x" + multiplicador;

    const aposta = Math.max(
        0,
        Number(elementoAposta.value) || 0
    );

    ganho = aposta * multiplicador;

    elementoGanho.textContent = dinheiro(ganho);
    elementoDivida.textContent = dinheiro(divida);

    document.getElementById("custo_melhoria1").textContent =
        dinheiro(custo_melhoria1);

    document.getElementById("custo_melhoria2").textContent =
        dinheiro(custo_melhoria2);

    document.getElementById("custo_melhoria_auto").textContent =
        dinheiro(custo_melhoria_auto);

    atualizarBotoesBancos();
}


// ======================================
// APOSTAS E ROLETA
// ======================================

elementoAposta.addEventListener("input", atualizarTela);

botaoGirar.addEventListener("click", girarRoleta);

function girarRoleta() {
    if (verificarJogo() || girando) {
        return;
    }

    const aposta = Number(elementoAposta.value);

    if (!Number.isFinite(aposta) || aposta <= 0) {
        elementoResultado.textContent =
            "Digite uma aposta válida!";
        return;
    }

    if (aposta > saldo) {
        elementoResultado.textContent =
            "Você não tem dinheiro suficiente!";
        return;
    }

    girando = true;
    botaoGirar.disabled = true;

    elementoResultado.textContent = "Girando...";

    let trocas = 0;

    // 10 trocas de 150 ms = aproximadamente 1,5 segundo.
    const intervalo = setInterval(() => {
        imagem1.src = codig[Math.floor(Math.random() * codig.length)];
        imagem2.src = codig[Math.floor(Math.random() * codig.length)];
        imagem3.src = codig[Math.floor(Math.random() * codig.length)];

        trocas++;

        if (trocas >= 10) {
            clearInterval(intervalo);

            finalizarGiro(aposta);

            girando = false;

            if (!jogoEncerrado) {
                botaoGirar.disabled = false;
            }
        }
    }, time);
}


function finalizarGiro(aposta) {
    giros_totais++;

    const numero1 = Math.floor(Math.random() * codig.length);
    const numero2 = Math.floor(Math.random() * codig.length);
    const numero3 = Math.floor(Math.random() * codig.length);

    imagem1.src = codig[numero1];
    imagem2.src = codig[numero2];
    imagem3.src = codig[numero3];

    elementoNumero.textContent = numero1 + 1;

    if (numero1 === numero2 && numero2 === numero3) {

        const premio = aposta * multiplicador;

        saldo += premio;

        elementoResultado.textContent =
            "🎉 VOCÊ GANHOU! Prêmio: " + dinheiro(premio);

    } else {

        saldo -= aposta;

        elementoResultado.textContent =
            "Você perdeu " + dinheiro(aposta);
    }

    atualizarTela();

    // Continua girando automaticamente.
    if (roletaAutomaticaAtiva && !jogoEncerrado) {

        if (saldo >= aposta) {

            setTimeout(() => {
                girarRoleta();
            }, 300);

        } else {

            roletaAutomaticaAtiva = false;

            botaoAtivarAuto.textContent = "Ativar automático";

            elementoResultado.textContent +=
                " | Saldo insuficiente para continuar.";
        }
    }
}


// ======================================
// MELHORIA DE VELOCIDADE
// ======================================

document.getElementById("botao_melhoria1").addEventListener("click", () => {

    if (verificarJogo()) return;

    if (saldo < custo_melhoria1) {
        alert("Dinheiro insuficiente!");
        return;
    }

    if (time <= 30) {
        alert("A velocidade já está no máximo!");
        return;
    }

    saldo -= custo_melhoria1;

    time = Math.max(30, time - 5);

    custo_melhoria1 = Math.floor(custo_melhoria1 * 1.7);

    atualizarTela();
});


// ======================================
// MELHORIA DE MULTIPLICADOR
// ======================================

document.getElementById("botao_melhoria2").addEventListener("click", () => {

    if (verificarJogo()) return;

    if (saldo < custo_melhoria2) {
        alert("Dinheiro insuficiente!");
        return;
    }

    saldo -= custo_melhoria2;

    multiplicador = Math.floor(multiplicador * 1.5);

    custo_melhoria2 = Math.floor(custo_melhoria2 * 2);

    atualizarTela();
});


// ======================================
// MELHORIA DE ROLETA AUTOMÁTICA
// ======================================

botaoMelhoriaAuto.addEventListener("click", () => {

    if (verificarJogo()) return;

    if (roletaAutomaticaDesbloqueada) {
        alert("Você já comprou essa melhoria!");
        return;
    }

    if (saldo < custo_melhoria_auto) {
        alert("Dinheiro insuficiente!");
        return;
    }

    saldo -= custo_melhoria_auto;

    roletaAutomaticaDesbloqueada = true;

    botaoMelhoriaAuto.disabled = true;
    botaoMelhoriaAuto.textContent = "Comprada";

    botaoAtivarAuto.disabled = false;

    atualizarTela();
});


botaoAtivarAuto.addEventListener("click", () => {

    if (verificarJogo()) return;

    if (!roletaAutomaticaDesbloqueada) return;

    roletaAutomaticaAtiva = !roletaAutomaticaAtiva;

    if (roletaAutomaticaAtiva) {

        botaoAtivarAuto.textContent = "Desativar automático";

        if (!girando) {
            girarRoleta();
        }

    } else {

        botaoAtivarAuto.textContent = "Ativar automático";
    }
});


// ======================================
// PAGAR DÍVIDA
// ======================================

document.getElementById("pagar_divida").addEventListener("click", () => {

    if (verificarJogo()) return;

    if (saldo <= 0) {
        alert("Você não tem dinheiro para pagar a dívida!");
        return;
    }

    const pagamento = Math.min(saldo, divida);

    saldo -= pagamento;
    divida -= pagamento;

    atualizarTela();

    if (divida <= 0) {
        divida = 0;
        encerrarJogo();
    }
});


// ======================================
// ENCERRAR JOGO
// ======================================

function encerrarJogo() {

    if (jogoEncerrado) return;

    jogoEncerrado = true;
    roletaAutomaticaAtiva = false;

    document.querySelectorAll("button").forEach(botao => {
        botao.disabled = true;
    });

    elementoAposta.disabled = true;

    elementoEstado.textContent =
        "🏆 PARABÉNS! Você pagou toda a dívida!";

    elementoResultado.textContent = "VOCÊ VENCEU!";
}


// ======================================
// SISTEMA DE BANCOS
// ======================================

botaoAbrirBancos.addEventListener("click", () => {

    if (verificarJogo()) return;

    selecaoBancos.hidden = !selecaoBancos.hidden;
});


function atualizarBotoesBancos() {

    document.querySelectorAll(".contratar").forEach(botao => {

        botao.disabled =
            verificarJogo() ||
            bancoAtual !== null ||
            saldo < precoContratacao;

        if (bancoAtual !== null) {
            botao.textContent = "Banco já contratado";
        } else {
            botao.textContent = "Contratar";
        }
    });
}


// ======================================
// CONTRATAR BANCO
// ======================================

document.querySelectorAll(".contratar").forEach(botao => {

    botao.addEventListener("click", () => {

        if (verificarJogo()) return;

        if (bancoAtual !== null) {
            alert("Você já possui um banco!");
            return;
        }

        if (saldo < precoContratacao) {
            alert("Você precisa de R$ 10.000 para contratar um banco!");
            return;
        }

        const identificador = botao.dataset.banco;

        bancoAtual = bancos[identificador];

        saldo -= precoContratacao;

        document.getElementById("nome_banco").textContent =
            bancoAtual.nome;

        document.getElementById("informacoes_banco").textContent =
            "Seu banco está contratado! Aproveite os serviços disponíveis.";

        painelBanco.hidden = false;
        selecaoBancos.hidden = true;

        atualizarBanco();
        atualizarTela();
    });
});


// ======================================
// ATUALIZAÇÃO DO BANCO
// ======================================

function atualizarBanco() {

    if (bancoAtual === null) return;

    document.getElementById("dinheiro_poupanca").textContent =
        dinheiro(dinheiroPoupanca);

    document.getElementById("rendimento_poupanca").textContent =
        (bancoAtual.poupanca * 100).toFixed(2) + "% por segundo";

    document.getElementById("divida_banco").textContent =
        dinheiro(dividaBanco);

    const limiteDisponivel = Math.max(
        0,
        bancoAtual.limite - dividaBanco
    );

    document.getElementById("limite_emprestimo").textContent =
        dinheiro(limiteDisponivel);

    document.getElementById("quantidade_acoes").textContent =
        quantidadeAcoes;

    document.getElementById("valor_carteira").textContent =
        dinheiro(quantidadeAcoes * precoAcao);
}


// ======================================
// DEPOSITAR NA POUPANÇA
// ======================================

document.getElementById("depositar").addEventListener("click", () => {

    if (verificarJogo() || bancoAtual === null) return;

    const valor = Number(
        document.getElementById("valor_poupanca").value
    );

    if (!Number.isFinite(valor) || valor <= 0) {
        alert("Digite um valor válido!");
        return;
    }

    if (valor > saldo) {
        alert("Saldo insuficiente!");
        return;
    }

    saldo -= valor;
    dinheiroPoupanca += valor;

    document.getElementById("valor_poupanca").value = "";

    atualizarTela();
    atualizarBanco();
});


// ======================================
// RETIRAR DA POUPANÇA
// ======================================

document.getElementById("retirar").addEventListener("click", () => {

    if (verificarJogo() || bancoAtual === null) return;

    const valor = Number(
        document.getElementById("valor_poupanca").value
    );

    if (!Number.isFinite(valor) || valor <= 0) {
        alert("Digite um valor válido!");
        return;
    }

    if (valor > dinheiroPoupanca) {
        alert("Você não tem esse valor na poupança!");
        return;
    }

    dinheiroPoupanca -= valor;
    saldo += valor;

    document.getElementById("valor_poupanca").value = "";

    atualizarTela();
    atualizarBanco();
});


// ======================================
// PEDIR EMPRÉSTIMO
// ======================================

document.getElementById("pedir_emprestimo").addEventListener("click", () => {

    if (verificarJogo() || bancoAtual === null) return;

    const valor = Number(
        document.getElementById("valor_emprestimo").value
    );

    const limiteDisponivel = bancoAtual.limite - dividaBanco;

    if (!Number.isFinite(valor) || valor <= 0) {
        alert("Digite um valor válido!");
        return;
    }

    if (valor > limiteDisponivel) {
        alert("Você ultrapassou o limite do banco!");
        return;
    }

    saldo += valor;
    dividaBanco += valor;

    document.getElementById("valor_emprestimo").value = "";

    atualizarTela();
    atualizarBanco();
});


// ======================================
// PAGAR EMPRÉSTIMO
// ======================================

document.getElementById("pagar_emprestimo").addEventListener("click", () => {

    if (verificarJogo() || bancoAtual === null) return;

    const valor = Number(
        document.getElementById("valor_pagamento").value
    );

    if (!Number.isFinite(valor) || valor <= 0) {
        alert("Digite um valor válido!");
        return;
    }

    if (valor > saldo) {
        alert("Você não tem saldo suficiente!");
        return;
    }

    if (valor > dividaBanco) {
        alert("O pagamento é maior que sua dívida com o banco!");
        return;
    }

    saldo -= valor;
    dividaBanco -= valor;

    document.getElementById("valor_pagamento").value = "";

    atualizarTela();
    atualizarBanco();
});


// ======================================
// BOLSA DE VALORES
// ======================================

function atualizarBolsa() {

    if (bancoAtual === null) return;

    variacaoAcao = (Math.random() * 6) - 3;

    precoAcao = precoAcao * (1 + variacaoAcao / 100);

    precoAcao = Math.max(1, precoAcao);

    historicoAcoes.push(precoAcao);

    if (historicoAcoes.length > 40) {
        historicoAcoes.shift();
    }

    document.getElementById("preco_acao").textContent =
        dinheiro(precoAcao);

    const elementoVariacao =
        document.getElementById("variacao_acao");

    elementoVariacao.textContent =
        variacaoAcao.toFixed(2) + "%";

    elementoVariacao.style.color =
        variacaoAcao >= 0 ? "#55df91" : "#ff7777";

    atualizarBanco();
    desenharGrafico();
}


// ======================================
// DESENHAR GRÁFICO
// ======================================

function desenharGrafico() {

    const canvas = document.getElementById("grafico_acoes");
    const contexto = canvas.getContext("2d");

    const largura = canvas.width;
    const altura = canvas.height;

    contexto.clearRect(0, 0, largura, altura);

    const minimo = Math.min(...historicoAcoes);
    const maximo = Math.max(...historicoAcoes);

    const diferenca = Math.max(maximo - minimo, 1);

    contexto.strokeStyle = "#ffffff22";
    contexto.lineWidth = 1;

    for (let i = 1; i < 4; i++) {

        const y = (altura / 4) * i;

        contexto.beginPath();
        contexto.moveTo(0, y);
        contexto.lineTo(largura, y);
        contexto.stroke();
    }

    contexto.beginPath();

    historicoAcoes.forEach((preco, indice) => {

        const x =
            (indice / Math.max(historicoAcoes.length - 1, 1))
            * largura;

        const y = altura - (
            ((preco - minimo) / diferenca) * (altura - 20) + 10
        );

        if (indice === 0) {
            contexto.moveTo(x, y);
        } else {
            contexto.lineTo(x, y);
        }
    });

    contexto.strokeStyle = "#8c70ff";
    contexto.lineWidth = 3;
    contexto.stroke();
}


// ======================================
// COMPRAR AÇÕES
// ======================================

document.getElementById("comprar_acoes").addEventListener("click", () => {

    if (verificarJogo() || bancoAtual === null) return;

    const quantidade = Number(
        document.getElementById("quantidade_compra").value
    );

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Digite uma quantidade válida!");
        return;
    }

    const valorCompra = quantidade * precoAcao;
    const taxa = valorCompra * bancoAtual.taxa;
    const custoTotal = valorCompra + taxa;

    if (custoTotal > saldo) {
        alert("Você não tem dinheiro suficiente!");
        return;
    }

    saldo -= custoTotal;
    quantidadeAcoes += quantidade;

    document.getElementById("mensagem_acoes").textContent =
        "Você comprou " + quantidade + " ações!";

    document.getElementById("quantidade_compra").value = "";

    atualizarTela();
    atualizarBanco();
});


// ======================================
// VENDER AÇÕES
// ======================================

document.getElementById("vender_acoes").addEventListener("click", () => {

    if (verificarJogo() || bancoAtual === null) return;

    const quantidade = Number(
        document.getElementById("quantidade_compra").value
    );

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Digite uma quantidade válida!");
        return;
    }

    if (quantidade > quantidadeAcoes) {
        alert("Você não possui tantas ações!");
        return;
    }

    const valorVenda = quantidade * precoAcao;
    const taxa = valorVenda * bancoAtual.taxa;
    const valorFinal = valorVenda - taxa;

    saldo += valorFinal;
    quantidadeAcoes -= quantidade;

    document.getElementById("mensagem_acoes").textContent =
        "Você vendeu " + quantidade + " ações!";

    document.getElementById("quantidade_compra").value = "";

    atualizarTela();
    atualizarBanco();
});


// ======================================
// RENDIMENTOS E JUROS DO BANCO
// ======================================

setInterval(() => {

    if (jogoEncerrado || bancoAtual === null) return;

    dinheiroPoupanca +=
        dinheiroPoupanca * bancoAtual.poupanca;

    dividaBanco +=
        dividaBanco * bancoAtual.juros;

    atualizarBanco();

}, 1000);


// ======================================
// ATUALIZAÇÃO DA BOLSA
// ======================================

setInterval(() => {

    if (jogoEncerrado) return;

    atualizarBolsa();

}, 1000);


// ======================================
// INICIALIZAÇÃO
// ======================================

atualizarTela();
atualizarBotoesBancos();
desenharGrafico();
