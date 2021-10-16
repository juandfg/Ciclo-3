const express = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Az2kt2yx8u*",
    database: "login",
    port: "3306"
});

connection.connect((error)=>{
    if(error){
        console.log("el error de conexion es :" + error);
        return;
    }else
    console.log("¡conectado a la base de datos");
});

module.exports = connection;