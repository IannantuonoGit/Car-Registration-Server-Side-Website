/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Giuliano Iannantuono Date: 2020-02-15
*
*
********************************************************************************/  

var express = require("express");
var app = express();
var path = require("path");
var ds = require("./data-service.js")
var multer = require("multer");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var fs = require('fs');

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public/css"));

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

const storage = multer.diskStorage({
    destination: "./public/pictures/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer( {storage: storage});

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
           } 
    }
}));

app.set('view engine', '.hbs');

app.use(express.static('public')); 

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   }); 
   
app.get("/", function(req, res){
    res.render('home', {titlex: 'Home'});
});

app.get("/about", function(req, res){
    res.render('about', {titlex: 'About'});
});

app.get("/people", (req, res) => { 
    ds.getAllPeople().then((data) => {
        if(req.query.vin){
            ds.getPeopleByVin(req.query.vin).then((data)=>{
                res.render("people", {people: data, titlex: 'People'});
            }).catch((err)=>{
                res.render({message: "no results"});
            });
        } else {
            res.render("people", {people: data, titlex: 'People'});
        }
    }).catch((err)=>{
        res.render({message: "no results"});
    });
});

app.get("/people/add", (req, res) =>{
    res.render('addPeople', {titlex: 'AddPeople'});
});

app.get("/people/:value", (req, res) => {
    ds.getPeopleById(req.params.value).then((data) => {
        res.render("person", { person: data, titlex: 'People' })
    }).catch((err) => {
        res.render("person",{message:"no results", titlex: 'People'});
    });
});

app.get("/cars", (req, res) => { 
    ds.getCars().then((data) => {

        if(req.query.vin){
            ds.getCarsByVin(req.query.vin).then((data)=>{
                res.render("cars", {cars: data, titlex: 'Cars'}); 
            }).catch((err)=>{
                res.render({message: "no results"});
            });
        } else if (req.query.make) {
            ds.getCarsByMake(req.query.make).then((data)=>{
                res.render("cars", {cars: data, titlex: 'Cars'}); 
            }).catch((err)=>{
                res.render({message: "no results"});
            });
        } else if (req.query.year) {
            ds.getCarsByYear(req.query.year).then((data)=>{
                res.render("cars", {cars: data, titlex: 'Cars'}); 
            }).catch((err)=>{
                res.render({message: "no results"});
            });
        } else {
            res.render("cars", {cars: data, titlex: 'Cars'}); 
        }
    }).catch((err)=>{
        res.render({message: "no results"});
    })
});

app.get("/stores", (req, res) => { 
    ds.getStores().then((data) => {
        if(req.query.retailer){
            ds.getStoresByRetailer(req.query.retailer).then((data) => {
                res.render("stores", {stores: data, titlex:'Stores'});
            }).catch((err)=>{
                res.render({message: "no results"});
            });
        } else {
            res.render("stores", {stores: data, titlex: 'Stores'});
        }
    }).catch((err)=>{
        res.render({message: "no results"});
    })
});

app.post("/people/add", (req, res)=>{
    ds.addPeople(req.body).then(()=>{
        res.redirect("/people");
    }).catch((err)=>{
        res.json({message: err});
    });
});

app.get("/pictures/add", (req, res) =>{
    res.render('addImage', {titlex: 'AddPhotos'})
});

app.post("/pictures/add", upload.single("pictureFile"),(req, res)=>{
    res.redirect("/pictures");
});

app.get("/pictures", (req, res)=>{
  var files =  fs.readdirSync(path.join(__dirname, "./public/pictures/uploaded"), 'utf-8');
  res.render('pictures', {data: files, titlex: 'Photos'});
  
});

app.post("/person/update", (req, res) => {
    ds.updatePerson(req.body).then(()=>{
        res.redirect("/people");
    }).catch((err)=>{
        res.json({message: err});
    });
   });   

app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname,"/views/404-page.html"));
  });

ds.initalize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=>{
    console.log(err);
})
