# Agendamentos Plataforma

Plataforma fullstack para agendamento de consultas, construída com:

- **Backend**: NestJS + PostgreSQL
- **Frontend**: Next.js (App Router)
- **Docker** para orquestração dos serviços

## Tecnologias

| Camada   | Tecnologia                      |
|----------|----------------------------------|
| Backend  | NestJS, TypeORM, PostgreSQL     |
| Frontend | React, Next.js, TailwindCSS     |
| Auth     | JWT, bcrypt                     |
| DevOps   | Docker, Docker Compose          |

---

## Instalação com Docker

> **Pré-requisitos**:
> - Docker
> - Docker Compose (`docker compose` ou `docker-compose` no terminal)

```bash
# Clone o projeto
git clone https://github.com/lucasccgomes/agendamentos-plataforma.git
cd agendamentos-plataforma

# Inicie a aplicação
docker-compose up --build
```

### Acesso

| Serviço   | URL                       |
|-----------|---------------------------|
| Frontend  | http://localhost:3001     |
| Backend   | http://localhost:3000     |
| Postgres  | localhost:5432 (via DB GUI) |

---

## Estrutura

```
agendamentos-plataforma/
│
├── backend/              → API NestJS
│   ├── src/
│   ├── .env              → Variáveis do backend
│   └── Dockerfile
│
├── frontend/             → App Next.js
│   ├── src/
│   ├── public/
│   ├── .env.local        → Variáveis do frontend
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## Variáveis de ambiente

### Backend `.env`

```env
# Local
DATABASE_URL=postgres://postgres:4237@localhost:5432/(nome-do-banco)
# Docker
# DATABASE_URL=postgres://postgres:postgres@postgres:5432/(nome-do-banco)
DATABASE_SSL=false
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Funcionalidades

- Autenticação com JWT
- Cadastro e login de usuários
- Criação de horários por profissionais
- Agendamento de consultas por clientes
- Upload de fotos de perfil
- Painéis distintos: Cliente e Profissional
- Validação e feedbacks visuais

---

## Rodar sem Docker (Manual)

> Recomendado para desenvolvimento local

### Pré-requisitos

- Node.js 18+
- PostgreSQL instalado e em execução

### Passo a passo

1. **Clone o projeto:**
```bash
git clone https://github.com/seuusuario/agendamentos-plataforma
cd agendamentos-plataforma
```

2. **Configure o banco de dados:**
```bash
sudo -u postgres psql
```
Dentro do terminal do PostgreSQL:
```sql
CREATE DATABASE (nome-do-banco);
CREATE USER postgres WITH ENCRYPTED PASSWORD '4237';
GRANT ALL PRIVILEGES ON DATABASE (nome-do-banco) TO postgres;
\q
```

3. **Backend**
```bash
cd backend
cp .env.example .env   # ou crie manualmente
npm install
npm run start:dev
```

4. **Frontend**
```bash
cd frontend
cp .env.local.example .env.local   # ou crie manualmente
npm install
npm run dev
```

### Arquivos `.env`

**Backend (`backend/.env`)**:
```env
DATABASE_URL=postgres://postgres:4237@localhost:5432/agendamentos
DATABASE_SSL=false
JWT_SECRET=sua_chave_supersecreta
```

**Frontend (`frontend/.env.local`)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Testes

> Futuro: incluir testes com Jest no backend e Cypress no frontend

---

## Em desenvolvimento

- [ ] Admin dashboard
- [ ] Notificações por e-mail
- [ ] Filtro por especialidade

---

## Autor

**Lucas Oliveira**  
Desenvolvedor Web & Mobile | React Native · Next.js · NestJS

---

## Licença

MIT License © 2025
