const { Router } = require('express');
const Controller = require('../../structures/Controller.js');
const authorizationMiddleware = require('../middlewares/hasLogged.js')

module.exports = class DashBoardController extends Controller {
    constructor(app) {
        super(app, 'UserController')
    }
    start() {
        const router = Router();

        router.use(authorizationMiddleware);
        
        router.get('/admin', async (req, res) => {
            const database = this.database.admins;
            console.log(req.user)
            const user = await database.findOne({ _id: req.user.user._id });
            console.log(user)
            if (!user) return res.status(400).json();
          
            return res.json({ user });
          });
        /*
        rota antiga
        router.get('/:id', async (req, res) => {
            const { id } = req.params;
            const user = await this.getUser({ integrations: { $elemMatch: { name: 'Google', 'integration.userId': id } } });

            return res.json({ user });
        })
        */

        router.post('/register', async (req, res) => {
            try {
                const { email, integration, password, username} = req.body
                const user = await this.saveUser({ email, integration, password, username });
                

                if (!user) res.status(400).json({ error: 'hasUser' });

                return res.json({ user })
            } catch (e) {
                return res.status(403).json({ error: 'Missing content' });
            }
        })
        return this.app.use('/user', router)
    }
}