const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController {
    static async showToughts(req, res) {
        res.render('toughts/home')
    }

    static async dashboard(req, res) {
        const userid = req.session.userid
        console.log(userid)

        if (!userid) {
            return res.redirect('/login')
        }
        const user = await User.findOne({
            where: {
                id: userid
            },
            include: Tought,
            plain: true
        })
        const toughts = (user.Toughts).map((result) => result.dataValues)
        console.log(toughts)

        let emptyToughts = false
        if (toughts.length === 0) {
            emptyToughts = true
        }

        res.render('toughts/dashboard', { toughts, emptyToughts })
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

    static async removeTought(req, res) {
        const UserId = req.session.userid
        const id = req.body.id

        if (!UserId) {
            return res.redirect('/login')
        }

        try {
            await Tought.destroy({ where: { id, UserId } })

            req.flash('message', 'Pensamento removido com Sucesso!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (erro) {
            console.log(erro)
        }
    }
}