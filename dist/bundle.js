/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {
	    game.load.image('fondo', 'assets/sky.png');
	    game.load.image('plataforma', 'assets/platform.png');
	    game.load.audio('punto', 'assets/numkey.wav');
	    game.load.spritesheet('foto', 'assets/dude.png', 32, 48);
	}

	var plataforma;
	var suelo;
	var foto;

	var txtPuntaje;
	var txtVidas;


	var sndPunto;

	function create() {
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	    game.physics.arcade.sortDirection = Phaser.Physics.Arcade.BOTTOM_TOP;

	    game.add.sprite(0, 0, 'fondo');


	    plataforma = game.add.sprite(0, 100, 'plataforma');
	    plataforma.width = 800;
	    game.physics.arcade.enable(plataforma);
	    plataforma.body.immovable = true;

	    suelo = game.add.sprite(0, game.world.height - 5, 'plataforma');
	    suelo.width = 800;
	    suelo.height = 5;
	    game.physics.arcade.enable(suelo);
	    suelo.body.immovable = true;

	    foto = game.add.sprite(0, game.world.height - 100, 'foto');
	    game.physics.arcade.enable(foto);
	    //foto.body.gravity.y = 300;
	    foto.body.velocity.x = 100;




	    //Variables del juego
	    game.giro = 250;
	    game.puntaje = 0;
	    game.nivel = 1;

	    //Loops y eventos
	    //game.subirNivel = game.time.events.loop(10000, subirNivel, this);

	    //Indicadores de puntaje y vidas
	    txtPuntaje = game.add.text(25, 16, 'Puntos: 0', { font: '24px Arial', fill: '#000' });
	    txtNivel = game.add.text(325, 16, 'Nivel: 1', {font: '24px Arial', fill: '#000'});

	    teclas = game.input.keyboard.createCursorKeys();

	    //Sonidos
	    sndPunto = game.add.audio('punto');

	}
	function createPersonaje(){
	  foto = game.add.sprite(0, game.world.height - 100, 'foto1');
	  game.physics.arcade.enable(foto);
	  //foto.body.gravity.y = 300;
	  foto.body.velocity.x = 100;
	}
	function update() {
	    if (teclas.right.isDown) {
	        txtPuntuaje=game.add.text(25, 16, '', { font: '24px Arial', fill: '#000' });
	        txtPuntuaje = game.add.text(25, 16, 'Puntos: 10', { font: '24px Arial', fill: '#000' });
	        foto.kill();
	        //createPersonaje();
	        sndPunto.play();
	    }


	}


/***/ }
/******/ ]);