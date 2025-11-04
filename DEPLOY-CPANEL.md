# Como fazer deploy no cPanel

## Pré-requisitos
- Conta de hospedagem com cPanel
- Acesso ao File Manager ou FTP

## Passos para instalação

### 1. Fazer o build da aplicação
No seu computador local, execute:
```bash
npm run build
```
Isso criará uma pasta `dist/` com os arquivos prontos para produção.

### 2. Upload dos arquivos
1. Acesse o cPanel da sua hospedagem
2. Abra o **File Manager**
3. Navegue até a pasta `public_html/` (ou a pasta do seu domínio)
4. **Importante**: Delete todos os arquivos existentes na pasta (se houver)
5. Faça upload de **TODOS** os arquivos da pasta `dist/` para `public_html/`
   - Inclua o arquivo `.htaccess` (pode estar oculto)
   - Inclua todas as pastas: `assets/`, etc.

### 3. Configuração de permissões
- Certifique-se que as permissões das pastas estão em **755**
- Certifique-se que as permissões dos arquivos estão em **644**

### 4. Configuração do .htaccess
O arquivo `.htaccess` já foi criado automaticamente e inclui:
- Redirecionamento para SPA (Single Page Application)
- Headers de segurança
- Compressão Gzip
- Cache control

### 5. Verificação
Após o upload, acesse seu domínio. O site deve carregar normalmente.

## Estrutura final no cPanel
```
public_html/
├── .htaccess
├── index.html
├── launch-logo.png
├── launch-preview.png
├── robots.txt
└── assets/
    ├── index-[hash].css
    ├── index-[hash].js
    └── outros arquivos...
```

## Problemas comuns

### Site não carrega (página em branco)
1. **Verifique se todos os arquivos foram enviados**
   - Deve haver um arquivo `index.html` na raiz
   - Pasta `assets/` com arquivos CSS e JS
   
2. **Verifique permissões no File Manager**
   - Clique com botão direito → Permissions
   - **Pastas: 755** (rwxr-xr-x)
   - **Arquivos: 644** (rw-r--r--)

3. **Para Apache 2.4 (cPanel moderno)**
   - O arquivo `.htaccess` já foi atualizado para compatibilidade
   - Se ainda não funcionar, tente criar um arquivo `index.php`:
   ```php
   <?php include_once("index.html"); ?>
   ```

### 404 ao navegar entre páginas
- **Certifique-se que o arquivo `.htaccess` está presente**
- **Verifique se o módulo mod_rewrite está ativo**
  - Entre em cPanel → Software → MultiPHP INI Editor
  - Procure por "rewrite" nas configurações

### Arquivos CSS/JS não carregam
1. **Verificar permissões** (644 para arquivos)
2. **Limpar cache do navegador** (Ctrl+F5)
3. **Verificar se a pasta assets/ foi enviada completa**

### Como testar se as permissões estão corretas
1. File Manager → public_html/
2. Selecionar todos os arquivos → Permissions
3. **Definir em lote:**
   - Arquivos: 644
   - Pastas: 755
   - Marcar "Aplicar recursivamente"

## Atualizações futuras
Para atualizar o site:
1. Faça `npm run build` novamente
2. Delete os arquivos antigos do `public_html/`
3. Faça upload dos novos arquivos da pasta `dist/`