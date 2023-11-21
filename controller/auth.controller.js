const { HashPassword, ComparePassword } = require('../helper/hash_pass_helper')
const { ResponseTemplate } = require('../helper/template.helper')
const { PrismaClient } = require('@prisma/client')
const { Sentry } = require('../lib/Sentry')

const prisma = new PrismaClient()
var jwt = require('jsonwebtoken')

async function Create(req, res) {

    const { name, email, password } = req.body

    const hashPass = await HashPassword(password)

    const payload = {
        name,
        email,
        password: hashPass
    }

    const emailUser = await prisma.user.findUnique({
        where: {email: payload.email},
    });

    if (emailUser) {
        let resp = ResponseTemplate(null, 'Email already exist', null, 404)
        res.status(404).json(resp)
        return
    }

    try {
        
        await prisma.user.create({
            data: payload
        });

        const userView = await prisma.user.findUnique({
            where: {
                email: payload.email
            },
            select: {
                name: true,
                email: true
            },
        });

        let resp = ResponseTemplate(userView, 'success', null, 200)
        res.status(200).json(resp);
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        Sentry.captureException(error)
        return
    }
}

async function Login(req, res) {

    try {
        const { email, password } = req.body

        const checkUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (checkUser === null) {
            let resp = ResponseTemplate(null, 'email is not found or incorrect', null, 400)
            res.status(400).json(resp)
            return
        }

        const checkPassword = await ComparePassword(password, checkUser.password)

        if (!checkPassword) {
            let resp = ResponseTemplate(null, 'password is not correct', null, 400)
            res.status(400).json(resp)
            return
        }

        const token = jwt.sign({
            id: checkUser.id,
            email: checkUser.email,
        }, process.env.SECRET_KEY,
            {expiresIn: '24h'});

        let resp = ResponseTemplate(token, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        Sentry.captureException(error)
        return
    }
}

module.exports = {
    Create,
    Login
}