(function (S) {

    function Turntable(id, radius, data, sectionCounts) {
        if (!id) {
            throw new Error('you must specify the id');
        }

        this.svg = S(id);
        this.radius = radius || 50;

        this.sectionCounts = sectionCounts || 4;
        this.dataLen = data.length;
        this.data = data;

        this.rotateDegree = 0;
        this.counts = this.dataLen * this.sectionCounts;

        this.init();
    }

    var turntableFn = Turntable.prototype;

    turntableFn.init = function () {
        this._drawOuterCircle();
        this._drawSectors();
        this._drawInnerCircle();
    }

    turntableFn._drawSectors = function () {
        var self = this,
            startAngle = 0,
            endAngle = 360,
            rad = Math.PI / 180,
            shadow = self.svg.filter(S.filter.shadow(5, 0, 0)),
            g = self.svg.g().attr({
                id: 'sectors-g'
            });

        self.gap = (endAngle - startAngle) / self.counts;

        for (var index = 0; index < self.counts; index++) {
            var x1 = self.radius * (1 + Math.cos(-startAngle * rad)),
                x2 = self.radius * (1 + Math.cos(-(startAngle + self.gap) * rad)),
                y1 = self.radius * (1 + Math.sin(-startAngle * rad)),
                y2 = self.radius * (1 + Math.sin(-(startAngle + self.gap) * rad));

            var path = self.svg.path(["M", self.radius, self.radius, "L", x1, y1, "A", self.radius, self.radius, 0, 0, 0, x2, y2, "z"].join(' '))
                .attr({
                    fill: "#1E1E1E",
                    stroke: '#000',
                    strokeWidth: 1
                })
                .data('index', index)
                .click(self._clickFn.bind(self));

            g.add(path);

            startAngle += self.gap;
        }
    }

    turntableFn._clickFn = function (e) {
        var self = this,
            curPath = S(e.target),
            index = curPath.data('index');

        self.rotateDegree += index * self.gap;

        self.svg
            .select('#sectors-g')
            .animate({
                transform: 'rotate(' + self.rotateDegree + ', ' + self.radius + ' ' + self.radius + ')'
            }, 500, mina.easeinout)
            .selectAll('path').forEach(function (path) {
                var pathIndex = path.data('index') - index;

                if (pathIndex < 0) {
                    pathIndex += self.counts;
                }

                path.data('index', pathIndex);

                path.removeClass('active');
            })

        curPath.addClass('active');
    }

    turntableFn._drawInnerCircle = function () {
        this.svg.circle(this.radius, this.radius, 80).attr({
            fill: "#343434"
        });
    }

    turntableFn._drawOuterCircle = function () {
        this.svg.circle(this.radius, this.radius, this.radius + 5).attr({
            fill: "#528387"
        });
    }

    var data = [
        {
            text: 'demo1',
            url: '#1'
        },
        {
            text: 'demo2',
            url: '#2'
        },
        {
            text: 'demo3',
            url: '#3'
        }
    ];

    new Turntable('#turnplate', 150, data);

}(Snap));