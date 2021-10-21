const express = require('express');
const mysql = require('mysql');

const connection = mysql.createPool({
    host: us-cdbr-east-04.cleardb.com,
    user: bd20d0a0a64be7,
    password: ba24c15d,
    database: heroku_98cf51eaea0e92a,
});

connection.getConnection((error)=>{
    if(error){
        console.log("el error de conexion es :" + error);
        return;
    }else
    console.log("¡conectado a la base de datos");
});

module.exports = connection;