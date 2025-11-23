// Variável global para guardar os dados
let bancoDeDados = [];
let timeAtual = []; 

// 1. CARREGAR DADOS
window.onload = function() {
    fetch("data.json")
        .then(response => response.json())
        .then(dados => {
            bancoDeDados = dados;
            carregarHerois();
            pesquisar();
        })
        .catch(error => console.error("Erro ao carregar:", error));
};

// 2. CRIA AS BOLINHAS
function carregarHerois() {
    let container = document.getElementById("galeria-herois");
    let html = "";
    for (let dado of bancoDeDados) {
        html += `
            <div class="hero-avatar" onclick="filtrarPorHeroi('${dado.titulo}')" title="${dado.titulo}">
                <img src="${dado.imagem}" alt="${dado.titulo}">
            </div>
        `;
    }
    container.innerHTML = html;
}

// 3. FILTRAR POR HERÓI
function filtrarPorHeroi(nome) {
    document.getElementById("campo-pesquisa").value = nome;
    document.getElementById("deck-view-container").style.display = "none"; 
    document.getElementById("resultados-pesquisa").style.display = "block"; 
    pesquisar();
}

// 4. ABAS
function mostrarAba(aba) {
    document.getElementById("aba-personagens").style.display = aba === 'personagens' ? 'block' : 'none';
    document.getElementById("aba-epiphany").style.display = aba === 'epiphany' ? 'block' : 'none';
    
    let btns = document.querySelectorAll('.nav-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// --- SISTEMA DE TIME ---

function toggleTime(indexDoPersonagem) {
    let personagemOriginal = bancoDeDados[indexDoPersonagem];
    let indexNoTime = timeAtual.findIndex(p => p.titulo === personagemOriginal.titulo);

    if (indexNoTime !== -1) {
        timeAtual.splice(indexNoTime, 1); 
    } else {
        if (timeAtual.length < 3) {
            let novoMembro = JSON.parse(JSON.stringify(personagemOriginal));
            novoMembro.cartasInativas = []; 
            timeAtual.push(novoMembro);
        } else {
            alert("O time já está cheio! (Máx 3)");
            return;
        }
    }
    atualizarBarraTime();
    pesquisar(); 
}

function removerDoTime(indexSlot) {
    if (timeAtual[indexSlot]) {
        timeAtual.splice(indexSlot, 1);
        atualizarBarraTime();
        pesquisar();
    }
}

function limparTime() {
    timeAtual = [];
    atualizarBarraTime();
    pesquisar();
    document.getElementById("deck-view-container").style.display = "none";
    document.getElementById("resultados-pesquisa").style.display = "block";
}

function atualizarBarraTime() {
    for (let i = 0; i < 3; i++) {
        let slot = document.getElementById(`slot-${i}`);
        if (timeAtual[i]) {
            slot.innerHTML = `<img src="${timeAtual[i].imagem}">`;
            slot.style.borderColor = "#04d361"; 
        } else {
            slot.innerHTML = `<span>+</span>`;
            slot.style.borderColor = "#555";
        }
    }
    
    document.getElementById("contador-time").innerText = `${timeAtual.length}/3 Selecionados`;
    
    let btnVer = document.getElementById("btn-ver-deck");
    if (timeAtual.length > 0) {
        btnVer.disabled = false;
        btnVer.style.background = "var(--primary)";
    } else {
        btnVer.disabled = true;
        btnVer.style.background = "#333";
    }
}

function toggleCarta(indexPersonagemNoTime, indexCarta) {
    let containerDeck = document.getElementById("deck-view-container");
    if (containerDeck.style.display === "none") return;

    let personagem = timeAtual[indexPersonagemNoTime];
    if (!personagem.cartasInativas) personagem.cartasInativas = [];

    if (personagem.cartasInativas.includes(indexCarta)) {
        personagem.cartasInativas = personagem.cartasInativas.filter(i => i !== indexCarta);
    } else {
        personagem.cartasInativas.push(indexCarta);
    }
    verDeckFinal(); 
}

// --- GERADOR DE HTML ---
// --- FUNÇÃO MESTRE QUE GERA O HTML DO CARD ---
// --- FUNÇÃO MESTRE QUE GERA O HTML DO CARD ---
function gerarHTMLPersonagem(dado, modoDeck = false, indexNoTime = null) {
    let campoPesquisa = document.getElementById("campo-pesquisa").value.toLowerCase().trim();
    
    // Lógica da Ego Skill
    let htmlImagem2 = "";
    if (dado.imagem2) {
        let mostrarEgo = modoDeck || (campoPesquisa !== "");
        if (mostrarEgo) {
            let textoEgo = dado.egoskill_descricao ? `<div class="ego-text">${dado.egoskill_descricao}</div>` : "";
            htmlImagem2 = `
                <div class="ego-skill-container">
                    <div style="text-align: center;">
                        <span class="ego-label">EGO SKILL</span>
                        <img src="${dado.imagem2}" alt="Ego Skill" class="ego-img">
                    </div>
                    ${textoEgo}
                </div>`;
        }
    }

    let htmlCartas = '<div class="lista-cartas">';
    let temCartaVisivel = false;

    dado.cartas.forEach((carta, i) => {
        let textoDaCarta = carta.nome.toLowerCase();
        if (carta.efeitos) {
            textoDaCarta += carta.efeitos.map(e => String(e.atributo).toLowerCase() + String(e.valor).toLowerCase()).join("");
        }
        
        let titulo = dado.titulo.toLowerCase();
        let buscaExataNome = (titulo === campoPesquisa);
        let deveMostrar = modoDeck || buscaExataNome || textoDaCarta.includes(campoPesquisa) || dado.tags.includes(campoPesquisa) || campoPesquisa === "";

        if (deveMostrar) {
            temCartaVisivel = true;
            let classeRaridade = carta.raridade ? "rarity-" + carta.raridade.toLowerCase() : "rarity-common";
            
            let classeDesativada = "";
            let acaoOnClick = "";
            let botaoCopy = ""; 
            
            if (modoDeck && indexNoTime !== null) {
                // --- MUDANÇA AQUI: Se quantidade for 0, fica cinza ---
                if (carta.quantidade === 0) {
                    classeDesativada = "disabled";
                }
                
                // Clique na carta = Remover (-1)
                acaoOnClick = `onclick="removerCopia(${indexNoTime}, ${i})"`;

                // Botão Copy = Adicionar (+1)
                botaoCopy = `<button class="btn-copy-card" onclick="event.stopPropagation(); adicionarCopia(${indexNoTime}, ${i})">COPY +1</button>`;
            }

            let htmlEfeitos = '';
            if (carta.efeitos) {
                for (let efeito of carta.efeitos) {
                    htmlEfeitos += `<span class="efeito-tag ${efeito.classe_css}"><strong>${efeito.valor}</strong> ${efeito.atributo}</span>`;
                }
            }

            htmlCartas += `
                <div class="card-item ${classeDesativada}" ${acaoOnClick}>
                    <div class="card-img-wrapper"><img src="${carta.imagem}" alt="${carta.nome}"></div>
                    <div class="card-info">
                        <div class="card-header">
                            <div>
                                <span class="${classeRaridade}">${carta.quantidade}x ${carta.nome}</span>
                                ${botaoCopy}
                            </div>
                            <span style="color: #666; font-size: 0.85rem;">Cost: ${carta.custo}</span>
                        </div>
                        <div class="card-efeitos">${htmlEfeitos}</div>
                    </div>
                </div>
            `;
        }
    });
    htmlCartas += '</div>';

    if (!temCartaVisivel) return "";

    let botaoHTML = "";
    if (!modoDeck) {
        let indexBanco = bancoDeDados.findIndex(p => p.titulo === dado.titulo);
        let estaNoTime = timeAtual.find(p => p.titulo === dado.titulo);
        let textoBtn = estaNoTime ? "REMOVER" : "ADICIONAR";
        let classeBtn = estaNoTime ? "btn-add-team selected" : "btn-add-team";
        
        botaoHTML = `<button class="${classeBtn}" onclick="toggleTime(${indexBanco})">${textoBtn}</button>`;
    }

    return `
    <div class="item-resultado">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap:10px;">
            <div style="display: flex; align-items: center; gap: 20px;">
                <img src="${dado.imagem}" alt="${dado.titulo}" class="char-img">
                <div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <h2 style="font-size: 2rem; margin:0;">${dado.titulo}</h2>
                        ${botaoHTML}
                    </div>
                    <span class="badge" style="background:var(--primary); color:white; margin-top:5px; display:inline-block;">${dado.tipo}</span>
                </div>
            </div>
            ${htmlImagem2}
        </div>
        <p class="descricao-meta" style="margin-top:15px; font-style: italic;">"${dado.descricao}"</p>
        <div style="margin-top: 20px;">${htmlCartas}</div> 
    </div>
    `;
}
// --- PESQUISAR (AGORA SIM COM A TRAVA!) ---
function pesquisar() {
    let section = document.getElementById("resultados-pesquisa");
    let deckView = document.getElementById("deck-view-container");
    let campoInput = document.getElementById("campo-pesquisa").value;
    let termoBusca = campoInput.toLowerCase().trim(); // Trim remove espaços extras
    
    deckView.style.display = "none";
    section.style.display = "block";

    let resultados = "";

    // 1. VERIFICA SE EXISTE ALGUÉM COM ESSE NOME EXATO
    // Ex: Se digitar "Rei", isso aqui vai ser True
    let existeNomeExato = bancoDeDados.some(d => d.titulo.toLowerCase() === termoBusca);

    for (let dado of bancoDeDados) {
        let titulo = dado.titulo.toLowerCase();
        
        // AQUI ESTÁ A MÁGICA:
        // Se existe um personagem com esse nome exato E o personagem atual NÃO é ele...
        // PULA (Ignora a Mei Lin se a busca for "Rei")
        if (existeNomeExato && titulo !== termoBusca) {
            continue; 
        }

        // Se passou da trava, segue a vida normal
        let pesquisouPeloNome = titulo.includes(termoBusca);
        let tags = dado.tags.toLowerCase();
        let encontrouNaTag = tags.includes(termoBusca);
        let mostrarTudo = (termoBusca === "");

        let temCartaQueBate = false;
        for(let c of dado.cartas) {
            let txt = c.nome.toLowerCase();
            if(c.efeitos) c.efeitos.forEach(e => txt += String(e.valor).toLowerCase() + String(e.atributo).toLowerCase());
            if(txt.includes(termoBusca)) temCartaQueBate = true;
        }

        if (pesquisouPeloNome || encontrouNaTag || temCartaQueBate || mostrarTudo) {
            resultados += gerarHTMLPersonagem(dado, false, null);
        }
    }

    if (resultados === "") resultados = "<p style='text-align:center; color:#666;'>Nenhum dado encontrado.</p>";
    section.innerHTML = resultados;
}

// --- VER DECK ---
function verDeckFinal() {
    let container = document.getElementById("deck-view-container");
    let resultadosBusca = document.getElementById("resultados-pesquisa");
    
    resultadosBusca.style.display = "none";
    container.style.display = "block";
    
    let html = `<h2 style="text-align:center; margin-bottom:10px; color:var(--primary)">EDITAR DECK</h2>`;
    html += `<p style="text-align:center; color:#777; margin-bottom:20px;">(Clique nas cartas para desativar. Depois gere o Resumo)</p>`;
    
    html += `<div style="text-align:center; margin-bottom:30px;">
                <button class="btn-action" style="font-size:1.2rem; padding: 10px 40px;" onclick="abrirResumo()">📸 GERAR RESUMO (PRINT)</button>
             </div>`;
    
    timeAtual.forEach((personagem, indexNoTime) => {
        html += gerarHTMLPersonagem(personagem, true, indexNoTime);
    });
    
    html += `<div style="text-align:center; margin-top:30px;">
                <button class="btn-action" style="background:#333;" onclick="filtrarPorHeroi('')">VOLTAR PARA BUSCA</button>
             </div>`;

    container.innerHTML = html;
}

// --- RESUMO ---
function abrirResumo() {
    let grid = document.getElementById("grid-resumo-final");
    grid.innerHTML = ""; 

    timeAtual.forEach(personagem => {
        let htmlColuna = `<div class="coluna-personagem">`;
        
        htmlColuna += `
            <div class="resumo-char-header">
                <img src="${personagem.imagem}" class="resumo-char-img">
                <div>
                    <h3 style="margin:0; font-size:1.1rem; color:white;">${personagem.titulo}</h3>
                    <span style="font-size:0.7rem; color:#888;">${personagem.tipo}</span>
                </div>
            </div>
        `;

        if (personagem.imagem2) {
             htmlColuna += `
                <div style="display:flex; align-items:center; gap:10px; background:#220000; padding:5px; margin-bottom:10px; border-radius:4px; border:1px solid var(--primary);">
                    <img src="${personagem.imagem2}" style="width:30px; height:30px; border-radius:4px;">
                    <span style="font-size:0.7rem; color:var(--primary); font-weight:bold;">EGO SKILL</span>
                </div>
             `;
        }

        personagem.cartas.forEach((carta) => {
            // SÓ MOSTRA SE QUANTIDADE > 0
            if (carta.quantidade > 0) {
                let corBorda = "border-left: 3px solid #555;";
                if (carta.efeitos && carta.efeitos.length > 0) {
                    if (carta.efeitos[0].classe_css === "keyword-dano") corBorda = "border-left: 3px solid #ff4d4d;";
                    if (carta.efeitos[0].classe_css === "keyword-defesa") corBorda = "border-left: 3px solid #4d94ff;";
                    if (carta.efeitos[0].classe_css === "keyword-buff") corBorda = "border-left: 3px solid #ffd700;";
                }
                
                let resumoEfeito = carta.efeitos && carta.efeitos.length > 0 
                    ? `<span style="color:#aaa;">${carta.efeitos[0].valor} ${carta.efeitos[0].atributo}</span>` 
                    : "";

                htmlColuna += `
                    <div class="card-resumo" style="${corBorda}">
                        <img src="${carta.imagem}">
                        <div class="card-resumo-info">
                            <strong style="color:white;">${carta.quantidade}x ${carta.nome}</strong>
                            ${resumoEfeito}
                        </div>
                    </div>
                `;
            }
        });

        htmlColuna += `</div>`; 
        grid.innerHTML += htmlColuna;
    });

    document.getElementById("overlay-resumo").style.display = "flex";
}
function fecharResumo() {
    document.getElementById("overlay-resumo").style.display = "none";
}
// --- FUNÇÃO PARA COPIAR CARTA (+1) ---
// --- FUNÇÃO PARA ADICIONAR CÓPIA (+1) ---
function adicionarCopia(indexPersonagemNoTime, indexCarta) {
    timeAtual[indexPersonagemNoTime].cartas[indexCarta].quantidade++;
    verDeckFinal();
}
// --- FUNÇÃO PARA REMOVER CÓPIA (-1) ---
function removerCopia(indexPersonagemNoTime, indexCarta) {
    let carta = timeAtual[indexPersonagemNoTime].cartas[indexCarta];
    
    // Só diminui se for maior que 0
    if (carta.quantidade > 0) {
        carta.quantidade--;
    }
    
    // Atualiza a tela (se chegar a 0, a função gerarHTML vai deixar cinza automaticamente)
    verDeckFinal();
}