const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config(); 

const authRoutes = require("./routes/authRoutes");
const instituicoesRoutes = require("./routes/instituicoesRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const alunosRoutes = require("./routes/alunosRoutes");
const professoresRoutes = require("./routes/professoresRoutes");
const administradoresRoutes = require("./routes/administradoresRoutes");
const turmasRoutes = require("./routes/turmasRoutes");
const alunosTurmasRoutes = require("./routes/alunosTurmasRoutes");
const atividadesRoutes = require("./routes/atividadesRoutes");
const redacoesEnviadasRoutes = require("./routes/redacoesEnviadasRoutes");
const conteudosRoutes = require("./routes/conteudosRoutes");
const metasRoutes = require("./routes/metasRoutes");
const notasCompetenciaRoutes = require("./routes/notasCompetenciaRoutes");
const evolucaoNotasRoutes = require("./routes/evolucaoNotasRoutes");
const distribuicaoTemasRedacaoRoutes = require("./routes/distribuicaoTemasRedacaoRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
const path = require("path");
const fs = require("fs");

// Garantir pasta de uploads e servir arquivos estáticos
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Testar conexão com o banco de dados
async function testDbConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Conexão com o banco de dados MySQL estabelecida com sucesso!");
    connection.end();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
    process.exit(1); // Encerrar a aplicação se não conseguir conectar ao DB
  }
}

testDbConnection();

// temporário: logar headers para depuração (mostra Authorization/x-auth-token)
app.use((req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const xAuth = req.headers['x-auth-token'];
    if (req.path && req.path.startsWith('/api')) {
      console.log(`>>> REQ ${req.method} ${req.path} - authorization: ${authHeader || '<none>'}, x-auth-token: ${xAuth || '<none>'}`);
    }
  } catch (e) {
    console.warn('Erro ao logar headers de debug:', e && e.message ? e.message : e);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/instituicoes", instituicoesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/alunos", alunosRoutes);
app.use("/api/professores", professoresRoutes);
app.use("/api/administradores", administradoresRoutes);
app.use("/api/turmas", turmasRoutes);
app.use("/api/alunos-turmas", alunosTurmasRoutes);
app.use("/api/atividades", atividadesRoutes);
app.use("/api/redacoes-enviadas", redacoesEnviadasRoutes);
app.use("/api/conteudos", conteudosRoutes);
app.use("/api/metas", metasRoutes);
app.use("/api/notas-competencia", notasCompetenciaRoutes);
app.use("/api/evolucao-notas", evolucaoNotasRoutes);
app.use("/api/distribuicao-temas-redacao", distribuicaoTemasRedacaoRoutes);

// Rotas de exemplo
app.get("/", (req, res) => {
  res.send("API do Launchpad está funcionando!");
});

// middleware de erro (colocar ANTES do app.listen)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.stack ? err.stack : err);
  const isDev = process.env.NODE_ENV === "development";
  res.status(err && err.status ? err.status : 500).json({
    message: err && err.message ? err.message : "Internal Server Error",
    ...(isDev ? { stack: err.stack } : {}),
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

