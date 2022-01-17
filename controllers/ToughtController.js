const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController {
    static async showToughts(req, res) {
        res.render('toughts/home')
    }

    static async dashboard(req, res) {
        res.render('toughts/dashboard')
    }

    static async createTought(req, res) {
        res.render('toughts/create')
    }

    static async createToughtSave(req, res) {
        const title = req.body.title
        const UserId = req.session.userid
        if (!UserId) {
            return res.redirect('/login')
        }

        try {
            const tought = { title, UserId }
            await Tought.create(tought)
            req.flash('message', 'Pensamento criado com Sucesso!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (erro) {
            console.log(erro)
        }

    }
}