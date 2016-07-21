var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var formidable=require('formidable');
var fs=require('fs');

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
	var form=new formidable.IncomingForm();

	form.parse(req,function(errors,fields,files){
		console.log('formdata');
		console.log(fields);
		console.log(files);
		var path=__dirname+'/'+files.pic.name;

		var readStream=fs.createReadStream(files.pic.path);
		var writeStream=fs.createWriteStream(path);
		readStream.pipe(writeStream);


		res.json({fields});

	});
	// console.log(req.body);
})

app.get('/test2',function(req,res){
	// console.log(req.body);
	res.setHeader('Content-Type','text/json');
	res.json({name:"jack"});
})


app.post('/uploadWav',function(req,res){
	var form=new formidable.IncomingForm();

	form.parse(req,function(err,fields,files){
		console.log(files);
		res.end('ok')
	})
})











































