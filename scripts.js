/* event based javascript routines*/
/* - Required dependancies: common.js 			 */
/*----------------------------------------------*/

/* Capture mouse movement and set MouseX and MouseY to its x,y corordinates */
var MouseX=0;
var MouseY=0;
var cursor = {x:0, y:0};
if(document.addEventListener){
	/* Firefox model */
	document.addEventListener("mousedown",mouseMove,false);
    document.addEventListener("mouseup",mouseMove,false);
    document.addEventListener("mousemove",mouseMove,false);
	}
else if(document.attachEvent){
	/* IE model */
	document.attachEvent("onmousedown",mouseMove);
    document.attachEvent("onmouseup",mouseMove);
    document.attachEvent("onmousemove",mouseMove);
	}
else if(document.captureEvents){
	document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
	}
else if(document.onmousemove){
	document.onmousemove = mouseMove;
	}
function mouseMove(e) {
	if (!e) var e = window.event;
	if (e.pageX || e.pageY){
		cursor.x = e.pageX;
		cursor.y = e.pageY;
		}
	else if (e.clientX || e.clientY){
		if(document.body){
			if(document.documentElement){
				cursor.x = e.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
				cursor.y = e.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
				}
			}
		}
	/* set MouseX and MouseY for backward compatibility*/
	MouseY=cursor.y;
    MouseX=cursor.x;
    //window.status=MouseX+','+MouseY;
	}
var d=document;
var ns = (navigator.appName.indexOf("Netscape") != -1);
var agt=navigator.userAgent.toLowerCase();
var isFirefox=(agt.indexOf('firefox')!=-1);
var isIE=(agt.indexOf('msie')!=-1);
var isNetscape=(agt.indexOf('netscape')!=-1);
/* Define document.getElementById for Internet Explorer 4 */
if (typeof(document.getElementById) == "undefined")
	document.getElementById = function (id)
	{
		// Just return the corresponding index of all.
		return document.all[id];
	}
function linkMouseOver(id){
	var obj=getObject(id);
	showOnScreen(id);
	return true;
	}
function linkMouseOut(id){
	var obj=getObject(id);
	if(obj.style.display=='none'){return true;}
	var show=obj.getAttribute('show');
	if(undefined != show && show==1){return true;}
	obj.style.display='none';
	return true;
	}
function linkClick(id){
	var obj=getObject(id);
	var dragobj=getObject(id+'_drag');
	var noteobj=getObject(id+'_note');
	obj.setAttribute('show',1);
	obj.style.display='block';
	dragobj.style.display='inline';
	setText(noteobj,'<strong>Click "Drag Cross Arrow" Icon To Move Window</strong>.');
	Drag.init(dragobj,obj);
	return false;
	}
function linkHide(id){
	var obj=getObject(id);
	if(obj.style.display=='none'){return false;}
	obj.setAttribute('show',0);
	obj.style.display='none';
	return false;
	}
function linkScriptures(obj,lang){
	if(undefined ==lang){lang='en';}
	obj=getObject(obj);
	linkScripturesTxt=getText(obj);
	//handle em dash and en dash
	var intIndexOfMatch = linkScripturesTxt.indexOf("\u2013");
	while (intIndexOfMatch != -1){
		linkScripturesTxt=linkScripturesTxt.replace("\u2013",'-');
		intIndexOfMatch = linkScripturesTxt.indexOf("\u2013");
		}
	var intIndexOfMatch = linkScripturesTxt.indexOf("\u8212");
	while (intIndexOfMatch != -1){
		linkScripturesTxt=linkScripturesTxt.replace("\u8212",'-');
		intIndexOfMatch = linkScripturesTxt.indexOf("\u8212");
		}

	var scriptureBooks=new Array(
		'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Solomon\'s Song','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation','1 Nephi','2 Nephi','Jacob','Enos','Jarom','Omni','Words of Mormon','Mosiah','Alma','Helaman','3 Nephi','4 Nephi','Mormon','Ether','Moroni','Doctrine and Covenants','Moses','Abraham','Joseph Smith--Matthew','Joseph Smith--History','Articles of Faith',
		'Gen.','Ex.','Lev.','Num.','Deut.','Josh.','Judg.','Ruth','1 Sam.','2 Sam.','1 Kgs.','2 Kgs.','1 Chr.','2 Chr.','Ezra','Neh.','Esth.','Job','Ps.','Prov.','Eccl.','Song.','Isa.','Jer.','Lam.','Ezek.','Dan.','Hosea','Joel','Amos','Obad.','Jonah','Micah','Nahum','Hab.','Zeph.','Hag.','Zech.','Mal.','Matt.','Mark','Luke','John','Acts','Rom.','1 Cor.','2 Cor.','Gal.','Eph.','Philip.','Col.','1 Thes.','2 Thes.','1 Tim.','2 Tim.','Titus','Philem.','Heb.','James','1 Pet.','2 Pet.','1 Jn.','2 Jn.','3 Jn.','Jude','Rev.','1 Ne.','2 Ne.','Jacob','Enos','Jarom','Omni','W of M','Mosiah','Alma','Hel.','3 Ne.','4 Ne.','Morm.','Ether','Moro.','D&C','D&amp;C','Moses','Abr.','JS-M','JS-H','A of F',
		'gen','ex','lev','num','deut','josh','judg','ruth','1_sam','2_sam','1_kgs','2_kgs','1_chr','2_chr','ezra','neh','esth','job','ps','prov','eccl','song','isa','jer','lam','ezek','dan','hosea','joel','amos','obad','jonah','micah','nahum','hab','zeph','hag','zech','mal','matt','mark','luke','john','acts','rom','1_cor','2_cor','gal','eph','philip','col','1_thes','2_thes','1_tim','2_tim','titus','philem','heb','james','1_pet','2_pet','1_jn','2_jn','3_jn','jude','rev','1_ne','2_ne','jacob','enos','jarom','omni','w_of_m','mosiah','alma','hel','3_ne','4_ne','morm','ether','moro','dc','moses','abr','js_m','js_h','a_of_f'
		);
	var found=new Array();
	var references=new Array();
	for(s=0;s<scriptureBooks.length;s++){
		var book=scriptureBooks[s];
		var regmatch= new RegExp(book+'\ [0-9]+\\:[0-9\\:\\-\\,\\s]+',"ig");
		var matches = linkScripturesTxt.match(regmatch);
		for (i in matches) {
			if(i=='input' || i=='index' || i=='lastIndex'){continue;}
			references[references.length++] = matches[i];
			}
		regmatch= new RegExp(book+'\ [0-9]+',"ig");
		matches = linkScripturesTxt.match(regmatch);
		for (i in matches) {
			if(i=='input' || i=='index' || i=='lastIndex'){continue;}
			references[references.length++] = matches[i];
			}
		}
	references.sort(compareStringLengths);
	references.reverse();
	for(i=0;i<references.length;i++){
		var ref=encodeBase64(references[i]);
		if(undefined != found[ref]){continue;}
		found[ref]=1;
		var title=references[i];
		title=title.replace('&amp;','&');
		title=asciiEncode(title);
		title=title.replace(':','&#58;');

		var link='<a style="color:#000;text-decoration:underline;" title="Click to view reference popup" href="#" onClick="return showScripture(\''+ref+'\',\''+lang+'\');">'+title+'</a>';
		var re=new RegExp(references[i],"gi");
		linkScripturesTxt=linkScripturesTxt.replace(re,link);
		continue;

		//alert(matches[i]+"\n"+link);
		//return;
		linkScripturesTxt=linkScripturesTxt.replace(references[i],link);
		// Loop over the string value replacing out each matching substring.
		var intIndexOfMatch = linkScripturesTxt.indexOf(references[i]);
		while (intIndexOfMatch != -1){
			linkScripturesTxt=linkScripturesTxt.replace(references[i],link);
			intIndexOfMatch = linkScripturesTxt.indexOf(references[i]);
			}
		}
	setText(obj,linkScripturesTxt);
	}
var base64Str;
var base64Count;
var base64Chars = new Array(
    'A','B','C','D','E','F','G','H',
    'I','J','K','L','M','N','O','P',
    'Q','R','S','T','U','V','W','X',
    'Y','Z','a','b','c','d','e','f',
    'g','h','i','j','k','l','m','n',
    'o','p','q','r','s','t','u','v',
    'w','x','y','z','0','1','2','3',
    '4','5','6','7','8','9','+','/'
	);

function setBase64Str(str){
    base64Str = str;
    base64Count = 0;
	}
function readBase64(){    
    if (!base64Str) return -1;
    if (base64Count >= base64Str.length) return -1;
    var c = base64Str.charCodeAt(base64Count) & 0xff;
    base64Count++;
    return c;
	}
function encodeBase64(str){
    setBase64Str(str);
    var result = '';
    var inBuffer = new Array(3);
    var lineCount = 0;
    var done = false;
    while (!done && (inBuffer[0] = readBase64()) != -1){
        inBuffer[1] = readBase64();
        inBuffer[2] = readBase64();
        result += (base64Chars[ inBuffer[0] >> 2 ]);
        if (inBuffer[1] != -1){
            result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30) | (inBuffer[1] >> 4) ]);
            if (inBuffer[2] != -1){
                result += (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6) ]);
                result += (base64Chars [inBuffer[2] & 0x3F]);
            } else {
                result += (base64Chars [((inBuffer[1] << 2) & 0x3c)]);
                result += ('=');
                done = true;
            }
        } else {
            result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30)]);
            result += ('=');
            result += ('=');
            done = true;
        }
        lineCount += 4;
        if (lineCount >= 76){
            result += ('\n');
            lineCount = 0;
        }
    }
    return result;
}

function asciiEncode(str){
	var outstr='';
	for(var i=0;i<str.length;i++){
		var code=str.charCodeAt(i);
		if((code > 64 && code < 91) || (code > 96 && code < 123)){
			var ascii='&#'+code+';';
			outstr += ascii;
			}
		else{outstr += str[i];}
    	}
    return outstr;
	}
function compareStringLengths(a,b){
  	if(a.length < b.length){return -1;}
  	if (a.length > b.length){return 1;}
  	return 0; // a and b are the same length
	}

function showScripture(ref,lang){
	//set language: options are en,es,it,de
	//Note: currently only the bible is offered in other languages
	if(undefined ==lang){lang='en';}
	iframePopup('http://stage.dearscriptures.com/mouseover?lang='+lang+'&encref='+ref+'',{id:'scripturepopup',noborder:1,notop:1,nobot:1,iwidth:320,iheight:260,iscrolling:'off',screen:1,fade:1,x:'-25',y:'-20'});
	return false;
    }
function showWPScripture(ref,lang){
	//set language: options are en,es,it,de
	//Note: currently only the bible is offered in other languages
	if(undefined ==lang){lang='en';}
	iframePopup('http://stage.dearscriptures.com/mouseover?lang='+lang+'&enc2ref='+ref+'',{id:'scripturepopup',noborder:1,notop:1,nobot:1,iwidth:320,iheight:260,iscrolling:'off',screen:1,fade:1,x:'-25',y:'-20'});
	return false;
    }
/* showHide */
function showHide(id){
	var cObj=getObject(id);
    if(undefined == cObj){return abort("undefined object passed to showHide:"+id);}
    if(cObj.style.display=='none'){
		cObj.style.display='block';
		showOnScreen(id);
		}
    else{cObj.style.display='none';}
	}
/* showHide */
function hideId(id){
	var cObj=getObject(id);
    if(undefined == cObj){return abort("undefined object passed to showHide:"+id);}
	cObj.style.display='none';
	}
//getObject - returns object
function getObject(obj){
	if(typeof(obj)=='object'){
		return obj;
    	}
    else if(typeof(obj)=='string'){
		if(undefined != document.getElementById(obj)){return document.getElementById(obj);}
		else if(undefined != document.getElementsByName(obj)){
			var els=document.getElementsByName(obj);
			if(els.length ==1){return els[0];}
			//else{return abort(els.length+" elements found in getObject for "+obj);}
        	}
		else if(undefined != document.all[obj]){return document.all[obj];}
		else{
			//alert('unable to getObject on string object '+obj);
			return null;
			}
    	}
    else{
		//alert('unable to getObject on object type '+typeof(obj)+' obj='+obj);
    	}
    return null;
	}
//getText - returns object text
function getText(obj){
	var cObj=getObject(obj);
	if(undefined == cObj){return '';}
	if(undefined != cObj.value){return cObj.value;}
    else if(undefined != cObj.innerHTML){return cObj.innerHTML;}
    else if(undefined != cObj.innerText){return cObj.innerText;}
    else{
		//alert('unable to getText on '+cObj);
    	}
    return '';
	}
//setText - returns object text
function setText(obj,txt){
	var cObj=getObject(obj);
    if(undefined == cObj){return null;}

    //alert(cObj+'\n'+txt);
    if(undefined != cObj.value){cObj.value=txt;}
    else if(undefined != cObj.innerHTML){cObj.innerHTML=txt;}
    else if(undefined != cObj.innerText){cObj.innerText=txt;}
    else{
		return null;
    	}
	}
// getWidth - width of object. defaults to window object
function getWidth(id){
	if(undefined == id){return document.body.clientWidth;}
	var idObj=getObject(id);
	if(undefined == idObj){return '?';}
	if(undefined != idObj.innerWidth){return idObj.innerWidth;}
	return idObj.offsetWidth;
	}
// getHeight - height of object. defaults to window object
function getHeight(id){
	if(undefined == id){return document.body.clientHeight;}
	var idObj=getObject(id);
	if(undefined == idObj){return null;}
	if(undefined != idObj.innerHeight){return idObj.innerHeight;}
	return idObj.offsetHeight;
	}
/* fadeOut - if remove ==1, the id will be destroyed after fading away */
function fadeId(eid,remove){
	var TimeToFade = 200.0;
  	var element=getObject(eid);
	if(undefined == element){return;}
	if(element.FadeState == null){
    	if(element.style.opacity == null || element.style.opacity == '' || element.style.opacity == '1'){
      		element.FadeState = 2;
    		}
		else{
      		element.FadeState = -2;
			}
  		}
   if(element.FadeState == 1 || element.FadeState == -1){
    	element.FadeState = element.FadeState == 1 ? -1 : 1;
    	element.FadeTimeLeft = TimeToFade - element.FadeTimeLeft;
  		}
	else{
    	element.FadeState = element.FadeState == 2 ? -1 : 1;
    	element.FadeTimeLeft = TimeToFade;
    	setTimeout("animateFade(" + new Date().getTime() + ",'" + eid + "','"+remove+"')", 33);
		}
	}
function animateFade(lastTick, eid, remove){
	var TimeToFade = 200.0;
	var curTick = new Date().getTime();
	var elapsedTicks = curTick - lastTick;
	var element=getObject(eid);
	if(undefined == element){return;}
	if(element.FadeTimeLeft <= elapsedTicks){
    	element.style.opacity = element.FadeState == 1 ? '1' : '0';
    	element.style.filter = 'alpha(opacity = ' + (element.FadeState == 1 ? '100' : '0') + ')';
    	element.FadeState = element.FadeState == 1 ? 2 : -2;
    	if(undefined != remove && remove==1){removeDiv(eid);}
    	return;
  		}
  	element.FadeTimeLeft -= elapsedTicks;
  	var newOpVal = element.FadeTimeLeft/TimeToFade;
  	if(element.FadeState == 1){newOpVal = 1 - newOpVal;}
	element.style.opacity = newOpVal;
	element.style.filter = 'alpha(opacity = ' + (newOpVal*100) + ')';
	setTimeout("animateFade(" + curTick + ",'" + eid + "','"+remove+"')", 33);
	}
function iframePopup(url,opts){
	var htm='';
	if(undefined == opts['iwidth']){opts['iwidth']=350;}
	if(undefined == opts['iheight']){opts['iheight']=200;}
	if(undefined == opts['iscrolling']){opts['iscrolling']='auto';}
	htm += '<iframe src="'+url+'" width="'+opts['iwidth']+'" height="'+opts['iheight']+'" frameborder="0" marginwidth="0" marginheight="0" scrolling="'+opts['iscrolling']+'" align="center">Your browser does not support iframes.</iframe>';
	popUpDiv(htm,opts);
	return false;
	}
/* popUpDiv */
function popUpDiv(content,param){
	/* set default opt values */
	var s="position:absolute;top:200px;left:200px;margin:5px;z-index:999;";
	var bs="padding:5px;border:1px solid #d6dee7;background:#FFF;";
	clearTimeout('popupdiv_timeout');
	if(undefined != param['width']){
		s+='width:'+param['width']+'px;';
		}
	if(undefined != param['height']){bs+='height:'+param['height']+'px;overflow:auto;';}
	var opt={
        id: 'w' + new Date().getTime(),
        style: s,
        title: "",
        closestyle:"cursor:pointer;",
        close: '<img src="/wfiles/x_red.gif" border="0">',
        bodystyle: bs,
        titleleft: 20,
        body: content
		}
	/* allow user to override default opt values */
	if(param){
		for (var key in opt){
			if(undefined != param[key]){opt[key]=param[key];}
			}
		/* add additonal user settings to opt Object */
		for (var key in param){
			if(undefined == opt[key]){opt[key]=param[key];}
			}
		}
	var masterdiv;
	if(undefined != document.getElementById(opt.id)){removeDiv(opt.id);}
	if(undefined != document.getElementById(opt.id)){
		masterdiv=document.getElementById(opt.id);
		//show if hidden
		var bodyid=opt.id+'_Body';
		masterdiv.style.display='block';
		if(undefined != document.getElementById(bodyid)){
			setText(bodyid,opt.body);
			}
		}
	else{
		masterdiv = document.createElement("div");
		masterdiv.setAttribute("id",opt['id']);
		masterdiv.style.zIndex='698';
		masterdiv.style.position='absolute';
		var t  = document.createElement("table");
		t.border=0;
		t.align="left";
		t.cellPadding=0;
		t.cellSpacing=0;
		if(undefined != opt['width']){
			t.style.width=opt['width']+'px';
			}
		//bgcolor
	    var bgcolor='#49495a';
	    if(opt.titlebgcolor){bgcolor=opt.titlebgcolor;}
	    //Table border
	    if(undefined == param['noborder']){
			t.style.border='1px solid '+bgcolor;
			}
		else{
			t.style.border='0px solid '+bgcolor;
        	}
		//body - begin
	    var tb = document.createElement("tbody");
	    if(undefined == param['notop']){
		    //title row - begin
		    var toprow = document.createElement("tr");
		    //titlecell
		    var titlecell = document.createElement("td");
		 	//title
		    titlecell.noWrap = true;
		    titlecell.align='right';
		    titlecell.style.fontFamily='arial';
		    titlecell.style.fontSize='11px';
			titlecell.style.backgroundColor=bgcolor;
			//color
			if(opt.titlecolor){
				titlecell.style.color=opt.titlecolor;
				}
			else{titlecell.style.color='#FFFFFF';}
			var titlediv = document.createElement("div");
		    var titletxt='<div id="'+opt['id']+'_Title'+'" style="float:left;margin-left:10px;margin-top:1px">'+opt['title']+'</div>';
		    //add close div
		    titletxt += '<a href="#" style="font-weight:bold;font-size:12px;font-family:arial;color:#e61d00;text-decoration:none;padding:0 3px 0 0;" onClick="fadeId(\''+opt['id']+'\',1);return false;">X</a>';
		    titlediv.innerHTML=titletxt;
		    titlecell.appendChild(titlediv);
		    toprow.appendChild(titlecell);
			tb.appendChild(toprow);
			}
		//top row - end
	
		//Body row - begin
	    var bodyrow = document.createElement("tr");
	    bodyrow.height='100%';
	    var bodycell = document.createElement("td");
	    bodycell.style.backgroundColor='#FFFFFF';
	    var bodydiv = document.createElement("div");
	    bodydiv.innerHTML='<div id="'+opt['id']+'_Body'+'">'+opt.body+'</div>';
	    bodycell.appendChild(bodydiv);
	    bodyrow.appendChild(bodycell);
		tb.appendChild(bodyrow);
		//body row - end
		if(undefined == param['nobot']){
			//bottom close row
		    var botrow = document.createElement("tr");
		    var botcell = document.createElement("td");
		    botcell.noWrap = true;
		    botcell.align='right';
		    botcell.style.fontFamily='arial';
		    botcell.style.fontSize='11px';
		    botcell.style.backgroundColor='#FFFFFF';
			var botdiv = document.createElement("div");
		    //add close div
		    var bottxt = '<a href="#" class="w_red w_bold w_link"" onClick="fadeId(\''+opt['id']+'\',1);return false;">Close</a>';
		    botdiv.innerHTML=bottxt;
		    botcell.appendChild(botdiv);
		    botrow.appendChild(botcell);
			tb.appendChild(botrow);
			}

		//allow body to be resized
		//addDragToTextarea(opt['id']+'_Body');

		//body -end
	    t.appendChild(tb);
	    
		masterdiv.style.display='block';
	    //append table to masterdiv
	    masterdiv.appendChild(t);
	    if(opt.drag && undefined == param['notop']){
			Drag.init(titlediv,masterdiv);
			titlediv.style.cursor='move';
	        }
	    //append to document body
	    document.body.appendChild(masterdiv);
    	}

    /* check for center option */
    if(opt.center){
		var xy=centerObject(masterdiv);
		var x=0;;
		var y=0;
		var cvalue=opt.center+'';
		if(cvalue.indexOf('x') != -1){
			//only center x - make y MouseY
			x=xy[0];
        	}
        else if(cvalue.indexOf('y') != -1){
			//only center y - make x MouseX
			y=xy[1];
        	}
        else{
			x=xy[0];
			y=xy[1];
        	}
        //check for x and y
		if(undefined != opt.x){
			//if x begins with a + or -, then add it
			xvalue=opt.x+'';
			if(xvalue.indexOf('+') != -1){x=Math.round(MouseX+parseInt(xvalue));}
			else if(xvalue.indexOf('-') != -1){x=Math.round(MouseX-Math.abs(parseInt(xvalue)));}
			else{x=Math.round(opt.x);}
			}
		if(undefined != opt.y){
			//if y begins with a + or -, then add it
			yvalue=opt.y+'';
			if(yvalue.indexOf('+') != -1){y=Math.round(MouseY+parseInt(yvalue));}
			else if(yvalue.indexOf('-') != -1){y=Math.round(MouseY-Math.abs(parseInt(yvalue)));}
			else{y=Math.round(opt.y);}
			}
		masterdiv.style.position='absolute';
		masterdiv.style.left=x+"px";
		masterdiv.style.top=y+"px";
		}
    /* check for center option */
    else if(opt.screen){
		var xy=showOnScreen(masterdiv);
		var x=0;;
		var y=0;
		var cvalue=opt.screen+'';
		if(cvalue.indexOf('x') != -1){
			//only center x - make y MouseY
			x=xy[0];
        	}
        else if(cvalue.indexOf('y') != -1){
			//only center y - make x MouseX
			y=xy[1];
        	}
        else{
			x=xy[0];
			y=xy[1];
        	}
        //check for x and y
		if(undefined != opt.x){
			//if x begins with a + or -, then add it
			xvalue=opt.x+'';
			if(xvalue.indexOf('+') != -1){x=x+Math.abs(parseInt(xvalue));}
			else if(xvalue.indexOf('-') != -1){x=x-Math.abs(parseInt(xvalue));}
			else{x=x+Math.round(opt.x);}
			}
		if(undefined != opt.y){
			//if y begins with a + or -, then add it
			yvalue=opt.y+'';
			if(yvalue.indexOf('+') != -1){y=y+Math.abs(parseInt(yvalue));}
			else if(yvalue.indexOf('-') != -1){y=y-Math.abs(parseInt(yvalue));}
			else{y=y+Math.round(opt.y);}
			}
		masterdiv.style.left=x+"px";
		masterdiv.style.top=y+"px";
		}
    else if(opt.mouse){
        var x=0;
		var y=0;
		var cvalue=opt.mouse+'';
		if(cvalue.indexOf('x') != -1){
			//only center x - make y MouseY
			x=MouseX;
        	}
        else if(cvalue.indexOf('y') != -1){
			//only center y - make x MouseX
			y=MouseY;
        	}
		//check for x and y
		if(undefined != opt.x){
			//if x begins with a + or -, then add it
			xvalue=opt.x+'';
			if(xvalue.indexOf('+') != -1){x=Math.round(MouseX+parseInt(xvalue));}
			else if(xvalue.indexOf('-') != -1){x=Math.round(MouseX-Math.abs(parseInt(xvalue)));}
			else{x=MouseX;}
			}
		if(undefined != opt.y){
			//if y begins with a + or -, then add it
			yvalue=opt.y+'';
			if(yvalue.indexOf('+') != -1){y=Math.round(MouseY+parseInt(yvalue));}
			else if(yvalue.indexOf('-') != -1){y=Math.round(MouseY-Math.abs(parseInt(yvalue)));}
			else{y=MouseY;}
			}
		window.status=x+','+y;
    	masterdiv.style.top=y+"px";
    	masterdiv.style.left=x+"px";
    	}
    else{
		if(undefined != opt.x){masterdiv.style.left=opt.x+"px";}
		if(undefined != opt.y){masterdiv.style.top=opt.y+"px";}
    	}
    if(opt.timeout){
		var t=Math.round(opt.timeout*1000);
		//remove the div if mouse is not in the div, otherwise until after they have moved mouse out and timeout has expired.
		popupdiv_timeout=setTimeout("removeDivOnExit('"+opt.id+"','"+opt.fade+"')",t);
    	}
    else if(opt.fade){
		masterdiv.onmouseout=function(e){
			if(undefined == e){e = fixE(e);}
			if(undefined != e){
				if(checkMouseLeave(this,e)){
					//alert('mouse left - 1');
					fadeId(this.id,1);
					}
				}
			//else{fadeId(this.id,1);}
			}
    	}
	}
function removeDiv(divid){
	return removeId(divid);
	}
function removeId(divid){
	setText(divid,'');
    if(isIE){document.getElementById(divid).removeNode(true);}
    else{
		var x=document.getElementById(divid);
		x.parentNode.removeChild(x);
    	}
    return;
	}
function removeDivOnExit(divid,fade){
	var obj=getObject(divid);
	if(undefined == obj){return;}
	if(!isMouseOver(divid)){
		//alert('mouse left - 2:'+divid);
		if(undefined != fade && fade==1){
			fadeId(divid,1);
			}
		else{removeDiv(divid);}
		return;
		}
	if(undefined != fade && fade==1){
		obj.onmouseout=function(e){
			if(undefined == e){e = fixE(e);}
			if(undefined != e){
				if(checkMouseLeave(this,e)){
					//alert('mouse left - 3');
					fadeId(this.id,1);
					}
				}
			//else{fadeId(this.id,1);}
			}
		}
	else{
		obj.onmouseout=function(e){
			if(undefined == e){e = fixE(e);}
			if(undefined != e){
				if(checkMouseLeave(this,e)){
					removeDiv(this.id);
					}
				}
			//else{removeDiv(this.id);}
			}
		}
	}
/* isMouseOver - return true the mouse if over this object*/
function isMouseOver(id){
	var exy = getXY(id);
	if(undefined == exy){return true;}
	var ewh = getWidthHeight(id);
	//alert(MouseX+','+MouseY);
	//showProperties(exy);
	//showProperties(ewh);
	if (MouseX >= exy[0] && MouseX <= exy[0]+ewh[0] && MouseY >= exy[1] && MouseY <= exy[1]+ewh[1]){return true;}
	return false;
	}
/* showOnScreen */
function showOnScreen(obj){
	var sObj=getObject(obj);
	if(undefined == sObj){return false;}
	if(sObj.style.display=='block'){return true;}
	//if the object is set to display:none it will have a 0 width and height - visibility lets us capture w and h
	sObj.style.position='absolute';
	sObj.style.visibility='hidden';
	sObj.style.display='block';
	//get object's width and height
	var w=getWidth(sObj);
	var h=getHeight(sObj);
	//get screen width and height
	var screen=getViewPort();
	var sw=getWidth();
	var sh=getHeight();
	//get cursor position
	var x=cursor.x;
	var y=cursor.y;
	/* set x */
	if(x+w+20 > sw){
		var z=x-w;
		while(z < 0){z++;}
		x = z;
		}
	/* set y */
	if(y+h+20 > sh){
		var z=y-h;
		while(z < 0){z++;}
		y = z;
		}
	//set object's new position
	sObj.style.left=x+'px';
  	sObj.style.top=y+'px';
  	sObj.style.visibility='visible';
  	return new Array(x,y);
   	}
/*setViewPort - Space within the browser window is known as the 'viewport' */
function getViewPort(){
	var viewport={};
	if (typeof window.innerWidth != 'undefined')
	 {
	      viewport.w = window.innerWidth,
	      viewport.h = window.innerHeight
	 }

	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

	 else if (typeof document.documentElement != 'undefined'
	     && typeof document.documentElement.clientWidth !=
	     'undefined' && document.documentElement.clientWidth != 0)
	 {
	       viewport.w = document.documentElement.clientWidth,
	       viewport.h = document.documentElement.clientHeight
	 }

	 // older versions of IE

	 else
	 {
	       viewport.w = document.getElementsByTagName('body')[0].clientWidth,
	       viewport.h = document.getElementsByTagName('body')[0].clientHeight
	 }
  return viewport;
  }
//CheckMouseEnter  - returns true if the mouse is over the element
function checkMouseEnter (element, evt) {
	   if (element.contains && evt.fromElement) {
	        return !element.contains(evt.fromElement);
		   }
	   else if (evt.relatedTarget) {
	   	   return !containsDOM(element, evt.relatedTarget);
		   }
	   }

// checkMouseLeave - returns true if the mouse is no longer over the element
function checkMouseLeave (element, evt) {
	   //window.status=evt;
	   //return; 
	   if (element.contains && undefined != evt.toElement) {
	        return !element.contains(evt.toElement);
		   }
	   else if (evt.relatedTarget) {
		   return !containsDOM(element, evt.relatedTarget);
		   }
	   }

//containsDOM - does container have containee
function containsDOM (container, containee) {
	   var isParent = false;
	   do {
	        if ((isParent = container == containee)){break;}
		   containee = containee.parentNode;
		   }
 	   while (containee != null);
	   return isParent;
	   }
function isOver(dragId,containerId){
	var dragPos=getPos(dragId);
	var dw=getWidth(dragId);
	var dx=dragPos.x+parseInt(dw/2);
	var contPos=getPos(containerId);
	var w=getWidth(containerId);
	var h=getHeight(containerId);
	var lft=contPos.x+w;
	var h=contPos.y+h;
	if(dx > contPos.x && dx < lft && dragPos.y > contPos.y && dragPos.y < h){return true;}
	return false;
	}
//Drag
var Drag = {

	obj : null,

	init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
	{
		o.onmousedown	= Drag.start;

		o.hmode			= bSwapHorzRef ? false : true ;
		o.vmode			= bSwapVertRef ? false : true ;

		o.root = oRoot && oRoot != null ? oRoot : o ;

		if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
		if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";
		if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
		if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

		o.minX	= typeof minX != 'undefined' ? minX : null;
		o.minY	= typeof minY != 'undefined' ? minY : null;
		o.maxX	= typeof maxX != 'undefined' ? maxX : null;
		o.maxY	= typeof maxY != 'undefined' ? maxY : null;

		o.xMapper = fXMapper ? fXMapper : null;
		o.yMapper = fYMapper ? fYMapper : null;

		o.root.onDragStart	= new Function();
		o.root.onDragEnd	= new Function();
		o.root.onDrag		= new Function();
	},

	start : function(e)
	{
		var o = Drag.obj = this;
		e = Drag.fixE(e);
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		o.root.onDragStart(x, y);

		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;

		if (o.hmode) {
			if (o.minX != null)	o.minMouseX	= e.clientX - x + o.minX;
			if (o.maxX != null)	o.maxMouseX	= o.minMouseX + o.maxX - o.minX;
		} else {
			if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
			if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
		}

		if (o.vmode) {
			if (o.minY != null)	o.minMouseY	= e.clientY - y + o.minY;
			if (o.maxY != null)	o.maxMouseY	= o.minMouseY + o.maxY - o.minY;
		} else {
			if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
			if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
		}

		document.onmousemove	= Drag.drag;
		document.onmouseup		= Drag.end;

		return false;
	},

	drag : function(e)
	{
		e = Drag.fixE(e);
		var o = Drag.obj;

		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		var nx, ny;

		if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
		if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
		if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
		if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

		nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
		ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

		if (o.xMapper)		nx = o.xMapper(y)
		else if (o.yMapper)	ny = o.yMapper(x)
		Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
		Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
		Drag.obj.lastMouseX	= ex;
		Drag.obj.lastMouseY	= ey;

		Drag.obj.root.onDrag(nx, ny);
		return false;
	},

	end : function()
	{
		document.onmousemove = null;
		document.onmouseup   = null;
		Drag.obj.root.onDragEnd(	parseInt(Drag.obj.root.style[Drag.obj.hmode ? "left" : "right"]), 
									parseInt(Drag.obj.root.style[Drag.obj.vmode ? "top" : "bottom"]));
		Drag.obj = null;
	},

	fixE : function(e)
	{
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
}