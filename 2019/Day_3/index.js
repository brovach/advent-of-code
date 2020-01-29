"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Vector = /** @class */ (function () {
    function Vector(p, q) {
        this.p = p;
        this.q = q;
        this.max_x = Math.max(this.p.x, this.q.x);
        this.min_x = Math.min(this.p.x, this.q.x);
        this.max_y = Math.max(this.p.y, this.q.y);
        this.min_y = Math.min(this.p.y, this.q.y);
    }
    Object.defineProperty(Vector.prototype, "A", {
        get: function () {
            return this.q.y - this.p.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "B", {
        get: function () {
            return this.q.x - this.p.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "C", {
        get: function () {
            return this.A * this.p.x + this.B * this.p.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "length", {
        get: function () {
            return this.max_x - this.min_x + this.max_y - this.min_y;
        },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.hasPoint = function (point) {
        if (point.x < this.min_x ||
            point.x > this.max_x ||
            point.y < this.min_y ||
            point.y > this.max_y) {
            return false;
        }
        return true;
    };
    Vector.getIntersectionPoint = function (v1, v2) {
        var denominator = v1.A * v2.B - v2.A * v1.B;
        if (denominator === 0) {
            return null;
        }
        var x = (v2.B * v1.C - v1.B * v2.C) / denominator;
        var y = (v1.A * v2.C - v2.A * v1.C) / denominator;
        return { x: x, y: y };
    };
    return Vector;
}());
var getDistance = function (p, q) {
    return Math.abs(p.x - q.x) + Math.abs(p.y - q.y);
};
var getVectors = function (currentPoint, changes) {
    var vectors = [];
    for (var i = 0; i < changes.length; i++) {
        var change = changes[i];
        var direction = change.slice(0, 1);
        var magnitude = Number(change.slice(1));
        var targetPoint = __assign({}, currentPoint);
        switch (direction) {
            case 'U':
                targetPoint.y += magnitude;
                break;
            case 'D':
                targetPoint.y -= magnitude;
                break;
            case 'L':
                targetPoint.x -= magnitude;
                break;
            case 'R':
                targetPoint.x += magnitude;
                break;
        }
        vectors.push(new Vector(__assign({}, currentPoint), targetPoint));
        currentPoint = targetPoint;
    }
    return vectors;
};
var input = fs.readFileSync('./input.txt', 'utf8');
console.time('exec');
var point0 = { x: 0, y: 0 };
// convert the input into vectors
var instructions = input
    .split('\n')
    .map(function (path) { return path.split(','); });
var wire1 = getVectors(__assign({}, point0), instructions[0]);
var wire2 = getVectors(__assign({}, point0), instructions[1]);
var shortestDistance = Number.MAX_SAFE_INTEGER;
var shortestPath = Number.MAX_SAFE_INTEGER;
for (var i = 0; i < wire1.length; i++) {
    var v1 = wire1[i];
    for (var j = 0; j < wire2.length; j++) {
        var v2 = wire2[j];
        var ip = Vector.getIntersectionPoint(v1, v2);
        if (ip && v1.hasPoint(ip) && v2.hasPoint(ip)) {
            var distance = getDistance(point0, ip);
            // ignore intersection at origin
            if (distance === 0) {
                continue;
            }
            var wire1Length = wire1
                .slice(0, i)
                .reduce(function (sum, v) { return (sum += v.length); }, 0);
            var wire2Length = wire2
                .slice(0, j)
                .reduce(function (sum, v) { return (sum += v.length); }, 0);
            var currentPath = wire1Length +
                wire2Length +
                getDistance(v1.p, ip) +
                getDistance(v2.p, ip);
            if (currentPath < shortestPath) {
                shortestPath = currentPath;
            }
            if (distance < shortestDistance) {
                shortestDistance = distance;
            }
        }
    }
}
console.timeEnd('exec');
console.log('distance to closest intersection', shortestDistance);
console.log('steps to first intersection', shortestPath);
