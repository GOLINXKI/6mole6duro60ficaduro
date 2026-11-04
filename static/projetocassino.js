const codig = [
    "/static/alex.png",
    "/static/balao.png",
    "/static/biscoito.png",
    "/static/peixe.png",
    "/static/picareta.png"

];

let numero = 0;
let custo = 10
let saldo = 1000;
let ganho = 1000;
let giros_totais = 0
let custo_melhoria1 = 200;
let custo_melhoria2 = 200;
let multiplicador = 50
let time = 150

const texto_melhoria1 = document.getElementById("custo_melhoria1");
const texto_melhoria2 = document.getElementById("custo_melhoria2")
const texto_giros_totais = document.getElementById("giros_totais")
const imagem1 = document.getElementById("imagem1");
const imagem2 = document.getElementById("imagem2");
const imagem3 = document.getElementById("imagem3");
const texto_saldo = document.getElementById("saldo");
const botao = document.getElementById("girar_roleta");
const resultado = document.getElementById("resultado");
const texto_numero = document.getElementById("numero");
const botao_melhoria1 = document.getElementById("botao_melhoria1");
const botao_melhoria2 = document.getElementById("botao_melhoria2");
const texto_custo_giro = document.getElementById("custo_giro")
const texto_ganho_giro = document.getElementById("ganho_giro")
const caixa_aposta = document.getElementById("aposta");
const texto_multiplicador = document.getElementById("custo_giro")




let divida = 11000000000000;
let tempo = 450;

const texto_timer = document.getElementById("timer");
const texto_divida = document.getElementById("divida");
const estado = document.getElementById("estado");

const botao_pagar1 = document.getElementById("pagar_divida");

const contagem = setInterval(function() {
    tempo--;

    texto_timer.innerText = tempo;

    if (tempo <= 0) {
        clearInterval(contagem);

        estado.innerText = "GAME OVER!";

        botao.disabled = true;
        botao_melhoria1.disabled = true;
        botao_melhoria2.disabled = true;
        botao_pagar1.disabled = true;
    }
}, 1000);



const botao_pagar = document.getElementById("pagar_divida");

botao_pagar.addEventListener("click", function() {

    if (saldo >= divida) {
        saldo = saldo - divida;

        texto_saldo.innerText = saldo;
        estado.innerText = "DÍVIDA PAGA! VOCÊ VENCEU!";

        clearInterval(contagem);

        botao.disabled = true;
        botao_melhoria1.disabled = true;
        botao_melhoria2.disabled = true;
        botao_pagar.disabled = true;

    } else {
        estado.innerText = "Você não tem dinheiro suficiente!";
    }

});



caixa_aposta.addEventListener("input", function() {
    ganho = Number(caixa_aposta.value) * multiplicador;
    texto_ganho_giro.textContent = parseInt(ganho)
    });
    
botao_melhoria1.addEventListener("click", function(){

    if (saldo > custo_melhoria1) {

        saldo = saldo - custo_melhoria1;

        custo_melhoria1 = custo_melhoria1 * 2;

        texto_melhoria1.innerText = parseInt(custo_melhoria1);
        texto_saldo.innerText = parseInt(saldo);

        time= time - 5

    }

});




botao_melhoria2.addEventListener("click", function(){

    if (saldo > custo_melhoria2) {

        saldo = saldo - custo_melhoria2;

        custo_melhoria2 = custo_melhoria2 * 2;

        texto_melhoria2.innerText = parseInt(custo_melhoria2);
        texto_saldo.innerText = parseInt(saldo);

        multiplicador = multiplicador * 1.5;
        ganho = Number(caixa_aposta.value) * multiplicador;
        texto_ganho_giro.innerText = parseInt(ganho);
        texto_multiplicador.innerText = multiplicador/100
    }

});


botao.addEventListener("click", function() {
    let custo = Number(caixa_aposta.value);

    if (saldo < custo) {
        resultado.textContent = "Saldo insuficiente!";
        return;
    }
    resultado.textContent = "Girando...";
    botao.disabled = true;
    giros_totais++;
    texto_giros_totais.innerText = giros_totais;



    let trocas = 0;

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

        resultado.textContent = "Você ganhou!";
        numero++;
        texto_numero.innerText = numero;

        saldo = saldo + ganho;
        texto_saldo.innerText = parseInt(saldo);;
        botao.disabled = false;

    } else {

        resultado.textContent = "Você perdeu!";
        saldo = saldo - custo;
        texto_saldo.innerText = parseInt(saldo);;
        botao.disabled = false;
    }    
    }

    }, time);


});