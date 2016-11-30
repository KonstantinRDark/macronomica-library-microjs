'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _queue = require('queue3');

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Queue = function (_Queue) {
  _inherits(Queue, _Queue);

  function Queue() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$jobs = _ref.jobs,
        jobs = _ref$jobs === undefined ? [] : _ref$jobs,
        options = _objectWithoutProperties(_ref, ['jobs']);

    _classCallCheck(this, Queue);

    var _this = _possibleConstructorReturn(this, (Queue.__proto__ || Object.getPrototypeOf(Queue)).call(this, options));

    _this.__next = undefined;
    _this.waiting = true;

    jobs.forEach(function (job) {
      return _this.push(job);
    });
    return _this;
  }

  _createClass(Queue, [{
    key: 'start',
    value: function start() {
      var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      this.__next = next;
      this.waiting = false;
      return this;
    }
  }, {
    key: 'run',
    value: function run() {
      if (!this.jobs.length && this.__next) {
        return this.__next();
      }

      if (!this.waiting) {
        _get(Queue.prototype.__proto__ || Object.getPrototypeOf(Queue.prototype), 'run', this).call(this);
      }
    }
  }]);

  return Queue;
}(_queue2.default);

exports.default = Queue;
//# sourceMappingURL=queue.js.map