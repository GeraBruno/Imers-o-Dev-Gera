# ⚔️ CZN Database & Team Builder (v1.0)

Este projeto foi desenvolvido como parte da [Nome da Imersão/Concurso] e serve como um **Database Interativo** para o jogo Chaos Zero Nightmare (CZN). O foco é oferecer aos jogadores uma ferramenta poderosa para visualização de cartas e, principalmente, a montagem e compartilhamento de decks otimizados.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3:** Estrutura e Estilização (Tema Dark Neon).
* **JavaScript (Vanilla JS):** Lógica de busca, filtragem e gerenciamento de estado do deck.
* **JSON:** Banco de dados estruturado para cards e personagens.

## ✨ Funcionalidades Principais

### 1. Sistema de Busca Inteligente (Busca Cirúrgica)
A pesquisa não se limita ao nome do personagem. O algoritmo customizado realiza uma **busca profunda** que encontra resultados mesmo que o termo digitado esteja:
* No nome do personagem.
* Nas tags do personagem (`tank`, `dps`, `exausth`).
* No **Nome da Carta** (Ex: "Anchor Shot").
* No **Efeito ou Valor** da carta (Ex: buscando "Heal", "Vulnerable" ou "Metalization").

### 2. Construtor de Deck Dinâmico (Team Builder)
Permite ao usuário montar uma equipe de 3 personagens com controle granular sobre o baralho final.
* **Seleção Rápida:** Grid de avatares dos heróis prontos para seleção.
* **Customização Atômica:** O usuário pode **clicar na carta** para **retirar uma cópia** (`-1`) ou usar o botão **"COPY +1"** para duplicar cartas (com limite mínimo de 0 cópias), simulando a aquisição de cartas no jogo.
* **Persistência de Estado:** O sistema rastreia quais cartas foram adicionadas/removidas para cada personagem individualmente.

### 3. Modo Resumo Otimizado para Compartilhamento
O recurso **"GERAR RESUMO (PRINT)"** cria uma visualização compacta, em colunas (uma por personagem), que atende aos seguintes requisitos:
* **Filtro Ativo:** Exibe **apenas** as cartas ativas (que não foram desativadas/removidas).
* **Layout Compacto:** Otimizado para caber em uma única tela/screenshot, ideal para compartilhar builds rapidamente com amigos ou em comunidades.

### 4. Identidade Visual Profissional
* **Tema:** Dark Neon (Preto e Vermelho Sangue).
* **Raridades:** Nome das cartas com cores que indicam Raridade (Branco: Common, Azul: Unique, Amarelo: Legendary, Roxo: Mystic).
* **Ego Skill:** Exibição da foto e descrição do Ego Skill do personagem ao lado da foto principal.

---

## 🚀 Como Executar o Projeto Localmente

1.  Clone este repositório para sua máquina local.
    ```bash
    git clone [LINK DO SEU REPOSITÓRIO AQUI]
    ```
2.  Abra o arquivo `index.html` em seu navegador.
3.  O banco de dados (`data.json`) será carregado automaticamente no início.

---

### Contato / Concurso

**[Deixe o nome do seu time/seu nome e o link do concurso aqui]**
