-- Esquema do Banco de Dados para a Plataforma Educacional Launch (Corrigido)

CREATE TABLE Usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('aluno', 'professor', 'administrador') NOT NULL
);

CREATE TABLE Instituicoes (
  instituicao_id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  endereco VARCHAR(500),
  telefone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255)
);

CREATE TABLE Alunos (
    aluno_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    idade INT,
    nota_geral DECIMAL(5,2),
    instituicao_id INT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (instituicao_id) REFERENCES Instituicoes(instituicao_id)
);

CREATE TABLE Professores (
    professor_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    idade INT,
    especializacao VARCHAR(255),
    instituicao_id INT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (instituicao_id) REFERENCES Instituicoes(instituicao_id)
);

CREATE TABLE Administradores (
    administrador_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    instituicao_id INT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (instituicao_id) REFERENCES Instituicoes(instituicao_id)
);

CREATE TABLE Turmas (
    turma_id INT PRIMARY KEY AUTO_INCREMENT,
    nome_turma VARCHAR(255) NOT NULL,
    professor_id INT NOT NULL,
    descricao TEXT,
    instituicao_id INT,
    FOREIGN KEY (professor_id) REFERENCES Professores(professor_id),
    FOREIGN KEY (instituicao_id) REFERENCES Instituicoes(instituicao_id)
);

CREATE TABLE AlunosTurmas (
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    PRIMARY KEY (aluno_id, turma_id),
    FOREIGN KEY (aluno_id) REFERENCES Alunos(aluno_id),
    FOREIGN KEY (turma_id) REFERENCES Turmas(turma_id)
);

CREATE TABLE Atividades (
    atividade_id INT PRIMARY KEY AUTO_INCREMENT,
    turma_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    tema_redacao VARCHAR(255),
    data_entrega DATE,
    instrucoes TEXT,
    FOREIGN KEY (turma_id) REFERENCES Turmas(turma_id)
);

CREATE TABLE RedacoesEnviadas (
    redacao_id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    atividade_id INT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    texto_redacao TEXT,
    caminho_arquivo VARCHAR(255),
    nota DECIMAL(5,2),
    feedback TEXT,
    FOREIGN KEY (aluno_id) REFERENCES Alunos(aluno_id),
    FOREIGN KEY (atividade_id) REFERENCES Atividades(atividade_id)
);

CREATE TABLE Conteudos (
    conteudo_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    visualizacoes INT DEFAULT 0,
    FOREIGN KEY (professor_id) REFERENCES Professores(professor_id)
);

CREATE TABLE Metas (
    meta_id INT PRIMARY KEY AUTO_INCREMENT,
    descricao_meta VARCHAR(255) NOT NULL,
    turma_id INT,
    professor_id INT,
    FOREIGN KEY (turma_id) REFERENCES Turmas(turma_id),
    FOREIGN KEY (professor_id) REFERENCES Professores(professor_id)
);

CREATE TABLE NotasCompetencia (
    nota_competencia_id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT,
    turma_id INT,
    nome_competencia VARCHAR(255) NOT NULL,
    nota DECIMAL(5,2),
    FOREIGN KEY (aluno_id) REFERENCES Alunos(aluno_id),
    FOREIGN KEY (turma_id) REFERENCES Turmas(turma_id)
);

CREATE TABLE EvolucaoNotas (
    evolucao_nota_id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT,
    turma_id INT,
    mes VARCHAR(20),
    nota_media DECIMAL(5,2),
    FOREIGN KEY (aluno_id) REFERENCES Alunos(aluno_id),
    FOREIGN KEY (turma_id) REFERENCES Turmas(turma_id)
);

CREATE TABLE DistribuicaoTemasRedacao (
    distribuicao_tema_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    nome_tema VARCHAR(255) NOT NULL,
    contagem INT DEFAULT 0,
    FOREIGN KEY (professor_id) REFERENCES Professores(professor_id)
);


