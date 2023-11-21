const mongoose = require("mongoose");
let DB = require('../db.config');
const request = require("supertest");
const app = require("../app");
const init_test = require("./init")

require("dotenv").config();

/* Import Test Account Properties */
const admin = JSON.parse(process.env.ADMIN_TEST)
const formateur = JSON.parse(process.env.FORMATEUR_TEST)

/* Connecting to the database before each test. */
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    await DB.sequelize.authenticate();
    await init_test.initAdminUser()
});

/* Closing database connection after each test. */
afterAll(async () => {
    await mongoose.connection.close();
    app.listen().close()
});

describe('WITH FORMATEUR ACCOUNT', () => {
    let admin_token
    let formateur_token
    let id_formateur_created

    beforeAll(async () => {
        // Get Admin token
        res = await request(app).post('/auth/admin/login').send(admin)
        admin_token = res.body.access_token

        // Create Formateur account
        res = await request(app)
            .put('/formateur')
            .set('Authorization', `Bearer ${admin_token}`)
            .send(formateur)
        id_formateur_created = res.body.data.id
    })

    afterAll(async () => {
        res = await request(app)
            .delete(`/formateur/${id_formateur_created}`)
            .set('Authorization', `Bearer ${admin_token}`)
    })



    describe('LOGIN', () => {

        let res

        it('Should return 200 status', async () => {
            res = await request(app).post('/auth/formateur/login').send({ "email": formateur.email, "password": formateur.password })
            expect(res.status).toBe(200)
        })
        it('Should return access token', async () => {
            const { body } = res
            expect(body).toHaveProperty('access_token');
            formateur_token = body.access_token
            expect(formateur_token).toEqual(expect.any(String))
        })
    })
})