# Baby Journey API

## **Descrição**
A Baby Journey API é uma aplicação backend desenvolvida em **NestJS** para gerenciar marcos e memórias de bebês. Ela permite que os usuários registrem momentos importantes, façam upload de imagens, atualizem e excluam registros. A API é consumida por um frontend desenvolvido em **React**, proporcionando uma interface amigável e intuitiva. Este projeto foi criado como parte avaliativa do curso de pós-graduação em Desenvolvimento Full Stack da PUCRS.

---

## **Funcionalidades**
- **Autenticação**: Implementação de autenticação segura utilizando **JWT (JSON Web Token)**.
- **Gerenciamento de Marcos**:
  - Cadastro, atualização e exclusão de marcos.
  - Upload de imagens para o **Azure Blob Storage**.
- **Gerenciamento de Memórias**:
  - Registro de memórias com suporte a imagens.
- **Documentação**: Endpoints documentados com **Swagger**.

---

## **Tecnologias Utilizadas**
### **Backend**
- **Framework**: NestJS
- **Banco de Dados**: MongoDB
- **Armazenamento de Imagens**: Azure Blob Storage
- **Autenticação**: JWT
- **Documentação**: Swagger

---

## **Publicação**
- **Frontend**: O frontend está publicado em [https://baby-journey-frontend.vercel.app](https://baby-journey-frontend.vercel.app).
- **Repositório do Frontend**: O código do frontend está disponível em [https://github.com/karen-freitas/baby-journey-frontend.git](https://github.com/karen-freitas/baby-journey-frontend.git).
- **Documentação da API**: A documentação da API pode ser acessada em [https://baby-journey-api.onrender.com/api-docs](https://baby-journey-api.onrender.com/api-docs).

---

## **Instalação**
### **Pré-requisitos**
- Node.js (versão 18 ou superior)
- MongoDB
- Conta no Azure Blob Storage (para armazenamento de imagens)

### **Passos**
1. Clone o repositório:
   ```bash
   git clone https://github.com/karen-freitas/baby-journey-api.git
   cd baby-journey-api
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`.
   - Preencha as variáveis de acordo com seu ambiente (MongoDB, Azure, JWT, etc.).
4. Inicie o banco de dados MongoDB:
   ```bash
   mongod
   ```
5. Execute a aplicação:
   ```bash
   npm run start:dev
   ```
6. Acesse a documentação da API:
   - URL: `http://localhost:3000/api`
   - Utilize o Swagger para explorar os endpoints disponíveis.

---

## **Recursos Adicionais**
- [Documentação Oficial do NestJS](https://docs.nestjs.com)
