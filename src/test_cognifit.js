var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('fondo', 'assets/sky.png');
    game.load.image('plataforma', 'assets/platform.png');
    game.load.audio('punto', 'assets/numkey.wav');
    game.load.spritesheet('foto', 'assets/dude.png', 32, 48);
}

var plataforma;
var suelo;
var fotos;
var foto;
var txtPuntaje;
var txtVidas;
var teclaPulsada;
var spaceKey;

var sndPunto;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.sortDirection = Phaser.Physics.Arcade.BOTTOM_TOP;

    game.add.sprite(0, 0, 'fondo');
    game.fotos = game.add.group();
    game.letras='';

    plataforma = game.add.sprite(0, 100, 'plataforma');
    plataforma.width = 800;
    game.physics.arcade.enable(plataforma);
    plataforma.body.immovable = true;

    suelo = game.add.sprite(0, game.world.height - 5, 'plataforma');
    suelo.width = 800;
    suelo.height = 5;
    game.physics.arcade.enable(suelo);
    suelo.body.immovable = true;

    pared = game.add.sprite(game.world.width-5, 0, 'plataforma');
    pared.height = 800;
    pared.width = 5;
    game.physics.arcade.enable(pared);
    pared.body.immovable = true;




    //Variables del juego
    game.giro = 250;
    game.puntaje = 0;
    game.nivel = 1;
    game.teclaPulsada;
    game.velocityFotos=50;


    //crearPersonaje();

    txtPuntaje = game.add.text(25, 16, 'Puntos: '+game.puntaje, { font: '24px Arial', fill: '#000' });

    teclas = game.input.keyboard.createCursorKeys();

    //Sonidos
    sndPunto = game.add.audio('punto');

      game.txtVidas = game.add.text(625, 16, 'Teclas ', {font: '24px Arial', fill: '#000'});

    welcome();

}
function welcome(){
      game.welcome=game.add.text(10, 250, 'Bienvenido', {font:'80px Arial', fill: '#000'});
      game.welcome1=game.add.text(10, 400, 'Pulsa la primera letra del objeto de la foto, date prisa, como lleve a la parte de la derecha pierdes',
       {font:'18px Arial', fill: '#000'});
      game.welcome2=game.add.text(10, 500, 'Pulsa cualquier tecla para empezar',
        {font:'12px Arial', fill: '#000'});
}
function getLetter(){
    var possible = "abcdefghijklmnopqrstuvwxyz";

    return possible.charAt(Math.floor(Math.random() * possible.length))
}
function crearPersonaje() {
    game.welcome.destroy();
    game.welcome1.destroy();
    game.welcome2.destroy();

    foto = game.fotos.create(0, game.world.height - 100, 'foto');
    game.physics.arcade.enable(foto);
    game.velocityFotos = game.velocityFotos + 20;
    foto.body.velocity.x = game.velocityFotos;
    foto.tag=getLetter();
    console.log("foto"+foto.tag);
    game.txtVidas.destroy();
    game.txtVidas = game.add.text(625, 16, 'Teclas '+foto.tag, {font: '24px Arial', fill: '#000'});
    game.letras =game.letras+foto.tag;

}
function perderVida(){
      pared.kill();
      game.add.text(200, 250, 'Perdiste', {font:'80px Arial', fill: '#000'});
      game.add.text(200, 400, 'Puntos: '+game.puntaje, {font:'30px Arial', fill: '#000'});
}

function update() {

 game.physics.arcade.overlap(game.fotos, pared, perderVida, null, this);

    game.input.keyboard.onDownCallback = function() {
      game.teclaPulsada = game.input.keyboard.event.key;

        if (game.letras.indexOf(game.teclaPulsada) !== -1) {
            var letra1= game.teclaPulsada;
            game.fotos.forEachExists(function(foto){
                if(foto.tag === letra1){
                  game.puntaje= game.puntaje+10;
                  foto.kill();

                }

            });
            crearPersonaje();

        }else{
            crearPersonaje();
        }
      sndPunto.play();


  };






}
