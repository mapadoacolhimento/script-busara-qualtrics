# script-busara-qualtrics

Esse script encripta o e-mail da MSR no formulário de cadastro no BONDE e guarda esse hash em uma variável global, para que após o cadastro ela seja redirecionada para a pesquisa da Busara com um `user_id` rastreável, porém encriptado por nós.

Ele pode ser executado em um servidor `node` ou direto no `browser`.

## Começo rápido

No terminal:

```
npm i
```

```
npm run dev
```

Para testar as funções do script, você pode executá-lo no terminal utilizando `npm run start` e mudando o arquivo `index.js` para logar o que desejar.

Para testar no browser, abra o `index.html` que contém um campo de e-mail para teste.
