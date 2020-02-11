const { Router } = require("express");
const Controller = require("../../structures/Controller.js");
const jwt = require("jsonwebtoken");

module.exports = class AdminController extends Controller {
  constructor(app) {
    super(app, "AdminContoller");
  }
  start() {
    const router = Router();

    router.get("/", async (req, res) => {
      const { email, password } = req.query;
      if (!(email && password)) return res.status(400).json({});

      const database = this.database;
      console.log(await database.admins.findAll())
      const hasAdmin = await database.admins.findGet({email,password})
      if (!hasAdmin) return res.status(401).json({});

      return res.json({
        token: jwt.sign({ user: hasAdmin }, process.env.JWT_TOKEN)
      });
    });
    return this.app.use("/auth", router);
  }
};
