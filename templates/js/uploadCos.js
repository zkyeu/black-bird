define("uploadCos",["cosjs"],function(e,n,t){e("cosjs");var r=new function(){var e=this;e.getSign=function(e){$.ajax({url:"/AdminContact/getCosSign",dataType:"json",success:function(n){e(n)}})},e.randomStr=function(e){var e=e||32,n="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",t=n.length,r=[];for(i=0;i<e;i++)r.push(n.charAt(Math.floor(Math.random()*t)));return r.join("")},e.getSuffix=function(e){var n=e.lastIndexOf(".");return n>-1?e.substring(n+1):void 0},e.getRandomName=function(n){return e.randomStr(20)+"."+e.getSuffix(n)},e.cos=new CosCloud({appid:"1253383298",bucket:"blackbird",region:"tj",getAppSign:function(n){e.getSign(function(e){n(e.sign)})},getAppSignOnce:function(n){e.getSign(function(e){n(e.sign)})}}),e.init=function(n){var t={selector:"input[type=file]",myFolder:"",bucket:"blackbird",fileLimitType:[],fileLimitSize:5120,error:function(){},errorCallBack:function(e){alert(e.responseJSON.message)},successCallBack:function(){console.log(arguments)},progressCallBack:function(){console.log(arguments)}},r=$.extend(!0,{},t,n),i=$(r.selector);if(i.get(0)){var o=function(){i.val(""),r.progress()&&(r.progress().style.width="0%")},a=function(){"function"==typeof r.errorCallBack&&r.errorCallBack.apply(null,arguments),o()},l=function(e){r.progress()&&(r.progress().style.width=100*e+"%"),"function"==typeof r.progressCallBack&&r.progressCallBack.apply(null,arguments)};i.on("change",function(n){var t=n.target.files[0];if(t){var i=t.name,c=e.getSuffix(i);if(-1==r.fileLimitType.indexOf(c))return r.error({errorCode:-1});var s=Math.ceil(t.size/1024);if(s>r.fileLimitSize)return r.error({errorCode:-2});"function"==typeof r.startCallBack&&r.startCallBack(),e.cos.uploadFile(function(){"function"==typeof r.successCallBack&&r.successCallBack.call(null,{fileUpdate:arguments[0],fileInfo:{fileName:i,fileSize:s}}),o()},a,l,r.bucket,r.myFolder+e.getRandomName(i),t,0)}})}}};t.exports=r});