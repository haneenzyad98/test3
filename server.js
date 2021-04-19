'use strict';

// import all packages we need
require('dotenv').config();
const PORT = process.env.PORT;
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodoverride = require('method-override');
const { pipe } = require('superagent');
// const { query } = require('express');
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
app.set('view engine', 'ejs');
app.use(express.static('./public/'));
app.use(express.urlencoded({ extended: true }))
app.use(methodoverride('_method'));
// ------------------------------------------------------
app.get('/', startapp)
app.get('/all' , alldata)
app.post('/all' ,savedata)
app.get('/save',showsave)

app.get('/details/:id', showdetails)
app.put('/details/:id', updatadata)
app.delete('/details/:id', deletdata)
// ------------------------------------------------------
client.connect().then(()=>{
    app.listen(PORT ,()=>console.log(`im runing in port ${PORT}`))
})
//------------------------------------------------------------
function startapp(req,res){
res.render('index')
}
function alldata(req,res){
    let url='https://digimon-api.vercel.app/api/digimon';
    superagent.get(url).then(x=>{
        let data=x.body;
        res.render('all',{toto:data})
    })
}
function savedata(req,res){
    let name=req.body.one;
    let src=req.body.two;
    let level=req.body.three;
    let value=[name,src,level]
    let SQL='INSERT INTO tes3 (name,image,level) VALUES($1,$2,$3) RETURNING *'
    client.query(SQL,value).then(x=>{
        console.log(x.rows);
        res.render('index')
    })
}
function showsave(req,res){
    let SQL=`SELECT * FROM tes3`
    client.query(SQL).then(x=>{
        res.render('mysave' , {coco:x.rows})
    })
}
function showdetails(req,res){
    let SQL =`SELECT * FROM tes3 WHERE id=$1`
    client.query(SQL,[req.params.id]).then(x=>{
        res.render('details',{data:x.rows[0]})
    })
}
function updatadata(req,res){
    let name=req.body.name;
    let image=req.body.image;
    let level=req.body.level;
    let id=req.body.id;
    let value=[name,image,level,id]
    let SQL='UPDATE tes3 SET name=$1,image=$2,level=$3 WHERE id=$4'
    client.query(SQL,value).then(x=>{
      
        res.redirect(`/details/${id}`)
    })
}
function deletdata(req,res){
    let id=req.body.id;
    let SQL='DELETE FROM tes3 WHERE id=$1';
    client.query(SQL,[id]).then(x=>{
        res.redirect('/')
    })
}