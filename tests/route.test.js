

const mongoose = require("mongoose");
let DB = require('../db.config');
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    await DB.sequelize.authenticate();
});

/* Closing database connection after each test. */
afterAll(async () => {
    await mongoose.connection.close();
    app.listen().close()
});

describe('MAIN ROUTE', () => {
    describe('GET TRY', () => {
        it('Should return 200 status', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(200)
        })
        it('Should return 501 status', async () => {
            const response = await request(app).get('/marcel')
            expect(response.status).toBe(501)
        })
    })
})



