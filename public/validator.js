/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-07-03 12:17:48
 * @version $Id$
 */
var Config=function(name,type){
	this.ipt=typeof(name)=="Object"? name:document.getElementsByName(name)[0];
	this.type=type;
	if(this.ipt.value){
		this.result=true;
	}else{
		this.result=false;
	}
}


var Validator=function(config,form,noRightAction,already){
	this.config=config;
	this.result_ok;
	this.result=[];
	this.already=already;
	this.noRightAction=noRightAction||false;
	this.form=typeof(form)=="Object"? form:document.getElementById(form);
	// console.log(this.config);
	var that=this;
	for(var i=0;i<this.config.length;i++){
		this.config[i].ipt.addEventListener("blur",function(e){
			that.validate(e);
		},false);
	}

	this.form.addEventListener("submit",function(e){
		var aa=true;
		// alert("jaja");
		for(var j=0;j<that.config.length;j++){
			console.log(that.config[j].result);
			if(!that.config[j].result){
				that.wwaction(that.config[j].ipt);
				aa=false;
				e.preventDefault();
			}
		}
		// console.log(aa);
	},false);
}

Validator.prototype={
	//onblur
	validate:function(e){
		var ele=e.target;
		var name=ele.name;
		// console.log(that.config);
		for(var i=0;i<this.config.length;i++){
			if(this.config[i].ipt.name==name){
				this.result_ok=Validator.types[this.config[i].type](ele.value,this.already);
				if(!this.result_ok.isTrue){
					this.waction(ele,this.result_ok);
				}else if(this.noRightAction){
					this.raction(ele,ele.result_ok);
				}
				this.config[i].result=this.result_ok.isTrue;
			}
		} 
	},

	waction:function(ele,data){
		var animate="animated shake";
		var animatend="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
		$(ele).css("border","1px solid red");
		if($(".err")){
			$(ele).parent().children(".err").remove();
		}
		var p=$("<p></p>").attr("class","err").text(data.info);
		$(ele).parent().append(p);
		$(ele).addClass(animate).one(animatend,function(){
			$(this).removeClass(animate);
		})
	},

	raction:function(ele){
		$(ele).parent().children(".err").remove();
		$(ele).css("borderColor","#ccc");
	},

	wwaction:function(ele){
		$(ele).css("border","1px solid red");
	}
}

Validator.types=(function(){
	var isEmpty=function(val,data){
		if(!val){
			return {
				isTrue:false,
				info:"该选项不能为空"
			}
		}
		else{
			return {
				isTrue:true
			};
		}
	}

	var tel=function(val){
		var reg=/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		var num=parseInt(val,10);
		if(!reg.test(val)){
			return {
				isTrue:false,
				info:"请输入正确的电话号码"
			}
		}
		else{
			return {
				isTrue:true
			}
		}
	}

	var isNumber=function(val){
		if(!val){
			return {
				isTrue:false,
				info:"请输入数字"
			}
		}
		if(!isNaN(val)){
			return {
				isTrue:true
			}
		}
		else{
			return {
				isTrue:false,
				info:"请输入数字"
			}
		}
	};

	var isRepeat=function(val,data){
		if(!val){
			return {
				isTrue:false,
				info:"该选项不能为空"
			}
		}
		var len=data.length;
		for(var i=0;i<data.length;i++){
			if(val==data[i]){
				return {
					isTrue:false,
					info:"该选项不能重复"
				}
			}
		}
		return{
			isTrue:true
		}
	}

	return {
		isEmpty:isEmpty,
		isTel:tel,
		isNumber:isNumber,
		isRepeat:isRepeat
	}
}());





























