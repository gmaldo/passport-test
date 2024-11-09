import express from "express"
import userModel from "../model/user.model.js"
import passport from "passport"
import jwtUtils from "../utils/jwtUtils.js"
import passportUtils from "../utils/passportUtils.js"

const router = express.Router()

router.get('/signup', async(req,res) => {
    res.render('signup.handlebars')
})

router.get("/login", async (req, res) => {
    res.render("login.handlebars")
})

router.post('/signup', passport.authenticate('signup', {session: false, failureRedirect: '/failsignup' }), async (req, res) => {
    res.send({ status: "success", message: "usuario registrado" })
});

router.get('/failsignup', async (req, res) => {
    console.log('Registro fallido')
    res.send({ error: "failed" })
})
router.post('/login', passport.authenticate('login', {session: false, failureRedirect: '/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(401).send({ status: "error", error: "Usuario no encontrado" })
   
    const access_token = jwtUtils.generateToken(req.user)
    res.cookie('jwt', access_token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    console.log('Cookie establecida:', access_token);
    res.render("success.handlebars")
    
});

router.get('/faillogin', async (req, res) => {
    console.log('Login fallido')
    res.render("login.handlebars", { error: true })
})

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/login'); 
})

// router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.send(req.user);
// })

router.get('/current', passportUtils.passportCall('jwt'), (req, res) => {
    
    //passport me da el usuario en req.user

    if (!req.user) {
        return res.redirect('/login'); 
    }

   // console.log(req.user)
    res.render('current.handlebars', {
        first_name: req.user.user.first_name,
        last_name: req.user.user.last_name,
        email: req.user.user.email,
        age: req.user.user.age
    });
   // res.send(req.user);
})

router.get('/github', passport.authenticate('github', {  session: false,scope: ['user:email'] }), async (req, res) => {
    res.send({ status: "success", message: "usuario registrado" })
})

router.get('/githubcallback', passport.authenticate('github', {  session: false,failureRedirect: '/login' }), async (req, res) => {
    //req.session.user = req.user
    //res.redirect('/')
    const access_token = jwtUtils.generateToken(req.user)
    res.cookie('jwt', access_token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    console.log('Cookie establecida:', access_token);
    res.render("success.handlebars")
})


export default router