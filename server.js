var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var formidable=require('formidable');

app.listen(3000,function(){
	console.log("listen 3000")
});





app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:false}));


app.get('/',function(req,res){
	res.end('hello world');
});


app.post('/test',function(req,res){
	console.log("kkk");
	// var form=new formidable.IncomingForm();

	// form.parse(req,function(errors,fields,files){
	// 	res.json(fields);
	// });
	console.log(req.body);
})

app.get('/test2',function(req,res){
	// console.log(req.body);
	res.setHeader('Content-Type','text/json');
	res.json({name:"jack"});
})











































