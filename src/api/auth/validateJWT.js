require('dotenv').config();
const jwt = require('jsonwebtoken');

const { User } = require('../../models');

const segredo = process.env.SECRET || 'seusecretdetoken';

module.exports = async (req, res, next) => {
     
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(400).json({ message: 'Token não encontrado ou informado' });
  }

  try {
    const decoded = jwt.verify(token, segredo);
    const user = await User.findOne({ where: { username: decoded.data.username } });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Erro ao procurar usuário do token.' });
    }

    const id = Number(req.params.id);
    console.log('hey')
    if (id !== user.id) {
      return res
        .status(401)
        .json({ message: 'Acesso negado' });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};