const express = require('express')
const Tought = require('../models/Tought')
const router = express.Router()

const ToughtController = require('../controllers/ToughtController')
const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.get('/add', checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createToughtSave)
router.get('/', ToughtController.showToughts)


module.exports = router