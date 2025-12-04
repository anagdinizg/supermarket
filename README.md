# Supermercado — Frontend

Frontend em React para o painel administrativo do Supermercado (painel de gestão de usuários, produtos e clientes).

## Visão geral
- SPA em React com rotas protegidas, autenticação via token JWT (armazenado em localStorage) e integração com a API backend.
- Funcionalidades: login, listagem/CRUD de produtos, usuários e clientes, modais, toasts e validações básicas (CPF, telefone, senha).

## Arquivos principais
- src/App.jsx — ponto de montagem da aplicação e carregamento inicial.
- src/routes/AppRoutes.jsx — definição de rotas públicas e áreas autenticadas.
- src/routes/AuthenticatedLayout.jsx — layout e lógica para usuários autenticados (sidebar, carregamento de dados).
- src/pages/* — páginas: LoginPage, ProductsPage, UsersPage, CustomersPage.
- src/components/* — Modal, Toast, Loading, ConfirmModal.
- src/services/* — chamadas HTTP e lógica de integração com API (api.js, authService, userService, productService, customerService).
- src/utils/validation.js — máscaras e validações (CPF, telefone, email, senha).
- src/config/api.config.js — configuração da URL base da API.
- .env — variáveis de ambiente

## Requisitos
- Node.js (>= 18 recomendado)
- Backend do Supermercado rodando

## Instalação e execução (local)
1. Instalar dependências:
   npm install

2. Verificar/ajustar .env (URL apontando para o backend).

3. Rodar em desenvolvimento:
   - Se o projeto usa Create React App:
     npm start
   - Se usa Vite:
     npm run dev
   (Verifique os scripts em package.json)

4. Build para produção:
   npm run build

## Observações técnicas
- As requisições usam axios com um interceptor (src/services/api.js) que inclui o token em Authorization quando presente e redireciona para /login em 401.
- Autenticação: token salvo em localStorage ("token"); dados do usuário em localStorage ("user").
- Validações e máscaras no frontend estão em src/utils/validation.js — importantes para CPF e telefone.
- Algumas permissões são tratadas no frontend (ex.: apenas admin/manager podem configurar preço promocional ou alterar roles). Regras finais devem ser validadas no backend.

## Boas práticas / dicas
- Mantenha o backend em execução ao testar o frontend.
- Para deploy, configure API_URL para a URL pública do backend antes de gerar o build.

## Recursos
- API backend esperada: endpoints em /api/auth, /api/users, /api/products, /api/customers (consulte o README do backend para detalhes de rotas e autenticação).
- Estrutura e nomes de campos esperados seguem os serviços em src/services/*.
