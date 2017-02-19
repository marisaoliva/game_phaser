var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('background', 'assets/sky.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.audio('punto', 'assets/numkey.wav');
    game.load.spritesheet('photo', 'assets/dude.png', 32, 48);
}

var platform;
var photos;
var photo;
var txtPoints;
var end

var keyPress;
var spaceKey;

var sndPunto;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.sortDirection = Phaser.Physics.Arcade.BOTTOM_TOP;

    game.add.sprite(0, 0, 'background');
    game.photos = game.add.group();
    game.letras='';

    platform = game.add.sprite(0, 100, 'platform');
    platform.width = 800;
    game.physics.arcade.enable(platform);
    platform.body.immovable = true;



    end = game.add.sprite(game.world.width-5, 0, 'platform');
    end.height = 800;
    end.width = 5;
    game.physics.arcade.enable(end);
    end.body.immovable = true;




    //Variables del juego
    game.giro = 250;
    game.points = 0;
    game.nivel = 1;
    game.keyPress;
    game.velocityphotos=150;

    game.txtPoints =  game.add.text(25, 16, 'Points: '+game.points, { font: '24px Arial', fill: '#000' });

    teclas = game.input.keyboard.createCursorKeys();

    //Sonidos
    sndPunto = game.add.audio('punto');

      game.txtVidas = game.add.text(625, 16, 'Key ', {font: '24px Arial', fill: '#000'});

    welcome();

}
function welcome(){
      game.welcome=game.add.text(10, 250, 'Welcome', {font:'80px Arial', fill: '#000'});
      game.welcome1=game.add.text(10, 400, 'Press the key that we indicated before the end of the Martian',
       {font:'18px Arial', fill: '#000'});
      game.welcome2=game.add.text(10, 500, 'Press any key...',
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

    photo = game.photos.create(0, game.world.height - 100, 'photo');
    game.physics.arcade.enable(photo);
    game.velocityphotos = game.velocityphotos + 150;
    photo.body.velocity.x = game.velocityphotos;
    photo.tag=getLetter();
    game.txtVidas.destroy();
    game.txtVidas = game.add.text(625, 16, 'Key '+photo.tag, {font: '24px Arial', fill: '#000'});
    game.letras =game.letras+photo.tag;

}
function perderVida(){
      end.kill();
      game.add.text(200, 250, 'Game over', {font:'80px Arial', fill: '#000'});
      game.add.text(200, 400, 'Points: '+game.points, {font:'30px Arial', fill: '#000'});
}

function update() {

 game.physics.arcade.overlap(game.photos, end, perderVida, null, this);

    game.input.keyboard.onDownCallback = function() {
      game.keyPress = game.input.keyboard.event.key;

        if (game.letras.indexOf(game.keyPress) !== -1) {
            var letra1= game.keyPress;
            game.photos.forEachExists(function(photo){
                if(photo.tag === letra1){
                  game.points= game.points+10;
                  photo.kill();
                }
            });
            crearPersonaje();

        }else{
            crearPersonaje();
        }
        game.txtPoints.destroy();
        game.txtPoints =  game.add.text(25, 16, 'Points: '+game.points, { font: '24px Arial', fill: '#000' });
      sndPunto.play();


  };
}
