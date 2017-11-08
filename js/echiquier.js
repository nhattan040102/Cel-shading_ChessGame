//FIXME remove mx, my variables from global scope
var mx = 0;
var my = 0;

var white = {r:255, g:255, b:255};
var black = {r:100, g:100, b:100};
	
var Pwvft = {};
var Rwvft = {};
var Nwvft = {};
var Bwvft = {};
var Qwvft = {};
var Kwvft = {};
var TMPwvft = {};

var promotion= {from: 'a1', to:'a3', promo:'n'};
var selectedPiece = "none";
var hand = "w";
var chess = new Chess();
var view = 'auto';
var altPieces = {};
var altPieces = [];


var audiostart = new Audio('chesssound/start1.ogg');
var audiomove = new Audio('chesssound/move1.ogg');
var audiocapture = new Audio('chesssound/capture1.ogg');


function buildAltPieces (option)
{
	if ( view != 'mobile' ) 
	{
		Bwvft = $.extend(true, {}, loadWavefrontFromHTLM('#bishop', 'bishop'));
		Rwvft = $.extend(true, {}, loadWavefrontFromHTLM('#rook', 'rook'));
		Nwvft = $.extend(true, {}, loadWavefrontFromHTLM('#knight', 'knight'));
		Pwvft = $.extend(true, {}, loadWavefrontFromHTLM('#pawn', 'pawn'));
		Qwvft = $.extend(true, {}, loadWavefrontFromHTLM('#queen', 'queen'));
		Kwvft = $.extend(true, {}, loadWavefrontFromHTLM('#king', 'king'));
	}
	else
	{
		Bwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatBishop', 'bishop'));
		Rwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatRook', 'rook'));
		Nwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatKnight', 'knight'));
		Pwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatPawn', 'pawn'));
		Qwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatQueen', 'queen'));
		Kwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatKing', 'king'));
	}

	altPieces.splice (0,altPieces.length );
	var tmpWvft2 = {};
	for ( var v = 0 ; v < 8 ; v++ )
	{	
		for ( var u = 0 ; u < 8 ; u++ )
		{
			if (chess.get(XYToSquare(u, v)) != null )
			{
				if (chess.get(XYToSquare(u, v)).type == 'p' ) tmpWvft2 = $.extend(true, {}, Pwvft);
				if (chess.get(XYToSquare(u, v)).type == 'n' ) tmpWvft2 = $.extend(true, {}, Nwvft);
				if (chess.get(XYToSquare(u, v)).type == 'b' ) tmpWvft2 = $.extend(true, {}, Bwvft);
				if (chess.get(XYToSquare(u, v)).type == 'r' ) tmpWvft2 = $.extend(true, {}, Rwvft);
				if (chess.get(XYToSquare(u, v)).type == 'q' ) tmpWvft2 = $.extend(true, {}, Qwvft);
				if (chess.get(XYToSquare(u, v)).type == 'k' ) tmpWvft2 = $.extend(true, {}, Kwvft);
				altPiece = {id: altPieces.length, square: XYToSquare(u, v), x: u, y: v, flags: '', index: 0, color: chess.get(XYToSquare(u, v)).color, type: chess.get(XYToSquare(u, v)).type, w: {}};
				setWavefrontId(tmpWvft2, altPieces.length);
				if ( chess.get(XYToSquare(u, v)).color == 'w')
					switchMaterialWavefront (tmpWvft2, 'blancs');
				if ( chess.get(XYToSquare(u, v)).color == 'b')
					switchMaterialWavefront (tmpWvft2, 'noirs');
				if ( view == 'mobile' ) 
				{
				
					if ( chess.get(XYToSquare(u, v)).type == 'p' == 'pawn'   ) 
						translateWavefront (tmpWvft2, 0, -13, 20);
					else translateWavefront (tmpWvft2, 0, -13, 23)
				}
				else
				{
					if ( chess.get(XYToSquare(u, v)).color == 'w')
						rotateWavefront (tmpWvft2, 0, 180, 0);
				}
				
				putPieceWavefrontToSquare (tmpWvft2, XYToSquare(u, v), 0);
				altPiece.w = $.extend(true, {},tmpWvft2 );
				altPieces.push(altPiece);
			}
		}
	}
}
function Log(s)
{
	console.log(s);
}
function getTargetFromMove (a)
{
	if (a.includes('+') | a.includes('#')  )
		a = a.slice (0, a.length-1);
	if (a.includes('=R') | a.includes('=Q') | a.includes('=R') | a.includes('=B') | a.includes('=N')  )
		a = a.slice (0, a.length-2);	
	if ( a == 'O-O-O')
	{
		if (chess.turn() == 'w')
			a = "c1";
		else if (chess.turn() == 'b')
			a = "c8";
	}
	if ( a == 'O-O' )
	{
		if (chess.turn() == 'w')
			a = "g1";
		else if (chess.turn() == 'b')
			a = "g8";
	}
	while ( a.length > 2 ) a = a.slice (1, a.length);
	return a;
}

function XYToSquare (px, py)
{
	var hp0, hp1;
	if ( py == 7 ) hp0 = 'a';
	if ( py == 6 ) hp0 = 'b';
	if ( py == 5 ) hp0 = 'c';
	if ( py == 4 ) hp0 = 'd';
	if ( py == 3 ) hp0 = 'e';
	if ( py == 2 ) hp0 = 'f';
	if ( py == 1 ) hp0 = 'g';
	if ( py == 0 ) hp0 = 'h';
	if ( px == 0 ) hp1 = '1';
	if ( px == 1 ) hp1 = '2';
	if ( px == 2 ) hp1 = '3';
	if ( px == 3 ) hp1 = '4';
	if ( px == 4 ) hp1 = '5';
	if ( px == 5 ) hp1 = '6';
	if ( px == 6 ) hp1 = '7';
	if ( px == 7 ) hp1 = '8';
	var bp = hp0+hp1;
	return bp;
}
function SquareToXY (s)
{

	var hp0 = s.slice(0, 1);
	var hp1 = s.slice(1, 2);	
	var px, py;
	
	if ( hp0 == 'a' ) py = 7;
	if ( hp0 == 'b' ) py = 6;
	if ( hp0 == 'c' ) py = 5;
	if ( hp0 == 'd' ) py = 4;
	if ( hp0 == 'e' ) py = 3;
	if ( hp0 == 'f' ) py = 2;
	if ( hp0 == 'g' ) py = 1;
	if ( hp0 == 'h' ) py = 0;
	if ( hp1 == '1' ) px = 0;
	if ( hp1 == '2' ) px = 1;
	if ( hp1 == '3' ) px = 2;
	if ( hp1 == '4' ) px = 3;
	if ( hp1 == '5' ) px = 4;
	if ( hp1 == '6' ) px = 5;
	if ( hp1 == '7' ) px = 6;
	if ( hp1 == '8' ) px = 7;
	
	return {x:px, y:py};
}
function isPromotion(a)
{
	if (a.includes('=R') | a.includes('=Q') | a.includes('=R') | a.includes('=B') | a.includes('=N')  )
	return true;
	else return false;
}

function showWay(p)
{
	var moves = chess.moves({square: altPieces[p].square});
	
	way2.splice(0, way2.length);

	for (var i = 0 ; i < moves.length ; i++)
	{
		addToWayables(	SquareToXY (getTargetFromMove(moves[i])).x, 
				SquareToXY (getTargetFromMove(moves[i])).y, 0 );	
		var aWay = { square: getTargetFromMove(moves[i]), move: moves[i] };
		if (chess.get(aWay.square) != null )
		{
			for ( var j = 0 ; j < altPieces.length ; j++ )
			{
			if (altPieces[j].square == aWay.square)
			switchMaterialWavefront ( altPieces[j].w, "way way"+i);
			}
		}
		way2.push(aWay);
	}	
}
function createClass(name,rules){
	var style = document.createElement('style');
	style.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(style);
	if(!(style.sheet||{}).insertRule) 
		(style.styleSheet || style.sheet).addRule(name, rules);
	else
		style.sheet.insertRule(name+"{"+rules+"}",0);
}
function generateMaterialsCSS (name, difuse)
{

createClass('.'+name,'fill: rgb('+Math.floor( difuse.r*0.75)+', '+Math.floor( difuse.g*0.75)+', '+Math.floor( difuse.b*0.75)+');');
//createClass('.'+name,'fill: rgb('+Math.floor( difuse.r*0.6)+', '+Math.floor( difuse.g*0.6)+', '+Math.floor( difuse.b*0.6)+');');


// Warning On Chromium web browser, framerate is dramaticaly affected by css rules quantity.
/*
createClass('.'+name+'-step-0', ' fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-1', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-2', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-3', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-4', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-5', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-6', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-7', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-8', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-9', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-10', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');*/
createClass('.'+name+'-step-11', 'fill: rgb('+Math.floor( difuse.r*0.96)+', '+Math.floor( difuse.g*0.96)+', '+Math.floor( difuse.b*0.96)+');');
createClass('.'+name+'-step-12', 'fill: rgb('+Math.floor( difuse.r*0.97)+', '+Math.floor( difuse.g*0.97)+', '+Math.floor( difuse.b*0.97)+');');
createClass('.'+name+'-step-13', 'fill: rgb('+Math.floor( difuse.r*0.98)+', '+Math.floor( difuse.g*0.98)+', '+Math.floor( difuse.b*0.98)+');');
createClass('.'+name+'-step-14', 'fill: rgb('+Math.floor( difuse.r*0.99)+', '+Math.floor( difuse.g*0.99)+', '+Math.floor( difuse.b*0.99)+');');
createClass('.'+name+'-step-15', 'fill: rgb('+Math.floor( difuse.r*1.0)+', '+Math.floor( difuse.g*1.0)+', '+Math.floor( difuse.b*1.0)+');');

}

function showUi ()
{		
	$('#ui').css('display' , 'block' );
	$('#navhelper').css('display' , 'none' );
	//$('#closelayer').css('display' , 'block' );
}

function closeUi ()
{
	$('#ui').css('display' , 'none' );
	$('#navhelper').css('display' , 'block' );
	//$('#closelayer').css('display' , 'none' );
}
function showPromotionUI ()
{		
	$('#PromotionUI').css('display' , 'block' );
	$('#navhelper').css('display' , 'none' );
}
function closePromotionUI ()
{		
	$('#PromotionUI').css('display' , 'none' );
	$('#navhelper').css('display' , 'block' );
}
function disposeapplicationlayers (option)
{		
	var w = $(window).width();
	var h = $(window).height();
	if ( option == 'auto' )
	{ 
		if (w < 900 && h < 900 )
		view = 'mobile';
		else view = 'desktop';
	}

	var zoom = 100;
	var ratio = w/h;
 	
	$('#UI').css({'top' : 0 });
	$('#UI').css({'left' : 0 });
	$('#UI').css({'width' : w });
	$('#UI').css({'height' : h });

	$('#PromotionUI').css({'top' : 0 });
	$('#PromotionUI').css({'left' : 0 });
	$('#PromotionUI').css({'width' : w });
	$('#PromotionUI').css({'height' : h });

	if (w>h) {portrait=false;paysage=true;}
 	if (w<h) {portrait=true;paysage=false;}
	if ( portrait == true )
	{
		$('#svg8').attr('width', w);
		$('#svg8').attr('height', h);	
		$("#svg8").attr('viewBox', '-'+zoom/2+' -'+(zoom/2/ratio)+' '+zoom+' '+(zoom/ratio));
	}
	if ( paysage == true )
	{
		$('#svg8').attr('width', w);
		$('#svg8').attr('height', h);
		$("#svg8").attr('viewBox', '-'+((zoom*ratio)/2)+' -'+(zoom/2)+' '+(zoom*ratio)+' '+zoom);
	}
	if ( view == 'mobile' )
	{
		buildAltPieces ('flat');
		initViewZlock(270, 0, 0, 770);
	}
	else {
		buildAltPieces ('3d');
		initViewZlock(220, 90, 0, 730);
	}
}
function checkGameState ( )
{
	
	if ( chess.insufficient_material() )
	{
		$('#matchResult').text ("MatchPartie nulle, materiel insuffisant");
		$('#gameHistory').text ( chess.pgn({ max_width: 15, newline_char: '<br />' }));
	}
	if ( chess.in_check() )
	{
		if (chess.turn() == 'w')
		{
			$('#matchResult').text ( 'Les blancs sont en Echec');
			switchMaterialInWavefrontById(buffer, 'wk', 'incheck');	
		}
		if (chess.turn() == 'b') 
		{
			$('#matchResult').text ( 'Les noirs sont en Echec');
			$('#gameHistory').html ( '' );
		}
	}
	if ( chess.in_threefold_repetition() )
	{
		$('#matchResult').text ( 'Partie nulle, répétition');
		$('#gameHistory').html ( chess.pgn({ max_width: 15, newline_char: '<br />' }));
	}
	if ( chess.in_checkmate() )
	{
		if (chess.turn() == 'w') $('#matchResult').text ( 'Les blancs sont en Echec et mat');
		if (chess.turn() == 'b') $('#matchResult').text ( 'Les noirs sont en Echec et mat');
		$('#gameHistory').html ( chess.pgn({ max_width: 5, newline_char: '<br />' }));
	}


	if (chess.in_check() )
	{
		if (chess.turn() == 'w')
			switchMaterialInWavefrontById(buffer, 'wk', 'incheck');
		if (chess.turn() == 'b') 
			switchMaterialInWavefrontById(buffer, 'bk', 'incheck');	
		viewChessBoard();
	}
	if ( chess.game_over() )
	{
		$('#endGameLayer').css('display' , 'block' );
		$('#navhelper').css('display' , 'none' );
		viewChessBoard();
	}
}
function closeEndGameLayer ()
{		
	$('#endGameLayer').css('display' , 'none' );
	$('#navhelper').css('display' , 'block' );
}
$(window).on("load", function() {
	
	if (Cookies.get('fen') != undefined )
	chess.load(Cookies.get('fen'));

	//audiostart.play();
	Log ('#=# cookie : '+Cookies.get('vue') );
	if ( Cookies.get('vue') == undefined ) 
	{
		view = 'auto';
		Cookies.set('vue', 'auto');
		Log ('setting cookie vue');
	}
	else
	{
		if ( Cookies.get('vue') == 'auto' ) view = 'auto';
		if ( Cookies.get('vue') == 'mobile' ) view = 'mobile';
		if ( Cookies.get('vue') == 'desktop' ) view = 'desktop';

	}
	Log ('#=# cookie : '+Cookies.get('vue') );
	

//	generateMaterialsCSS ('blancs', {r:253, g:251, b:235});
	generateMaterialsCSS ('blancs', {r:241, g:241, b:255});
	generateMaterialsCSS ('noirs', {r:100, g:100, b:100});
	generateMaterialsCSS ('selectedPiece', {r:0, g:0, b:220});

	generateMaterialsCSS ('HARDbrown',{r:59, g:42, b:17} );
	generateMaterialsCSS ('HARDcream',{r:159, g:152, b:117} );
/*	generateMaterialsCSS ('blancs', {r:253, g:231, b:135});
	generateMaterialsCSS ('noirs', {r:169, g:162, b:137});
	generateMaterialsCSS ('selectedPiece', {r:0, g:0, b:220});

	generateMaterialsCSS ('HARDbrown', {r:170, g:170, b:170});
	generateMaterialsCSS ('HARDcream',{r:245, g:245, b:245} );
*/
	boardwvft = $.extend(true, {}, loadWavefrontFromHTLM('#board', 'board'));
	boardbuffer = $.extend(true, {}, boardwvft);
	buffer = $.extend(true, {}, boardwvft);


	disposeapplicationlayers(view);
		viewChessBoard();


	$('body').on('click', '#uiLayerFooter', function() {

		closeUi();
		
	});
	$('body').on('click', '#endGameLayerFooter', function() {

		closeEndGameLayer();
		
	});
	$('body').on('click', '#show-ui', function() {

		showUi();
	});


	$('body').on('click', '*', function() {

		$('.banner').css('display', 'none');
	});
	$('body').on('click', '#toggleViewMobile', function() {


		$('.selectedToggle').removeClass('selectedToggle');
		$('#toggleViewMobile').addClass('selectedToggle');
		view = 'mobile';
		Cookies.set('vue','mobile' );
		disposeapplicationlayers('mobile');
	});
	$('body').on('click', '#toggleViewDesktop', function() {

	
		$('.selectedToggle').removeClass('selectedToggle');
		$('#toggleViewDesktop').addClass('selectedToggle');
		view = 'desktop';
		Cookies.set('vue', 'desktop');
		disposeapplicationlayers('desktop');
		
	});
	$('body').on('click', '#toggleViewAuto', function() {

		$('.selectedToggle').removeClass('selectedToggle');
		$('#toggleViewAuto').addClass('selectedToggle');
		view = 'auto';
		Cookies.set('vue', 'auto');
		disposeapplicationlayers('auto');
	});
	$('body').on('click', '#resetBoard', function() {

		chess.reset();

		disposeapplicationlayers('desktop');
		viewChessBoard();

	});
	$('.selectedToggle').removeClass('selectedToggle');
	var tmp = Cookies.get('vue');
	if (tmp == 'auto') $('#toggleViewAuto').addClass('selectedToggle');
	if (tmp == 'mobile') $('#toggleViewMobile').addClass('selectedToggle');
	if (tmp == 'desktop') $('#toggleViewDesktop').addClass('selectedToggle');
	

/*
	var singleTap = new Hammer.Tap({
		event: 'singletap'
	});
	var doubleTap = new Hammer.Tap({
		event: 'doubletap',
		taps: 2
	});
	var tripleTap = new Hammer.Tap({
		event: 'tripletap',
		taps: 3
	});
	tripleTap.recognizeWith([doubleTap, singleTap]);
	doubleTap.recognizeWith(singleTap);
	doubleTap.requireFailure(tripleTap);
	singleTap.requireFailure([tripleTap, doubleTap]);
	
	*/
	//hammertime.get('pinch').set({ enable: true });
	var myElement = document.getElementById('svg8');
	var mc = new Hammer(myElement);
	mc.get('pan').set({
		direction: Hammer.DIRECTION_ALL
	});
	mc.on("doubletap", function(ev) {
		//
	});
	mc.on("singletap", function(ev) {
		//
	
	});
	mc.on("pan", function(ev) {
		if (view != 'mobile')
		{
			rotateViewZlock (ev.velocityY*15, ev.velocityX*15, 0 );
			$('#csl').text(ZlockANGx+'\n '+ZlockANGy+'\n '+ZlockANGz);
			viewChessBoard();
		}
	});
	$('body').on('click', '#QueenPromotion', function() {
	

		var mv = chess.move({from:promotmp2.f, to: promotmp2.t, promotion: 'q'});
		buildAltPieces ();
		selectedPiece = "none";
		clearWayables();
		viewChessBoard();
		checkGameState ();
		closePromotionUI();
	});

	$('body').on('click', '#RookPromotion', function() {
	

		var mv = chess.move({from:promotmp2.f, to: promotmp2.t, promotion: 'r'});
		buildAltPieces ();
		selectedPiece = "none";
		clearWayables();
		viewChessBoard();
		checkGameState ();
		closePromotionUI();
	});
	$('body').on('click', '#KnightPromotion', function() {

		var mv = chess.move({from:promotmp2.f, to: promotmp2.t, promotion: 'n'});
		buildAltPieces ();
		selectedPiece = "none";
		clearWayables();
		viewChessBoard();
		checkGameState ();
		closePromotionUI();
	});
	$('body').on('click', '#BishopPromotion', function() {
	
		var mv = chess.move({from:promotmp2.f, to: promotmp2.t, promotion: 'b'});
		buildAltPieces ();
		selectedPiece = "none";
		clearWayables();
		viewChessBoard();
		checkGameState ();
		closePromotionUI();
	});
	$('body').on('click', '.piece', function() {
	
		var id = getFaceId(this);		
		if ( chess.turn() == altPieces[id].color )
		{
			switchMaterialWavefront (altPieces[id].w, "selectedPiece");

			if (selectedPiece != "none")
			{
				if (altPieces[selectedPiece].color == 'w')
					switchMaterialWavefront (altPieces[selectedPiece].w, 'blancs');
				if (altPieces[selectedPiece].color == 'b')
					switchMaterialWavefront (altPieces[selectedPiece].w, 'noirs');
		
			}
			switchMaterialWavefront (altPieces[id].w, "selectedPiece");
			selectedPiece = id;
			clearWayables ();
			showWay(selectedPiece);
			viewChessBoard();
		}
	});
	$('body').on('click', '.way', function() {

		var id = getFaceId(this);
		var tmp = $(this).attr('class');
		
		var tmp2 = tmp.match(/way\d+/)+"";
		selectedway = parseInt(tmp2.match(/\d+/));

		if (isPromotion(way2[selectedway].move))
		{
			promotmp = selectedPiece;
			promotmp2 = {f:altPieces[selectedPiece].square, t:way2[selectedway].square};
			showPromotionUI ();		
		}
		else
		{		
			var move = chess.move(way2[selectedway].move);
			buildAltPieces ('flat');
			selectedPiece = "none";
			clearWayables();
			viewChessBoard();
			checkGameState ();
			Cookies.set('fen', chess.fen());
		}
	});

	$('#svg8').on('mousewheel', function(event) {
	if (view != 'mobile')
	{
		translateView (0, 0, event.deltaY*event.deltaFactor );
		viewChessBoard();
	}
	});
	$(window).on('resize', function() {
		disposeapplicationlayers(Cookies.get('vue'));
	});
});


function clearWayables ()
{
			/*var contents = $('#board').text();
			var obj = parsewavefront(contents);
			boardwvft = $.extend(true, {}, obj);
			gennormalesboard();
			boardbuffer = $.extend(true, {}, boardwvft);*/
	boardwvft = loadWavefrontFromHTLM('#board');
	boardbuffer = $.extend(true, {}, boardwvft);
			

			way2.splice(0, way2.length );
}
function addToWayables (x, y, i)
{
	var xs = 224;
	var ys = 224;
	var mrg = 32;
	var stp = 64;
	var z = 0;
	var v = [-y*stp-mrg+xs, z, -x*stp-mrg+ys ];
	boardwvft.vertices.push(v);
	var v1 = [-y*stp-mrg+xs, z, -x*stp+mrg+ys ];
	boardwvft.vertices.push(v1);
	var v2 = [-y*stp+mrg+xs, z, -x*stp+mrg+ys ];
	boardwvft.vertices.push(v2);
	var v3 = [-y*stp+mrg+xs, z, -x*stp-mrg+ys ];
	boardwvft.vertices.push(v3);

	var tmp = boardwvft.nv;
	var t = [tmp+2, tmp+4, tmp+1];
	boardwvft.triangles.push(t);
	t = [tmp+4, tmp+2, tmp+3];
	boardwvft.triangles.push(t);

	boardwvft.nt = boardwvft.nt+2;
	boardwvft.nv = boardwvft.nv+4;

	var n = [ 0.0, 1.0, 0.0];
	boardwvft.triangles[boardwvft.nt-1].mat = "way"+way2.length;
	boardwvft.triangles[boardwvft.nt-1].n=n;
	boardwvft.triangles[boardwvft.nt-2].mat = "way"+way2.length;
	boardwvft.triangles[boardwvft.nt-2].n=n;
	
	boardbuffer = $.extend(true, {}, boardwvft);

}
function putPieceWavefrontToSquare (pieceWavefront, square, id)
{
	var xs = 224;
	var ys = 224;
	var mrg = 0;
	var stp = 64;
	var z = 0;
	
	var x = SquareToXY (square).x;
	var y = SquareToXY (square).y;

	translateWavefront (pieceWavefront, -y*stp-mrg+xs, z, -x*stp-mrg+ys );
}
