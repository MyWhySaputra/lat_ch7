const express = require('express')
const router = express.Router()
const { Create, Login } = require('../controller/auth.controller')
const { CheckLogin, CheckRegister } = require('../middleware/middleware')

/**
 * @swagger
 * /api/v1/auth/create:
 *   post:
 *     tags:
 *      - "Auth"
 *     summary: example to create user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.post('/auth/create', CheckRegister, Create)

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *      - "Auth"
 *     summary: example to login user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.post('/auth/login', CheckLogin, Login)


module.exports = router