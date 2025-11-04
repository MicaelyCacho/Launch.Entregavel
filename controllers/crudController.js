
const pool = require("../db");

exports.getAll = (tableName) => async (req, res) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM ${tableName}`);
    res.json(rows);
  } catch (error) {
    console.error(`Erro ao buscar ${tableName}:`, error);
    res.status(500).json({ message: "Erro do servidor" });
  }
};

exports.getById = (tableName, idColumn) => async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(`SELECT * FROM ${tableName} WHERE ${idColumn} = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: `${tableName} não encontrado` });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar ${tableName} por ID:`, error);
    res.status(500).json({ message: "Erro do servidor" });
  }
};

exports.create = (tableName, columns) => async (req, res) => {
  // Mapear valores do req.body; substituir undefined por null para evitar valores 'undefined' no array
  const values = columns.map(col => {
    const v = req.body[col];
    return typeof v === 'undefined' ? null : v;
  });
  const placeholders = columns.map(() => "?").join(", ");
  const sqlColumns = columns.join(", ");
  try {
    const [result] = await pool.execute(
      `INSERT INTO ${tableName} (${sqlColumns}) VALUES (${placeholders})`,
      values
    );
    res.status(201).json({ message: `${tableName} criado com sucesso!`, id: result.insertId });
  } catch (error) {
    // Log detalhado para debugar inserções que falham
    console.error(`Erro ao criar ${tableName}:`, error && error.stack ? error.stack : error);
    const isDev = process.env.NODE_ENV === 'development';
    const errMsg = isDev ? (error && error.message ? error.message : String(error)) : 'Erro do servidor';
    res.status(500).json({ message: errMsg });
  }
};

exports.update = (tableName, idColumn, columns) => async (req, res) => {
  const { id } = req.params;

  // Build update from only the fields present in req.body (partial update)
  const updateKeys = columns.filter(col => Object.prototype.hasOwnProperty.call(req.body, col));

  if (updateKeys.length === 0) {
    return res.status(400).json({ message: 'Nenhum campo válido para atualizar' });
  }

  const values = updateKeys.map(col => req.body[col]);
  const setClause = updateKeys.map(col => `${col} = ?`).join(", ");

  try {
    const [result] = await pool.execute(
      `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = ?`,
      [...values, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `${tableName} não encontrado` });
    }
    res.json({ message: `${tableName} atualizado com sucesso!` });
  } catch (error) {
    console.error(`Erro ao atualizar ${tableName}:`, error && error.stack ? error.stack : error);
    res.status(500).json({ message: "Erro do servidor" });
  }
};

exports.remove = (tableName, idColumn) => async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute(`DELETE FROM ${tableName} WHERE ${idColumn} = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `${tableName} não encontrado` });
    }
    res.json({ message: `${tableName} excluído com sucesso!` });
  } catch (error) {
    console.error(`Erro ao excluir ${tableName}:`, error);
    res.status(500).json({ message: "Erro do servidor" });
  }
};

