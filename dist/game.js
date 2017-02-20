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
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);

	angular.module('app', [
	  'ngResource',
	  'ngRoute',
	  'app.welcome',
	  'app.game',
	  'app.results'
	])
	.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
	  $locationProvider.hashPrefix('!')

	  $routeProvider.otherwise({redirectTo: '/welcome'})


	}])


/***/ },
/* 1 */
/***/ function(module, exports) {

	/* global angular */

	'use strict'

	angular.module('app.welcome', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
	  $routeProvider.when('/welcome', {
	    templateUrl: 'app/views/welcome/welcome.view.html',
	    controller: 'WelcomeCtrl'
	  })
	}])

	.controller('WelcomeCtrl', [function () {

	}])


/***/ },
/* 2 */
/***/ function(module, exports) {

	/* global angular Phaser */

	'use strict'

	angular.module('app.game', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
	  $routeProvider.when('/game', {
	    templateUrl: 'app/views/game/game.html',
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

	      var game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'game', null, true)

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

	      this.load.path = 'app/assets/'

	      this.load.bitmapFont('fat-and-tiny')
	      this.load.bitmapFont('digits')

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

	.factory('Game.Logic', ['Photos', '$rootScope', '$location', 'GameResults', function (Photos, $rootScope, $location, GameResults) {

	  var KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']

	  var Game = function () {

	    this.score = 0
	    this.scoreText = null
	  }

	  Game.prototype = {

	    init: function () {

	      this.score = 0

	      $rootScope.$on('selection', function (ev, data) {
	        this.selectKey(data)
	      }.bind(this))
	    },

	    create: function () {

	      this.scoreText = this.add.bitmapText(64, 12, 'fat-and-tiny', 'SCORE: 0', 32)
	      this.scoreText.smoothed = false
	      this.scoreText.tint = 0x000000

	      this.rawPhotoData = Photos.get()

	      this.playing = true
	      this.speed = 1
	      this.totalKeys = []
	      this.successfulTags = []
	      this.totalTags = []

	      this.showNextPhoto()
	    },

	    update: function () {

	      if (this.playing && this.input.keyboard.pressEvent) {

	        var ev = this.input.keyboard.pressEvent
	        var success = this.currentTags.filter(function (value) {
	          return value.indexOf(ev.key) === 0
	        })

	        this.keysPressed.push(ev.key)
	        this.totalKeys.push(ev.key)

	        if (success.length > 0) {
	          this.success(success)
	        }

	        this.input.keyboard.pressEvent = null
	      }
	    },

	    success: function (tags) {

	      this.playing = false

	      this.successfulTags = (this.successfulTags || []).concat(tags)
	      this.totalTags = (this.totalTags || []).concat(this.currentTags)

	      this.add.tween(this.currentPhoto).to({
	        x: this.world.centerX,
	        y: this.world.centerY,
	        width: 10000,
	        height: 10000,
	        alpha: 0
	      }, 300, 'Sine.easeOut', true, 100)

	      var style = { font: 'bold 70px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'center' }
	      var text = this.game.add.text(0, 0, tags.join('\n').toString(), style)
	      text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
	      text.anchor.set(0.5)
	      text.x = this.world.width / 2
	      text.y = this.world.height / 2
	      var tween = this.add.tween(text).to({
	        alpha: 0,
	        width: 0,
	        height: 0
	      }, 300, 'Sine.easeOut', true, 300)

	      tween.onComplete.add(this.addScore, this)
	    },

	    calcPoints: function () {

	      var worldWidth = this.world.width
	      var photoRightCorner = this.currentPhoto.x
	      var percentageOfScreen = (worldWidth - photoRightCorner) / worldWidth
	      var positionScore = Math.floor(percentageOfScreen * 10)

	      var speedScore = Math.floor(this.speed)

	      var keysNeeded = this.keysPressed.length
	      var keysNeededScore = Math.max(10 - keysNeeded, 0)

	      this.totalPhotos = (this.totalPhotos || 0) + 1

	      return positionScore + speedScore + keysNeededScore
	    },

	    addScore: function (tween) {

	      this.score += this.calcPoints()
	      this.scoreText.text = 'SCORE: ' + this.score

	      this.currentPhoto.destroy()

	      this.showNextPhoto()
	    },

	    showNextPhoto: function () {

	      if (this.photoTween) {
	        this.photoTween.stop()
	      }

	      var photo = Phaser.ArrayUtils.getRandomItem(this.rawPhotoData)

	      this.currentPhoto = this.add.image(0, this.world.centerY, photo.image_url)
	      this.currentPhoto.anchor.set(0.5)
	      this.currentPhoto.x -= this.currentPhoto.width / 2
	      this.currentTags = photo.tags
	      this.currentPhoto.alpha = 0

	      this.speed *= 1.2

	      this.playing = true
	      this.keysPressed = []

	      this.add.tween(this.currentPhoto).to({alpha: 1}, 1000, 'Sine.easeOut', true, 100)
	      this.photoTween = this.add.tween(this.currentPhoto).to({x: this.world.width + (this.currentPhoto.width / 2)}, 10000 / this.speed, 'Linear', true, 100)
	      this.photoTween.onComplete.add(this.gameOver, this)

	      if (!Phaser.Device.desktop) {
	        var tips = this.updateTips()
	        $rootScope.$broadcast('tips', tips)
	      }
	    },

	    updateTips: function () {

	      var tags = this.currentTags[this.game.rnd.integerInRange(0, this.currentTags.length - 1)]

	      var tips = []

	      if (tags) {
	        tips.push(tags.substr(0, 1))
	      } else {
	        tips.push(KEYS[this.game.rnd.integerInRange(0, 10)])
	      }
	      tips.push(KEYS[this.game.rnd.integerInRange(0, 10)])
	      tips.push(KEYS[this.game.rnd.integerInRange(10, 20)])
	      tips.push(KEYS[this.game.rnd.integerInRange(20, KEYS.length - 1)])

	      return Phaser.ArrayUtils.shuffle(tips)
	    },

	    selectKey: function (k) {

	      var success = this.currentTags.filter(function (value) {
	        return value.indexOf(k) === 0
	      })

	      this.keysPressed.push(k)
	      this.totalKeys.push(k)

	      if (success.length > 0) {
	        this.success(success)
	      } else {
	        this.updateTips()
	      }
	    },

	    gameOver: function () {

	      GameResults.set({
	        score: this.score,
	        keysPressed: this.totalKeys,
	        maxSpeed: this.speed,
	        tags: {
	          successful: this.successfulTags,
	          total: this.totalTags
	        }
	      })

	      this.game.destroy()

	      $rootScope.$apply(function () {
	        $location.path('/results')
	      })
	    }
	  }

	  return Game
	}])


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* global angular */

	'use strict'

	angular.module('app.results', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {

	  $routeProvider.when('/results', {
	    templateUrl: 'app/views/results/results.view.html',
	    controller: 'ResultsCtrl'
	  })

	}])

	.controller('ResultsCtrl', ['$scope', 'GameResults', function ($scope, GameResults) {

	  var data = GameResults.get()
	  var last = data.results.slice(-1)[0]

	  $scope.score = last.score
	  $scope.highscore = data.highscore
	  $scope.others = data.results.slice(data.results.length - 2)
	  $scope.last = last

	  $scope.labels = data.results.map(function (value, index) { return 'Game ' + (index + 1) })
	  $scope.series = ['Keys Pressed', 'Succesful tags', 'Max speed']

	  $scope.data = data.results.reduce(function (prev, next) {
	    prev[0].push(next.keysPressed.length)
	    prev[1].push(next.tags.successful.length)
	    prev[2].push(next.maxSpeed)
	    return prev
	  }, [[], [], []])
	}])


/***/ }
/******/ ]);