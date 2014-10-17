( function( global, doc, $, ns, undefined ) {
  'use strict';
  ns = ns || {};  

  function EventDispatcher() {
    this._events = {};
  }

  EventDispatcher.prototype.hasEventListener = function(eventName) {
    return !!this._events[eventName];
  };

  EventDispatcher.prototype.listen = function(eventName, callback) {
    if (this.hasEventListener(eventName)) {
      var events = this._events[eventName];
      for (var i in events) {
        if (events[i] === callback) {
          return;
        }
      }
      events.push(callback);
    }
    else{
      this._events[eventName] = [callback];
    }
    return this;
  };

  EventDispatcher.prototype.removeEventListener = function(eventName, callback) {
    if (!this.hasEventListener(eventName)) {
      return;
    }
    else{
      var events = this._events[eventName],
          i      = events.length,
          index;
      while (i--) {
        if (events[i] === callback) {
          index = i;
        }
      }
      events.splice(index, 1);
    }
    return this;
  };

  EventDispatcher.prototype.fire = function(eventName, opt_this) {
    if (!this.hasEventListener(eventName)) {
      return;
    }
    else{
      var events = this._events[eventName],
      copyEvents = $.merge([], events),
      arg        = $.merge([], arguments);
      arg.splice(0, 2);
      for (var i in copyEvents) {
        copyEvents[i].apply(opt_this || this, arg);
      }
    }
  };

  ns.EventDispatcher = EventDispatcher;
  global.pi = ns;
})( this, document, jQuery, this.pi );

( function( global, doc, $, ns, undefined ){
  'use strict';
  ns = ns || {};  

  function Throttle(minInterval) {
    this.interval = minInterval;
    this.prevTime = 0;
    this.timer = function(){};
  }

  Throttle.prototype.exec = function(callback) {
    var now = + new Date(),
        delta = now - this.prevTime;

    clearTimeout(this.timer);
    if( delta >= this.interval ){
      this.prevTime = now;
      callback();
    }
    else{
      this.timer = setTimeout(callback, this.interval);
    }
  };

  ns.Throttle = Throttle;
  global.pi = ns;
})( this, document, jQuery, this.pi );

( function( global, doc, $, ns, undefined ){
  'use strict';
  ns = ns || {};

  ns.PI = '3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912983367336244065664308602139494639522473719070217986094370277053921717629317675238467481846766940513200056812714526356082778577134275778960917363717872146844090122495343014654958537105079227968925892354201995611212902196086403441815981362977477130996051870721134999999837297804995105973173281609631859502445945534690830264252230825334468503526193118817101000313783875288658753320838142061717766914730359825349042875546873115956286388235378759375195778185778053217122680661300192787661119590921642019893809525720106548586327886593615338182796823030195203530185296899577362259941389124972177528347913151557485724245415069595082953311686172785588907509838175463746493931925506040092770167113900984882401285836160356370766010471018194295559619894676783744944825537977472684710404753464620804668425906949129331367702898915210475216205696602405803815019351125338243003558764024749647326391419927260426992279678235478163600934172164121992458631503028618297455570674983850549458858692699569092721079750930295532116534498720275596023648066549911988183479775356636980742654252786255181841757467289097777279380008164706001614524919217321721477235014144197356854816136115735255213347574184946843852332390739414333454776241686251898356948556209921922218427255025425688767179049460165346680498862723279178608578438382796797668145410095388378636095068006422512520511739298489608412848862694560424196528502221066118630674427862203919494504712371378696095636437191728746776465757396241389086583264599581339047802759009';

  ns.NAPIER = '2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274274663919320030599218174135966290435729003342952605956307381323286279434907632338298807531952510190115738341879307021540891499348841675092447614606680822648001684774118537423454424371075390777449920695517027618386062613313845830007520449338265602976067371132007093287091274437470472306969772093101416928368190255151086574637721112523897844250569536967707854499699679468644549059879316368892300987931277361782154249992295763514822082698951936680331825288693984964651058209392398294887933203625094431173012381970684161403970198376793206832823764648042953118023287825098194558153017567173613320698112509961818815930416903515988885193458072738667385894228792284998920868058257492796104841984443634632449684875602336248270419786232090021609902353043699418491463140934317381436405462531520961836908887070167683964243781405927145635490613031072085103837505101157477041718986106873969655212671546889570350354';

  global.pi = ns;
})( this, document, jQuery, this.pi );

( function( global, doc, $, ns, undefined ){
	'use strict';
	ns = ns || {};
  var	instance;
  var originalConstructor;

  /*-------------------------------------------
    PUBLIC
  -------------------------------------------*/

	function ResizeHandler(){
    var that = this;

    ns.EventDispatcher.call( that );
    _setEvent( that );

    function _setEvent( that ){
      var throttle = new ns.Throttle(250);
      var $wrapper = $( '#wrapper' );

      $( window ).on('load resize', function(){
        throttle.exec(function(){
          that.fire( 'RESIZE', that, $wrapper.width(), $wrapper.height() );
        });
      });
    }
 	}

  /*-------------------------------------------
    INHERIT
  -------------------------------------------*/

  originalConstructor = ResizeHandler.prototype.constructor;
  ResizeHandler.prototype = new ns.EventDispatcher();
  ResizeHandler.prototype.constructor = originalConstructor;

  /*-------------------------------------------
    EXPORT (singleton)
  -------------------------------------------*/

  function getInstance(){
    if (!instance) {
      instance = new ResizeHandler();
    }
    return instance;
  }

  ns.ResizeHandler = {
    getInstance: getInstance
  };

	global.pi = ns;
})( this, document, jQuery, this.pi );

( function( global, doc, $, ns, undefined ){
	'use strict';
	ns = ns || {};
  var	instance;

  var $canvas = $( '#canvas' );
  var context;

  var PI = Math.PI;

  /*-------------------------------------------
    PUBLIC
  -------------------------------------------*/

	function Canvas(){
    if ( !$canvas.get( 0 ).getContext ){
      alert( 'This browser doesn\'t supoort HTML5 Canvas.');
      return;
    }
    context = $canvas.get( 0 ).getContext( '2d' );
 	}

  /*-------------------------------------------
    PROTOTYPE
  -------------------------------------------*/

  Canvas.prototype.resetContext = function( width, height ){
    $canvas.get( 0 ).width = width;
    $canvas.get( 0 ).height = height;

    context.font = '128px "Anonymous Pro"';
    this.drawText( width / 2, height / 2, ns.PI, '#000000' );
  };

  Canvas.prototype.clearRect = function( width, height ){
    context.clearRect( 0, 0, width, height );
  };

  Canvas.prototype.drawEllipse = function( x, y, radius, rgb ){
    context.beginPath();
    context.arc( x, y, radius, 0, PI * 2, true );
    context.fillStyle = rgb; 
    context.fill();
  };

  Canvas.prototype.drawText = function( x, y, text, font_size, rgb ){
    context.font = font_size + 'px "Anonymous Pro"';
    context.fillStyle = rgb;
    context.fillText( text, x, y );
  };

  /*-------------------------------------------
    EXPORT (singleton)
  -------------------------------------------*/

  function getInstance(){
    if (!instance) {
      instance = new Canvas();
    }
    return instance;
  }

  ns.Canvas = {
    getInstance: getInstance
  };

	global.pi = ns;
})( this, document, jQuery, this.pi );

( function( global, doc, $, ns, undefined ){
	'use strict';
	ns = ns || {};
  var	instance;
  var originalConstructor;
  var SAMPLING_RATE = 44100;
  var FREQ_FIX_VAL = 2 * Math.PI.toFixed( 4 ) / SAMPLING_RATE;
  var ctx = new global.webkitAudioContext();

  /*-------------------------------------------
    PUBLIC
  -------------------------------------------*/
	function Audio(){
    ns.EventDispatcher.call( this );
 	}

  /*-------------------------------------------
    INHERIT
  -------------------------------------------*/
  originalConstructor = Audio.prototype.constructor;
  Audio.prototype = new ns.EventDispatcher();
  Audio.prototype.constructor = originalConstructor;

  /*-------------------------------------------
    PROTOTYPE 
  -------------------------------------------*/
  Audio.prototype.playFreq = function( freq, option ){
    var DURATION = 0.2;
    var buffer = ctx.createBuffer( 1, DURATION * SAMPLING_RATE, SAMPLING_RATE );
    var channel = buffer.getChannelData( 0 );
    var t;
    var src;
    var length;
    var is_sin = true;

    if( option === 'cos' ){
      is_sin = false;
    }

    ctx.samplingRate = SAMPLING_RATE;
    length = channel.length;
    for( t = 0; t < length; t++ ){
      if( is_sin ){
        channel[ t ] = Math.sin( FREQ_FIX_VAL * freq * t ) / 100;
      }
      else{
        channel[ t ] = Math.cos( FREQ_FIX_VAL * freq * t ) / 100;
      }
    }
    src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect( ctx.destination );
    src.start( 0 );
  };

  /*-------------------------------------------
    EXPORT (singleton)
  -------------------------------------------*/
  function getInstance(){
    if (!instance) {
      instance = new Audio();
    }
    return instance;
  }

  ns.Audio = {
    getInstance: getInstance
  };

	global.pi = ns;
})( this, document, jQuery, this.pi );

( function( global, doc, $, ns, undefined ){
  'use strict';
  ns = ns || {};
  global.IS_PLAYAUDIO = false;
  global.IS_DRAWCODE = false;
  var total_scroll = 0;
  var context_width;
  var context_height;

  var FONT_WIDTH = 70;
  var FONT_HEIGHT = 85;
  var COLORCODE_LENGTH = 6;

  // fix max value from 99 to 255
  var COLORCODE_COMPENSE = 255 / 99;

  /*-------------------------------------------
    MAIN 
  -------------------------------------------*/
  $(function() {
    var resizeHandler = ns.ResizeHandler.getInstance();
    var canvas = ns.Canvas.getInstance();
    var audio = ns.Audio.getInstance();
    var ellipse_r = 180;
    var bigFont_ratio = 1.5;

    resizeHandler.listen( 'RESIZE', function( width, height ){
      context_width = width;
      context_height = height;
      canvas.resetContext( width, height );
    });

    $( global ).on( 'keypress', function( event ) {
      if ( ( event.which && event.which === 13 ) || 
           ( event.keyCode && event.keyCode === 13 ) ) {
             if ( !global.IS_DRAWCODE ){
               global.IS_DRAWCODE = true;
             }
             else if ( !global.IS_PLAYAUDIO ){
               global.IS_PLAYAUDIO = true;
             }
      }
    });

    $( document ).on( 'mousewheel', function( event ){
      var colorCode;
      //var napierCode;
      var colorCodeObj = {};
      var rgb;
      var readPieFrom;

      // scroll to DOWN is NEGATIVE value.
      total_scroll -= event.deltaY;
      readPieFrom = parseInt( total_scroll / FONT_WIDTH );

      // this value is decimal and integer
      colorCode = ( ns.PI.slice( readPieFrom,
          readPieFrom + COLORCODE_LENGTH ) );
      /*
      napierCode = ( ns.NAPIER.slice( readPieFrom,
          readPieFrom + COLORCODE_LENGTH ) );*/
      if( global.IS_PLAYAUDIO ){
        audio.playFreq( colorCode / 200 );
      }
      //audio.playFreq( napierCode / 200 );

      // convert to object which includes rgb
      // ( Hexidental value ) 
      colorCodeObj = _colorCodeConpensate(
        /* red = */ colorCode.slice( 0, 2 ),
        /* green = */ colorCode.slice( 2, 4 ),
        /* blue = */ colorCode.slice( 4, 6 ) );
      rgb = 'rgb( ' + colorCodeObj.red +
             ', ' + colorCodeObj.green + ', ' + 
             colorCodeObj.blue + ')';

      canvas.clearRect( context_width, context_height );
      canvas.drawEllipse(
        context_width / 2,
        context_height / 2 - ( ellipse_r + FONT_HEIGHT ),
        ellipse_r,
        rgb
      );

      // draw the whole text of PI
      canvas.drawText( context_width / 2 - total_scroll,
        context_height / 2, /* text = */ ns.PI,
        /* font size = */ 128, 'rgb( 0, 0, 0 )' ); 

      // draw the colorCode by the color
      // at the original position 
      canvas.drawText(
        /* start X of colorCode area = */
        context_width / 2 - total_scroll + 
        ( FONT_WIDTH * readPieFrom ),
        context_height / 2,
        /* text = */ colorCode,
        /* font size = */ 128,
        /* rgb = */ rgb );

      // draw the colorCode at the bottom 
      if ( global.IS_DRAWCODE ){
        canvas.drawText(
          context_width / 2 - ( FONT_WIDTH * bigFont_ratio * 3.5 ),
          context_height / 2 + ( ellipse_r + FONT_HEIGHT ),
          /* text = */ '#' + colorCode,
          /* font size = */ 128 * bigFont_ratio,
          /* rgb = */ rgb );
      }
    });

  });

  /*-------------------------------------------
    PRIVATE
  -------------------------------------------*/
  function _colorCodeConpensate( red, blue, green ){
    var colorCode = {}; 
    colorCode.red = parseInt( red * COLORCODE_COMPENSE );
    colorCode.green = parseInt( blue * COLORCODE_COMPENSE );
    colorCode.blue = parseInt( green * COLORCODE_COMPENSE );
    return colorCode;
  }

  global.pi = ns;
})( this, document, jQuery, this.pi );
