const User = require('../models/User')
const bcrypty = require('bcryptjs')


module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
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

        const salt = bcrypty.genSaltSync(10)
        const hashedPassword = bcrypty.hashSync(password, salt)

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



        res.redirect('/login')
    }
}