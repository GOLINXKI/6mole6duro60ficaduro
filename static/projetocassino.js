
// =====================================
// CONFIGURAÇÕES DO CASSINO
// =====================================

const codig = [
    "/static/alex.png",
    "/static/balao.png",
    "/static/biscoito.png",
    "/static/peixe.png",
    "/static/picareta.png"
];

let numero = 0;
let saldo = 1000;
let ganho = 1000;
let giros_totais = 0;

let custo_melhoria1 = 200;
let custo_melhoria2 = 200;

let multiplicador = 50;
let time = 150;

let divida = 11000000000000;
let tempo = 450;

let jogoEncerrado = false;


// =====================================
// ELEMENTOS DO HTML
// =====================================

const texto_melhoria1 = document.getElementById("custo_melhoria1");
const texto_melhoria2 = document.getElementById("custo_melhoria2");

const texto_giros_totais = document.getElementById("giros_totais");

const imagem1 = document.getElementById("imagem1");
const imagem2 = document.getElementById("imagem2");
const imagem3 = document.getElementById("imagem3");

const texto_saldo = document.getElementById("saldo");

const botao = document.getElementById("girar_roleta");
const resultado = document.getElementById("resultado");

const texto_numero = document.getElementById("numero");

const botao_melhoria1 = document.getElementById("botao_melhoria1");
const botao_melhoria2 = document.getElementById("botao_melhoria2");

const texto_custo_giro = document.getElementById("custo_giro");
const texto_ganho_giro = document.getElementById("ganho_giro");

const caixa_aposta = document.getElementById("aposta");

const texto_timer = document.getElementById("timer");
const texto_divida = document.getElementById("divida");

const estado = document.getElementById("estado");
const botao_pagar = document.getElementById("pagar_divida");


// =====================================
// FUNÇÕES GERAIS
// =====================================

function dinheiro(valor) {

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}

function atualizarSaldo() {

    texto_saldo.innerText = dinheiro(saldo);

}

function atualizarGanho() {

    ganho = Number(caixa_aposta.value) * multiplicador / 50;

    texto_ganho_giro.innerText = dinheiro(ganho);

    texto_custo_giro.innerText =
        (multiplicador / 50).toFixed(2).replace(".", ",") + "x";

}

function encerrarJogo(mensagem) {

    if (jogoEncerrado) return;

    jogoEncerrado = true;

    estado.innerText = mensagem;

    document.querySelectorAll("button").forEach(function(botao) {
        botao.disabled = true;
    });

    clearInterval(contagem);

}


// =====================================
// APOSTA
// =====================================

caixa_aposta.addEventListener("input", function() {

    atualizarGanho();

});


// =====================================
// CONTAGEM DO TEMPO
// =====================================

const contagem = setInterval(function() {

    if (jogoEncerrado) return;

    tempo--;

    texto_timer.innerText = tempo;

    if (tempo <= 0) {

        clearInterval(contagem);

        encerrarJogo("GAME OVER! O TEMPO ACABOU!");

    }

}, 1000);


// =====================================
// PAGAR DÍVIDA PRINCIPAL
// =====================================

botao_pagar.addEventListener("click", function() {

    if (jogoEncerrado) return;

    if (saldo >= divida) {

        saldo -= divida;

        atualizarSaldo();

        encerrarJogo("DÍVIDA PAGA! VOCÊ VENCEU!");

    } else {

        estado.innerText = "Você não tem dinheiro suficiente!";

    }

});


// =====================================
// MELHORIA 1 - VELOCIDADE
// =====================================

botao_melhoria1.addEventListener("click", function() {

    if (saldo >= custo_melhoria1) {

        saldo -= custo_melhoria1;

        custo_melhoria1 *= 2;

        time = Math.max(30, time - 5);

        texto_melhoria1.innerText = dinheiro(custo_melhoria1);

        atualizarSaldo();

    }

});


// =====================================
// MELHORIA 2 - MULTIPLICADOR
// =====================================

botao_melhoria2.addEventListener("click", function() {

    if (saldo >= custo_melhoria2) {

        saldo -= custo_melhoria2;

        custo_melhoria2 *= 2;

        multiplicador *= 1.5;

        texto_melhoria2.innerText = dinheiro(custo_melhoria2);

        atualizarGanho();
        atualizarSaldo();

    }

});


// =====================================
// ROLETA
// =====================================

botao.addEventListener("click", function() {

    if (jogoEncerrado) return;

    let custo = Number(caixa_aposta.value);

    if (!Number.isFinite(custo) || custo <= 0) {

        resultado.innerText = "Digite uma aposta válida!";
        return;

    }

    if (saldo < custo) {

        resultado.innerText = "Saldo insuficiente!";
        return;

    }

    resultado.innerText = "Girando...";

    botao.disabled = true;

    giros_totais++;

    texto_giros_totais.innerText = giros_totais;

    let trocas = 0;

    const premio = ganho;

    const animacaoRapida = setInterval(function() {

        imagem1.src = codig[Math.floor(Math.random() * codig.length)];
        imagem2.src = codig[Math.floor(Math.random() * codig.length)];
        imagem3.src = codig[Math.floor(Math.random() * codig.length)];

        trocas++;

        if (trocas >= 6) {

            clearInterval(animacaoRapida);

            let numero1 = Math.floor(Math.random() * 5);
            let numero2 = Math.floor(Math.random() * 5);
            let numero3 = Math.floor(Math.random() * 5);

            imagem1.src = codig[numero1];
            imagem2.src = codig[numero2];
            imagem3.src = codig[numero3];

            if (numero1 === numero2 && numero2 === numero3) {

                resultado.innerText = "Você ganhou!";

                numero++;

                texto_numero.innerText = numero;

                saldo += premio;

            } else {

                resultado.innerText = "Você perdeu!";

                saldo -= custo;

            }

            atualizarSaldo();

            if (!jogoEncerrado) {
                botao.disabled = false;
            }

        }

    }, time);

});


// =====================================
// SISTEMA BANCÁRIO
// =====================================

// Configurações dos três bancos

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


// Variáveis do banco

let bancoAtual = null;

let dinheiroPoupanca = 0;

let dividaBanco = 0;

let acoes = 0;


// Elementos do banco

const contratarBanco = document.getElementById("contratar_banco");
const painelBanco = document.getElementById("painel_banco");

const nomeBanco = document.getElementById("nome_banco");
const informacoesBanco = document.getElementById("informacoes_banco");

const textoPoupanca = document.getElementById("dinheiro_poupanca");
const textoRendimento = document.getElementById("rendimento_poupanca");

const textoDividaBanco = document.getElementById("divida_banco");
const textoLimite = document.getElementById("limite_emprestimo");

const inputPoupanca = document.getElementById("valor_poupanca");
const inputEmprestimo = document.getElementById("valor_emprestimo");
const inputPagamento = document.getElementById("valor_pagamento");

const inputAcoes = document.getElementById("quantidade_compra");

const mensagemAcoes = document.getElementById("mensagem_acoes");

const textoPrecoAcao = document.getElementById("preco_acao");
const textoVariacao = document.getElementById("variacao_acao");

const textoQuantidadeAcoes = document.getElementById("quantidade_acoes");
const textoValorCarteira = document.getElementById("valor_carteira");


// =====================================
// CONTRATAR BANCO
// =====================================

document.querySelectorAll(".contratar").forEach(function(botaoBanco) {

    botaoBanco.addEventListener("click", function() {

        if (jogoEncerrado) return;

        if (bancoAtual !== null) return;

        if (saldo < 10000) {

            alert("Você precisa de R$ 10.000 para contratar um banco!");

            return;

        }

        const escolha = botaoBanco.dataset.banco;

        bancoAtual = bancos[escolha];

        saldo -= 10000;

        atualizarSaldo();

        contratarBanco.hidden = true;

        painelBanco.hidden = false;

        nomeBanco.innerText = bancoAtual.nome;

        informacoesBanco.innerText =
            "Poupança: " + (bancoAtual.poupanca * 100).toFixed(2) +
            "% por segundo | Juros: " +
            (bancoAtual.juros * 100).toFixed(2) +
            "% por segundo";

        atualizarBanco();

        alert("Parabéns! Você contratou o " + bancoAtual.nome + "!");

    });

});


// =====================================
// ATUALIZAR PAINEL BANCÁRIO
// =====================================

function atualizarBanco() {

    if (bancoAtual === null) return;

    textoPoupanca.innerText = dinheiro(dinheiroPoupanca);

    textoRendimento.innerText =
        dinheiro(dinheiroPoupanca * bancoAtual.poupanca);

    textoDividaBanco.innerText = dinheiro(dividaBanco);

    textoLimite.innerText =
        dinheiro(Math.max(0, bancoAtual.limite - dividaBanco));

    textoQuantidadeAcoes.innerText = acoes;

    textoValorCarteira.innerText = dinheiro(acoes * precoAcao);

}


// =====================================
// POUPANÇA
// =====================================

document.getElementById("depositar").addEventListener("click", function() {

    if (bancoAtual === null || jogoEncerrado) return;

    let valor = Number(inputPoupanca.value);

    if (!Number.isFinite(valor) || valor <= 0) return;

    if (saldo >= valor) {

        saldo -= valor;

        dinheiroPoupanca += valor;

        atualizarSaldo();
        atualizarBanco();

    } else {

        alert("Saldo insuficiente!");

    }

});


document.getElementById("retirar").addEventListener("click", function() {

    if (bancoAtual === null || jogoEncerrado) return;

    let valor = Number(inputPoupanca.value);

    if (!Number.isFinite(valor) || valor <= 0) return;

    if (dinheiroPoupanca >= valor) {

        dinheiroPoupanca -= valor;

        saldo += valor;

        atualizarSaldo();
        atualizarBanco();

    } else {

        alert("Você não tem esse valor na poupança!");

    }

});


// =====================================
// EMPRÉSTIMOS
// =====================================

document.getElementById("pedir_emprestimo").addEventListener("click", function() {

    if (bancoAtual === null || jogoEncerrado) return;

    let valor = Number(inputEmprestimo.value);

    let limiteDisponivel = bancoAtual.limite - dividaBanco;

    if (!Number.isFinite(valor) || valor <= 0) return;

    if (valor > limiteDisponivel) {

        alert("Você ultrapassou seu limite de empréstimo!");

        return;

    }

    dividaBanco += valor;

    saldo += valor;

    atualizarSaldo();
    atualizarBanco();

});


document.getElementById("pagar_emprestimo").addEventListener("click", function() {

    if (bancoAtual === null || jogoEncerrado) return;

    let valor = Number(inputPagamento.value);

    if (!Number.isFinite(valor) || valor <= 0) return;

    if (saldo < valor) {

        alert("Saldo insuficiente!");

        return;

    }

    if (dividaBanco <= 0) {

        alert("Você não possui empréstimos!");

        return;

    }

    if (valor > dividaBanco) {

        alert("O pagamento não pode ser maior que sua dívida!");

        return;

    }

    saldo -= valor;

    dividaBanco -= valor;

    atualizarSaldo();
    atualizarBanco();

});


// =====================================
// JUROS AUTOMÁTICOS
// =====================================

setInterval(function() {

    if (bancoAtual === null || jogoEncerrado) return;

    // Rendimento da poupança

    dinheiroPoupanca += dinheiroPoupanca * bancoAtual.poupanca;

    // Juros do empréstimo

    dividaBanco += dividaBanco * bancoAtual.juros;

    atualizarBanco();

}, 1000);


// =====================================
// BOLSA DE VALORES
// =====================================

// Preço inicial da ação

let precoAcao = 100;

let precoAnterior = 100;

// Histórico dos preços

let historicoPrecos = [100];


// =====================================
// COMPRAR AÇÕES
// =====================================

document.getElementById("comprar_acoes").addEventListener("click", function() {

    if (bancoAtual === null || jogoEncerrado) return;

    let quantidade = Number(inputAcoes.value);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {

        mensagemAcoes.innerText = "Digite uma quantidade válida!";
        return;

    }

    let custo = precoAcao * quantidade;

    // Taxa cobrada pelo banco

    let taxa = custo * bancoAtual.taxa;

    let custoTotal = custo + taxa;

    if (saldo < custoTotal) {

        mensagemAcoes.innerText = "Dinheiro insuficiente!";
        return;

    }

    saldo -= custoTotal;

    acoes += quantidade;

    mensagemAcoes.innerText =
        "Você comprou " + quantidade + " ações!";

    atualizarSaldo();
    atualizarBanco();

});


// =====================================
// VENDER AÇÕES
// =====================================

document.getElementById("vender_acoes").addEventListener("click", function() {

    if (bancoAtual === null || jogoEncerrado) return;

    let quantidade = Number(inputAcoes.value);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {

        mensagemAcoes.innerText = "Digite uma quantidade válida!";
        return;

    }

    if (acoes < quantidade) {

        mensagemAcoes.innerText = "Você não possui tantas ações!";
        return;

    }

    let valorVenda = precoAcao * quantidade;

    let taxa = valorVenda * bancoAtual.taxa;

    let valorFinal = valorVenda - taxa;

    acoes -= quantidade;

    saldo += valorFinal;

    mensagemAcoes.innerText =
        "Você vendeu " + quantidade + " ações!";

    atualizarSaldo();
    atualizarBanco();

});


// =====================================
// MOVIMENTAÇÃO DA BOLSA
// =====================================

setInterval(function() {

    if (bancoAtual === null || jogoEncerrado) return;

    precoAnterior = precoAcao;

    // Variação aleatória de aproximadamente -3% até +3%

    let variacao = (Math.random() * 0.06) - 0.03;

    precoAcao *= (1 + variacao);

    // Impede o preço de chegar a zero

    precoAcao = Math.max(1, precoAcao);

    historicoPrecos.push(precoAcao);

    // Mantém apenas os últimos 40 preços

    if (historicoPrecos.length > 40) {

        historicoPrecos.shift();

    }

    atualizarBolsa();

}, 1000);


// =====================================
// ATUALIZAR BOLSA
// =====================================

function atualizarBolsa() {

    textoPrecoAcao.innerText = dinheiro(precoAcao);

    let variacao = ((precoAcao - precoAnterior) / precoAnterior) * 100;

    textoVariacao.innerText =
        (variacao >= 0 ? "+" : "") + variacao.toFixed(2) + "%";

    textoVariacao.style.color =
        variacao >= 0 ? "green" : "red";

    atualizarBanco();

    desenharGrafico();

}


// =====================================
// DESENHAR GRÁFICO
// =====================================

function desenharGrafico() {

    const canvas = document.getElementById("grafico_acoes");

    const contexto = canvas.getContext("2d");

    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;

    if (!largura || !altura) return;

    canvas.width = largura * window.devicePixelRatio;
    canvas.height = altura * window.devicePixelRatio;

    contexto.scale(
        window.devicePixelRatio,
        window.devicePixelRatio
    );

    // Fundo

    contexto.clearRect(0, 0, largura, altura);

    contexto.strokeStyle = "#dddddd";
    contexto.lineWidth = 1;

    for (let i = 1; i <= 3; i++) {

        let y = (altura / 4) * i;

        contexto.beginPath();
        contexto.moveTo(0, y);
        contexto.lineTo(largura, y);
        contexto.stroke();

    }

    if (historicoPrecos.length < 2) return;

    let maximo = Math.max(...historicoPrecos);
    let minimo = Math.min(...historicoPrecos);

    let diferenca = maximo - minimo;

    if (diferenca === 0) diferenca = 1;

    contexto.beginPath();

    historicoPrecos.forEach(function(preco, indice) {

        let x = (indice / 39) * largura;

        let y = altura -
            ((preco - minimo) / diferenca) * (altura - 20) - 10;

        if (indice === 0) {

            contexto.moveTo(x, y);

        } else {

            contexto.lineTo(x, y);

        }

    });

    contexto.strokeStyle =
        precoAcao >= precoAnterior ? "#16834a" : "#d93636";

    contexto.lineWidth = 3;

    contexto.stroke();

}


// =====================================
// VALORES INICIAIS
// =====================================

atualizarSaldo();

atualizarGanho();

atualizarBolsa();
