## Em desenvolvimento — Última atualização em 24/08/2025 às 22h11

# 100Spoiler - Transforme sua vida literária

O 100Spoiler é um sistema moderno e elegante criado para transformar sua vida literária. Com ele, você pode adicionar amigos, recomendar leituras, registrar os livros já concluídos e aqueles que ainda deseja ler. Além disso, organize sua biblioteca pessoal com filtros inteligentes, acompanhe o progresso, participe de competições divertidas com seus amigos e faça parte de uma comunidade apaixonada por livros...

## 🚀 Funcionalidades

- ✅ Adicionar novos livros à biblioteca
- ✅ Editar informações dos livros existentes
- ✅ Marcar livros como "Para Ler" ou "Lido"
- ✅ Buscar livros por título ou autor
- ✅ Visualizar estatísticas da biblioteca
- ✅ Interface responsiva e moderna
- ✅ Sistema de capas com fallback automático


## Ideias / Roadmap

   - Integração integração com a API que está em desenvolvimento.
   - Sistema de login e buscar de livros por usuários.
   - Tela de indicação de livros
   - Modo escuro com persistência em localStorage.
   - Adicionar o Status: 'lendo'
   - Perfil de usuário com conquistas
   - Filtros (Mês/ano/autor)
   - Criação de pastas para agrupar livros
   - Funcionalidade de adicionar amigos
   - Testes de componentes com React Testing Library.

## 🚀 Como executar

1. Instale dependências:
   - npm install

2. Inicie o servidor de desenvolvimento:
   - npm run dev

3. Build e preview (opcional):
   - npm run build
   - npm run preview

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal para interface
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Ícones modernos
- **ESLint** - Linting de código

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── Header.jsx      # Cabeçalho da aplicação
│   ├── SearchBar.jsx   # Barra de pesquisa
│   ├── StatsCards.jsx  # Cartões de estatísticas
│   ├── TabNavigation.jsx # Navegação entre abas
│   ├── BookCard.jsx    # Card individual do livro
│   ├── BooksGrid.jsx   # Grid de livros
│   └── BookModal.jsx   # Modal para adicionar/editar livros
├── hooks/              # Hooks customizados
│   ├── useBooks.js     # Gerenciamento de estado dos livros
│   └── useModal.js     # Gerenciamento de modais
├── utils/              # Utilitários e helpers
│   ├── constants.js    # Constantes da aplicação
│   └── helpers.js      # Funções auxiliares
├── App.jsx            # Componente principal
├── main.jsx           # Ponto de entrada
└── index.css          # Estilos globais
```
## Contribuição
   - Contribuições são bem-vindas. Abra uma issue ou envie um PR com um branch `feat/`,`improvement/`, `fix/`.
---