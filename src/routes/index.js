const express = require('express');
const bcryptjs = require('bcryptjs');
const connection = require('../datbase/db');
const router = express.Router();
const calcular = require('../calcular/calcular');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const cookieParser = require('cookie-parser');
//const authcontroller = require('../controller/authcontroller')


router.get('/', /*isAuthenticateduser,*/ (req, res) =>{
    res.render('index.html', {user: req.user});
});

router.get("/login.html", (req, res) =>{
    res.render("login.html");
});
router.post('/auth', async (req, res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
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
                    timer: 2000,
                    ruta:'login.html'
                })
            }else{
                const id = results[0].idusers;
                const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                    expiresIn:process.env.JWT_TIEMPO_EXPIRA
                
                });
                console.log(token)
                const cookiesOptions = {
                    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
                    httpOnly:true
                }
                res.cookie('jwt', token, cookiesOptions)
                res.render('login.html',{
                    alert:true,
                    alertTitle: "login correcto",
                    alertMessage: "¡sesion iniciada!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: '/'
                })    
            }
        });
    }
});

async function isAuthenticated(req, res, next){
    if(req.cookies.jwt){
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM users WHERE idusers = ?', [decodificada.id], (error, results)=>{
            if(decodificada.id != 33){res.render('login.html')}
            req.user = results[0]
            return next()
        })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/')
        
    }
};
async function isAuthenticateduser(req, res, next){
    if(req.cookies.jwt){
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM users WHERE idusers = ?', [decodificada.id], (error, results)=>{
            if(!results){res.render('/')}
            req.user = results[0]
            return next()
        })
        } catch (error) {
            console.log(error)
            return next()
        }
        
    }else{
        res.redirect('login.html')
        
    }
    
};

router.get('/logout', (req, res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
});

//router.post('/auth', authcontroller.login)


router.get("/registro.html", (req, res) =>{
    res.render("registro.html");
});
router.post('/registro.html', async (req, res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const direccion = req.body.direccion;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) =>{
            if(results.length == 0){
                
                connection.query('INSERT INTO users SET ?',{user:user, apellido:apellido, email:email, dirección:direccion, password:passwordHaash}, async (error, results) =>{
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
                        ruta: 'login.html'
                        })
                    }
                });
            }else{
                res.render('registro.html',{
                    alert:true,
                    alertTitle: "Oops...",
                    alertMessage: "¡USUARIO YA EN USO!",
                    alertIcon: 'error',
                    showConfirmButton: false,
                    timer: 2000,
                    ruta:'registro.html'
                });
            }
        });
    }
});


router.get("/contact.html", (req, res) =>{
    res.render("contact.html");
});

//productos
router.get("/productos.html", (req, res) =>{
    res.render("productos.html");
});
router.post('/productos.html', (req, res)=>{
    const CantHeta5 = req.body.CantHetaPalma;
    const CantHeta1= req.body.CantHetaMaiz;
    const CantHeta2= req.body.CantHetaCafe;
    const CantHeta3= req.body.CantHetaArroz;
    const CantHeta4= req.body.CantHetaCacao;
    if(CantHeta5 > 0){
        let palce = 51313100;
        res.render('productos.html',{
            alert:true,
            alertTitle: "Hecho",
            alertMessage: "¡Total!"+ calcular.operacion(CantHeta5,palce),
            alertIcon: 'success',
            showConfirmButton: false,
            footer: '<a href="/pagar.html">Desea agregar al carrito?</a>',
            timer: '',
            ruta: 'productos.html'
            });
        }if(CantHeta1 > 0){
            let palce = 3568000;
            res.render('productos.html',{
                alert:true,
                alertTitle: "Hecho",
                alertMessage: "¡Total!"+ calcular.operacion(CantHeta1,palce),
                alertIcon: 'success',
                showConfirmButton: false,
                footer: '<a href="/pagar.html">Desea agregar al carrito?</a>',
                timer: '',
                ruta: 'productos.html'
                });
        }else if(CantHeta2 > 0){
            let palce = 2226440;
            res.render('productos.html',{
                alert:true,
                alertTitle: "Hecho",
                alertMessage: "¡Total!"+ calcular.operacion(CantHeta2,palce),
                alertIcon: 'success',
                showConfirmButton: false,
                footer: '<a href="/pagar.html">Desea agregar al carrito?</a>',
                timer: '',
                ruta: 'productos.html'
                });
        }else if(CantHeta3 > 0){
            let palce = 1275950;
            res.render('productos.html',{
                alert:true,
                alertTitle: "Hecho",
                alertMessage: "¡Total!"+ calcular.operacion(CantHeta3,palce),
                alertIcon: 'success',
                showConfirmButton: false,
                footer: '<a href="/pagar.html">Desea agregar al carrito?</a>',
                timer: '',
                ruta: 'productos.html'
                });
        }else if(CantHeta4 > 0){
            let palce = 1144400;
            res.render('productos.html',{
                alert:true,
                alertTitle: "Hecho",
                alertMessage: "¡Total!"+ calcular.operacion(CantHeta4,palce),
                alertIcon: 'success',
                showConfirmButton: false,
                footer: '<a href="/pagar.html">Desea agregar al carrito?</a>',
                timer: '',
                ruta: 'productos.html'
                });
        }else{
            console.log('bobo hp')
        }
});

//cart
router.get("/pagar.html",isAuthenticateduser, (req, res) =>{
    res.render("pagar.html");
});

//admin
router.get("/administrador.html", isAuthenticated, (req, res)=>{
    res.render("administrador.html");
});


module.exports = router;