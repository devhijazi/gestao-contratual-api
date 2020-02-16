const jwt = require('jsonwebtoken');


module.exports = (req,res,next) =>{
    const token = req.body.token || req.query.token || req.headers.authorization;

    if(!token) return res.status(401).json({ok: false, error:'Unauthorized'});

    jwt.verify(token, process.env.JWT_TOKEN, (err,decoded)=>{
        if(err) return res.status(401).json({ok: false, error:'Unauthorized'})

        req.token = token;
        req.user = decoded;
        next()
    })
}