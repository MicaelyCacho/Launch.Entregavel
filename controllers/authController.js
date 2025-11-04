const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // assume mysql2/promise pool exportado em db.js

exports.register = async (req, res) => {
  try {
    // Normaliza o tipo de usuário aceitando vários nomes
    const b = req.body || {};
    const tipo_usuario =
      b.tipo_usuario || b.tipo || b.tipoUsuario || b.user_type || b.role || b.perfil;

    if (!tipo_usuario) {
      return res.status(400).json({
        message: 'Tipo de usuário é obrigatório (aluno | professor | administrador)',
      });
    }

    const tipoNormalizado = String(tipo_usuario).toLowerCase();
    const tiposPermitidos = ['aluno', 'professor', 'administrador'];
    if (!tiposPermitidos.includes(tipoNormalizado)) {
      return res.status(400).json({
        message: 'Tipo de usuário inválido (aluno | professor | administrador)',
      });
    }

    const { email, senha, nome_completo = null } = req.body;
    if (!email || !senha) return res.status(400).json({ message: 'Email e senha são obrigatórios' });

    conn = await pool.getConnection();
    await conn.beginTransaction();

    // bloqueia/verifica duplicata
    const [existing] = await conn.query('SELECT usuario_id FROM Usuarios WHERE email = ? FOR UPDATE', [email]);
    if (existing.length > 0) {
      await conn.rollback();
      conn.release();
      return res.status(409).json({ message: 'Email já registrado' });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);
    const [result] = await conn.query(
      'INSERT INTO Usuarios (email, senha_hash, tipo_usuario) VALUES (?, ?, ?)',
      [email, senhaHash, tipoNormalizado]
    );
    const usuarioId = result.insertId;

    // O mapa de tabelas já valida o tipo, então o 'if' anterior se torna redundante.
const profileTableMap = {
  'aluno': 'Alunos',
  'professor': 'Professores',
  'administrador': 'Administradores'
};

const profileTable = profileTableMap[tipoNormalizado];

// A validação `validTypes.includes` no início do código já garante que profileTable não será undefined.
const sql = `INSERT INTO ${profileTable} (usuario_id, nome_completo) VALUES (?, ?)`;
await conn.query(sql, [usuarioId, nome_completo]);


    await conn.commit();
    conn.release();
  return res.status(201).json({ usuario_id: usuarioId, tipo_usuario: tipoNormalizado });
  } catch (err) {
    try { if (conn) { await conn.rollback(); conn.release(); } } catch (_) {}
    console.error('Erro no registro:', err);
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email já registrado' });
    return res.status(500).json({ message: 'Erro do servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT usuario_id, email, senha_hash, tipo_usuario FROM Usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.usuario_id, tipo_usuario: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // <-- aumentar duração para 7 dias (ou '1h', '30m', etc)
    );

    return res.json({ token, tipo_usuario: user.tipo_usuario });
  } catch (error) {
    // log completo do erro
    console.error("Erro no login:", error && (error.stack || error));
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(500).json({ message: "Erro do servidor", ...(isDev ? { stack: error.stack } : {}) });
  }
};

