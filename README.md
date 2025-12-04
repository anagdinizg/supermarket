# Supermercado — Frontend

Frontend em React para o painel administrativo do Supermercado (SPA) que consome a API Backend.

## Visão geral
Aplicação React com autenticação via JWT, rotas públicas/privadas, CRUD de usuários, produtos e clientes, upload de imagem de perfil, modais, toasts e validações de CPF/telefone/senha.

## Arquivos principais
- [src/App.jsx](src/App.jsx) — ponto de montagem da aplicação e carregamento inicial.
- [src/routes/AppRoutes.jsx](src/routes/AppRoutes.jsx) — definição de rotas públicas e área autenticada.
- [src/routes/AuthenticatedLayout.jsx](src/routes/AuthenticatedLayout.jsx) — layout e lógica para área autenticada (sidebar, carregamento de dados).
- [src/pages/LoginPage.jsx](src/pages/LoginPage.jsx) — página de login.
- [src/pages/UsersPage.jsx](src/pages/UsersPage.jsx) — gerenciamento de usuários.
- [src/pages/ProductsPage.jsx](src/pages/ProductsPage.jsx) — gerenciamento de produtos.
- [src/pages/CustomersPage.jsx](src/pages/CustomersPage.jsx) — gerenciamento de clientes.
- [src/components/Modal.jsx](src/components/Modal.jsx) — modal de CRUD.
- [src/components/ConfirmModal.jsx](src/components/ConfirmModal.jsx) — modal de confirmação.
- [src/components/Toast.jsx](src/components/Toast.jsx) — notificações.
- [src/components/Loading.jsx](src/components/Loading.jsx) — componente de carregamento.
- [src/services/api.js](src/services/api.js) — instancia axios com interceptors.
- [src/services/authService.js](src/services/authService.js) — lógica de autenticação cliente.
- [src/services/userService.js](src/services/userService.js) — integração usuários.
- [src/services/productService.js](src/services/productService.js) — integração produtos.
- [src/services/customerService.js](src/services/customerService.js) — integração clientes.
- [src/utils/validation.js](src/utils/validation.js) — máscaras e validações (CPF, telefone, email, senha).
- [src/config/api.config.js](src/config/api.config.js) — URL base da API.
- [.env](.env) — variáveis de ambiente (ex.: REACT_APP_API_URL).

## Configuração de API
- URL base configurada em [src/config/api.config.js](src/config/api.config.js) e pode ser sobrescrita pela variável de ambiente `REACT_APP_API_URL` no arquivo `.env`.

## Autenticação / autorização (frontend)
- Token JWT armazenado em `localStorage` (chave "token"), dados do usuário em "user".
- Interceptor em [src/services/api.js](src/services/api.js) adiciona Authorization: `Bearer <token>` nas requisições e redireciona para `/login` em 401.
- Funções de login/getMe/logout em [src/services/authService.js](src/services/authService.js).

## Rotas / Páginas
- [src/routes/AppRoutes.jsx](src/routes/AppRoutes.jsx) — roteamento principal, exibe Login ou AuthenticatedLayout.
- [src/routes/AuthenticatedLayout.jsx](src/routes/AuthenticatedLayout.jsx) — carrega dados iniciais (users, products, customers) e provê ações (abrir modais, toasts).

## Serviços / Integração com API
- [src/services/api.js](src/services/api.js) — axios instance e interceptors.
- [src/services/*Service.js](src/services) — wrappers para chamadas REST (users, products, customers, auth).

## Validações e utilitários
- [src/utils/validation.js](src/utils/validation.js) — máscaras (CPF, telefone), validação de CPF/email e verificação de força de senha.

## Requisitos
- Node.js >= 18
- Backend do Supermercado rodando — a URL deve corresponder a `REACT_APP_API_URL`.

## Instalação e execução
1. Instalar dependências:
```bash
npm install
```

2. Ajustar `.env`.

3. Rodar em desenvolvimento:
```bash
npm start
# ou, se o projeto usar Vite:
# npm run dev
```

4. Build para produção:
```bash
npm run build
```

## Endpoints esperados (Backend)
O frontend consome os endpoints do backend; ver README do backend para detalhes. Exemplos:
- Auth: POST /api/auth/login, GET /api/auth/me, PUT /api/auth/update-password
- Users: /api/users
- Products: /api/products
- Customers: /api/customers

## Tratamento de erros (frontend)
- Erros de API são repassados pelos services. O interceptor em [src/services/api.js](src/services/api.js) trata 401 removendo token e redirecionando para login.
- Mensagens de erro são exibidas via toasts/modais nas páginas.

## Boas práticas / Observações
- Mantenha o backend em execução ao testar o frontend.
- Não comite secrets no repositório (.env).
- Validações e regras de permissão no frontend ajudam UX, mas a autorização final deve ser validada no backend.
- Ajuste `REACT_APP_API_URL` para o endereço do backend antes do build para produção.
