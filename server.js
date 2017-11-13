var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var session = require('express-session');
app.listen(8000, function() {
 console.log("listening on port 8000");
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret: 'codingdojorocks'}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './static')));

mongoose.Promise = global.Promise;

var PersonSchema = new mongoose.Schema({
    name:{type:String, required:true,minlength:3},
},{timestamps:true});

mongoose.model("Person",PersonSchema);
var Person = mongoose.model("Person");

app.get('/', function(req, res){
    Person.find({},function(err, people){
        if(err){
            res.send("there is a error!!!");
        }else{
            res.json(people);
        }
    })
})


app.get('/new/:name', function(req, res){
    var newperson = new Person({name: req.params.name});
    newperson.save(function(err){
        if(err){
            res.send("there is a error!!!");
        }else{
            res.redirect('/');
        }
    })
})

app.get('/remove/:name', function(req, res){
    Person.remove({name:req.params.name}, function(err){
        if(err){
            res.send("Can not remove this name!!!");
        }else{
            res.redirect('/');
        }
    })
})

app.get('/:name',function(req, res){
    Person.findOne({name:req.params.name}, function(err, person){
        if(err){
            res.send("Can not find this name!!!");
        }else{
            res.json(person);
        }
    })
})