var _createClass = function() {
    function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor); } } return function(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * Created by z on 2017/5/4.
 */

// var _Config = __webpack_require__(3);

// var _Config2 = _interopRequireDefault(_Config);

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var canvas = null;
var context = null;
var stars = null;
var meteors = [];
var count = 0;

var $el = $('.ns-meteor-page');
var width = document.documentElement.clientWidth;
var height = document.documentElement.clientHeight;

// 星星

var Stars = function() {
    function Stars(ctx, width, height, num) {
        _classCallCheck(this, Stars);

        this.ctx = ctx;
        this.width = width * 2;
        this.height = height * 2;
        this.num = num;

        this.init();
    }

    _createClass(Stars, [{
        key: 'init',
        value: function init() {

            this.stars = [];

            for (var i = 0; i < this.num; i++) {

                var star = {};
                star.x = Math.random() * this.width;
                star.y = Math.random() * this.height;
                star.r = Math.random() + 1;

                this.stars.push(star);
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var _this = this;

            this.ctx.save();

            this.stars.forEach(function(star) {
                _this.ctx.fillStyle = _this.getColor();
                _this.ctx.beginPath();
                _this.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
                _this.ctx.fill();
            });

            this.ctx.restore();
        }
    }, {
        key: 'getColor',
        value: function getColor() {

            var n = Math.random();
            var color = void 0;

            if (n < 0.5) {
                color = '#d6edff';
            } else {
                color = '#858bc5';
            }

            return color;
        }
    }]);

    return Stars;
}();
// 流星


var Meteor = function() {
    function Meteor(ctx, width, height) {
        _classCallCheck(this, Meteor);

        this.ctx = ctx;
        this.width = width * 2;
        this.height = height * 2;
        this.init();
    }

    _createClass(Meteor, [{
        key: 'init',
        value: function init() {

            // this.x = this.width - 166;
            this.x = Math.random() * this.width;
            this.y = Math.random() * this.height / 2;

            this.speed = Math.floor(Math.random() * 5 + 2);
        }
    }, {
        key: 'draw',
        value: function draw() {
            var _this2 = this;

            this.ctx.save();

            if (!this.img) {
                this.img = new Image();
                this.img.onload = function() {
                    _this2.ctx.drawImage(_this2.img, _this2.x, _this2.y);
                };
                this.img.src = '../img/bg_meteor.png';
            } else {
                this.ctx.drawImage(this.img, this.x, this.y);
            }

            this.ctx.restore();
        }
    }, {
        key: 'flow',
        value: function flow() {

            // if (this.x < -166 || this.y > this.height) {
            if (this.y > this.height) {
                return true;
            } else {

                return false;
            }
        }
    }, {
        key: 'move',
        value: function move() {
            // let x = 1;
            // let y = 1;
            this.ctx.clearRect(this.x, this.y, 166, 130);

            this.x -= this.speed;
            this.y += this.speed;

            this.draw();
        }
    }]);

    return Meteor;
}();

var init = function init() {

    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');

    canvas.width = width * 2;
    canvas.height = height * 2;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    stars = new Stars(context, width, height, 30);

    stars.draw();

    $el.append(canvas);

    createMeteors();

    animate();
};

var createMeteors = function createMeteors() {

    for (var i = 0; i < 1; i++) {

        meteors.push(new Meteor(context, width, height));

        meteors[i].draw();
    }
};

var animate = function animate() {

    count++;

    if (stars) {
        count % 10 === 0 && stars.draw();
    }
    if (meteors.length > 0) {
        meteors.forEach(function(meteor, index) {

            if (meteor.flow()) {

                context.clearRect(meteor.x, meteor.y, 166, 130);
                meteor.init();
                meteor.draw();
            } else {

                meteor.move();
            }
        });
    }

    requestAnimationFrame(animate);
};
init();