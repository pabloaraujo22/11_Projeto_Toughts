const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { raw } = require('express')


module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email: email }, raw: true })

        if (!user) {
            req.flash('message', 'Usuário não encontrado')
            return res.render('auth/login')
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            req.flash('message', 'Senha Inválida!')
            return res.render('auth/login')
        }

        req.session.userid = user.id
        req.flash('message', 'Autenticação realizada com sucesso!')
        req.session.save(() => {
            res.redirect('/')
        })

    }

    static register(req, res) {
        res.render('auth/register')
    }
    static async resgisterPost(req, res) {
        const { name, email, password, confirmpassword } = req.body

        //passwords math validation
        if (password !== confirmpassword) {
            req.flash('message', 'As senhas não coferem! Digite novamente!')
            return res.render('auth/register')
        }

        //email validation
        const checkIfUserExists = await User.findOne({ where: { email } })
        if (checkIfUserExists) {
            req.flash('message', 'O e-mail já está em uso!')
            return res.render('auth/register')
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
                name,
                email,
                password: hashedPassword
            }
            //inicialização da sessao
        try {
            const createdUser = await User.create(user)
            req.session.userid = createdUser.id
            req.flash('message', 'Cadastro realizado com Sucesso!')
            req.session.save(() => {
                res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}