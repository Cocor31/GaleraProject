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
const formation_eleve = JSON.parse(process.env.FORMATION_ELEVE_TEST)

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


describe('WITH ADMIN ACCOUNT', () => {
    let admin_token

    describe('LOGIN', () => {

        let res

        it('Should return 200 status', async () => {
            res = await request(app).post('/auth/admin/login').send(admin)
            expect(res.status).toBe(200)
        })
        it('Should return access token', async () => {
            const { body } = res
            expect(body).toHaveProperty('access_token');
            admin_token = body.access_token
            expect(admin_token).toEqual(expect.any(String))
            //expect(admin_token.length).toBeGreaterThan(0)
        })
    })

    describe('ALTER FORMATION DATA', () => {
        let id_fomation_created
        describe('GET / endpoint return all formations', () => {
            let res
            it('Should return 200 status', async () => {
                res = await request(app)
                    .get('/formation')
                    .set('Authorization', `Bearer ${admin_token}`)
                //.set("Accept", "application/json");
                const { statusCode } = res
                expect(statusCode).toBe(200);
            })

            it('Should return Array data', async () => {
                const { body } = res
                expect(body).toHaveProperty('data');
                expect(Array.isArray(body.data)).toBe(true);
            })
        })

        describe('PUT / endpoint return the correct response', () => {
            let res
            it('Should return 200 status', async () => {
                res = await request(app)
                    .put('/formation')
                    .set('Authorization', `Bearer ${admin_token}`)
                    .send(formation)
                const { statusCode } = res
                expect(statusCode).toBe(200);
            })

            it('Should return message Formation Created', async () => {
                const { body } = res
                expect(body).toHaveProperty('message');
                expect(body.message).toBe("Formation Created");
            })
            it('Should return data with id_fomation', async () => {
                const { body } = res
                expect(body).toHaveProperty('data');
                expect(body.data).toHaveProperty('id');
                id_fomation_created = body.data.id
            })
        })

        describe('GET /:id endpoint return only the formation created before', () => {
            let res
            it('Should return 200 status', async () => {
                res = await request(app)
                    .get(`/formation/${id_fomation_created}`)
                    .set('Authorization', `Bearer ${admin_token}`)
                const { statusCode } = res
                expect(statusCode).toBe(200);
            })

            it('Should return Array data with only one objet', async () => {
                const { body } = res
                expect(body).toHaveProperty('data');
                const { data } = body
                expect(Array.isArray(data)).toBe(false);
                expect(data).toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        nom: expect.any(String),
                        debut: expect.any(Number),
                        fin: expect.any(Number),
                    })
                )
            })
        })

        describe('DELETE /:id endpoint return the correct response', () => {
            let res
            it('Should return 200 status', async () => {
                res = await request(app)
                    .delete(`/formation/${id_fomation_created}`)
                    .set('Authorization', `Bearer ${admin_token}`)
                const { statusCode } = res
                expect(statusCode).toBe(200);
            })

            it('Should return message Formation Deleted', async () => {
                const { body } = res
                expect(body).toHaveProperty('message');
                expect(body.message).toContain('Successfully Deleted')
            })
        })

        describe('GET /:id endpoint after deletion', () => {
            let res
            it('Should return 404 status', async () => {
                res = await request(app)
                    .get(`/formation/${id_fomation_created}`)
                    .set('Authorization', `Bearer ${admin_token}`)
                const { statusCode } = res
                expect(statusCode).toBe(404);
            })

            it("Should return message Formation doesn't exist", async () => {
                const { body } = res
                expect(body).toHaveProperty('message');
                expect(body.message).toBe("This formation does not exist !");
            })
        })
    })

    describe('ALTER ELEVE DATA', () => {
        let id_eleve_created
        let id_fomation_eleve

        beforeAll(async () => {
            res = await request(app)
                .put('/formation')
                .set('Authorization', `Bearer ${admin_token}`)
                .send(formation_eleve)
            const { body } = res
            id_fomation_eleve = body.data.id
        })

        afterAll(async () => {
            res = await request(app)
                .delete(`/formation/${id_fomation_eleve}`)
                .set('Authorization', `Bearer ${admin_token}`)
        })

        describe('GET / endpoint return all eleves', () => {
            let res
            it('Should return 200 status', async () => {
                res = await request(app)
                    .get('/eleve')
                    .set('Authorization', `Bearer ${admin_token}`)
                const { statusCode } = res
                expect(statusCode).toBe(200);
            })

            it('Should return Array data', async () => {
                const { body } = res
                expect(body).toHaveProperty('data');
                expect(Array.isArray(body.data)).toBe(true);
            })
        })

        describe('PUT / endpoint return the correct response', () => {
            let res
            it('Should return 200 status', async () => {
                res = await request(app)
                    .put('/eleve')
                    .set('Authorization', `Bearer ${admin_token}`)
                    .send({
                        ...eleve,
                        "id_formation": `${id_fomation_eleve}`,
                    })
                const { statusCode } = res
                expect(statusCode).toBe(200);
            })

            it('Should return message Eleve Created', async () => {
                const { body } = res
                expect(body).toHaveProperty('message');
                expect(body.message).toBe("Eleve Created");
            })
            it('Should return data with id_eleve', async () => {
                const { body } = res
                expect(body).toHaveProperty('data');
                expect(body.data).toHaveProperty('id');
                id_eleve_created = body.data.id
            })
        })

        describe('GET /:id endpoint return only the eleve created before', () => {
            let res
            it('Should return 200 status', async () => {
                res = await request(app)
                    .get(`/eleve/${id_eleve_created}`)
                    .set('Authorization', `Bearer ${admin_token}`)
                const { statusCode } = res
                expect(statusCode).toBe(200);
            })

            it('Should return Array data with only one objet', async () => {
                const { body } = res
                expect(body).toHaveProperty('data');
                const { data } = body
                expect(Array.isArray(data)).toBe(false);
                expect(data).toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        id_formation: expect.any(Number),
                        lastname: expect.any(String),
                        firstname: expect.any(String),
                        email: expect.any(String),
                        password: expect.any(String),
                    })
                )
            })
        })

        describe('DELETE /:id endpoint return the correct response', () => {
            let res
            it('Should return 200 status', async () => {
                res = await request(app)
                    .delete(`/eleve/${id_eleve_created}`)
                    .set('Authorization', `Bearer ${admin_token}`)
                const { statusCode } = res
                expect(statusCode).toBe(200);
            })

            it('Should return message Eleve Deleted', async () => {
                const { body } = res
                expect(body).toHaveProperty('message');
                expect(body.message).toContain('Successfully Deleted')
            })
        })

        describe('GET /:id endpoint after deletion', () => {
            let res
            it('Should return 404 status', async () => {
                res = await request(app)
                    .get(`/eleve/${id_eleve_created}`)
                    .set('Authorization', `Bearer ${admin_token}`)
                const { statusCode } = res
                expect(statusCode).toBe(404);
            })

            it("Should return message Eleve doesn't exist", async () => {
                const { body } = res
                expect(body).toHaveProperty('message');
                expect(body.message).toBe("This eleve does not exist !");
            })
        })
    })
})