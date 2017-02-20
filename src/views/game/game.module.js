/* global angular Phaser */

'use strict'

angular.module('app.game', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'src/views/game/game.view.html',
    controller: 'GameCtrl'
  })
}])

.controller('GameCtrl', ['Photos', '$scope', '$rootScope', '$timeout', 'Game.Preloader', 'Game.Logic', function (Photos, $scope, $rootScope, $timeout, Preloader, Logic) {

  $scope.assetsLoaded = false

  Photos.fetch()
    .then(function (data) {
      return data.photos.map(function (obj) {
        return obj.image_url
      })
    })
    .then(function (photosURL) {

      //var game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'game', null, true)
      var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', null, true);


      game.state.add('Preloader', Preloader(photosURL), true)
      game.state.add('Game', Logic)

      $scope.assetsLoaded = false

      $rootScope.$on('loaded', function (event) {
        $scope.$apply(function () {
          $scope.assetsLoaded = true
        })

        $timeout(
          function () {
            $scope.$apply(function () {
              $scope.hidePreloader = true
              game.state.start('Game')
            })
          }
          , 2000)
      })
    })

  $rootScope.$on('tips', function (event, data) {
    $scope.$apply(function () {
      $scope.tips = data
    })
  })

  $scope.onSelect = function (selection) {
    $rootScope.$broadcast('selection', selection)
  }
}])

.factory('Game.Preloader', ['$rootScope', function ($rootScope) {

  var _photosURL

  var Preloader = function () {}

  Preloader.prototype = {

    init: function () {
      this.input.maxPointers = 1
      this.scale.pageAlignHorizontally = true
    },

    preload: function () {

      this.load.image('background', 'assets/sky.png');
      this.load.image('platform', 'assets/platform.png');
      this.load.audio('punto', 'assets/numkey.wav');
      this.load.images(_photosURL)
    },

    create: function () {
      $rootScope.$broadcast('loaded')
    }
  }

  return function (photosURL) {

    _photosURL = photosURL

    return Preloader
  }
}])

.factory('Game.Logic', ['Photos', '$rootScope', '$location', function (Photos, $rootScope, $location) {

  var KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']

  var Game = function () {

    this.score = 0
    this.scoreText = null
  }

  Game.prototype = {

    init: function () {

      this.score = 0
      this.platform;
      this.photos;
      this.photo;
      this.txtPoints;
      this.end

      this.keyPress;
      this.spaceKey;

      this.sndPunto;
      $rootScope.$on('selection', function (ev, data) {
        this.selectKey(data)
      }.bind(this))
    },

    create: function () {

      this.rawPhotoData = Photos.get()

      this.physics.startSystem(Phaser.Physics.ARCADE);
      this.physics.arcade.sortDirection = Phaser.Physics.Arcade.BOTTOM_TOP;

      this.add.sprite(0, 0, 'background');
      this.photos = this.add.group();
      this.game.letras='';

      this.platform = this.add.sprite(0, 100, 'platform');
      this.platform.width = 800;
      this.physics.arcade.enable(this.platform);
      this.platform.body.immovable = true;



      this.end = this.add.sprite(this.world.width-5, 0, 'platform');
      this.end.height = 800;
      this.end.width = 5;
      this.physics.arcade.enable(this.end);
      this.end.body.immovable = true;




      //Variables del juego
      this.giro = 250;
      this.points = 0;
      this.nivel = 1;
      this.keyPress;
      this.velocityphotos=150;

      this.txtPoints =  this.add.text(25, 16, 'Points: '+this.points, { font: '24px Arial', fill: '#000' });

      this.teclas = this.input.keyboard.createCursorKeys();

      //Sonidos
      this.sndPunto = this.add.audio('punto');

        this.txtVidas = this.add.text(625, 16, 'Key ', {font: '24px Arial', fill: '#000'});

      this.welcome();
    },

    update: function () {
      var that = this;
      this.physics.arcade.overlap(this.photos, this.end, this.perderVida, null, this);

         this.input.keyboard.onDownCallback = function() {
           that.keyPress = this.game.input.keyboard.event.key;

             if (that.game.letras.indexOf(that.keyPress) !== -1) {
                 var letra1= that.keyPress;
                 that.photos.forEachExists(function(photo){
                     if(that.photo.tag === letra1){
                       that.points= that.points+10;
                       that.photo.kill();
                     }
                 });
                 that.crearPersonaje();

             }else{
                 that.crearPersonaje();
             }
             that.txtPoints.destroy();
             that.txtPoints =  that.add.text(25, 16, 'Points: '+that.points, { font: '24px Arial', fill: '#000' });
           that.sndPunto.play();
    }
  },

     welcome: function() {
          this.welcome=this.add.text(10, 250, 'Welcome', {font:'80px Arial', fill: '#000'});
          this.welcome1=this.add.text(10, 400, 'Press the key that we indicated before the end of the Martian',
           {font:'18px Arial', fill: '#000'});
          this.welcome2=this.add.text(10, 500, 'Press any key...',
            {font:'12px Arial', fill: '#000'});
    },
    crearPersonaje: function() {
       this.welcome.destroy();
       this.welcome1.destroy();
       this.welcome2.destroy();

       var photo = Phaser.ArrayUtils.getRandomItem(this.rawPhotoData)

       this.game.load.spritesheet('photo', photo.image_url, 32, 48);
       this.photo = this.photos.create(0, this.game.world.height - 100, 'photo');
       this.game.physics.arcade.enable(this.photo);
       this.velocityphotos = this.velocityphotos + 50;
       this.photo.body.velocity.x = this.velocityphotos;
       this.photo.tag=this.getLetter();
       this.txtVidas.destroy();
       this.txtVidas = this.game.add.text(625, 16, 'Key '+this.photo.tag, {font: '24px Arial', fill: '#000'});
       this.game.letras =this.game.letras+this.photo.tag;

       /*this.photo = this.add.image(0, this.world.centerY, photo.image_url)
       this.photo.anchor.set(0.5)
       this.photo.x -= this.photo.width / 2
       this.photo = photo.tags
       this.photo.alpha = 0
       this.speed *= 1.2

       this.playing = true
       this.keysPressed = []

       this.add.tween(this.photo).to({alpha: 1}, 1000, 'Sine.easeOut', true, 100)
       this.photoTween = this.add.tween(this.photo).to({x: this.world.width + (this.photo.width / 2)}, 10000 / this.speed, 'Linear', true, 100)
       this.photoTween.onComplete.add(this.perderVida, this)*/

       /*this.photo = this.photos.create(0, this.world.height - 100, 'photo');
       this.physics.arcade.enable(this.photo);
       this.velocityphotos = this.velocityphotos + 150;
       this.photo.body.velocity.x = this.velocityphotos;*/
       //this.photo.tag=this.getLetter();
       this.txtVidas.destroy();
       this.txtVidas = this.add.text(625, 16, 'Key '+this.photo.tag, {font: '24px Arial', fill: '#000'});
       this.game.letras =this.game.letras+this.photo.tag;

    },
     getLetter: function() {
        var possible = "abcdefghijklmnopqrstuvwxyz";

        return possible.charAt(Math.floor(Math.random() * possible.length))
    },
    perderVida: function(){

          this.end.kill();
          this.add.text(200, 250, 'Game over', {font:'80px Arial', fill: '#000'});
          this.add.text(200, 400, 'Points: '+this.points, {font:'30px Arial', fill: '#000'});





    }

}

  return Game
}])
