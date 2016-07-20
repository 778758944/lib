'use strict';

/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-04-16 09:45:19
 * @version $Id$
 */

(function (window) {
	var isFormData = window.FormData ? true : false,
	    isPromise = window.Promise ? true : false,
	    isXMLHttpRequest = window.XMLHttpRequest ? true : false,
	    xhr;

	function getForm(id) {
		// alert('组装formdata')
		var form = document.getElementById(id),
		    len = form.length,
		    data = '';

		for (var i = 0; i < len; i++) {
			var ele = form[i],
			    type = ele.type,
			    value = ele.value,
			    name = ele.name;

			switch (type) {
				case 'radio':
					if (ele.checked) {
						data += name + '=' + value + '&';
					}
					break;

				case 'file' || 'submit':
					break;

				case 'checkbox':
					break;

				default:
					data += name + '=' + value + '&';
			}
		}
		return data.substring(0, data.length - 1);
	}

	function serialize(data, multi) {
		var form = '';
		if (multi) {

			if (!isFormData) {
				throw new Error('not support formdata');
			}
			form = new FormData(document.getElementById(data));

			return form;
		}

		if (!multi) {
			if (data && data instanceof Object) {
				for (i in data) {
					console.log(i);
					if (data.hasOwnProperty(i)) {
						form += i + '=' + data[i] + '&';
					}
				}
				return form.substring(0, form.length - 1);
			} else if (data) {
				return getForm(data);
			} else {
				return null;
			}
		}
	}

	function ajax(conf) {
		var obj = {
			method: "GET",
			responseType: "text",
			progress: null,
			abort: null,
			loadend: null,
			data: null,
			success: null,
			failuer: null,
			url: '',
			multi: false
		};

		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (conf[prop]) {
					obj[prop] = conf[prop];
				}
			}
		}

		console.log(obj);

		if (!obj.url) {
			throw new Error('no url');
			return;
		}

		if (isXMLHttpRequest) {
			if (isPromise) {
				var p = new Promise(function (resolve, reject) {
					var xhr = new XMLHttpRequest();
					xhr.open(obj.method, obj.url, true);
					xhr.responseType = obj.responseType;
					if (!obj.multi) {
						xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					}
					xhr.onload = function () {
						resolve(xhr.response);
					};
					xhr.onerror = function (e) {
						reject(e);
					};
					xhr.onprogress = obj.progress;
					xhr.onabort = obj.abort;
					xhr.onloadend = obj.loadend;
					xhr.send(serialize(obj.data, obj.multi));
				});

				if (obj.success) {
					return p.then(obj.success, obj.failuer);
				} else {
					return p;
				}
			} else {
				// alert("xmlhttp");
				xhr = new XMLHttpRequest();
			}
		} else {
			// alert('Active')
			xhr = new ActiveXObject("MSXML2.XMLHTTP");
		}
		// alert("no promise");

		xhr.open(obj.method, obj.url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if (obj.success && window.JSON) {
					// alert("kk")
					obj.success(JSON.parse(xhr.responseText));
				} else if (obj.success) {
					var str = xhr.responseText.substring(1, xhr.responseText.length - 1);
					var arr = str.split(',');
					var len = arr.length;
					var res_data = {};
					for (var i = 0; i < len; i++) {
						var tem_arr = arr[i].split(':');
						var value = tem_arr[1].replace(/"/g, '');
						value = unescape(value.replace(/\\/g, '%'));
						res_data[tem_arr[0].replace(/"/g, '')] = value;
					}
					obj.success(res_data);
				}
			}
		};
		if (!obj.multi) {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		xhr.send(serialize(obj.data));
	}

	function get(url, fn) {
		var conf = { url: url, responseType: "text" };
		if (fn) {
			conf.success = fn;
		}
		var p = ajax(conf);
		return p;
	}

	function post(url, data, fn) {
		var conf = { url: url, data: data, responseType: "json", method: "POST" };
		if (fn) {
			conf.success = fn;
		}
		var p = ajax(conf);
		return p;
	}

	window.ajax = ajax;
	window.post = post;
	window.get = get;
})(window);

