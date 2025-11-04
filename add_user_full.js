// Uso: node add_user_full.js <tipo> <email> <senha> "<nome_completo>"
// Ex.: node add_user_full.js aluno aluno@example.com MinhaSenha123 "Aluno Teste"

const bcrypt = require('bcryptjs');
const pool = require('./db'); // usa pool do projeto
const [,, tipo, email, senha, nomeCompleto] = process.argv;

if (!tipo || !email || !senha || !nomeCompleto) {
  console.error('Uso: node add_user_full.js <tipo> <email> <senha> "<nome_completo>"');
  console.error('Tipos válidos: aluno, professor, administrador');
  process.exit(1);
}

const validTypes = ['aluno', 'professor', 'administrador'];
if (!validTypes.includes(tipo)) {
  console.error('Tipo inválido. Use: aluno | professor | administrador');
  process.exit(1);
}

(async () => {
  try {
    const senhaHash = bcrypt.hashSync(senha, 10);

    // Inserir em Usuarios
    const insertUsuarioSql = 'INSERT INTO Usuarios (email, senha_hash, tipo_usuario) VALUES (?, ?, ?)';
    const [resUsuario] = await pool.query(insertUsuarioSql, [email, senhaHash, tipo]);
    const usuarioId = resUsuario.insertId;
    console.log(`Usuário criado: usuario_id=${usuarioId}, email=${email}, tipo=${tipo}`);

    // Inserir na tabela específica (nome_completo é NOT NULL nas tabelas correspondentes)
    if (tipo === 'aluno') {
      const insertAluno = 'INSERT INTO Alunos (usuario_id, nome_completo) VALUES (?, ?)';
      await pool.query(insertAluno, [usuarioId, nomeCompleto]);
      console.log(`Registro criado em Alunos para usuario_id=${usuarioId}`);
    } else if (tipo === 'professor') {
      const insertProf = 'INSERT INTO Professores (usuario_id, nome_completo) VALUES (?, ?)';
      await pool.query(insertProf, [usuarioId, nomeCompleto]);
      console.log(`Registro criado em Professores para usuario_id=${usuarioId}`);
    } else if (tipo === 'administrador') {
      const insertAdm = 'INSERT INTO Administradores (usuario_id, nome_completo) VALUES (?, ?)';
      await pool.query(insertAdm, [usuarioId, nomeCompleto]);
      console.log(`Registro criado em Administradores para usuario_id=${usuarioId}`);
    }

  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      console.error('Erro: email já existe no banco.');
    } else {
      console.error('Erro ao criar usuário:', err.message || err);
    }
  } finally {
    // fechar pool para o processo terminar
    try { await pool.end(); } catch(e) {}
    process.exit(0);
  }
})();