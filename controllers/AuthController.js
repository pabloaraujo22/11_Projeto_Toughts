const User = require('../models/User')
const bcripty = require('bcryptjs')

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static register(req, res) {
        res.render('auth/register')
    }
    static async resgisterPost(req, res) {
        const { name, email, password, confirmpassword } = req.body

        if (password !== confirmpassword) {
            req.flash('message', 'As senhas não coferem! Digite novamente!')
            return res.render('auth/register')
        }

        res.redirect('/login')
    }
}