# ✅ Checklist para Deploy no cPanel

## Antes do Upload
- [ ] Executei `npm run build` no projeto
- [ ] Pasta `dist/` foi criada com sucesso
- [ ] Vou enviar APENAS o conteúdo da pasta `dist/`, não o projeto inteiro

## Upload no cPanel
- [ ] Acessei cPanel → File Manager
- [ ] Naveguei para `public_html/`
- [ ] **DELETEI** todos os arquivos antigos da pasta
- [ ] Fiz upload de TODOS os arquivos de dentro da pasta `dist/`
- [ ] Arquivo `.htaccess` está presente (pode estar oculto)
- [ ] Pasta `assets/` foi enviada completa

## Verificação de Permissões
- [ ] Cliquei com botão direito em qualquer arquivo → Permissions
- [ ] **Arquivos estão 644** (rw-r--r--)
- [ ] **Pastas estão 755** (rwxr-xr-x)
- [ ] Se não estiverem corretas, selecionei todos → Permissions → Definir em lote

## Teste Final
- [ ] Acessei meu domínio no navegador
- [ ] Página inicial carrega
- [ ] Consigo navegar entre as páginas
- [ ] CSS e JavaScript estão funcionando
- [ ] Testei em navegador privado (sem cache)

## Se não funcionar
- [ ] Arquivo `index.html` está na raiz do `public_html/`?
- [ ] Arquivo `.htaccess` está presente?
- [ ] Permissões estão corretas?
- [ ] Limpei o cache do navegador (Ctrl+F5)?
- [ ] Tentei criar um `index.php` com: `<?php include_once("index.html"); ?>`

## Estrutura Final Esperada
```
public_html/
├── .htaccess          ← OBRIGATÓRIO
├── index.html         ← OBRIGATÓRIO  
├── launch-logo.png
├── launch-preview.png
├── robots.txt
└── assets/            ← OBRIGATÓRIO
    ├── index-abc123.css
    ├── index-def456.js
    └── outros arquivos...
```