const { User } = require('../models');

module.exports = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await User.findOne({ where: { id } });

    if (!user) throw Error;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuários no banco', error: err.message });
  }
  
}