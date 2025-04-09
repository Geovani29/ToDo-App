// Middleware para autorizar roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.user.role} no est� autorizado para acceder a esta ruta`
      });
    }
    next();
  };
};
