# Como contribuir

Obrigado por querer contribuir com o Vampiro App. Este guia resume como preparar o projeto, fazer alteracoes e abrir uma contribuicao com menos atrito.

## Preparando o ambiente

Clone o repositorio e instale as dependencias:

```bash
git clone <URL_DO_REPOSITORIO>
cd vampiro-app
npm install
```

Crie o arquivo de ambiente local:

```bash
cp .env.example .env
```

Por padrao, voce pode manter a IA desativada para desenvolver sem consumir API externa:

```env
USE_AI=false
GEMINI_API_KEY=
```

Para rodar o projeto:

```bash
npm run dev
```

Depois acesse:

```text
http://localhost:3000/index.html
```

## Fluxo sugerido

1. Crie uma branch a partir da branch principal:

```bash
git checkout -b minha-melhoria
```

2. Faca uma alteracao pequena e focada.
3. Teste manualmente a parte afetada no navegador.
4. Rode as verificacoes disponiveis antes de abrir o PR:

```bash
npm run lint
```

5. Abra um pull request descrevendo o que mudou e como foi testado.

## Padroes do projeto

- Mantenha as mudancas simples e alinhadas ao estilo atual de HTML, CSS e JavaScript.
- Evite refatoracoes grandes junto com correcoes pequenas.
- Nao commite arquivos `.env`, chaves de API ou qualquer dado sensivel.
- Ao alterar a ficha visual, confira se a impressao continua funcionando bem.
- Ao alterar a geracao por prompt, mantenha o modo mockado funcionando com `USE_AI=false`.

## Mensagens de commit

Prefira mensagens curtas e descritivas, por exemplo:

```text
Adiciona link do GitHub na toolbar
Corrige exportacao de ficha em JSON
Atualiza estilos da janela de prompt
```

## Checklist antes do PR

- A aplicacao abre em `http://localhost:3000/index.html`.
- A funcionalidade alterada foi testada manualmente.
- `npm run lint` foi executado ou a impossibilidade foi explicada no PR.
- Nenhuma chave, segredo ou configuracao local foi adicionada ao commit.
- O README foi atualizado se o comportamento ou setup mudou.

