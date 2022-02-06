const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const PORT = process.env.PORT || 8080;

const app = require('./app');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiRoutes = express.Router();

apiRoutes.post('/api/login', routes.login);

apiRoutes.get('/api/posts', routes.getPosts);
apiRoutes.post('/api/users', routes.createUsers);
apiRoutes.get('/api/users/:id', routes.getUserById);
apiRoutes.get('/api/users', routes.getUsers);



app.use(apiRoutes);

app.listen(PORT, () => console.log(`Conectado na porta ${PORT}`));
