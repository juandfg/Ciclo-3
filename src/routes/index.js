const express = require('express');
const bcryptjs = require('bcryptjs');
const connection = require('../datbase/db');
const router = express.Router();

router.get("/", (req, res) =>{
    res.render("index.html");
});

router.get("/login.html", (req, res) =>{
    res.render("login.html");
});
router.post('/auth', async (req, res) =>{
    const user = req.body.user;
    const pass = req.body.user;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) =>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login.html',{
                    alert:true,
                    alertTitle: "Oops...",
                    alertMessage: "¡USUARIO O PASSWORD INCORRECTO!",
                    alertIcon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                })
            }else{
                res.render('login.html',{
                    alert:true,
                    alertTitle: "login correcto",
                    alertMessage: "¡sesion iniciada!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                })    
            }
        });
    }
});

router.get("/registro.html", (req, res) =>{
    res.render("registro.html");
});
router.post('/registro.html', async (req, res) =>{
    const user = req.body.user;
    const pass = req.body.user;
    let passwordHaash = await bcryptjs.hash(pass, 8);
        connection.query('INSERT INTO users SET ?',{user:user, pass:passwordHaash}, async (error, results) =>{
            if(error){
                console.log(error)
            }else{
                res.render('registro.html',{
                alert:true,
                alertTitle: "Registration",
                alertMessage: "¡Successful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    });
});


router.get("/contact.html", (req, res) =>{
    res.render("contact.html");
});

router.get("/productos.html", (req, res) =>{
    res.render("productos.html");
});

router.get("/pagar.html", (req, res) =>{
    res.render("pagar.html");
});

module.exports = router;