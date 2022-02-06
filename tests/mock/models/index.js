const Users = require('./Users.json');

const mockCreate = (Instance, data) => {
  if(!data){
    return;
  }

  const newData = data;
  if(!!Instance[0].id) {
    newData.id = Date.now();
  }
  Instance.push(newData);
  return newData;
};

const mockFindOne = (Instance, where) => {
  if (!where) {
    return Instance[0];
  }

  const entries = Object.entries(where);
  let result;

  entries.forEach(entry => {
    const [key, value] = [entry[0], entry[1]];

    const index = Instance
      .findIndex(item => !!item[key] && item[key] === value);
    if(index !== -1){
      result = Instance[index];
    }
  });

  return result;
};

const User = {
  create: async (data) => mockCreate(Users, data),
  findAll: async () => Users,
  findOne: async ({ where }) => mockFindOne(Users, where),
};

module.exports = {
  User,
};