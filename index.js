require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./routes/routes')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express')
const swaggerDefinition = require('./helper/swagger_template.helper')

const { initializeSentry } = require('./lib/Sentry')

initializeSentry(process.env.SENTRY_DSN);

const port = process.env.PORT || 3000

const swaggerSpec = swaggerJsdoc(swaggerDefinition)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})