const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

const server = require('../api/app');

const { User } = require('../models');
const { User: userMock }  = require('./mock/models')

chai.use(chaiHttp);

const { expect } = chai;

describe('Rota /api/users', () => {
    describe('Testa a inserção de registros através da rota', () => {
        let createRequest = {};
        let firstUserList = [];
        let secondUserList = [];
        const newUser = {
            username: 'jane',
            password: 'senha123'
        };

        before(async () => {
            // Intercepta os métodos utilizados pelo modelo do sequelize
            // e os substitui pelos nossos
            sinon.stub(User, 'create')
                .callsFake(userMock.create);
            sinon.stub(User, 'findAll')
                .callsFake(userMock.findAll);
            
            /*
                São feitas três ações:
                (1) Validação da lista de usuários inicial
                (2) Criação de um novo usuário
                (3) Re-validação da lista, que deve conter o 
                    novo registro
            */
            firstUserList = await chai
                .request(server)
                .get('/api/users')
                .then(({body}) => body);
            createRequest = await chai
                .request(server)
                .post('/api/users')
                .send(newUser);          
            secondUserList = await chai
                .request(server)
                .get('/api/users')
                .then(({body}) => body);
        });

        after(async () => {
            User.create.restore();
            User.findAll.restore();
        })

        it('GET: A lista inicial de usuários deve conter 2 registros', () => {
            expect(firstUserList).to.have.length(2);
        });

        it('POST: Retorna o código de status 201 após a inserção', () => {
            expect(createRequest).to.have.status(201);
        });

        it('POST: Retorna um objeto no corpo da resposta', () => {
            expect(createRequest.body).to.be.a('object');
        });

        it('POST: O objeto possui a propriedade "message"', () => {
            expect(createRequest.body)
              .to.have.property('message');
        });

        it('POST: A propriedade "message" possui o texto "Novo usuário criado com sucesso"', 
          () => {
            expect(createRequest.body.message)
              .to.be.equal('Novo usuário criado com sucesso');
          }
        );

        it('GET: A lista de usuários após a inserção deve conter 3 registros', () => {
            expect(secondUserList).to.have.length(3);
        });

        it('GET: O registro criado deve corresponder ao enviado na requisição POST', () => {
            expect(secondUserList[2]).to.contain(newUser);
        })
    });
});
