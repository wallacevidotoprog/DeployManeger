Arquitetura do Sistema
backend/ (Node.js + TypeScript)
  ├── src/
  │   ├── controllers/ (Lógica das rotas)
  │   ├── services/ (Lógica de negócios)
  │   ├── models/ (Definições de dados)
  │   ├── config/ (Configurações)
  │   ├── utils/ (Utilitários)
  │   └── app.ts (Aplicação principal)
  ├── .env
  ├── package.json
  └── tsconfig.json

frontend/ (Angular 19)
  ├── src/
  │   ├── app/
  │   │   ├── auth/ (Autenticação)
  │   │   ├── dashboard/ (Painel)
  │   │   ├── projects/ (Gerenciamento de projetos)
  │   │   ├── logs/ (Visualização de logs)
  │   │   ├── backups/ (Gerenciamento de backups)
  │   │   └── shared/ (Componentes compartilhados)
  │   └── assets/
  ├── angular.json
  └── package.json



  Funcionalidades Principais
1. Autenticação
Tela de login padrão com JWT

Proteção de rotas no frontend e backend

2. Dashboard de Aplicações
Lista de projetos implantados

Status de cada aplicação (online/offline)

Uso de recursos (CPU, memória)

Histórico de implantações

3. Visualização de Logs
Visualização em tempo real

Filtros por data, nível de log, projeto

Download de logs

4. Importação de Novos Projetos
Formulário para inserir URL do GitHub

Processo automatizado:

Clone do repositório

Instalação de dependências (npm install)

Configuração de .env

Build do projeto

Implantação

5. Atualização Automática (CI/CD)
Webhook do GitHub para detectar commits

Fluxo de atualização:

Pull das alterações

Backup do sistema atual (código + banco de dados)

Compactação em .zip

Implantação da nova versão

Rollback automático em caso de falha

6. Gerenciamento de Backups
Lista de backups disponíveis

Restauração de backups

Exclusão de backups antigos