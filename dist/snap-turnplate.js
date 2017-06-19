/**
 * A turnplate plugin by Snap.svg.
 * 
 * Bundle of snap-turnplate
 * Date: 2017-06-19
 * Version: 1.0.0
 * Author: Young Luo
 * 
 * Copyright © 2017 Young Luo.
 */

(function () {
'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}

__$styleInject(".turnplate{padding:3px}.turnplate path{cursor:pointer}.turnplate .active{fill:#28aec9}", undefined);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arguments = arguments;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
        if (target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < _arguments.length; index++) {
            var source = _arguments[index];
            if (source !== null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var Turnplate = function () {
        function Turnplate(options) {
            _classCallCheck(this, Turnplate);

            var defaultOptions = {
                wrapperDom: '',
                outerRadius: 150,
                innerRadius: 0,
                outerBackgroundColor: '#528387',
                innerBackgroundColor: '#848888',
                sectorsBackgroundColor: '#ccc',
                sectorsBorderColor: '#000',
                sectorsBorderWidth: 1,
                section: 1
            };

            this.options = Object.assign({}, defaultOptions, options);
            this._init();

            return this;
        }

        _createClass(Turnplate, [{
            key: '_init',
            value: function _init() {
                var _options = this.options,
                    data = _options.data,
                    section = _options.section,
                    outerRadius = _options.outerRadius,
                    wrapperDom = _options.wrapperDom;

                this.svg = Snap(outerRadius * 2, outerRadius * 2).attr({ class: 'turnplate' });
                if (wrapperDom) {
                    var svg = this.svg.node;
                    svg.parentNode.removeChild(svg);
                    document.querySelector(wrapperDom).appendChild(svg);
                }
                this.rotateDegree = 0;
                this.counts = data.length * section;

                this._drawOuterCircle();
                this._drawSectors();
                this._drawInnerCircle();
            }
        }, {
            key: '_drawOuterCircle',
            value: function _drawOuterCircle() {
                var _options2 = this.options,
                    outerRadius = _options2.outerRadius,
                    outerBackgroundColor = _options2.outerBackgroundColor;

                this.svg.circle(outerRadius, outerRadius, outerRadius).attr({
                    fill: outerBackgroundColor
                });
            }
        }, {
            key: '_drawInnerCircle',
            value: function _drawInnerCircle() {
                var _options3 = this.options,
                    outerRadius = _options3.outerRadius,
                    innerRadius = _options3.innerRadius,
                    innerBackgroundColor = _options3.innerBackgroundColor;

                if (!innerRadius) return;
                this.svg.circle(outerRadius, outerRadius, innerRadius).attr({
                    fill: innerBackgroundColor
                });
            }
        }, {
            key: '_drawSectors',
            value: function _drawSectors() {
                var startAngle = 0;

                var endAngle = 360,
                    rad = Math.PI / 180,
                    _options4 = this.options,
                    outerRadius = _options4.outerRadius,
                    sectorsBackgroundColor = _options4.sectorsBackgroundColor,
                    sectorsBorderColor = _options4.sectorsBorderColor,
                    sectorsBorderWidth = _options4.sectorsBorderWidth,
                    data = _options4.data,
                    g = this.svg.g().attr({
                    class: 'turnplate-g'
                });


                this.gap = (endAngle - startAngle) / this.counts; // each of angle

                for (var index = 0; index < this.counts; index++) {
                    var x1 = outerRadius * (1 + Math.cos(-startAngle * rad)),
                        x2 = outerRadius * (1 + Math.cos(-(startAngle + this.gap) * rad)),
                        y1 = outerRadius * (1 + Math.sin(-startAngle * rad)),
                        y2 = outerRadius * (1 + Math.sin(-(startAngle + this.gap) * rad));

                    var path = this.svg.path(["M", outerRadius, outerRadius, "L", x1, y1, "A", outerRadius, outerRadius, 0, 0, 0, x2, y2, "z"].join(' ')).attr({
                        fill: sectorsBackgroundColor,
                        stroke: sectorsBorderColor,
                        strokeWidth: sectorsBorderWidth
                    }).data('index', index).click(this._clickFn.bind(this));

                    this._setText(path, data[index].text);

                    g.add(path);
                    startAngle += this.gap;
                }
            }
        }, {
            key: '_setText',
            value: function _setText(path, text) {
                var _path$getBBox = path.getBBox(),
                    x = _path$getBBox.x,
                    x2 = _path$getBBox.x2,
                    y = _path$getBBox.y,
                    y2 = _path$getBBox.y2;

                var textX = x + (x2 - x) / 2;
                var textY = y + (y2 - y) / 2;
                var span = document.createElement('text');
                var span2 = document.createElement('textPath');
                span2.textContent = text;
                span.append(span2);
                path.append(span);
            }
        }, {
            key: '_clickFn',
            value: function _clickFn(e) {
                var _this = this;

                var curPath = Snap(e.target),
                    index = curPath.data('index'),
                    outerRadius = this.options.outerRadius;


                this.rotateDegree += index * this.gap;

                this.svg.select('.turnplate-g').animate({
                    transform: 'rotate(' + this.rotateDegree + ',' + outerRadius + ' ' + outerRadius + ')'
                }, 500, mina.easeinout).selectAll('path').forEach(function (path) {
                    var pathIndex = path.data('index') - index;
                    if (pathIndex < 0) {
                        pathIndex += _this.counts;
                    }
                    path.data('index', pathIndex);
                    path.removeClass('active');
                });

                curPath.addClass('active');
            }
        }]);

        return Turnplate;
    }();

    Snap.turnplate = function (options) {
        return new Turnplate(options);
    };
});

}());
