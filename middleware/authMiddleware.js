const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // suportar vários nomes de header e formatos (Bearer ...)
    const rawAuth = req.headers["authorization"] || req.headers["Authorization"];
    let token = null;

    if (rawAuth) {
      if (typeof rawAuth === "string" && rawAuth.toLowerCase().startsWith("bearer ")) {
        token = rawAuth.slice(7).trim();
      } else {
        token = String(rawAuth).trim();
      }
    }

    token = token || req.headers["x-auth-token"] || req.headers["token"];

    if (!token) {
      return res.status(401).json({ message: "Nenhum token, autorização negada" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
  } catch (err) {
    console.error("authMiddleware error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ message: "Erro do servidor" });
  }
};

