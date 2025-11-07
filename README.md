# Supermercado Bom Preço

Painel administrativo simples feito com React + Vite, estilizado com Tailwind CSS e ícones de `lucide-react`.

## Tecnologias
- Vite ([vite.config.js](vite.config.js))
- React 19 ([src/main.jsx](src/main.jsx), [src/App.jsx](src/App.jsx))
- React Router ([src/routes/AppRoutes.jsx](src/routes/AppRoutes.jsx), [src/routes/AuthenticatedLayout.jsx](src/routes/AuthenticatedLayout.jsx))
- Tailwind CSS ([tailwind.config.js](tailwind.config.js), [postcss.config.js](postcss.config.js), [src/index.css](src/index.css))
- Ícones: `lucide-react`
- Dados de exemplo: [src/services/mockData.js](src/services/mockData.js)

## Estrutura do projeto

Principais arquivos e pastas:
- index.html
- src/main.jsx
- src/App.jsx — estado global inicial e rota principal
- src/services/mockData.js — dados mock (users, products, customers)
- src/utils/validation.js — máscaras e validações:
  - maskCPF
  - isValidCPF
  - isValidEmail
  - isStrongPassword
  - getPasswordStrengthMessage
  
Rotas e layout:
- AppRoutes — roteamento público/privado
- AuthenticatedLayout — layout da área autenticada

Páginas:
- src/pages/LoginPage.jsx
- src/pages/ProductsPage.jsx
- src/pages/PromotionsPage.jsx
- src/pages/UsersPage.jsx
- src/pages/CustomersPage.jsx
  
Componentes principais:
- Modal — formulário para adicionar/editar/visualizar Users, Customers e Products
- AvatarUpload — uploader de avatar usado dentro do modal
- Toast — Feedbacks
- Loading — tela de loading
- ConfirmModal — confirmação de exclusão

## Fluxo e comportamento
- Autenticação simples baseada em comparação com mockUsers. Credenciais de teste no login: bruno@super.com / Senha@123 (ver src/pages/LoginPage.jsx).
- CRUD é mantido em memória via estado no src/App.jsx e passado para as páginas via props.
- Modal de edição/visualização reutilizável: veja Modal e sua integração no AuthenticatedLayout.
- Validações de formulário centralizadas em src/utils/validation.js.

## Como rodar
Instale dependências e rode em modo de desenvolvimento:

```bash
npm install
npm run dev
