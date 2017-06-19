import './index.css';

if (typeof Object.assign !== 'function') {
    Object.assign = target => {
        if (target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (let index = 1; index < arguments.length; index++) {
            const source = arguments[index];
            if (source !== null) {
                for (let key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

Snap.plugin((Snap, Element, Paper, glob, Fragment) => {
    class Turnplate {
        constructor(options) {
            const defaultOptions = {
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

        _init() {
            const { data, section, outerRadius, wrapperDom } = this.options;
            this.svg = Snap(outerRadius * 2, outerRadius * 2)
                .attr({ class: 'turnplate' });
            if (wrapperDom) {
                const svg = this.svg.node;
                svg.parentNode.removeChild(svg);
                document.querySelector(wrapperDom).appendChild(svg);
            }
            this.rotateDegree = 0;
            this.counts = data.length * section;

            this._drawOuterCircle();
            this._drawSectors();
            this._drawInnerCircle();
        }

        _drawOuterCircle() {
            const { outerRadius, outerBackgroundColor } = this.options;
            this.svg.circle(outerRadius, outerRadius, outerRadius).attr({
                fill: outerBackgroundColor
            });
        }

        _drawInnerCircle() {
            const { outerRadius, innerRadius, innerBackgroundColor } = this.options;
            if (!innerRadius) return;
            this.svg.circle(outerRadius, outerRadius, innerRadius).attr({
                fill: innerBackgroundColor
            });
        }

        _drawSectors() {
            let startAngle = 0;
            const
                endAngle = 360,
                rad = Math.PI / 180,
                { outerRadius, sectorsBackgroundColor, sectorsBorderColor, sectorsBorderWidth, data } = this.options,
                g = this.svg.g().attr({
                    class: 'turnplate-g'
                });

            this.gap = (endAngle - startAngle) / this.counts; // each of angle

            for (let index = 0; index < this.counts; index++) {
                const x1 = outerRadius * (1 + Math.cos(-startAngle * rad)),
                    x2 = outerRadius * (1 + Math.cos(-(startAngle + this.gap) * rad)),
                    y1 = outerRadius * (1 + Math.sin(-startAngle * rad)),
                    y2 = outerRadius * (1 + Math.sin(-(startAngle + this.gap) * rad));

                const path = this.svg.path(["M", outerRadius, outerRadius, "L", x1, y1, "A", outerRadius, outerRadius, 0, 0, 0, x2, y2, "z"].join(' '))
                    .attr({
                        fill: sectorsBackgroundColor,
                        stroke: sectorsBorderColor,
                        strokeWidth: sectorsBorderWidth
                    })
                    .data('index', index)
                    .click(this._clickFn.bind(this));

                this._setText(path, data[index].text);

                g.add(path);
                startAngle += this.gap;
            }
        }

        _setText(path, text) {
            const { x, x2, y, y2 } = path.getBBox();
            const textX = x + (x2 - x) / 2;
            const textY = y + (y2 - y) / 2;
            const span = document.createElement('text');
            const span2 = document.createElement('textPath');
            span2.textContent = text;
            span.append(span2);
            path.append(span);
        }

        _clickFn(e) {
            const curPath = Snap(e.target),
                index = curPath.data('index'),
                { outerRadius } = this.options;

            this.rotateDegree += index * this.gap;

            this.svg
                .select('.turnplate-g')
                .animate({
                    transform: `rotate(${this.rotateDegree},${outerRadius} ${outerRadius})`
                }, 500, mina.easeinout)
                .selectAll('path').forEach(path => {
                    let pathIndex = path.data('index') - index;
                    if (pathIndex < 0) {
                        pathIndex += this.counts;
                    }
                    path.data('index', pathIndex);
                    path.removeClass('active');
                })

            curPath.addClass('active');
        }
    }

    Snap.turnplate = options => {
        return new Turnplate(options);
    };
});
