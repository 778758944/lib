/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-04-16 09:45:19
 * @version $Id$
 */
(function(){
	var isFromData=FormData ? true:false;
	var isPromise=Promise ? true:false;
	var isXMLHttpRequest=XMLHttpRequest ? true:false;


	// console.log(isPromise);




	function serialize(data){
		var form='';
		if(FormData){
			if(data instanceof Object){
				form=new FormData();
				for(var i in data){
					if(data.hasOwnProperty(i)){
						form.append(i,data[i])
					}
				}
			}
			else if(!data){
				form=new FormData(document.getElementById(data));
			}
			else{
				form=null;
			}
			return form;
		}

		if(!FormData||!XMLHttpRequest){
			if(data && data instanceof Object){
				for(i in data){
					if(data.hasOwnProperty(i)){
						form+=i+'='+data[i]+'&';
					}
					return form.substring(0,form.length-1);
				}
			}
			else{
				return null;
			}
		}
	}



	function ajax(conf){




		var obj={
			method:"GET",
			responseType:"text",
			progress:null,
			abort:null,
			loadend:null,
			data:null,
			success:null,
			failuer:null
		}


		Object.assign(obj,conf);
		console.log(obj);
		if(!obj.url){
			throw(new Error('no url'));
			return;
		}

		if(XMLHttpRequest){
			var p = new Promise((resolve,reject)=>{
				var xhr=new XMLHttpRequest();
				xhr.open(obj.method,obj.url,true);
				xhr.responseType=obj.responseType;
				// xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onload=function(){
					resolve(xhr.response);
				};
				xhr.onerror=function(e){
					reject(e);
				}
				xhr.onprogress=obj.progress;
				xhr.onabort=obj.abort;
				xhr.onloadend=obj.loadend;
				xhr.send(serialize(obj.data));
			});

			if(obj.success){
				return p.then(obj.success,obj.failuer);
			}
			else{
				return p;
			}
		}
		else{
			var xhr=new ActiveXObject("MSXML2.XMLHTTP");
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					console.log(xhr.response);
				}
			}
			xhr.open(obj.method,obj.url,true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(serialize(obj.data));
		}
	}



	function get(url,fn){
		var conf={url:url,responseType:"text"};
		if(fn){
			conf.success=fn;
		}
		var p=ajax(conf);
		return p;
	}





	function post(url,data,fn){
		var conf={url:url,data:data,responseType:"text",method:"POST"};
		if(fn){
			conf.success=fn;
		}
		var p=ajax(conf);
		return p;
	}

	window.ajax=ajax;
	window.post=post;
	window.get=get;

})()

