/**
 * [nodejs server]
 * version 1 - 20170225
 */
var MongoClient = require('mongodb').MongoClient;
var colors = require('colors');
var express = require('express');
// check if there are comments in db
var comments = require('./comments');
var app = express();
// db 'blog'
var URL = 'mongodb://localhost:27017/blog';
var db = require('./db');
var maDb;

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var parseurl = require('parseurl');


app.use("/pages", express.static(__dirname + '/pages'));
app.use("/img", express.static(__dirname + '/img'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use(bodyParser.urlencoded({ extended: false }));



app.use(cookieParser());

// pug template
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', 'pages');


//pages
app.get('/', function (req,res) {
       
       res.render('index', { titre:'Home'});
});

app.get('/form', function(req, res){
       
        res.render('formulaire', { titre:'formulaire', message:''});
});

app.get('/polar-bear', function(req, res){
    var collection = maDb.collection('polarbear');
    collection.find().toArray(function(err, data){

        res.render('polar-bear', { titre:'A polar bear plunging', soustitre:' (© Sergei Gladyshev/500px)', msgCom:comments.msgCom(data), messages:data});
    });
});

app.get('/penguin', function(req, res){
    var collection = maDb.collection('penguin');
    collection.find().toArray(function(err, data){

        res.render('penguin', { titre:'Emperor penguin adult and chicks, Snow Hill Island, Antarctica', soustitre:'(© Mike Hill/Getty Images)', msgCom:comments.msgCom(data), messages:data});

    });
});
app.get('/porcupinefish', function(req, res){
    var collection = maDb.collection('porcupinefish');
    collection.find().toArray(function(err, data){

        res.render('porcupinefish', { titre:'Spot-fin porcupinefish near Hawaii', soustitre: '(© David Fleetham/Visuals Unlimited, Inc.)', msgCom:comments.msgCom(data), messages:data});
    });
});
app.get('/frogs', function(req, res){
    var collection = maDb.collection('frogs');
    collection.find().toArray(function(err, data){
           
        res.render('frogs', { titre:'Black-webbed tree frogs', soustitre: '(© Hendy MP/Solent News/REX)', msgCom:comments.msgCom(data), messages:data});
    });
});
app.get('/turtle', function(req, res){
    var collection = maDb.collection('turtle');
    collection.find().toArray(function(err, data){

        res.render('turtle', { titre:'Green sea turtle being cleaned by reef fish off the Kona Coast, Big Island, Hawaii ', soustitre: '(© Masa Ushioda/Aurora Photos)', msgCom:comments.msgCom(data), messages:data});
    });
});
app.get('/lion', function(req, res){
    var collection = maDb.collection('lion');
    collection.find().toArray(function(err, data){

        res.render('lion', { titre:'African lion cub playing with adult male, Masai Mara National Reserve, Kenya', soustitre: '(© Suzi Eszterhas/Minden Pictures)', msgCom:comments.msgCom(data), messages:data});
    });
});

app.post('/reponse', function(req, res){
    if (!req.body) return req.sendStatus(404);

    var dataBase = req.query.r;

    var collection = maDb.collection(dataBase);
    var date = new Date();
    var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();

    if(day <= 9){
      day = '0' + day;
    }
    if(month <= 9){
      month = '0' + month;
    }

      collection.insert({
          article: req.body.article,
          texte: req.body.texte,
          auteur :req.body.auteur,
          date: day+'-'+month+'-'+year,
          time : date.getTime()
        }, function(err, result) {
            if(err){
                res.redirect('404');
            } else {
                res.redirect(dataBase);
            }
       });
});

app.use(function(req, res, next){
  res.status(404);

      if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
      } 
});

MongoClient.connect(URL, function(err, db) { 
     maDb = db;
  if (err) {
    console.log(colors.bold.bgRed('   connection db failed !!!  '));
    return;
  }
  app.listen(8080, function() {  
    console.log(colors.bold.bgGreen('      Le serveur est disponible sur le port 8080      '));
  });
});
