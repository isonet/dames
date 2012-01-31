var CTX_fields;
var CVS_fields;

var CTX_pieces;
var CVS_pieces;

var SelectedPiece = 0;

var width = 0;
var height = 0;

var drag = false;

var Fields = new Array(63);
var Pieces = new Array(24);

var loaded = false;

var CommandQ = new Array();

function InitPieces()
{
	var i = 0;
	for (i = 0; i <= 23;i++)
	{
		if ((i <= 3) || ((i >= 8) && (i <= 11)))
		{
			Pieces[i] = new Object();
			Pieces[i]["field"] = i*2;
			Pieces[i]["color"] = "rgb(0,0,150)";
		}
		if ((i >= 4) && (i <= 7))
		{
			Pieces[i] = new Object();
			Pieces[i]["field"] = (i*2)+1;
			Pieces[i]["color"] = "rgb(0,0,150)";
		}
		if ((i >= 12) && (i <= 15))
		{
			Pieces[i] = new Object();
			Pieces[i]["field"] = 39+((i-11)*2);
			Pieces[i]["color"] = "rgb(150,0,0)";
		}
		if ((i >= 16) && (i <= 19))
		{
			Pieces[i] = new Object();
			Pieces[i]["field"] = (37+((i-11)*2))+1;
			Pieces[i]["color"] = "rgb(150,0,0)";
		}
		if ((i >=20) && (i <= 23))
		{
			Pieces[i] = new Object();
			Pieces[i]["field"] = (39+((i-11)*2));
			Pieces[i]["color"] = "rgb(150,0,0)";
		}
	}
}

function init() {
	
	//Hide Scrollbars
	document.body.style.overflow='hidden';
	
	InitPieces();
	
	
	AdaptSize();
	
	CVS_fields = document.getElementById("CVS_fields");
	
	if (CVS_fields.getContext)
	{
		CTX_fields = CVS_fields.getContext("2d");
		
		CTX_fields.canvas.width = width;
		CTX_fields.canvas.height = height;
		
		DrawFields()		
	}
	
	CVS_pieces = document.getElementById("CVS_pieces");
	
	if (CVS_pieces.getContext)
	{
		CTX_pieces = CVS_pieces.getContext("2d");
		
		CTX_pieces.canvas.width = width;
		CTX_pieces.canvas.height = height;
		
		DrawPieces()		
	}
	
	
	
	CVS_fields.style.width = width;
	CVS_fields.style.height = height;
	CVS_pieces.style.width = width;
	CVS_pieces.style.height = height;
	
	CTX_pieces.canvas.onmousedown = myDown; 
	CTX_pieces.canvas.onmouseup = myUp; 
	CTX_pieces.canvas.onmousemove = myMove;
	
	document.addEventListener("touchstart", touchHandler, true);
	document.addEventListener("touchmove", touchHandler, true);
	document.addEventListener("touchend", touchHandler, true);
	document.addEventListener("touchcancel", touchHandler, true);
   
	var j = 0;
	for (j = 0; j <= 23;j++)
	{
		Fields[Pieces[j]["field"]]["piece"]=j;
	}
	
	loaded=true;
	return setInterval(Update, 10); 
}

window.onresize = function(event)
{
	if (loaded)
	{
		Update();
	}
}

function AdaptSize()
{
	if (window.innerWidth < window.innerHeight)
	{
		width=window.innerWidth;
		height=window.innerWidth;
	}
	if (window.innerWidth > window.innerHeight)
	{
		width=window.innerHeight;
		height=window.innerHeight;
	}
	if (window.innerWidth == window.innerHeight)
	{
		width=window.innerWidth;
		height=window.innerHeight;
	}


}

function InitFields()
{
	var i = 0;
	for (i = 0; i <= 63;i++)
	{
		CTX_fields.fillStyle = Fields[i]["color"];
		CTX_fields.fillRect (Fields[i]["x"],Fields[i]["y"],Fields[i]["width"],Fields[i]["height"]);
	}		
}

function Update()
{

	if (CommandQ[0]=="MoveEnd")
	{
		MoveEnd();
	}

	if (CommandQ[0]=="MoveStart")
	{
		MoveStart()
	}
	
	CommandQ.shift();
	
	AdaptSize();
	
	CTX_fields.canvas.width  = width;
	CTX_fields.canvas.height = height;		
	CTX_pieces.canvas.width  = width;
	CTX_pieces.canvas.height = height;
	
	InitFields();
	
	DrawPieces();		
	
	CVS_fields.style.width=width;
	CVS_fields.style.height=height;
	CVS_pieces.style.width=width;
	CVS_pieces.style.height=height;
	
}

function MoveEnd()
{
	var i = 0;
	for (i = 0; i <= 63;i++)
	{
		if (((MouseX >= Fields[i]["x"]) && ((MouseX <= (Fields[i]["x"]+Fields[i]["width"])))) &&
			((MouseY >= Fields[i]["y"]) && ((MouseY <= (Fields[i]["y"]+Fields[i]["height"])))))
		{
			Pieces[SelectedPiece]["field"] = i;
			Fields[i]["piece"] = SelectedPiece;
			DrawPieces();
		}
		else
		{
			//alert("Nothing selected!");
			//break;
		}
	}
}

function MoveStart()
{
	var i = 0;
	for (i = 0; i <= 63;i++)
	{
		if (((MouseX >= Fields[i]["x"]) && ((MouseX <= (Fields[i]["x"]+Fields[i]["width"])))) &&
			((MouseY >= Fields[i]["y"]) && ((MouseY <= (Fields[i]["y"]+Fields[i]["height"])))))
		{
			SelectedPiece = Fields[i]["piece"];
		}
		else
		{
			//alert("Nothing selected!");
			//break;
		}
	}
}

function myMove(e)
{ 
	MouseX = e.pageX - CTX_pieces.canvas.offsetLeft; 
	MouseY = e.pageY - CTX_pieces.canvas.offsetTop; 
	if (drag)
	{
		CommandQ.push("MoveEnd");
	}
} 

function myDown(e)
{ 
	MouseX = e.pageX - CTX_pieces.canvas.offsetLeft; 
	MouseY = e.pageY - CTX_pieces.canvas.offsetTop; 
	
	
	CommandQ.push("MoveStart");
	drag = true;
	
} 

function myUp()
{ 
	CommandQ.push("MoveEnd");
	drag = false;
} 

function DrawPieces()
{
	
	CTX_pieces.clearRect ( 0 , 0 , width , height );
	var i = 0;
	
	for (i = 0; i <= 23;i++)
	{
		var field = Pieces[i]["field"]
		drawEllipse(CTX_pieces,Fields[field]["x"]+(Fields[field]["width"]/2),Fields[field]["y"]+(Fields[field]["height"]/2),Fields[field]["width"]/1.2,Fields[field]["height"]/1.2,Pieces[i]["color"]);
	}
	
}

function DrawFields()
{
	var x = 0;
	var y = 0;
	var count = 0;

	for (y = 0; y <= 7; y++)
	{
		for (x = 0; x<= 7; x++)
		{
			var tmpC = "";
			if (((x%2)==0) && ((y%2)!=0)){tmpC = "rgb(0,0,0)"}
			if (((x%2)!=0) && ((y%2)==0)){tmpC = "rgb(0,0,0)";}
			if (((x%2)==0) && ((y%2)==0)){tmpC = "rgb(255,255,255)";}
			if (((x%2)!=0) && ((y%2)!=0)){tmpC = "rgb(255,255,255)";}

			// ARRAY ERSTELLEN
			Fields[count] = new Object();
			Fields[count]["x"] = x*(CTX_fields.canvas.width * 0.125);
			Fields[count]["y"] = y*(CTX_fields.canvas.height * 0.125);
			Fields[count]["width"] = (CTX_fields.canvas.width * 0.125);
			Fields[count]["height"] = (CTX_fields.canvas.height * 0.125);
			Fields[count]["color"] = tmpC;
			Fields[count]["piece"] = -1;
			count++;
			//
		}
	}
	
	var i = 0;
	for (i = 0; i <= 63;i++)
	{
		CTX_fields.fillStyle = Fields[i]["color"];
		CTX_fields.fillRect (Fields[i]["x"],Fields[i]["y"],Fields[i]["width"],Fields[i]["height"]);
	}
	
}

function drawEllipse(CTX_tmp,centerX, centerY, width, height,color) {
	
  CTX_tmp.beginPath();
  
  CTX_tmp.moveTo(centerX, centerY - height/2); // A1
  
  CTX_tmp.bezierCurveTo(
    centerX + width/2, centerY - height/2, // C1
    centerX + width/2, centerY + height/2, // C2
    centerX, centerY + height/2); // A2

  CTX_tmp.bezierCurveTo(
    centerX - width/2, centerY + height/2, // C3
    centerX - width/2, centerY - height/2, // C4
    centerX, centerY - height/2); // A1
 
  CTX_tmp.fillStyle = color;
  CTX_tmp.fill();
  CTX_tmp.closePath();	
}



function touchHandler(event)
{
	var touches = event.changedTouches,
    first = touches[0],
    type = "";

    switch(event.type)
	{
		case "touchstart": type = "mousedown"; break;
		case "touchmove":  type="mousemove"; break;        
		case "touchend":   type="mouseup"; break;
		case "touchcancel":type="mouseup"; break;
		default: return;
	}
	
	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, window, 1,
								  first.screenX, first.screenY,
								  first.clientX, first.clientY, false,
								  false, false, false, 0/*left*/, null);

	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}




function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7;i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}





