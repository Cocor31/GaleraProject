

const mongoose = require("mongoose");
let DB = require('../db.config');
const request = require("supertest");
const app = require("../app");
const init_test = require("./init")

require("dotenv").config();

/* Import Test Account Properties */
const admin = JSON.parse(process.env.ADMIN_TEST)
const eleve = JSON.parse(process.env.ELEVE_TEST)
const formation = JSON.parse(process.env.FORMATION_TEST)

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


describe('WITH ELEVE ACCOUNT', () => {
    let admin_token
    let id_fomation_eleve
    let id_eleve_created
    let eleve_token

    beforeAll(async () => {
        // Get Admin token
        res = await request(app).post('/auth/admin/login').send(admin)
        admin_token = res.body.access_token

        // Create Formation for eleve
        res = await request(app)
            .put('/formation')
            .set('Authorization', `Bearer ${admin_token}`)
            .send(formation)
        id_fomation_eleve = res.body.data.id

        // Create Eleve account
        res = await request(app)
            .put('/eleve')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                ...eleve,
                "id_formation": `${id_fomation_eleve}`,
            })
        id_eleve_created = res.body.data.id
    })

    afterAll(async () => {
        res = await request(app)
            .delete(`/formation/${id_fomation_eleve}`)
            .set('Authorization', `Bearer ${admin_token}`)
    })



    describe('LOGIN', () => {

        let res

        it('Should return 200 status', async () => {
            res = await request(app).post('/auth/eleve/login').send({ "email": eleve.email, "password": eleve.password })
            expect(res.status).toBe(200)
        })
        it('Should return access token', async () => {
            const { body } = res
            expect(body).toHaveProperty('access_token');
            eleve_token = body.access_token
            expect(eleve_token).toEqual(expect.any(String))
        })
    })
})