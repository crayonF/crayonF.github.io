(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.bodymovin = factory();
  }
})(window, function () {
  function roundValues(t) {
    bm_rnd = t
      ? Math.round
      : function (t) {
          return t;
        };
  }
  function roundTo2Decimals(t) {
    return Math.round(1e4 * t) / 1e4;
  }
  function roundTo3Decimals(t) {
    return Math.round(100 * t) / 100;
  }
  function styleDiv(t) {
    (t.style.position = "absolute"),
      (t.style.top = 0),
      (t.style.left = 0),
      (t.style.display = "block"),
      (t.style.transformOrigin = t.style.webkitTransformOrigin = "0 0"),
      (t.style.backfaceVisibility = t.style.webkitBackfaceVisibility =
        "visible"),
      (t.style.transformStyle =
        t.style.webkitTransformStyle =
        t.style.mozTransformStyle =
          "preserve-3d");
  }
  function styleUnselectableDiv(t) {
    (t.style.userSelect = "none"),
      (t.style.MozUserSelect = "none"),
      (t.style.webkitUserSelect = "none"),
      (t.style.oUserSelect = "none");
  }
  function BMEnterFrameEvent(t, e, s, r) {
    (this.type = t),
      (this.currentTime = e),
      (this.totalTime = s),
      (this.direction = 0 > r ? -1 : 1);
  }
  function BMCompleteEvent(t, e) {
    (this.type = t), (this.direction = 0 > e ? -1 : 1);
  }
  function BMCompleteLoopEvent(t, e, s, r) {
    (this.type = t),
      (this.currentLoop = e),
      (this.totalLoops = s),
      (this.direction = 0 > r ? -1 : 1);
  }
  function BMSegmentStartEvent(t, e, s) {
    (this.type = t), (this.firstFrame = e), (this.totalFrames = s);
  }
  function BMDestroyEvent(t, e) {
    (this.type = t), (this.target = e);
  }
  function _addEventListener(t, e) {
    this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e);
  }
  function _removeEventListener(t, e) {
    if (e) {
      if (this._cbs[t]) {
        for (var s = 0, r = this._cbs[t].length; r > s; )
          this._cbs[t][s] === e &&
            (this._cbs[t].splice(s, 1), (s -= 1), (r -= 1)),
            (s += 1);
        this._cbs[t].length || (this._cbs[t] = null);
      }
    } else this._cbs[t] = null;
  }
  function _triggerEvent(t, e) {
    if (this._cbs[t])
      for (var s = this._cbs[t].length, r = 0; s > r; r++) this._cbs[t][r](e);
  }
  function randomString(t, e) {
    void 0 === e &&
      (e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
    var s,
      r = "";
    for (s = t; s > 0; --s) r += e[Math.round(Math.random() * (e.length - 1))];
    return r;
  }
  function HSVtoRGB(t, e, s) {
    var r, i, a, n, o, h, l, p;
    switch (
      (1 === arguments.length && ((e = t.s), (s = t.v), (t = t.h)),
      (n = Math.floor(6 * t)),
      (o = 6 * t - n),
      (h = s * (1 - e)),
      (l = s * (1 - o * e)),
      (p = s * (1 - (1 - o) * e)),
      n % 6)
    ) {
      case 0:
        (r = s), (i = p), (a = h);
        break;
      case 1:
        (r = l), (i = s), (a = h);
        break;
      case 2:
        (r = h), (i = s), (a = p);
        break;
      case 3:
        (r = h), (i = l), (a = s);
        break;
      case 4:
        (r = p), (i = h), (a = s);
        break;
      case 5:
        (r = s), (i = h), (a = l);
    }
    return [r, i, a];
  }
  function RGBtoHSV(t, e, s) {
    1 === arguments.length && ((e = t.g), (s = t.b), (t = t.r));
    var r,
      i = Math.max(t, e, s),
      a = Math.min(t, e, s),
      n = i - a,
      o = 0 === i ? 0 : n / i,
      h = i / 255;
    switch (i) {
      case a:
        r = 0;
        break;
      case t:
        (r = e - s + n * (s > e ? 6 : 0)), (r /= 6 * n);
        break;
      case e:
        (r = s - t + 2 * n), (r /= 6 * n);
        break;
      case s:
        (r = t - e + 4 * n), (r /= 6 * n);
    }
    return [r, o, h];
  }
  function addSaturationToRGB(t, e) {
    var s = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
    return (
      (s[1] += e),
      s[1] > 1 ? (s[1] = 1) : s[1] <= 0 && (s[1] = 0),
      HSVtoRGB(s[0], s[1], s[2])
    );
  }
  function addBrightnessToRGB(t, e) {
    var s = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
    return (
      (s[2] += e),
      s[2] > 1 ? (s[2] = 1) : s[2] < 0 && (s[2] = 0),
      HSVtoRGB(s[0], s[1], s[2])
    );
  }
  function addHueToRGB(t, e) {
    var s = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
    return (
      (s[0] += e / 360),
      s[0] > 1 ? (s[0] -= 1) : s[0] < 0 && (s[0] += 1),
      HSVtoRGB(s[0], s[1], s[2])
    );
  }
  function componentToHex(t) {
    var e = t.toString(16);
    return 1 == e.length ? "0" + e : e;
  }
  function fillToRgba(t, e) {
    if (!cachedColors[t]) {
      var s = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
      cachedColors[t] =
        parseInt(s[1], 16) +
        "," +
        parseInt(s[2], 16) +
        "," +
        parseInt(s[3], 16);
    }
    return "rgba(" + cachedColors[t] + "," + e + ")";
  }
  function RenderedFrame(t, e) {
    (this.tr = t), (this.o = e);
  }
  function LetterProps(t, e, s, r, i, a) {
    (this.o = t),
      (this.sw = e),
      (this.sc = s),
      (this.fc = r),
      (this.m = i),
      (this.props = a);
  }
  function iterateDynamicProperties(t) {
    var e,
      s = this.dynamicProperties;
    for (e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(t);
  }
  function reversePath(t, e) {
    var s,
      r,
      i = [],
      a = [],
      n = [],
      o = {},
      h = 0;
    e && ((i[0] = t.o[0]), (a[0] = t.i[0]), (n[0] = t.v[0]), (h = 1)),
      (r = t.i.length);
    var l = r - 1;
    for (s = h; r > s; s += 1)
      i.push(t.o[l]), a.push(t.i[l]), n.push(t.v[l]), (l -= 1);
    return (o.i = i), (o.o = a), (o.v = n), o;
  }
  function Matrix() {}
  function matrixManagerFunction() {
    var t = new Matrix(),
      e = function (e, s, r, i, a) {
        return t.reset().translate(i, a).rotate(e).scale(s, r).toCSS();
      },
      s = function (t) {
        return e(t.tr.r[2], t.tr.s[0], t.tr.s[1], t.tr.p[0], t.tr.p[1]);
      };
    return { getMatrix: s };
  }
  function createElement(t, e, s) {
    if (!e) {
      var r = Object.create(t.prototype, s),
        i = {};
      return (
        r && "[object Function]" === i.toString.call(r.init) && r.init(), r
      );
    }
    (e.prototype = Object.create(t.prototype)),
      (e.prototype.constructor = e),
      (e.prototype._parent = t.prototype);
  }
  function extendPrototype(t, e) {
    for (var s in t.prototype)
      t.prototype.hasOwnProperty(s) && (e.prototype[s] = t.prototype[s]);
  }
  function bezFunction() {
    function t(t, e, s, r, i, a) {
      var n = t * r + e * i + s * a - i * r - a * t - s * e;
      return n > -1e-4 && 1e-4 > n;
    }
    function e(e, s, r, i, a, n, o, h, l) {
      return t(e, s, i, a, o, h) && t(e, r, i, n, o, l);
    }
    function s(t) {
      (this.segmentLength = 0), (this.points = new Array(t));
    }
    function r(t, e) {
      (this.partialLength = t), (this.point = e);
    }
    function i(t, e) {
      var s = e.segments,
        r = s.length,
        i = bm_floor((r - 1) * t),
        a = t * e.addedLength,
        n = 0;
      if (a == s[i].l) return s[i].p;
      for (var o = s[i].l > a ? -1 : 1, h = !0; h; )
        s[i].l <= a && s[i + 1].l > a
          ? ((n = (a - s[i].l) / (s[i + 1].l - s[i].l)), (h = !1))
          : (i += o),
          (0 > i || i >= r - 1) && (h = !1);
      return s[i].p + (s[i + 1].p - s[i].p) * n;
    }
    function a() {
      (this.pt1 = new Array(2)),
        (this.pt2 = new Array(2)),
        (this.pt3 = new Array(2)),
        (this.pt4 = new Array(2));
    }
    function n(t, e, s, r, n, o, h) {
      var l = new a();
      n = 0 > n ? 0 : n > 1 ? 1 : n;
      var p = i(n, h);
      o = o > 1 ? 1 : o;
      var m,
        f = i(o, h),
        d = t.length,
        c = 1 - p,
        u = 1 - f;
      for (m = 0; d > m; m += 1)
        (l.pt1[m] =
          Math.round(
            1e3 *
              (c * c * c * t[m] +
                (p * c * c + c * p * c + c * c * p) * s[m] +
                (p * p * c + c * p * p + p * c * p) * r[m] +
                p * p * p * e[m])
          ) / 1e3),
          (l.pt3[m] =
            Math.round(
              1e3 *
                (c * c * u * t[m] +
                  (p * c * u + c * p * u + c * c * f) * s[m] +
                  (p * p * u + c * p * f + p * c * f) * r[m] +
                  p * p * f * e[m])
            ) / 1e3),
          (l.pt4[m] =
            Math.round(
              1e3 *
                (c * u * u * t[m] +
                  (p * u * u + c * f * u + c * u * f) * s[m] +
                  (p * f * u + c * f * f + p * u * f) * r[m] +
                  p * f * f * e[m])
            ) / 1e3),
          (l.pt2[m] =
            Math.round(
              1e3 *
                (u * u * u * t[m] +
                  (f * u * u + u * f * u + u * u * f) * s[m] +
                  (f * f * u + u * f * f + f * u * f) * r[m] +
                  f * f * f * e[m])
            ) / 1e3);
      return l;
    }
    var o =
        (Math,
        (function () {
          function t(t, e) {
            (this.l = t), (this.p = e);
          }
          var e = {};
          return function (s, r, i, a) {
            var n = (
              s.join("_") +
              "_" +
              r.join("_") +
              "_" +
              i.join("_") +
              "_" +
              a.join("_")
            ).replace(/\./g, "p");
            if (e[n]) return e[n];
            var o,
              h,
              l,
              p,
              m,
              f,
              d = defaultCurveSegments,
              c = 0,
              u = [],
              y = [],
              g = { addedLength: 0, segments: [] };
            for (l = i.length, o = 0; d > o; o += 1) {
              for (m = o / (d - 1), f = 0, h = 0; l > h; h += 1)
                (p =
                  bm_pow(1 - m, 3) * s[h] +
                  3 * bm_pow(1 - m, 2) * m * i[h] +
                  3 * (1 - m) * bm_pow(m, 2) * a[h] +
                  bm_pow(m, 3) * r[h]),
                  (u[h] = p),
                  null !== y[h] && (f += bm_pow(u[h] - y[h], 2)),
                  (y[h] = u[h]);
              f && ((f = bm_sqrt(f)), (c += f)), g.segments.push(new t(c, m));
            }
            return (g.addedLength = c), (e[n] = g), g;
          };
        })()),
      h = (function () {
        var e = {};
        return function (i) {
          var a = i.s,
            n = i.e,
            o = i.to,
            h = i.ti,
            l = (
              a.join("_") +
              "_" +
              n.join("_") +
              "_" +
              o.join("_") +
              "_" +
              h.join("_")
            ).replace(/\./g, "p");
          if (e[l]) return void (i.bezierData = e[l]);
          var p,
            m,
            f,
            d,
            c,
            u,
            y,
            g = defaultCurveSegments,
            v = 0,
            b = null;
          2 === a.length &&
            (a[0] != n[0] || a[1] != n[1]) &&
            t(a[0], a[1], n[0], n[1], a[0] + o[0], a[1] + o[1]) &&
            t(a[0], a[1], n[0], n[1], n[0] + h[0], n[1] + h[1]) &&
            (g = 2);
          var P = new s(g);
          for (f = o.length, p = 0; g > p; p += 1) {
            for (y = new Array(f), c = p / (g - 1), u = 0, m = 0; f > m; m += 1)
              (d =
                bm_pow(1 - c, 3) * a[m] +
                3 * bm_pow(1 - c, 2) * c * (a[m] + o[m]) +
                3 * (1 - c) * bm_pow(c, 2) * (n[m] + h[m]) +
                bm_pow(c, 3) * n[m]),
                (y[m] = d),
                null !== b && (u += bm_pow(y[m] - b[m], 2));
            (u = bm_sqrt(u)), (v += u), (P.points[p] = new r(u, y)), (b = y);
          }
          (P.segmentLength = v), (i.bezierData = P), (e[l] = P);
        };
      })();
    return {
      getBezierLength: o,
      getNewSegment: n,
      buildBezierData: h,
      pointOnLine2D: t,
      pointOnLine3D: e,
    };
  }
  function dataFunctionManager() {
    function t(i, a, o) {
      var h,
        l,
        p,
        m,
        f,
        d,
        c,
        u,
        y = i.length;
      for (m = 0; y > m; m += 1)
        if (((h = i[m]), "ks" in h && !h.completed)) {
          if (
            ((h.completed = !0),
            h.tt && (i[m - 1].td = h.tt),
            (l = []),
            (p = -1),
            h.hasMask)
          ) {
            var g = h.masksProperties;
            for (d = g.length, f = 0; d > f; f += 1)
              if (g[f].pt.k.i) r(g[f].pt.k);
              else
                for (u = g[f].pt.k.length, c = 0; u > c; c += 1)
                  g[f].pt.k[c].s && r(g[f].pt.k[c].s[0]),
                    g[f].pt.k[c].e && r(g[f].pt.k[c].e[0]);
          }
          0 === h.ty
            ? ((h.layers = e(h.refId, a)), t(h.layers, a, o))
            : 4 === h.ty
            ? s(h.shapes)
            : 5 == h.ty && n(h, o);
        }
    }
    function e(t, e) {
      for (var s = 0, r = e.length; r > s; ) {
        if (e[s].id === t) return JSON.parse(JSON.stringify(e[s].layers));
        s += 1;
      }
    }
    function s(t) {
      var e,
        i,
        a,
        n = t.length;
      for (e = n - 1; e >= 0; e -= 1)
        if ("sh" == t[e].ty)
          if (t[e].ks.k.i) r(t[e].ks.k);
          else
            for (a = t[e].ks.k.length, i = 0; a > i; i += 1)
              t[e].ks.k[i].s && r(t[e].ks.k[i].s[0]),
                t[e].ks.k[i].e && r(t[e].ks.k[i].e[0]);
        else "gr" == t[e].ty && s(t[e].it);
    }
    function r(t) {
      var e,
        s = t.i.length;
      for (e = 0; s > e; e += 1)
        (t.i[e][0] += t.v[e][0]),
          (t.i[e][1] += t.v[e][1]),
          (t.o[e][0] += t.v[e][0]),
          (t.o[e][1] += t.v[e][1]);
    }
    function i(t, e) {
      var s = e ? e.split(".") : [100, 100, 100];
      return t[0] > s[0]
        ? !0
        : s[0] > t[0]
        ? !1
        : t[1] > s[1]
        ? !0
        : s[1] > t[1]
        ? !1
        : t[2] > s[2]
        ? !0
        : s[2] > t[2]
        ? !1
        : void 0;
    }
    function a(e, s) {
      o(e), t(e.layers, e.assets, s);
    }
    function n(t, e) {
      var s,
        r,
        i,
        a,
        n,
        o,
        h,
        l = [],
        p = t.t.d,
        m = 0,
        f = t.t.m.g,
        d = 0,
        c = 0,
        u = 0,
        y = [],
        g = 0,
        v = 0,
        b = e.getFontByName(p.f),
        P = 0,
        E = b.fStyle.split(" "),
        k = "normal",
        S = "normal";
      for (r = E.length, s = 0; r > s; s += 1)
        "italic" === E[s].toLowerCase()
          ? (S = "italic")
          : "bold" === E[s].toLowerCase()
          ? (k = "700")
          : "black" === E[s].toLowerCase()
          ? (k = "900")
          : "medium" === E[s].toLowerCase()
          ? (k = "500")
          : "regular" === E[s].toLowerCase() || "normal" === E[s].toLowerCase()
          ? (k = "400")
          : ("light" === E[s].toLowerCase() || "thin" === E[s].toLowerCase()) &&
            (k = "200");
      if (((p.fWeight = k), (p.fStyle = S), (r = p.t.length), p.sz)) {
        var x = p.sz[0],
          M = -1;
        for (s = 0; r > s; s += 1)
          (i = !1),
            " " === p.t.charAt(s)
              ? (M = s)
              : 13 === p.t.charCodeAt(s) && ((g = 0), (i = !0)),
            e.chars
              ? ((h = e.getCharData(p.t.charAt(s), b.fStyle, b.fFamily)),
                (P = i ? 0 : (h.w * p.s) / 100))
              : (P = e.measureText(p.t.charAt(s), p.f, p.s)),
            g + P > x
              ? (-1 === M
                  ? ((p.t = p.t.substr(0, s) + "\r" + p.t.substr(s)), (r += 1))
                  : ((s = M),
                    (p.t = p.t.substr(0, s) + "\r" + p.t.substr(s + 1))),
                (M = -1),
                (g = 0))
              : (g += P);
        r = p.t.length;
      }
      for (g = 0, P = 0, s = 0; r > s; s += 1)
        if (
          ((i = !1),
          " " === p.t.charAt(s)
            ? (a = "� ")
            : 13 === p.t.charCodeAt(s)
            ? (y.push(g),
              (v = g > v ? g : v),
              (g = 0),
              (a = ""),
              (i = !0),
              (u += 1))
            : (a = p.t.charAt(s)),
          e.chars
            ? ((h = e.getCharData(
                p.t.charAt(s),
                b.fStyle,
                e.getFontByName(p.f).fFamily
              )),
              (P = i ? 0 : (h.w * p.s) / 100))
            : (P = e.measureText(a, p.f, p.s)),
          (g += P),
          l.push({ l: P, an: P, add: d, n: i, anIndexes: [], val: a, line: u }),
          2 == f)
        ) {
          if (((d += P), "" == a || "� " == a || s == r - 1)) {
            for (("" == a || "� " == a) && (d -= P); s >= c; )
              (l[c].an = d), (l[c].ind = m), (l[c].extra = P), (c += 1);
            (m += 1), (d = 0);
          }
        } else if (3 == f) {
          if (((d += P), "" == a || s == r - 1)) {
            for ("" == a && (d -= P); s >= c; )
              (l[c].an = d), (l[c].ind = m), (l[c].extra = P), (c += 1);
            (d = 0), (m += 1);
          }
        } else (l[m].ind = m), (l[m].extra = 0), (m += 1);
      if (((p.l = l), (v = g > v ? g : v), y.push(g), p.sz))
        (p.boxWidth = p.sz[0]), (t.t.d.justifyOffset = 0);
      else
        switch (((p.boxWidth = v), p.j)) {
          case 1:
            t.t.d.justifyOffset = -p.boxWidth;
            break;
          case 2:
            t.t.d.justifyOffset = -p.boxWidth / 2;
            break;
          default:
            t.t.d.justifyOffset = 0;
        }
      p.lineWidths = y;
      var C = t.t.a;
      o = C.length;
      var D,
        w,
        T = [];
      for (n = 0; o > n; n += 1) {
        for (
          C[n].a.sc && (p.strokeColorAnim = !0),
            C[n].a.sw && (p.strokeWidthAnim = !0),
            (C[n].a.fc || C[n].a.fh || C[n].a.fs || C[n].a.fb) &&
              (p.fillColorAnim = !0),
            w = 0,
            D = C[n].s.b,
            s = 0;
          r > s;
          s += 1
        )
          (l[s].anIndexes[n] = w),
            ((1 == D && "" != l[s].val) ||
              (2 == D && "" != l[s].val && "� " != l[s].val) ||
              (3 == D && (l[s].n || "� " == l[s].val || s == r - 1)) ||
              (4 == D && (l[s].n || s == r - 1))) &&
              (1 === C[n].s.rn && T.push(w), (w += 1));
        t.t.a[n].s.totalChars = w;
        var F,
          I = -1;
        if (1 === C[n].s.rn)
          for (s = 0; r > s; s += 1)
            I != l[s].anIndexes[n] &&
              ((I = l[s].anIndexes[n]),
              (F = T.splice(Math.floor(Math.random() * T.length), 1)[0])),
              (l[s].anIndexes[n] = F);
      }
      0 !== o || "m" in t.t.p || (t.singleShape = !0),
        (p.yOffset = 1.2 * p.s),
        (p.ascent = (b.ascent * p.s) / 100);
    }
    var o = (function () {
        function t(e) {
          var s,
            r,
            i,
            a = e.length;
          for (s = 0; a > s; s += 1)
            if ("gr" === e[s].ty) t(e[s].it);
            else if ("fl" === e[s].ty || "st" === e[s].ty)
              if (e[s].c.k && e[s].c.k[0].i)
                for (i = e[s].c.k.length, r = 0; i > r; r += 1)
                  e[s].c.k[r].s &&
                    ((e[s].c.k[r].s[0] /= 255),
                    (e[s].c.k[r].s[1] /= 255),
                    (e[s].c.k[r].s[2] /= 255),
                    (e[s].c.k[r].s[3] /= 255)),
                    e[s].c.k[r].e &&
                      ((e[s].c.k[r].e[0] /= 255),
                      (e[s].c.k[r].e[1] /= 255),
                      (e[s].c.k[r].e[2] /= 255),
                      (e[s].c.k[r].e[3] /= 255));
              else
                (e[s].c.k[0] /= 255),
                  (e[s].c.k[1] /= 255),
                  (e[s].c.k[2] /= 255),
                  (e[s].c.k[3] /= 255);
        }
        function e(e) {
          var s,
            r = e.length;
          for (s = 0; r > s; s += 1) 4 === e[s].ty && t(e[s].shapes);
        }
        var s = [4, 1, 9];
        return function (t) {
          if (i(s, t.v) && (e(t.layers), t.assets)) {
            var r,
              a = t.assets.length;
            for (r = 0; a > r; r += 1)
              t.assets[r].layers && e(t.assets[r].layers);
          }
        };
      })(),
      h = {};
    return (h.completeData = a), h;
  }
  function ShapeModifier() {}
  function TrimModifier() {}
  function RoundCornersModifier() {}
  function SVGRenderer(t, e) {
    (this.animationItem = t),
      (this.layers = null),
      (this.renderedFrame = -1),
      (this.globalData = { frameNum: -1 }),
      (this.renderConfig = {
        preserveAspectRatio: (e && e.preserveAspectRatio) || "xMidYMid meet",
      }),
      (this.elements = []),
      (this.destroyed = !1);
  }
  function CanvasRenderer(t, e) {
    (this.animationItem = t),
      (this.renderConfig = {
        clearCanvas: (e && e.clearCanvas) || !0,
        context: (e && e.context) || null,
        scaleMode: (e && e.scaleMode) || "fit",
      }),
      (this.renderConfig.dpr = (e && e.dpr) || 1),
      this.animationItem.wrapper &&
        (this.renderConfig.dpr = (e && e.dpr) || window.devicePixelRatio || 1),
      (this.renderedFrame = -1),
      (this.globalData = { frameNum: -1 }),
      (this.contextData = {
        saved: Array.apply(null, { length: 15 }),
        savedOp: Array.apply(null, { length: 15 }),
        cArrPos: 0,
        cTr: new Matrix(),
        cO: 1,
      });
    var s,
      r = 15;
    for (s = 0; r > s; s += 1)
      this.contextData.saved[s] = Array.apply(null, { length: 16 });
    (this.elements = []), (this.transformMat = new Matrix());
  }
  function HybridRenderer(t) {
    (this.animationItem = t),
      (this.layers = null),
      (this.renderedFrame = -1),
      (this.globalData = { frameNum: -1 }),
      (this.elements = []),
      (this.threeDElements = []),
      (this.destroyed = !1),
      (this.camera = null);
  }
  function MaskElement(t, e, s) {
    (this.dynamicProperties = []),
      (this.data = t),
      (this.element = e),
      (this.globalData = s),
      (this.paths = []),
      (this.storedData = []),
      (this.masksProperties = this.data.masksProperties),
      (this.viewData = new Array(this.masksProperties.length)),
      (this.maskElement = null),
      (this.firstFrame = !0);
    var r,
      i,
      a,
      n,
      o,
      h,
      l,
      p,
      m = (this.element.maskedElement, this.globalData.defs),
      f = this.masksProperties.length,
      d = this.masksProperties,
      c = 0,
      u = [],
      y = randomString(10),
      g = "clipPath",
      v = "clip-path";
    for (r = 0; f > r; r++)
      if (
        ((("a" !== d[r].mode && "n" !== d[r].mode) || d[r].inv) &&
          ((g = "mask"), (v = "mask")),
        ("s" != d[r].mode && "i" != d[r].mode) ||
          0 != c ||
          ((o = document.createElementNS(svgNS, "rect")),
          o.setAttribute("fill", "#ffffff"),
          o.setAttribute("x", "0"),
          o.setAttribute("y", "0"),
          o.setAttribute("width", "100%"),
          o.setAttribute("height", "100%"),
          u.push(o)),
        "n" != d[r].mode && d[r].cl !== !1)
      ) {
        if (
          ((c += 1),
          (i = document.createElementNS(svgNS, "path")),
          d[r].cl
            ? "s" == d[r].mode
              ? i.setAttribute("fill", "#000000")
              : i.setAttribute("fill", "#ffffff")
            : (i.setAttribute("fill", "none"),
              "s" == d[r].mode
                ? i.setAttribute("fill", "#000000")
                : i.setAttribute("fill", "#ffffff"),
              i.setAttribute("stroke-width", "1"),
              i.setAttribute("stroke-miterlimit", "10")),
          i.setAttribute("clip-rule", "nonzero"),
          0 !== d[r].x.k)
        ) {
          (g = "mask"),
            (v = "mask"),
            (p = PropertyFactory.getProp(
              this.element,
              d[r].x,
              0,
              null,
              this.dynamicProperties
            ));
          var b = "fi_" + randomString(10);
          (h = document.createElementNS(svgNS, "filter")),
            h.setAttribute("id", b),
            (l = document.createElementNS(svgNS, "feMorphology")),
            l.setAttribute("operator", "dilate"),
            l.setAttribute("in", "SourceGraphic"),
            l.setAttribute("radius", "0"),
            h.appendChild(l),
            m.appendChild(h),
            "s" == d[r].mode
              ? i.setAttribute("stroke", "#000000")
              : i.setAttribute("stroke", "#ffffff");
        } else (l = null), (p = null);
        if (
          ((this.storedData[r] = {
            elem: i,
            x: p,
            expan: l,
            lastPath: "",
            lastOperator: "",
            filterId: b,
            lastRadius: 0,
          }),
          "i" == d[r].mode)
        ) {
          n = u.length;
          var P = document.createElementNS(svgNS, "g");
          for (a = 0; n > a; a += 1) P.appendChild(u[a]);
          var E = document.createElementNS(svgNS, "mask");
          E.setAttribute("mask-type", "alpha"),
            E.setAttribute("id", y + "_" + c),
            E.appendChild(i),
            m.appendChild(E),
            P.setAttribute("mask", "url(#" + y + "_" + c + ")"),
            (u.length = 0),
            u.push(P);
        } else u.push(i);
        d[r].inv &&
          !this.solidPath &&
          (this.solidPath = this.createLayerSolidPath()),
          (this.viewData[r] = {
            elem: i,
            lastPath: "",
            prop: ShapePropertyFactory.getShapeProp(
              this.element,
              d[r],
              3,
              this.dynamicProperties,
              null
            ),
          }),
          this.viewData[r].prop.k ||
            this.drawPath(d[r], this.viewData[r].prop.v, this.viewData[r]);
      } else
        this.viewData[r] = {
          prop: ShapePropertyFactory.getShapeProp(
            this.element,
            d[r],
            3,
            this.dynamicProperties,
            null
          ),
        };
    for (
      this.maskElement = document.createElementNS(svgNS, g),
        f = u.length,
        r = 0;
      f > r;
      r += 1
    )
      this.maskElement.appendChild(u[r]);
    this.maskElement.setAttribute("id", y),
      c > 0 && this.element.maskedElement.setAttribute(v, "url(#" + y + ")"),
      m.appendChild(this.maskElement);
  }
  function BaseElement() {}
  function SVGBaseElement(t, e, s, r, i) {
    (this.globalData = s),
      (this.comp = r),
      (this.data = t),
      (this.matteElement = null),
      (this.parentContainer = e),
      (this.layerId = i ? i.layerId : "ly_" + randomString(10)),
      (this.placeholder = i),
      this.init();
  }
  function ITextElement(t, e, s, r) {}
  function SVGTextElement(t, e, s, r, i) {
    (this.textSpans = []),
      (this.renderType = "svg"),
      this._parent.constructor.call(this, t, e, s, r, i);
  }
  function ICompElement(t, e, s, r, i) {
    this._parent.constructor.call(this, t, e, s, r, i),
      (this.layers = t.layers),
      (this.isSvg = !0),
      this.data.tm &&
        (this.tm = PropertyFactory.getProp(
          this,
          this.data.tm,
          0,
          s.frameRate,
          this.dynamicProperties
        ));
  }
  function IImageElement(t, e, s, r, i) {
    (this.assetData = s.getAssetData(t.refId)),
      (this.path = s.getPath()),
      this._parent.constructor.call(this, t, e, s, r, i);
  }
  function IShapeElement(t, e, s, r, i) {
    (this.shapes = []),
      (this.shapesData = t.shapes),
      (this.stylesList = []),
      (this.viewData = []),
      (this.shapeModifiers = []),
      (this.shapesContainer = document.createElementNS(svgNS, "g")),
      this._parent.constructor.call(this, t, e, s, r, i);
  }
  function ISolidElement(t, e, s, r, i) {
    this._parent.constructor.call(this, t, e, s, r, i);
  }
  function CVBaseElement(t, e, s) {
    (this.globalData = s),
      (this.data = t),
      (this.comp = e),
      (this.canvasContext = s.canvasContext),
      this.init();
  }
  function CVCompElement(t, e, s) {
    this._parent.constructor.call(this, t, e, s);
    var r = {};
    for (var i in s) s.hasOwnProperty(i) && (r[i] = s[i]);
    (r.renderer = this),
      (r.compHeight = this.data.h),
      (r.compWidth = this.data.w),
      (this.renderConfig = { clearCanvas: !0 }),
      (this.contextData = {
        saved: Array.apply(null, { length: 15 }),
        savedOp: Array.apply(null, { length: 15 }),
        cArrPos: 0,
        cTr: new Matrix(),
        cO: 1,
      });
    var a,
      n = 15;
    for (a = 0; n > a; a += 1)
      this.contextData.saved[a] = Array.apply(null, { length: 16 });
    (this.transformMat = new Matrix()),
      (this.parentGlobalData = this.globalData);
    var o = document.createElement("canvas");
    (r.canvasContext = o.getContext("2d")),
      (this.canvasContext = r.canvasContext),
      (o.width = this.data.w),
      (o.height = this.data.h),
      (this.canvas = o),
      (this.globalData = r),
      (this.layers = t.layers),
      this.data.tm &&
        (this.tm = PropertyFactory.getProp(
          this,
          this.data.tm,
          0,
          s.frameRate,
          this.dynamicProperties
        ));
  }
  function CVImageElement(t, e, s) {
    (this.assetData = s.getAssetData(t.refId)),
      (this.path = s.getPath()),
      this._parent.constructor.call(this, t, e, s),
      this.globalData.addPendingElement();
  }
  function CVMaskElement(t, e) {
    (this.data = t),
      (this.element = e),
      (this.dynamicProperties = []),
      (this.masksProperties = this.data.masksProperties),
      (this.viewData = new Array(this.masksProperties.length));
    var s,
      r = this.masksProperties.length;
    for (s = 0; r > s; s++)
      this.viewData[s] = ShapePropertyFactory.getShapeProp(
        this.element,
        this.masksProperties[s],
        3,
        this.dynamicProperties,
        null
      );
  }
  function CVShapeElement(t, e, s) {
    (this.shapes = []),
      (this.stylesList = []),
      (this.viewData = []),
      (this.shapeModifiers = []),
      (this.shapesData = t.shapes),
      (this.firstFrame = !0),
      this._parent.constructor.call(this, t, e, s);
  }
  function CVSolidElement(t, e, s) {
    this._parent.constructor.call(this, t, e, s);
  }
  function CVTextElement(t, e, s) {
    (this.textSpans = []),
      (this.yOffset = 0),
      (this.fillColorAnim = !1),
      (this.strokeColorAnim = !1),
      (this.strokeWidthAnim = !1),
      (this.stroke = !1),
      (this.fill = !1),
      (this.justifyOffset = 0),
      (this.currentRender = null),
      (this.renderType = "canvas"),
      (this.values = {
        fill: "rgba(0,0,0,0)",
        stroke: "rgba(0,0,0,0)",
        sWidth: 0,
        fValue: "",
      }),
      this._parent.constructor.call(this, t, e, s);
  }
  function HBaseElement(t, e, s, r, i) {
    (this.globalData = s),
      (this.comp = r),
      (this.data = t),
      (this.matteElement = null),
      (this.parentContainer = e),
      (this.layerId = i ? i.layerId : "ly_" + randomString(10)),
      (this.placeholder = i),
      this.init();
  }
  function HSolidElement(t, e, s, r, i) {
    this._parent.constructor.call(this, t, e, s, r, i);
  }
  function HCompElement(t, e, s, r, i) {
    this._parent.constructor.call(this, t, e, s, r, i),
      (this.layers = t.layers),
      (this.isSvg = !1),
      this.data.tm &&
        (this.tm = PropertyFactory.getProp(
          this,
          this.data.tm,
          0,
          s.frameRate,
          this.dynamicProperties
        )),
      this.data.hasMask && (this.isSvg = !0);
  }
  function HShapeElement(t, e, s, r, i) {
    (this.shapes = []),
      (this.shapeModifiers = []),
      (this.shapesData = t.shapes),
      (this.stylesList = []),
      (this.viewData = []),
      this._parent.constructor.call(this, t, e, s, r, i);
  }
  function HTextElement(t, e, s, r, i) {
    (this.textSpans = []),
      (this.textPaths = []),
      (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 }),
      (this.renderType = "svg"),
      (this.isMasked = !1),
      this._parent.constructor.call(this, t, e, s, r, i);
  }
  function HImageElement(t, e, s, r, i) {
    (this.assetData = s.getAssetData(t.refId)),
      (this.path = s.getPath()),
      this._parent.constructor.call(this, t, e, s, r, i);
  }
  function HCameraElement(t, e, s, r, i) {
    if (
      (this._parent.constructor.call(this, t, e, s, r, i),
      (this.pe = PropertyFactory.getProp(
        this,
        t.pe,
        0,
        0,
        this.dynamicProperties
      )),
      t.ks.p.s
        ? ((this.px = PropertyFactory.getProp(
            this,
            t.ks.p.x,
            1,
            0,
            this.dynamicProperties
          )),
          (this.py = PropertyFactory.getProp(
            this,
            t.ks.p.y,
            1,
            0,
            this.dynamicProperties
          )),
          (this.pz = PropertyFactory.getProp(
            this,
            t.ks.p.z,
            1,
            0,
            this.dynamicProperties
          )))
        : (this.p = PropertyFactory.getProp(
            this,
            t.ks.p,
            1,
            0,
            this.dynamicProperties
          )),
      t.ks.a &&
        (this.a = PropertyFactory.getProp(
          this,
          t.ks.a,
          1,
          0,
          this.dynamicProperties
        )),
      t.ks.or.k.length)
    ) {
      var a,
        n = t.ks.or.k.length;
      for (a = 0; n > a; a += 1)
        (t.ks.or.k[a].to = null), (t.ks.or.k[a].ti = null);
    }
    (this.or = PropertyFactory.getProp(
      this,
      t.ks.or,
      1,
      degToRads,
      this.dynamicProperties
    )),
      (this.or.sh = !0),
      (this.rx = PropertyFactory.getProp(
        this,
        t.ks.rx,
        0,
        degToRads,
        this.dynamicProperties
      )),
      (this.ry = PropertyFactory.getProp(
        this,
        t.ks.ry,
        0,
        degToRads,
        this.dynamicProperties
      )),
      (this.rz = PropertyFactory.getProp(
        this,
        t.ks.rz,
        0,
        degToRads,
        this.dynamicProperties
      )),
      (this.mat = new Matrix());
  }
  function SliderEffect(t, e, s) {
    this.p = PropertyFactory.getProp(e, t.v, 0, 0, s);
  }
  function AngleEffect(t, e, s) {
    this.p = PropertyFactory.getProp(e, t.v, 0, 0, s);
  }
  function ColorEffect(t, e, s) {
    this.p = PropertyFactory.getProp(e, t.v, 1, 0, s);
  }
  function PointEffect(t, e, s) {
    this.p = PropertyFactory.getProp(e, t.v, 1, 0, s);
  }
  function CheckboxEffect(t, e, s) {
    this.p = PropertyFactory.getProp(e, t.v, 1, 0, s);
  }
  function NoValueEffect(t, e, s) {
    this.p = {};
  }
  function groupEffectFunction(t) {}
  function GroupEffect() {
    var t = groupEffectFunction;
    return t;
  }
  function EffectsManager(t, e, s) {
    var r,
      i,
      a = t.ef,
      n = [],
      o = a.length;
    for (r = 0; o > r; r++)
      switch (a[r].ty) {
        case 0:
          (i = new SliderEffect(a[r], e, s)), n.push(i.proxyFunction.bind(i));
          break;
        case 1:
          (i = new AngleEffect(a[r], e, s)), n.push(i.proxyFunction.bind(i));
          break;
        case 2:
          (i = new ColorEffect(a[r], e, s)), n.push(i.proxyFunction.bind(i));
          break;
        case 3:
          (i = new PointEffect(a[r], e, s)), n.push(i.proxyFunction.bind(i));
          break;
        case 4:
        case 7:
          (i = new CheckboxEffect(a[r], e, s)), n.push(i.proxyFunction.bind(i));
          break;
        case 5:
          (i = new EffectsManager(a[r], e, s)), n.push(i);
          break;
        case 6:
          (i = new NoValueEffect(a[r], e, s)), n.push(i);
      }
    var h = function (e) {
      for (var s = t.ef, r = 0, i = s.length; i > r; ) {
        if (e === s[r].nm || e === s[r].ix)
          return 5 === s[r].ty ? n[r] : n[r]();
        r += 1;
      }
    };
    return h;
  }
  var svgNS = "http://www.w3.org/2000/svg",
    subframeEnabled = !0,
    expressionsPlugin,
    isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    cachedColors = {},
    bm_rounder = Math.round,
    bm_rnd,
    bm_pow = Math.pow,
    bm_sqrt = Math.sqrt,
    bm_abs = Math.abs,
    bm_floor = Math.floor,
    bm_max = Math.max,
    bm_min = Math.min,
    BMMath = {};
  !(function () {
    var t,
      e = Object.getOwnPropertyNames(Math),
      s = e.length;
    for (t = 0; s > t; t += 1) BMMath[e[t]] = Math[e[t]];
  })(),
    (BMMath.random = Math.random),
    (BMMath.abs = function (t) {
      var e = typeof t;
      if ("object" === e && t.length) {
        var s,
          r = Array.apply(null, { length: t.length }),
          i = t.length;
        for (s = 0; i > s; s += 1) r[s] = Math.abs(t[s]);
        return r;
      }
      return t;
    });
  var defaultCurveSegments = 75,
    degToRads = Math.PI / 180,
    roundCorner = 0.5519;
  roundValues(!1);
  var rgbToHex = (function () {
      var t,
        e,
        s = [];
      for (t = 0; 256 > t; t += 1)
        (e = t.toString(16)), (s[t] = 1 == e.length ? "0" + e : e);
      return function (t, e, r) {
        return (
          0 > t && (t = 0),
          0 > e && (e = 0),
          0 > r && (r = 0),
          "#" + s[t] + s[e] + s[r]
        );
      };
    })(),
    fillColorToString = (function () {
      var t = [];
      return function (e, s) {
        return (
          void 0 !== s && (e[3] = s),
          t[e[0]] || (t[e[0]] = {}),
          t[e[0]][e[1]] || (t[e[0]][e[1]] = {}),
          t[e[0]][e[1]][e[2]] || (t[e[0]][e[1]][e[2]] = {}),
          t[e[0]][e[1]][e[2]][e[3]] ||
            (t[e[0]][e[1]][e[2]][e[3]] = "rgba(" + e.join(",") + ")"),
          t[e[0]][e[1]][e[2]][e[3]]
        );
      };
    })(),
    Matrix = (function () {
      function t() {
        return (
          (this.props[0] = 1),
          (this.props[1] = 0),
          (this.props[2] = 0),
          (this.props[3] = 0),
          (this.props[4] = 0),
          (this.props[5] = 1),
          (this.props[6] = 0),
          (this.props[7] = 0),
          (this.props[8] = 0),
          (this.props[9] = 0),
          (this.props[10] = 1),
          (this.props[11] = 0),
          (this.props[12] = 0),
          (this.props[13] = 0),
          (this.props[14] = 0),
          (this.props[15] = 1),
          this
        );
      }
      function e(t) {
        if (0 === t) return this;
        var e = Math.cos(t),
          s = Math.sin(t);
        return this._t(e, -s, 0, 0, s, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function s(t) {
        if (0 === t) return this;
        var e = Math.cos(t),
          s = Math.sin(t);
        return this._t(1, 0, 0, 0, 0, e, -s, 0, 0, s, e, 0, 0, 0, 0, 1);
      }
      function r(t) {
        if (0 === t) return this;
        var e = Math.cos(t),
          s = Math.sin(t);
        return this._t(e, 0, s, 0, 0, 1, 0, 0, -s, 0, e, 0, 0, 0, 0, 1);
      }
      function i(t) {
        if (0 === t) return this;
        var e = Math.cos(t),
          s = Math.sin(t);
        return this._t(e, -s, 0, 0, s, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function a(t, e) {
        return this._t(1, e, t, 1, 0, 0);
      }
      function n(t, e) {
        return this.shear(Math.tan(t), Math.tan(e));
      }
      function o(t, e) {
        var s = Math.cos(e),
          r = Math.sin(e);
        return this._t(s, r, 0, 0, -r, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
          ._t(1, 0, 0, 0, Math.tan(t), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
          ._t(s, -r, 0, 0, r, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function h(t, e, s) {
        return (
          (s = isNaN(s) ? 1 : s),
          1 == t && 1 == e && 1 == s
            ? this
            : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, s, 0, 0, 0, 0, 1)
        );
      }
      function l(t, e, s, r, i, a, n, o, h, l, p, m, f, d, c, u) {
        return (
          (this.props[0] = t),
          (this.props[1] = e),
          (this.props[2] = s),
          (this.props[3] = r),
          (this.props[4] = i),
          (this.props[5] = a),
          (this.props[6] = n),
          (this.props[7] = o),
          (this.props[8] = h),
          (this.props[9] = l),
          (this.props[10] = p),
          (this.props[11] = m),
          (this.props[12] = f),
          (this.props[13] = d),
          (this.props[14] = c),
          (this.props[15] = u),
          this
        );
      }
      function p(t, e, s) {
        return (
          (s = isNaN(s) ? 0 : s),
          0 !== t || 0 !== e || 0 !== s
            ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, s, 1)
            : this
        );
      }
      function m(t, e, s, r, i, a, n, o, h, l, p, m, f, d, c, u) {
        if (
          1 === t &&
          0 === e &&
          0 === s &&
          0 === r &&
          0 === i &&
          1 === a &&
          0 === n &&
          0 === o &&
          0 === h &&
          0 === l &&
          1 === p &&
          0 === m
        )
          return (
            (0 !== f || 0 !== d || 0 !== c) &&
              ((this.props[12] =
                this.props[12] * t +
                this.props[13] * i +
                this.props[14] * h +
                this.props[15] * f),
              (this.props[13] =
                this.props[12] * e +
                this.props[13] * a +
                this.props[14] * l +
                this.props[15] * d),
              (this.props[14] =
                this.props[12] * s +
                this.props[13] * n +
                this.props[14] * p +
                this.props[15] * c),
              (this.props[15] =
                this.props[12] * r +
                this.props[13] * o +
                this.props[14] * m +
                this.props[15] * u)),
            this
          );
        var y = this.props[0],
          g = this.props[1],
          v = this.props[2],
          b = this.props[3],
          P = this.props[4],
          E = this.props[5],
          k = this.props[6],
          S = this.props[7],
          x = this.props[8],
          M = this.props[9],
          C = this.props[10],
          D = this.props[11],
          w = this.props[12],
          T = this.props[13],
          F = this.props[14],
          I = this.props[15];
        return (
          (this.props[0] = y * t + g * i + v * h + b * f),
          (this.props[1] = y * e + g * a + v * l + b * d),
          (this.props[2] = y * s + g * n + v * p + b * c),
          (this.props[3] = y * r + g * o + v * m + b * u),
          (this.props[4] = P * t + E * i + k * h + S * f),
          (this.props[5] = P * e + E * a + k * l + S * d),
          (this.props[6] = P * s + E * n + k * p + S * c),
          (this.props[7] = P * r + E * o + k * m + S * u),
          (this.props[8] = x * t + M * i + C * h + D * f),
          (this.props[9] = x * e + M * a + C * l + D * d),
          (this.props[10] = x * s + M * n + C * p + D * c),
          (this.props[11] = x * r + M * o + C * m + D * u),
          (this.props[12] = w * t + T * i + F * h + I * f),
          (this.props[13] = w * e + T * a + F * l + I * d),
          (this.props[14] = w * s + T * n + F * p + I * c),
          (this.props[15] = w * r + T * o + F * m + I * u),
          this
        );
      }
      function f(t) {
        var e;
        for (e = 0; 16 > e; e += 1) t.props[e] = this.props[e];
      }
      function d(t) {
        var e;
        for (e = 0; 16 > e; e += 1) this.props[e] = t[e];
      }
      function c(t, e, s) {
        return {
          x:
            t * this.props[0] +
            e * this.props[4] +
            s * this.props[8] +
            this.props[12],
          y:
            t * this.props[1] +
            e * this.props[5] +
            s * this.props[9] +
            this.props[13],
          z:
            t * this.props[2] +
            e * this.props[6] +
            s * this.props[10] +
            this.props[14],
        };
      }
      function u(t, e, s) {
        return (
          t * this.props[0] +
          e * this.props[4] +
          s * this.props[8] +
          this.props[12]
        );
      }
      function y(t, e, s) {
        return (
          t * this.props[1] +
          e * this.props[5] +
          s * this.props[9] +
          this.props[13]
        );
      }
      function g(t, e, s) {
        return (
          t * this.props[2] +
          e * this.props[6] +
          s * this.props[10] +
          this.props[14]
        );
      }
      function v(t, e, s) {
        return [
          t * this.props[0] +
            e * this.props[4] +
            s * this.props[8] +
            this.props[12],
          t * this.props[1] +
            e * this.props[5] +
            s * this.props[9] +
            this.props[13],
          t * this.props[2] +
            e * this.props[6] +
            s * this.props[10] +
            this.props[14],
        ];
      }
      function b(t, e) {
        return (
          bm_rnd(t * this.props[0] + e * this.props[4] + this.props[12]) +
          "," +
          bm_rnd(t * this.props[1] + e * this.props[5] + this.props[13])
        );
      }
      function P() {
        return [
          this.props[0],
          this.props[1],
          this.props[2],
          this.props[3],
          this.props[4],
          this.props[5],
          this.props[6],
          this.props[7],
          this.props[8],
          this.props[9],
          this.props[10],
          this.props[11],
          this.props[12],
          this.props[13],
          this.props[14],
          this.props[15],
        ];
      }
      function E() {
        return isSafari
          ? "matrix3d(" +
              roundTo2Decimals(this.props[0]) +
              "," +
              roundTo2Decimals(this.props[1]) +
              "," +
              roundTo2Decimals(this.props[2]) +
              "," +
              roundTo2Decimals(this.props[3]) +
              "," +
              roundTo2Decimals(this.props[4]) +
              "," +
              roundTo2Decimals(this.props[5]) +
              "," +
              roundTo2Decimals(this.props[6]) +
              "," +
              roundTo2Decimals(this.props[7]) +
              "," +
              roundTo2Decimals(this.props[8]) +
              "," +
              roundTo2Decimals(this.props[9]) +
              "," +
              roundTo2Decimals(this.props[10]) +
              "," +
              roundTo2Decimals(this.props[11]) +
              "," +
              roundTo2Decimals(this.props[12]) +
              "," +
              roundTo2Decimals(this.props[13]) +
              "," +
              roundTo2Decimals(this.props[14]) +
              "," +
              roundTo2Decimals(this.props[15]) +
              ")"
          : ((this.cssParts[1] = this.props.join(",")), this.cssParts.join(""));
      }
      function k() {
        return (
          "matrix(" +
          this.props[0] +
          "," +
          this.props[1] +
          "," +
          this.props[4] +
          "," +
          this.props[5] +
          "," +
          this.props[12] +
          "," +
          this.props[13] +
          ")"
        );
      }
      function S() {
        return "" + this.toArray();
      }
      return function () {
        (this.reset = t),
          (this.rotate = e),
          (this.rotateX = s),
          (this.rotateY = r),
          (this.rotateZ = i),
          (this.skew = n),
          (this.skewFromAxis = o),
          (this.shear = a),
          (this.scale = h),
          (this.setTransform = l),
          (this.translate = p),
          (this.transform = m),
          (this.applyToPoint = c),
          (this.applyToX = u),
          (this.applyToY = y),
          (this.applyToZ = g),
          (this.applyToPointArray = v),
          (this.applyToPointStringified = b),
          (this.toArray = P),
          (this.toCSS = E),
          (this.to2dCSS = k),
          (this.toString = S),
          (this.clone = f),
          (this.cloneFromProps = d),
          (this._t = this.transform),
          (this.props = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
          (this.cssParts = ["matrix3d(", "", ")"]);
      };
    })();
  !(function (t, e) {
    function s(s, l, p) {
      var d = [];
      l = 1 == l ? { entropy: !0 } : l || {};
      var v = n(a(l.entropy ? [s, h(t)] : null == s ? o() : s, 3), d),
        b = new r(d),
        P = function () {
          for (var t = b.g(f), e = u, s = 0; y > t; )
            (t = (t + s) * m), (e *= m), (s = b.g(1));
          for (; t >= g; ) (t /= 2), (e /= 2), (s >>>= 1);
          return (t + s) / e;
        };
      return (
        (P.int32 = function () {
          return 0 | b.g(4);
        }),
        (P.quick = function () {
          return b.g(4) / 4294967296;
        }),
        (P["double"] = P),
        n(h(b.S), t),
        (
          l.pass ||
          p ||
          function (t, s, r, a) {
            return (
              a &&
                (a.S && i(a, b),
                (t.state = function () {
                  return i(b, {});
                })),
              r ? ((e[c] = t), s) : t
            );
          }
        )(P, v, "global" in l ? l.global : this == e, l.state)
      );
    }
    function r(t) {
      var e,
        s = t.length,
        r = this,
        i = 0,
        a = (r.i = r.j = 0),
        n = (r.S = []);
      for (s || (t = [s++]); m > i; ) n[i] = i++;
      for (i = 0; m > i; i++)
        (n[i] = n[(a = v & (a + t[i % s] + (e = n[i])))]), (n[a] = e);
      (r.g = function (t) {
        for (var e, s = 0, i = r.i, a = r.j, n = r.S; t--; )
          (e = n[(i = v & (i + 1))]),
            (s = s * m + n[v & ((n[i] = n[(a = v & (a + e))]) + (n[a] = e))]);
        return (r.i = i), (r.j = a), s;
      })(m);
    }
    function i(t, e) {
      return (e.i = t.i), (e.j = t.j), (e.S = t.S.slice()), e;
    }
    function a(t, e) {
      var s,
        r = [],
        i = typeof t;
      if (e && "object" == i)
        for (s in t)
          try {
            r.push(a(t[s], e - 1));
          } catch (n) {}
      return r.length ? r : "string" == i ? t : t + "\x00";
    }
    function n(t, e) {
      for (var s, r = t + "", i = 0; i < r.length; )
        e[v & i] = v & ((s ^= 19 * e[v & i]) + r.charCodeAt(i++));
      return h(e);
    }
    function o() {
      try {
        if (l) return h(l.randomBytes(m));
        var e = new Uint8Array(m);
        return (p.crypto || p.msCrypto).getRandomValues(e), h(e);
      } catch (s) {
        var r = p.navigator,
          i = r && r.plugins;
        return [+new Date(), p, i, p.screen, h(t)];
      }
    }
    function h(t) {
      return String.fromCharCode.apply(0, t);
    }
    var l,
      p = this,
      m = 256,
      f = 6,
      d = 52,
      c = "random",
      u = e.pow(m, f),
      y = e.pow(2, d),
      g = 2 * y,
      v = m - 1;
    (e["seed" + c] = s), n(e.random(), t);
  })([], BMMath);
  var BezierFactory = (function () {
      function t(t, e, s, r, i) {
        var a =
          i || ("bez_" + t + "_" + e + "_" + s + "_" + r).replace(/\./g, "p");
        if (p[a]) return p[a];
        var n = new h([t, e, s, r]);
        return (p[a] = n), n;
      }
      function e(t, e) {
        return 1 - 3 * e + 3 * t;
      }
      function s(t, e) {
        return 3 * e - 6 * t;
      }
      function r(t) {
        return 3 * t;
      }
      function i(t, i, a) {
        return ((e(i, a) * t + s(i, a)) * t + r(i)) * t;
      }
      function a(t, i, a) {
        return 3 * e(i, a) * t * t + 2 * s(i, a) * t + r(i);
      }
      function n(t, e, s, r, a) {
        var n,
          o,
          h = 0;
        do
          (o = e + (s - e) / 2),
            (n = i(o, r, a) - t),
            n > 0 ? (s = o) : (e = o);
        while (Math.abs(n) > d && ++h < c);
        return o;
      }
      function o(t, e, s, r) {
        for (var n = 0; m > n; ++n) {
          var o = a(e, s, r);
          if (0 === o) return e;
          var h = i(e, s, r) - t;
          e -= h / o;
        }
        return e;
      }
      function h(t) {
        (this._p = t),
          (this._mSampleValues = g ? new Float32Array(u) : new Array(u)),
          (this._precomputed = !1),
          (this.get = this.get.bind(this));
      }
      var l = {};
      l.getBezierEasing = t;
      var p = {},
        m = 4,
        f = 0.001,
        d = 1e-7,
        c = 10,
        u = 11,
        y = 1 / (u - 1),
        g = "function" == typeof Float32Array;
      return (
        (h.prototype = {
          get: function (t) {
            var e = this._p[0],
              s = this._p[1],
              r = this._p[2],
              a = this._p[3];
            return (
              this._precomputed || this._precompute(),
              e === s && r === a
                ? t
                : 0 === t
                ? 0
                : 1 === t
                ? 1
                : i(this._getTForX(t), s, a)
            );
          },
          _precompute: function () {
            var t = this._p[0],
              e = this._p[1],
              s = this._p[2],
              r = this._p[3];
            (this._precomputed = !0),
              (t !== e || s !== r) && this._calcSampleValues();
          },
          _calcSampleValues: function () {
            for (var t = this._p[0], e = this._p[2], s = 0; u > s; ++s)
              this._mSampleValues[s] = i(s * y, t, e);
          },
          _getTForX: function (t) {
            for (
              var e = this._p[0],
                s = this._p[2],
                r = this._mSampleValues,
                i = 0,
                h = 1,
                l = u - 1;
              h !== l && r[h] <= t;
              ++h
            )
              i += y;
            --h;
            var p = (t - r[h]) / (r[h + 1] - r[h]),
              m = i + p * y,
              d = a(m, e, s);
            return d >= f ? o(t, m, e, s) : 0 === d ? m : n(t, i, i + y, e, s);
          },
        }),
        l
      );
    })(),
    MatrixManager = matrixManagerFunction;
  !(function () {
    for (
      var t = 0, e = ["ms", "moz", "webkit", "o"], s = 0;
      s < e.length && !window.requestAnimationFrame;
      ++s
    )
      (window.requestAnimationFrame = window[e[s] + "RequestAnimationFrame"]),
        (window.cancelAnimationFrame =
          window[e[s] + "CancelAnimationFrame"] ||
          window[e[s] + "CancelRequestAnimationFrame"]);
    window.requestAnimationFrame ||
      (window.requestAnimationFrame = function (e, s) {
        var r = new Date().getTime(),
          i = Math.max(0, 16 - (r - t)),
          a = window.setTimeout(function () {
            e(r + i);
          }, i);
        return (t = r + i), a;
      }),
      window.cancelAnimationFrame ||
        (window.cancelAnimationFrame = function (t) {
          clearTimeout(t);
        });
  })();
  var bez = bezFunction(),
    dataManager = dataFunctionManager(),
    FontManager = (function () {
      function t(t, e) {
        var s = document.createElement("span");
        s.style.fontFamily = e;
        var r = document.createElement("span");
        (r.innerHTML = "giItT1WQy@!-/#"),
          (s.style.position = "absolute"),
          (s.style.left = "-10000px"),
          (s.style.top = "-10000px"),
          (s.style.fontSize = "300px"),
          (s.style.fontVariant = "normal"),
          (s.style.fontStyle = "normal"),
          (s.style.fontWeight = "normal"),
          (s.style.letterSpacing = "0"),
          s.appendChild(r),
          document.body.appendChild(s);
        var i = r.offsetWidth;
        return (
          (r.style.fontFamily = t + ", " + e), { node: r, w: i, parent: s }
        );
      }
      function e() {
        var t,
          s,
          r,
          i = this.fonts.length,
          a = i;
        for (t = 0; i > t; t += 1)
          if (this.fonts[t].loaded) a -= 1;
          else if ("t" === this.fonts[t].fOrigin) {
            if (
              window.Typekit &&
              window.Typekit.load &&
              0 === this.typekitLoaded
            ) {
              this.typekitLoaded = 1;
              try {
                Typekit.load({
                  async: !0,
                  active: function () {
                    this.typekitLoaded = 2;
                  }.bind(this),
                });
              } catch (n) {}
            }
            2 === this.typekitLoaded && (this.fonts[t].loaded = !0);
          } else
            "n" === this.fonts[t].fOrigin
              ? (this.fonts[t].loaded = !0)
              : ((s = this.fonts[t].monoCase.node),
                (r = this.fonts[t].monoCase.w),
                s.offsetWidth !== r
                  ? ((a -= 1), (this.fonts[t].loaded = !0))
                  : ((s = this.fonts[t].sansCase.node),
                    (r = this.fonts[t].sansCase.w),
                    s.offsetWidth !== r &&
                      ((a -= 1), (this.fonts[t].loaded = !0))),
                this.fonts[t].loaded &&
                  (this.fonts[t].sansCase.parent.parentNode.removeChild(
                    this.fonts[t].sansCase.parent
                  ),
                  this.fonts[t].monoCase.parent.parentNode.removeChild(
                    this.fonts[t].monoCase.parent
                  )));
        0 !== a && Date.now() - this.initTime < h
          ? setTimeout(e.bind(this), 20)
          : setTimeout(
              function () {
                this.loaded = !0;
              }.bind(this),
              0
            );
      }
      function s(t, e) {
        var s = document.createElementNS(svgNS, "text");
        (s.style.fontSize = "100px"),
          (s.style.fontFamily = e.fFamily),
          (s.textContent = "1"),
          e.fClass
            ? ((s.style.fontFamily = "inherit"), (s.className = e.fClass))
            : (s.style.fontFamily = e.fFamily),
          t.appendChild(s);
        var r = document.createElement("canvas").getContext("2d");
        return (r.font = "100px " + e.fFamily), r;
      }
      function r(r, i) {
        if (!r) return void (this.loaded = !0);
        if (this.chars) return (this.loaded = !0), void (this.fonts = r.list);
        var a,
          n = r.list,
          o = n.length;
        for (a = 0; o > a; a += 1) {
          if (
            ((n[a].loaded = !1),
            (n[a].monoCase = t(n[a].fFamily, "monospace")),
            (n[a].sansCase = t(n[a].fFamily, "sans-serif")),
            n[a].fPath)
          ) {
            if ("p" === n[a].fOrigin) {
              var h = document.createElement("style");
              (h.type = "text/css"),
                (h.innerHTML =
                  "@font-face {font-family: " +
                  n[a].fFamily +
                  "; font-style: normal; src: url('" +
                  n[a].fPath +
                  "');}"),
                i.appendChild(h);
            } else if ("g" === n[a].fOrigin) {
              var l = document.createElement("link");
              (l.type = "text/css"),
                (l.rel = "stylesheet"),
                (l.href = n[a].fPath),
                i.appendChild(l);
            } else if ("t" === n[a].fOrigin) {
              var p = document.createElement("script");
              p.setAttribute("src", n[a].fPath), i.appendChild(p);
            }
          } else n[a].loaded = !0;
          (n[a].helper = s(i, n[a])), this.fonts.push(n[a]);
        }
        e.bind(this)();
      }
      function i(t) {
        if (t) {
          this.chars || (this.chars = []);
          var e,
            s,
            r,
            i = t.length,
            a = this.chars.length;
          for (e = 0; i > e; e += 1) {
            for (s = 0, r = !1; a > s; )
              this.chars[s].style === t[e].style &&
                this.chars[s].fFamily === t[e].fFamily &&
                this.chars[s].ch === t[e].ch &&
                (r = !0),
                (s += 1);
            r || (this.chars.push(t[e]), (a += 1));
          }
        }
      }
      function a(t, e, s) {
        for (var r = 0, i = this.chars.length; i > r; ) {
          if (
            this.chars[r].ch === t &&
            this.chars[r].style === e &&
            this.chars[r].fFamily === s
          )
            return this.chars[r];
          r += 1;
        }
      }
      function n(t, e, s) {
        var r = this.getFontByName(e),
          i = r.helper;
        return (i.measureText(t).width * s) / 100;
      }
      function o(t) {
        for (var e = 0, s = this.fonts.length; s > e; ) {
          if (this.fonts[e].fName === t) return this.fonts[e];
          e += 1;
        }
        return "sans-serif";
      }
      var h = 5e3,
        l = function () {
          (this.fonts = []),
            (this.chars = null),
            (this.typekitLoaded = 0),
            (this.loaded = !1),
            (this.initTime = Date.now());
        };
      return (
        (l.prototype.addChars = i),
        (l.prototype.addFonts = r),
        (l.prototype.getCharData = a),
        (l.prototype.getFontByName = o),
        (l.prototype.measureText = n),
        l
      );
    })(),
    PropertyFactory = (function () {
      function t() {
        if (this.elem.globalData.frameId !== this.frameId) {
          this.mdf = !1;
          var t = this.comp.renderedFrame - this.offsetTime;
          if (
            t === this.lastFrame ||
            (this.lastFrame !== l &&
              ((this.lastFrame >=
                this.keyframes[this.keyframes.length - 1].t - this.offsetTime &&
                t >=
                  this.keyframes[this.keyframes.length - 1].t -
                    this.offsetTime) ||
                (this.lastFrame < this.keyframes[0].t - this.offsetTime &&
                  t < this.keyframes[0].t - this.offsetTime)))
          );
          else {
            for (
              var e, s, r = 0, i = this.keyframes.length - 1, a = 1, n = !0;
              n;

            ) {
              if (
                ((e = this.keyframes[r]),
                (s = this.keyframes[r + 1]),
                r == i - 1 && t >= s.t - this.offsetTime)
              ) {
                e.h && (e = s);
                break;
              }
              if (s.t - this.offsetTime > t) break;
              i - 1 > r ? (r += a) : (n = !1);
            }
            var o,
              h,
              p,
              m,
              f,
              d = 0;
            if (e.to) {
              e.bezierData || bez.buildBezierData(e);
              var c = e.bezierData;
              if (t >= s.t - this.offsetTime || t < e.t - this.offsetTime) {
                var u = t >= s.t - this.offsetTime ? c.points.length - 1 : 0;
                for (h = c.points[u].point.length, o = 0; h > o; o += 1)
                  (this.v[o] = this.mult
                    ? c.points[u].point[o] * this.mult
                    : c.points[u].point[o]),
                    (this.pv[o] = c.points[u].point[o]),
                    this.lastPValue[o] !== this.pv[o] &&
                      ((this.mdf = !0), (this.lastPValue[o] = this.pv[o]));
              } else {
                e.__fnct
                  ? (f = e.__fnct)
                  : ((f = BezierFactory.getBezierEasing(
                      e.o.x,
                      e.o.y,
                      e.i.x,
                      e.i.y,
                      e.n
                    ).get),
                    (e.__fnct = f)),
                  (p = f(
                    (t - (e.t - this.offsetTime)) /
                      (s.t - this.offsetTime - (e.t - this.offsetTime))
                  ));
                var y,
                  g = c.segmentLength * p,
                  v = 0;
                for (a = 1, n = !0, m = c.points.length; n; ) {
                  if (
                    ((v += c.points[d].partialLength * a),
                    0 === g || 0 === p || d == c.points.length - 1)
                  ) {
                    for (h = c.points[d].point.length, o = 0; h > o; o += 1)
                      (this.v[o] = this.mult
                        ? c.points[d].point[o] * this.mult
                        : c.points[d].point[o]),
                        (this.pv[o] = c.points[d].point[o]),
                        this.lastPValue[o] !== this.pv[o] &&
                          ((this.mdf = !0), (this.lastPValue[o] = this.pv[o]));
                    break;
                  }
                  if (g >= v && g < v + c.points[d + 1].partialLength) {
                    for (
                      y = (g - v) / c.points[d + 1].partialLength,
                        h = c.points[d].point.length,
                        o = 0;
                      h > o;
                      o += 1
                    )
                      (this.v[o] = this.mult
                        ? (c.points[d].point[o] +
                            (c.points[d + 1].point[o] - c.points[d].point[o]) *
                              y) *
                          this.mult
                        : c.points[d].point[o] +
                          (c.points[d + 1].point[o] - c.points[d].point[o]) *
                            y),
                        (this.pv[o] =
                          c.points[d].point[o] +
                          (c.points[d + 1].point[o] - c.points[d].point[o]) *
                            y),
                        this.lastPValue[o] !== this.pv[o] &&
                          ((this.mdf = !0), (this.lastPValue[o] = this.pv[o]));
                    break;
                  }
                  (m - 1 > d && 1 == a) || (d > 0 && -1 == a)
                    ? (d += a)
                    : (n = !1);
                }
              }
            } else {
              var b,
                P,
                E,
                k,
                S,
                x = !1;
              for (i = e.s.length, r = 0; i > r; r += 1) {
                if (
                  (1 !== e.h &&
                    (e.o.x instanceof Array
                      ? ((x = !0),
                        e.__fnct || (e.__fnct = []),
                        e.__fnct[r] ||
                          ((b = e.o.x[r] || e.o.x[0]),
                          (P = e.o.y[r] || e.o.y[0]),
                          (E = e.i.x[r] || e.i.x[0]),
                          (k = e.i.y[r] || e.i.y[0])))
                      : ((x = !1),
                        e.__fnct ||
                          ((b = e.o.x), (P = e.o.y), (E = e.i.x), (k = e.i.y))),
                    x
                      ? e.__fnct[r]
                        ? (f = e.__fnct[r])
                        : ((f = BezierFactory.getBezierEasing(b, P, E, k).get),
                          (e.__fnct[r] = f))
                      : e.__fnct
                      ? (f = e.__fnct)
                      : ((f = BezierFactory.getBezierEasing(b, P, E, k).get),
                        (e.__fnct = f)),
                    (p =
                      t >= s.t - this.offsetTime
                        ? 1
                        : t < e.t - this.offsetTime
                        ? 0
                        : f(
                            (t - (e.t - this.offsetTime)) /
                              (s.t - this.offsetTime - (e.t - this.offsetTime))
                          ))),
                  this.sh && 1 !== e.h)
                ) {
                  var M = e.s[r],
                    C = e.e[r];
                  -180 > M - C ? (M += 360) : M - C > 180 && (M -= 360),
                    (S = M + (C - M) * p);
                } else S = 1 === e.h ? e.s[r] : e.s[r] + (e.e[r] - e.s[r]) * p;
                1 === i
                  ? ((this.v = this.mult ? S * this.mult : S),
                    (this.pv = S),
                    this.lastPValue != this.pv &&
                      ((this.mdf = !0), (this.lastPValue = this.pv)))
                  : ((this.v[r] = this.mult ? S * this.mult : S),
                    (this.pv[r] = S),
                    this.lastPValue[r] !== this.pv[r] &&
                      ((this.mdf = !0), (this.lastPValue[r] = this.pv[r])));
              }
            }
          }
          (this.lastFrame = t), (this.frameId = this.elem.globalData.frameId);
        }
      }
      function e() {}
      function s(t, s, r) {
        (this.mult = r),
          (this.v = r ? s.k * r : s.k),
          (this.pv = s.k),
          (this.mdf = !1),
          (this.comp = t.comp),
          (this.k = !1),
          (this.kf = !1),
          (this.vel = 0),
          (this.getValue = e);
      }
      function r(t, s, r) {
        (this.mult = r),
          (this.data = s),
          (this.mdf = !1),
          (this.comp = t.comp),
          (this.k = !1),
          (this.kf = !1),
          (this.frameId = -1),
          (this.v = new Array(s.k.length)),
          (this.pv = new Array(s.k.length)),
          (this.lastValue = new Array(s.k.length));
        var i = Array.apply(null, { length: s.k.length });
        this.vel = i.map(function () {
          return 0;
        });
        var a,
          n = s.k.length;
        for (a = 0; n > a; a += 1)
          (this.v[a] = r ? s.k[a] * r : s.k[a]), (this.pv[a] = s.k[a]);
        this.getValue = e;
      }
      function i(e, s, r) {
        (this.keyframes = s.k),
          (this.offsetTime = e.data.st),
          (this.lastValue = -99999),
          (this.lastPValue = -99999),
          (this.frameId = -1),
          (this.k = !0),
          (this.kf = !0),
          (this.data = s),
          (this.mult = r),
          (this.elem = e),
          (this.comp = e.comp),
          (this.lastFrame = l),
          (this.v = r ? s.k[0].s[0] * r : s.k[0].s[0]),
          (this.pv = s.k[0].s[0]),
          (this.getValue = t);
      }
      function a(e, s, r) {
        var i,
          a,
          n,
          o,
          h,
          p = s.k.length;
        for (i = 0; p - 1 > i; i += 1)
          s.k[i].to &&
            s.k[i].s &&
            s.k[i].e &&
            ((a = s.k[i].s),
            (n = s.k[i].e),
            (o = s.k[i].to),
            (h = s.k[i].ti),
            ((2 == a.length &&
              bez.pointOnLine2D(
                a[0],
                a[1],
                n[0],
                n[1],
                a[0] + o[0],
                a[1] + o[1]
              ) &&
              bez.pointOnLine2D(
                a[0],
                a[1],
                n[0],
                n[1],
                n[0] + h[0],
                n[1] + h[1]
              )) ||
              (bez.pointOnLine3D(
                a[0],
                a[1],
                a[2],
                n[0],
                n[1],
                n[2],
                a[0] + o[0],
                a[1] + o[1],
                a[2] + o[2]
              ) &&
                bez.pointOnLine3D(
                  a[0],
                  a[1],
                  a[2],
                  n[0],
                  n[1],
                  n[2],
                  n[0] + h[0],
                  n[1] + h[1],
                  n[2] + h[2]
                ))) &&
              ((s.k[i].to = null), (s.k[i].ti = null)));
        (this.keyframes = s.k),
          (this.offsetTime = e.data.st),
          (this.k = !0),
          (this.kf = !0),
          (this.mult = r),
          (this.elem = e),
          (this.comp = e.comp),
          (this.getValue = t),
          (this.frameId = -1),
          (this.v = new Array(s.k[0].s.length)),
          (this.pv = new Array(s.k[0].s.length)),
          (this.lastValue = new Array(s.k[0].s.length)),
          (this.lastPValue = new Array(s.k[0].s.length)),
          (this.lastFrame = l);
      }
      function n(t, e, n, o, h) {
        var l;
        if (2 === n) l = new p(t, e, h);
        else if (7 === n) l = new TrimProperty(t, e, h);
        else if (e.k.length)
          if ("number" == typeof e.k[0]) l = new r(t, e, o);
          else
            switch (n) {
              case 0:
                l = new i(t, e, o);
                break;
              case 1:
                l = new a(t, e, o);
            }
        else l = new s(t, e, o);
        return l.k && h.push(l), l;
      }
      function o(t, e, s, r) {
        return new f(t, e, s, r);
      }
      function h(t, e, s) {
        return new d(t, e, s);
      }
      var l = -999999,
        p = (function () {
          function t() {
            return this.p.k && this.p.getValue(), this.p.v;
          }
          function e() {
            return this.px.k && this.px.getValue(), this.px.v;
          }
          function s() {
            return this.py.k && this.py.getValue(), this.py.v;
          }
          function r() {
            return this.a.k && this.a.getValue(), this.a.v;
          }
          function i() {
            return this.or.k && this.or.getValue(), this.or.v;
          }
          function a() {
            return this.r.k && this.r.getValue(), this.r.v / degToRads;
          }
          function n() {
            return this.s.k && this.s.getValue(), this.s.v;
          }
          function o() {
            return this.o.k && this.o.getValue(), this.o.v;
          }
          function h() {
            return this.sk.k && this.sk.getValue(), this.sk.v;
          }
          function l() {
            return this.sa.k && this.sa.getValue(), this.sa.v;
          }
          function p(t) {
            var e,
              s = this.dynamicProperties.length;
            for (e = 0; s > e; e += 1)
              this.dynamicProperties[e].getValue(),
                this.dynamicProperties[e].mdf && (this.mdf = !0);
            this.a && t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
              this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
              this.r
                ? t.rotate(-this.r.v)
                : t
                    .rotateZ(-this.rz.v)
                    .rotateY(this.ry.v)
                    .rotateX(this.rx.v)
                    .rotateZ(-this.or.v[2])
                    .rotateY(this.or.v[1])
                    .rotateX(this.or.v[0]),
              this.data.p.s
                ? this.data.p.z
                  ? t.translate(this.px.v, this.py.v, -this.pz.v)
                  : t.translate(this.px.v, this.py.v, 0)
                : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
          }
          function m() {
            if (this.elem.globalData.frameId !== this.frameId) {
              this.mdf = !1;
              var t,
                e = this.dynamicProperties.length;
              for (t = 0; e > t; t += 1)
                this.dynamicProperties[t].getValue(),
                  this.dynamicProperties[t].mdf && (this.mdf = !0);
              this.mdf &&
                (this.v.reset(),
                this.a &&
                  this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                this.s && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                this.sk && this.v.skewFromAxis(-this.sk.v, this.sa.v),
                this.r
                  ? this.v.rotate(-this.r.v)
                  : this.v
                      .rotateZ(-this.rz.v)
                      .rotateY(this.ry.v)
                      .rotateX(this.rx.v)
                      .rotateZ(-this.or.v[2])
                      .rotateY(this.or.v[1])
                      .rotateX(this.or.v[0]),
                this.data.p.s
                  ? this.data.p.z
                    ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                    : this.v.translate(this.px.v, this.py.v, 0)
                  : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])),
                (this.frameId = this.elem.globalData.frameId);
            }
          }
          function f() {
            (this.inverted = !0),
              (this.iv = new Matrix()),
              this.k ||
                (this.data.p.s
                  ? this.iv.translate(this.px.v, this.py.v, -this.pz.v)
                  : this.iv.translate(this.p.v[0], this.p.v[1], -this.p.v[2]),
                this.r
                  ? this.iv.rotate(-this.r.v)
                  : this.iv
                      .rotateX(-this.rx.v)
                      .rotateY(-this.ry.v)
                      .rotateZ(this.rz.v),
                this.s && this.iv.scale(this.s.v[0], this.s.v[1], 1),
                this.a &&
                  this.iv.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]));
          }
          return function (d, c, u) {
            (this.elem = d),
              (this.frameId = -1),
              (this.dynamicProperties = []),
              (this.mdf = !1),
              (this.data = c),
              (this.getValue = m),
              (this.applyToMatrix = p),
              (this.setInverted = f),
              (this.v = new Matrix()),
              c.p.s
                ? ((this.px = PropertyFactory.getProp(
                    d,
                    c.p.x,
                    0,
                    0,
                    this.dynamicProperties
                  )),
                  (this.py = PropertyFactory.getProp(
                    d,
                    c.p.y,
                    0,
                    0,
                    this.dynamicProperties
                  )),
                  c.p.z &&
                    (this.pz = PropertyFactory.getProp(
                      d,
                      c.p.z,
                      0,
                      0,
                      this.dynamicProperties
                    )))
                : (this.p = PropertyFactory.getProp(
                    d,
                    c.p,
                    1,
                    0,
                    this.dynamicProperties
                  )),
              c.r
                ? (this.r = PropertyFactory.getProp(
                    d,
                    c.r,
                    0,
                    degToRads,
                    this.dynamicProperties
                  ))
                : c.rx &&
                  ((this.rx = PropertyFactory.getProp(
                    d,
                    c.rx,
                    0,
                    degToRads,
                    this.dynamicProperties
                  )),
                  (this.ry = PropertyFactory.getProp(
                    d,
                    c.ry,
                    0,
                    degToRads,
                    this.dynamicProperties
                  )),
                  (this.rz = PropertyFactory.getProp(
                    d,
                    c.rz,
                    0,
                    degToRads,
                    this.dynamicProperties
                  )),
                  (this.or = PropertyFactory.getProp(
                    d,
                    c.or,
                    0,
                    degToRads,
                    this.dynamicProperties
                  ))),
              c.sk &&
                ((this.sk = PropertyFactory.getProp(
                  d,
                  c.sk,
                  0,
                  degToRads,
                  this.dynamicProperties
                )),
                (this.sa = PropertyFactory.getProp(
                  d,
                  c.sa,
                  0,
                  degToRads,
                  this.dynamicProperties
                ))),
              c.a &&
                (this.a = PropertyFactory.getProp(
                  d,
                  c.a,
                  1,
                  0,
                  this.dynamicProperties
                )),
              c.s &&
                (this.s = PropertyFactory.getProp(
                  d,
                  c.s,
                  1,
                  0.01,
                  this.dynamicProperties
                )),
              (this.o = c.o
                ? PropertyFactory.getProp(d, c.o, 0, 0.01, u)
                : { mdf: !1, v: 1 }),
              this.dynamicProperties.length
                ? u.push(this)
                : (this.a &&
                    this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                  this.s && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                  this.sk && this.v.skewFromAxis(-this.sk.v, this.sa.v),
                  this.r
                    ? this.v.rotate(-this.r.v)
                    : this.v
                        .rotateZ(-this.rz.v)
                        .rotateY(this.ry.v)
                        .rotateX(this.rx.v)
                        .rotateZ(-this.or.v[2])
                        .rotateY(this.or.v[1])
                        .rotateX(this.or.v[0]),
                  this.data.p.s
                    ? c.p.z
                      ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                      : this.v.translate(this.px.v, this.py.v, 0)
                    : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])),
              Object.defineProperty(this, "position", { get: t }),
              Object.defineProperty(this, "xPosition", { get: e }),
              Object.defineProperty(this, "yPosition", { get: s }),
              Object.defineProperty(this, "orientation", { get: i }),
              Object.defineProperty(this, "anchorPoint", { get: r }),
              Object.defineProperty(this, "rotation", { get: a }),
              Object.defineProperty(this, "scale", { get: n }),
              Object.defineProperty(this, "opacity", { get: o }),
              Object.defineProperty(this, "skew", { get: h }),
              Object.defineProperty(this, "skewAxis", { get: l });
          };
        })(),
        m = (function () {
          function t(t) {
            if (
              (this.prop.getValue(),
              (this.cmdf = !1),
              (this.omdf = !1),
              this.prop.mdf || t)
            ) {
              var e,
                s,
                r,
                i = 4 * this.data.p;
              for (e = 0; i > e; e += 1)
                (s = e % 4 === 0 ? 100 : 255),
                  (r = Math.round(this.prop.v[e] * s)),
                  this.c[e] !== r && ((this.c[e] = r), (this.cmdf = !0));
              if (this.o.length)
                for (i = this.prop.v.length, e = 4 * this.data.p; i > e; e += 1)
                  (s = e % 2 === 0 ? 100 : 1),
                    (r =
                      e % 2 === 0
                        ? Math.round(100 * this.prop.v[e])
                        : this.prop.v[e]),
                    this.o[e - 4 * this.data.p] !== r &&
                      ((this.o[e - 4 * this.data.p] = r), (this.omdf = !0));
            }
          }
          function e(e, s, r) {
            (this.prop = n(e, s.k, 1, null, [])),
              (this.data = s),
              (this.k = this.prop.k),
              (this.c = Array.apply(null, { length: 4 * s.p }));
            var i = s.k.k[0].s
              ? s.k.k[0].s.length - 4 * s.p
              : s.k.k.length - 4 * s.p;
            (this.o = Array.apply(null, { length: i })),
              (this.cmdf = !1),
              (this.omdf = !1),
              (this.getValue = t),
              this.prop.k && r.push(this),
              this.getValue(!0);
          }
          return function (t, s, r) {
            return new e(t, s, r);
          };
        })(),
        f = (function () {
          function t(t) {
            var e = 0,
              s = this.dataProps.length;
            if (this.elem.globalData.frameId !== this.frameId || t) {
              for (
                this.mdf = !1, this.frameId = this.elem.globalData.frameId;
                s > e;

              ) {
                if (this.dataProps[e].p.mdf) {
                  this.mdf = !0;
                  break;
                }
                e += 1;
              }
              if (this.mdf || t)
                for (
                  "svg" === this.renderer && (this.dasharray = ""), e = 0;
                  s > e;
                  e += 1
                )
                  "o" != this.dataProps[e].n
                    ? "svg" === this.renderer
                      ? (this.dasharray += " " + this.dataProps[e].p.v)
                      : (this.dasharray[e] = this.dataProps[e].p.v)
                    : (this.dashoffset = this.dataProps[e].p.v);
            }
          }
          return function (e, s, r, i) {
            (this.elem = e),
              (this.frameId = -1),
              (this.dataProps = new Array(s.length)),
              (this.renderer = r),
              (this.mdf = !1),
              (this.k = !1),
              (this.dasharray =
                "svg" === this.renderer ? "" : new Array(s.length - 1)),
              (this.dashoffset = 0);
            var a,
              n,
              o = s.length;
            for (a = 0; o > a; a += 1)
              (n = PropertyFactory.getProp(e, s[a].v, 0, 0, i)),
                (this.k = n.k ? !0 : this.k),
                (this.dataProps[a] = { n: s[a].n, p: n });
            (this.getValue = t), this.k ? i.push(this) : this.getValue(!0);
          };
        })(),
        d = (function () {
          function t() {
            if (this.dynamicProperties.length) {
              var t,
                e = this.dynamicProperties.length;
              for (t = 0; e > t; t += 1)
                this.dynamicProperties[t].getValue(),
                  this.dynamicProperties[t].mdf && (this.mdf = !0);
            }
            var s = this.data.totalChars,
              r = 2 === this.data.r ? 1 : 100 / s,
              i = this.o.v / r,
              a = this.s.v / r + i,
              n = this.e.v / r + i;
            if (a > n) {
              var o = a;
              (a = n), (n = o);
            }
            (this.finalS = a), (this.finalE = n);
          }
          function e(t) {
            var e = BezierFactory.getBezierEasing(
                this.ne.v / 100,
                0,
                1 - this.xe.v / 100,
                1
              ).get,
              a = 0,
              n = this.finalS,
              o = this.finalE,
              h = this.data.sh;
            if (2 == h)
              (a =
                o === n
                  ? t >= o
                    ? 1
                    : 0
                  : s(0, r(0.5 / (o - n) + (t - n) / (o - n), 1))),
                (a = e(a));
            else if (3 == h)
              (a =
                o === n
                  ? t >= o
                    ? 0
                    : 1
                  : 1 - s(0, r(0.5 / (o - n) + (t - n) / (o - n), 1))),
                (a = e(a));
            else if (4 == h)
              o === n
                ? (a = t >= o ? 0 : 1)
                : ((a = s(0, r(0.5 / (o - n) + (t - n) / (o - n), 1))),
                  0.5 > a ? (a *= 2) : (a = 1 - a));
            else if (5 == h)
              if (o === n) a = t >= o ? 0 : 1;
              else {
                var l = o - n;
                a = (-4 / (l * l)) * t * t + (4 / l) * t;
              }
            else
              6 == h
                ? (a =
                    o === n
                      ? t >= o
                        ? 0
                        : 1
                      : (1 +
                          (Math.cos(
                            Math.PI + (2 * Math.PI * (t - n)) / (o - n)
                          ) +
                            0)) /
                        2)
                : t >= i(n) &&
                  (a = 0 > t - n ? 1 - (n - t) : s(0, r(o - t, 1)));
            return a * this.a.v;
          }
          var s = Math.max,
            r = Math.min,
            i = Math.floor;
          return (
            (this.mdf = !1),
            function (s, r, i) {
              (this.mdf = !1),
                (this.k = !1),
                (this.data = r),
                (this.dynamicProperties = []),
                (this.getValue = t),
                (this.getMult = e),
                (this.comp = s.comp),
                (this.finalS = 0),
                (this.finalE = 0),
                (this.s = PropertyFactory.getProp(
                  s,
                  r.s || { k: 0 },
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.e =
                  "e" in r
                    ? PropertyFactory.getProp(
                        s,
                        r.e,
                        0,
                        0,
                        this.dynamicProperties
                      )
                    : { v: 2 === r.r ? r.totalChars : 100 }),
                (this.o = PropertyFactory.getProp(
                  s,
                  r.o || { k: 0 },
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.xe = PropertyFactory.getProp(
                  s,
                  r.xe || { k: 0 },
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.ne = PropertyFactory.getProp(
                  s,
                  r.ne || { k: 0 },
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.a = PropertyFactory.getProp(
                  s,
                  r.a,
                  0,
                  0.01,
                  this.dynamicProperties
                )),
                this.dynamicProperties.length ? i.push(this) : this.getValue();
            }
          );
        })(),
        c = {};
      return (
        (c.getProp = n),
        (c.getDashProp = o),
        (c.getTextSelectorProp = h),
        (c.getGradientProp = m),
        c
      );
    })(),
    ShapePropertyFactory = (function () {
      function t() {
        this.mdf = !1;
        var t = this.comp.renderedFrame - this.offsetTime;
        if (
          this.lastFrame !== n &&
          ((this.lastFrame < this.keyframes[0].t - this.offsetTime &&
            t < this.keyframes[0].t - this.offsetTime) ||
            (this.lastFrame >
              this.keyframes[this.keyframes.length - 1].t - this.offsetTime &&
              t >
                this.keyframes[this.keyframes.length - 1].t - this.offsetTime))
        );
        else {
          var e, s, r;
          if (t < this.keyframes[0].t - this.offsetTime)
            (e = this.keyframes[0].s[0]), (r = !0);
          else if (
            t >
            this.keyframes[this.keyframes.length - 1].t - this.offsetTime
          )
            (e =
              1 === this.keyframes[this.keyframes.length - 2].h
                ? this.keyframes[this.keyframes.length - 2].s[0]
                : this.keyframes[this.keyframes.length - 2].e[0]),
              (r = !0);
          else {
            for (
              var i,
                a,
                o,
                h,
                l,
                p,
                m = 0,
                f = this.keyframes.length - 1,
                d = 1,
                c = !0;
              c &&
              ((i = this.keyframes[m]),
              (a = this.keyframes[m + 1]),
              !(a.t - this.offsetTime > t && 1 == d));

            )
              (f - 1 > m && 1 == d) || (m > 0 && -1 == d) ? (m += d) : (c = !1);
            (r = 1 === i.h), r && m === f - 1 && (i = a);
            var u;
            if (!r) {
              var y;
              i.__fnct
                ? (y = i.__fnct)
                : ((y = BezierFactory.getBezierEasing(
                    i.o.x,
                    i.o.y,
                    i.i.x,
                    i.i.y
                  ).get),
                  (i.__fnct = y)),
                (u =
                  t >= a.t - this.offsetTime
                    ? 1
                    : t < i.t - this.offsetTime
                    ? 0
                    : y(
                        (t - (i.t - this.offsetTime)) /
                          (a.t - this.offsetTime - (i.t - this.offsetTime))
                      )),
                (s = i.e[0]);
            }
            e = i.s[0];
          }
          (h = this.v.i.length), (p = e.i[0].length);
          var g,
            v = !1;
          for (o = 0; h > o; o += 1)
            for (l = 0; p > l; l += 1)
              r
                ? ((g = e.i[o][l]),
                  this.v.i[o][l] !== g &&
                    ((this.v.i[o][l] = g), (this.pv.i[o][l] = g), (v = !0)),
                  (g = e.o[o][l]),
                  this.v.o[o][l] !== g &&
                    ((this.v.o[o][l] = g), (this.pv.o[o][l] = g), (v = !0)),
                  (g = e.v[o][l]),
                  this.v.v[o][l] !== g &&
                    ((this.v.v[o][l] = g), (this.pv.v[o][l] = g), (v = !0)))
                : ((g = e.i[o][l] + (s.i[o][l] - e.i[o][l]) * u),
                  this.v.i[o][l] !== g &&
                    ((this.v.i[o][l] = g), (this.pv.i[o][l] = g), (v = !0)),
                  (g = e.o[o][l] + (s.o[o][l] - e.o[o][l]) * u),
                  this.v.o[o][l] !== g &&
                    ((this.v.o[o][l] = g), (this.pv.o[o][l] = g), (v = !0)),
                  (g = e.v[o][l] + (s.v[o][l] - e.v[o][l]) * u),
                  this.v.v[o][l] !== g &&
                    ((this.v.v[o][l] = g), (this.pv.v[o][l] = g), (v = !0)));
          (this.mdf = v), (this.paths.length = 0), (this.paths[0] = this.v);
        }
        this.lastFrame = t;
      }
      function e() {
        return this.v;
      }
      function s() {
        this.paths.length
          ? ((this.paths.length = 1), (this.paths[0] = this.v))
          : (this.paths = [this.v]);
      }
      function r(t, r, i) {
        (this.comp = t.comp),
          (this.k = !1),
          (this.mdf = !1),
          (this.closed = 3 === i ? r.cl : r.closed),
          (this.numNodes = 3 === i ? r.pt.k.v.length : r.ks.k.v.length),
          (this.v = 3 === i ? r.pt.k : r.ks.k),
          (this.getValue = e),
          (this.pv = this.v),
          (this.v.c = this.closed),
          (this.paths = [this.v]),
          (this.reset = s);
      }
      function i(e, r, i) {
        (this.comp = e.comp),
          (this.offsetTime = e.data.st),
          (this.getValue = t),
          (this.keyframes = 3 === i ? r.pt.k : r.ks.k),
          (this.k = !0),
          (this.closed = 3 === i ? r.cl : r.closed);
        var a,
          o = this.keyframes[0].s[0].i.length,
          h = this.keyframes[0].s[0].i[0].length;
        for (
          this.numNodes = o,
            this.v = {
              i: Array.apply(null, { length: o }),
              o: Array.apply(null, { length: o }),
              v: Array.apply(null, { length: o }),
              c: this.closed,
            },
            this.pv = {
              i: Array.apply(null, { length: o }),
              o: Array.apply(null, { length: o }),
              v: Array.apply(null, { length: o }),
            },
            a = 0;
          o > a;
          a += 1
        )
          (this.v.i[a] = Array.apply(null, { length: h })),
            (this.v.o[a] = Array.apply(null, { length: h })),
            (this.v.v[a] = Array.apply(null, { length: h })),
            (this.pv.i[a] = Array.apply(null, { length: h })),
            (this.pv.o[a] = Array.apply(null, { length: h })),
            (this.pv.v[a] = Array.apply(null, { length: h }));
        (this.paths = []), (this.lastFrame = n), (this.reset = s);
      }
      function a(t, e, s, a) {
        var n;
        if (3 === s || 4 === s) {
          var p = 3 === s ? e.pt.k : e.ks.k;
          n = p.length ? new i(t, e, s) : new r(t, e, s);
        } else
          5 === s
            ? (n = new l(t, e))
            : 6 === s
            ? (n = new o(t, e))
            : 7 === s && (n = new h(t, e));
        return n.k && a.push(n), n;
      }
      var n = -999999,
        o = (function () {
          function t() {
            var t = this.p.v[0],
              e = this.p.v[1],
              s = this.s.v[0] / 2,
              i = this.s.v[1] / 2;
            2 !== this.d && 3 !== this.d
              ? ((this.v.v[0] = [t, e - i]),
                (this.v.i[0] = [t - s * r, e - i]),
                (this.v.o[0] = [t + s * r, e - i]),
                (this.v.v[1] = [t + s, e]),
                (this.v.i[1] = [t + s, e - i * r]),
                (this.v.o[1] = [t + s, e + i * r]),
                (this.v.v[2] = [t, e + i]),
                (this.v.i[2] = [t + s * r, e + i]),
                (this.v.o[2] = [t - s * r, e + i]),
                (this.v.v[3] = [t - s, e]),
                (this.v.i[3] = [t - s, e + i * r]),
                (this.v.o[3] = [t - s, e - i * r]))
              : ((this.v.v[0] = [t, e - i]),
                (this.v.o[0] = [t - s * r, e - i]),
                (this.v.i[0] = [t + s * r, e - i]),
                (this.v.v[1] = [t - s, e]),
                (this.v.o[1] = [t - s, e + i * r]),
                (this.v.i[1] = [t - s, e - i * r]),
                (this.v.v[2] = [t, e + i]),
                (this.v.o[2] = [t + s * r, e + i]),
                (this.v.i[2] = [t - s * r, e + i]),
                (this.v.v[3] = [t + s, e]),
                (this.v.o[3] = [t + s, e - i * r]),
                (this.v.i[3] = [t + s, e + i * r])),
              (this.paths.length = 0),
              (this.paths[0] = this.v);
          }
          function e(t) {
            var e,
              s = this.dynamicProperties.length;
            if (this.elem.globalData.frameId !== this.frameId) {
              for (
                this.mdf = !1,
                  this.frameId = this.elem.globalData.frameId,
                  e = 0;
                s > e;
                e += 1
              )
                this.dynamicProperties[e].getValue(t),
                  this.dynamicProperties[e].mdf && (this.mdf = !0);
              this.mdf &&
                (this.convertEllToPath(),
                (this.paths.length = 0),
                (this.paths[0] = this.v));
            }
          }
          var r = roundCorner;
          return function (r, i) {
            (this.v = {
              v: Array.apply(null, { length: 4 }),
              i: Array.apply(null, { length: 4 }),
              o: Array.apply(null, { length: 4 }),
              c: !0,
            }),
              (this.numNodes = 4),
              (this.d = i.d),
              (this.dynamicProperties = []),
              (this.paths = []),
              (i.closed = !0),
              (this.closed = !0),
              (this.elem = r),
              (this.comp = r.comp),
              (this.frameId = -1),
              (this.mdf = !1),
              (this.getValue = e),
              (this.convertEllToPath = t),
              (this.reset = s),
              (this.p = PropertyFactory.getProp(
                r,
                i.p,
                1,
                0,
                this.dynamicProperties
              )),
              (this.s = PropertyFactory.getProp(
                r,
                i.s,
                1,
                0,
                this.dynamicProperties
              )),
              this.dynamicProperties.length
                ? (this.k = !0)
                : this.convertEllToPath();
          };
        })(),
        h = (function () {
          function t() {
            var t = Math.floor(this.pt.v),
              e = (2 * Math.PI) / t;
            (this.v.v.length = t), (this.v.i.length = t), (this.v.o.length = t);
            var s,
              r = this.or.v,
              i = this.os.v,
              a = (2 * Math.PI * r) / (4 * t),
              n = -Math.PI / 2,
              o = 3 === this.data.d ? -1 : 1;
            for (n += this.r.v, s = 0; t > s; s += 1) {
              var h = r * Math.cos(n),
                l = r * Math.sin(n),
                p = 0 === h && 0 === l ? 0 : l / Math.sqrt(h * h + l * l),
                m = 0 === h && 0 === l ? 0 : -h / Math.sqrt(h * h + l * l);
              (h += +this.p.v[0]),
                (l += +this.p.v[1]),
                (this.v.v[s] = [h, l]),
                (this.v.i[s] = [h + p * a * i * o, l + m * a * i * o]),
                (this.v.o[s] = [h - p * a * i * o, l - m * a * i * o]),
                (n += e * o);
            }
            (this.numNodes = t),
              (this.paths.length = 0),
              (this.paths[0] = this.v);
          }
          function e() {
            var t = 2 * Math.floor(this.pt.v),
              e = (2 * Math.PI) / t;
            (this.v.v.length = t), (this.v.i.length = t), (this.v.o.length = t);
            var s,
              r,
              i,
              a,
              n = !0,
              o = this.or.v,
              h = this.ir.v,
              l = this.os.v,
              p = this.is.v,
              m = (2 * Math.PI * o) / (2 * t),
              f = (2 * Math.PI * h) / (2 * t),
              d = -Math.PI / 2;
            d += this.r.v;
            var c = 3 === this.data.d ? -1 : 1;
            for (s = 0; t > s; s += 1) {
              (r = n ? o : h), (i = n ? l : p), (a = n ? m : f);
              var u = r * Math.cos(d),
                y = r * Math.sin(d),
                g = 0 === u && 0 === y ? 0 : y / Math.sqrt(u * u + y * y),
                v = 0 === u && 0 === y ? 0 : -u / Math.sqrt(u * u + y * y);
              (u += +this.p.v[0]),
                (y += +this.p.v[1]),
                (this.v.v[s] = [u, y]),
                (this.v.i[s] = [u + g * a * i * c, y + v * a * i * c]),
                (this.v.o[s] = [u - g * a * i * c, y - v * a * i * c]),
                (n = !n),
                (d += e * c);
            }
            (this.numNodes = t),
              (this.paths.length = 0),
              (this.paths[0] = this.v);
          }
          function r() {
            if (this.elem.globalData.frameId !== this.frameId) {
              (this.mdf = !1), (this.frameId = this.elem.globalData.frameId);
              var t,
                e = this.dynamicProperties.length;
              for (t = 0; e > t; t += 1)
                this.dynamicProperties[t].getValue(),
                  this.dynamicProperties[t].mdf && (this.mdf = !0);
              this.mdf && this.convertToPath();
            }
          }
          return function (i, a) {
            (this.v = { v: [], i: [], o: [], c: !0 }),
              (this.elem = i),
              (this.comp = i.comp),
              (this.data = a),
              (this.frameId = -1),
              (this.d = a.d),
              (this.dynamicProperties = []),
              (this.mdf = !1),
              (a.closed = !0),
              (this.closed = !0),
              (this.getValue = r),
              (this.reset = s),
              1 === a.sy
                ? ((this.ir = PropertyFactory.getProp(
                    i,
                    a.ir,
                    0,
                    0,
                    this.dynamicProperties
                  )),
                  (this.is = PropertyFactory.getProp(
                    i,
                    a.is,
                    0,
                    0.01,
                    this.dynamicProperties
                  )),
                  (this.convertToPath = e))
                : (this.convertToPath = t),
              (this.pt = PropertyFactory.getProp(
                i,
                a.pt,
                0,
                0,
                this.dynamicProperties
              )),
              (this.p = PropertyFactory.getProp(
                i,
                a.p,
                1,
                0,
                this.dynamicProperties
              )),
              (this.r = PropertyFactory.getProp(
                i,
                a.r,
                0,
                degToRads,
                this.dynamicProperties
              )),
              (this.or = PropertyFactory.getProp(
                i,
                a.or,
                0,
                0,
                this.dynamicProperties
              )),
              (this.os = PropertyFactory.getProp(
                i,
                a.os,
                0,
                0.01,
                this.dynamicProperties
              )),
              (this.paths = []),
              this.dynamicProperties.length
                ? (this.k = !0)
                : this.convertToPath();
          };
        })(),
        l = (function () {
          function t(t) {
            if (this.elem.globalData.frameId !== this.frameId) {
              (this.mdf = !1), (this.frameId = this.elem.globalData.frameId);
              var e,
                s = this.dynamicProperties.length;
              for (e = 0; s > e; e += 1)
                this.dynamicProperties[e].getValue(t),
                  this.dynamicProperties[e].mdf && (this.mdf = !0);
              this.mdf && this.convertRectToPath();
            }
          }
          function e() {
            var t = this.p.v[0],
              e = this.p.v[1],
              s = this.s.v[0] / 2,
              r = this.s.v[1] / 2,
              i = bm_min(s, r, this.r.v),
              a = i * (1 - roundCorner);
            2 === this.d || 1 === this.d
              ? ((this.v.v[0] = [t + s, e - r + i]),
                (this.v.o[0] = this.v.v[0]),
                (this.v.i[0] = [t + s, e - r + a]),
                (this.v.v[1] = [t + s, e + r - i]),
                (this.v.o[1] = [t + s, e + r - a]),
                (this.v.i[1] = this.v.v[1]),
                (this.v.v[2] = [t + s - i, e + r]),
                (this.v.o[2] = this.v.v[2]),
                (this.v.i[2] = [t + s - a, e + r]),
                (this.v.v[3] = [t - s + i, e + r]),
                (this.v.o[3] = [t - s + a, e + r]),
                (this.v.i[3] = this.v.v[3]),
                (this.v.v[4] = [t - s, e + r - i]),
                (this.v.o[4] = this.v.v[4]),
                (this.v.i[4] = [t - s, e + r - a]),
                (this.v.v[5] = [t - s, e - r + i]),
                (this.v.o[5] = [t - s, e - r + a]),
                (this.v.i[5] = this.v.v[5]),
                (this.v.v[6] = [t - s + i, e - r]),
                (this.v.o[6] = this.v.v[6]),
                (this.v.i[6] = [t - s + a, e - r]),
                (this.v.v[7] = [t + s - i, e - r]),
                (this.v.o[7] = [t + s - a, e - r]),
                (this.v.i[7] = this.v.v[7]))
              : ((this.v.v[0] = [t + s, e - r + i]),
                (this.v.o[0] = [t + s, e - r + a]),
                (this.v.i[0] = this.v.v[0]),
                (this.v.v[1] = [t + s - i, e - r]),
                (this.v.o[1] = this.v.v[1]),
                (this.v.i[1] = [t + s - a, e - r]),
                (this.v.v[2] = [t - s + i, e - r]),
                (this.v.o[2] = [t - s + a, e - r]),
                (this.v.i[2] = this.v.v[2]),
                (this.v.v[3] = [t - s, e - r + i]),
                (this.v.o[3] = this.v.v[3]),
                (this.v.i[3] = [t - s, e - r + a]),
                (this.v.v[4] = [t - s, e + r - i]),
                (this.v.o[4] = [t - s, e + r - a]),
                (this.v.i[4] = this.v.v[4]),
                (this.v.v[5] = [t - s + i, e + r]),
                (this.v.o[5] = this.v.v[5]),
                (this.v.i[5] = [t - s + a, e + r]),
                (this.v.v[6] = [t + s - i, e + r]),
                (this.v.o[6] = [t + s - a, e + r]),
                (this.v.i[6] = this.v.v[6]),
                (this.v.v[7] = [t + s, e + r - i]),
                (this.v.o[7] = this.v.v[7]),
                (this.v.i[7] = [t + s, e + r - a])),
              (this.paths.length = 0),
              (this.paths[0] = this.v);
          }
          return function (r, i) {
            (this.v = {
              v: Array.apply(null, { length: 8 }),
              i: Array.apply(null, { length: 8 }),
              o: Array.apply(null, { length: 8 }),
              c: !0,
            }),
              (this.paths = []),
              (this.numNodes = 8),
              (this.elem = r),
              (this.comp = r.comp),
              (this.frameId = -1),
              (this.d = i.d),
              (this.dynamicProperties = []),
              (this.mdf = !1),
              (i.closed = !0),
              (this.closed = !0),
              (this.getValue = t),
              (this.convertRectToPath = e),
              (this.reset = s),
              (this.p = PropertyFactory.getProp(
                r,
                i.p,
                1,
                0,
                this.dynamicProperties
              )),
              (this.s = PropertyFactory.getProp(
                r,
                i.s,
                1,
                0,
                this.dynamicProperties
              )),
              (this.r = PropertyFactory.getProp(
                r,
                i.r,
                0,
                0,
                this.dynamicProperties
              )),
              this.dynamicProperties.length
                ? (this.k = !0)
                : this.convertRectToPath();
          };
        })(),
        p = {};
      return (p.getShapeProp = a), p;
    })(),
    ShapeModifiers = (function () {
      function t(t, e) {
        r[t] || (r[t] = e);
      }
      function e(t, e, s, i) {
        return new r[t](e, s, i);
      }
      var s = {},
        r = {};
      return (s.registerModifier = t), (s.getModifier = e), s;
    })();
  (ShapeModifier.prototype.initModifierProperties = function () {}),
    (ShapeModifier.prototype.addShape = function (t) {
      this.closed || this.shapes.push({ shape: t, last: [] });
    }),
    (ShapeModifier.prototype.init = function (t, e, s) {
      (this.elem = t),
        (this.frameId = -1),
        (this.shapes = []),
        (this.dynamicProperties = []),
        (this.mdf = !1),
        (this.closed = !1),
        (this.k = !1),
        (this.isTrimming = !1),
        (this.comp = t.comp),
        this.initModifierProperties(t, e),
        this.dynamicProperties.length
          ? ((this.k = !0), s.push(this))
          : this.getValue(!0);
    }),
    extendPrototype(ShapeModifier, TrimModifier),
    (TrimModifier.prototype.processKeys = function (t) {
      if (this.elem.globalData.frameId !== this.frameId || t) {
        (this.mdf = t ? !0 : !1), (this.frameId = this.elem.globalData.frameId);
        var e,
          s = this.dynamicProperties.length;
        for (e = 0; s > e; e += 1)
          this.dynamicProperties[e].getValue(),
            this.dynamicProperties[e].mdf && (this.mdf = !0);
        if (this.mdf || t) {
          var r = (this.o.v % 360) / 360;
          0 > r && (r += 1);
          var i = this.s.v + r,
            a = this.e.v + r;
          if (i > a) {
            var n = i;
            (i = a), (a = n);
          }
          (this.sValue = i), (this.eValue = a), (this.oValue = r);
        }
      }
    }),
    (TrimModifier.prototype.initModifierProperties = function (t, e) {
      (this.sValue = 0),
        (this.eValue = 0),
        (this.oValue = 0),
        (this.getValue = this.processKeys),
        (this.s = PropertyFactory.getProp(
          t,
          e.s,
          0,
          0.01,
          this.dynamicProperties
        )),
        (this.e = PropertyFactory.getProp(
          t,
          e.e,
          0,
          0.01,
          this.dynamicProperties
        )),
        (this.o = PropertyFactory.getProp(
          t,
          e.o,
          0,
          0,
          this.dynamicProperties
        )),
        this.dynamicProperties.length || this.getValue(!0);
    }),
    (TrimModifier.prototype.getSegmentsLength = function (t) {
      var e,
        s = t.c,
        r = t.v,
        i = t.o,
        a = t.i,
        n = r.length,
        o = [],
        h = 0;
      for (e = 0; n - 1 > e; e += 1)
        (o[e] = bez.getBezierLength(r[e], r[e + 1], i[e], a[e + 1])),
          (h += o[e].addedLength);
      return (
        s &&
          ((o[e] = bez.getBezierLength(r[e], r[0], i[e], a[0])),
          (h += o[e].addedLength)),
        { lengths: o, totalLength: h }
      );
    }),
    (TrimModifier.prototype.processShapes = function () {
      var t,
        e,
        s,
        r,
        i,
        a,
        n,
        o = this.shapes.length,
        h = this.sValue,
        l = this.eValue,
        p = 0;
      if (l === h)
        for (e = 0; o > e; e += 1)
          (this.shapes[e].shape.paths = []), (this.shapes[e].shape.mdf = !0);
      else {
        var m,
          f,
          d = [];
        for (e = 0; o > e; e += 1)
          if (((m = this.shapes[e]), m.shape.mdf || this.mdf)) {
            for (
              t = m.shape.paths,
                m.shape.mdf = !0,
                r = t.length,
                i = [],
                n = 0,
                s = 0;
              r > s;
              s += 1
            )
              (a = this.getSegmentsLength(t[s])),
                i.push(a),
                (n += a.totalLength);
            (m.totalShapeLength = n), (m.pathsData = i), (p += n);
          } else m.shape.paths = m.last;
        for (e = 0; o > e; e += 1)
          if (((f = []), (m = this.shapes[e]), m.shape.mdf)) {
            (d.length = 0),
              1 >= l
                ? d.push({
                    s: m.totalShapeLength * h,
                    e: m.totalShapeLength * l,
                  })
                : h >= 1
                ? d.push({
                    s: m.totalShapeLength * (h - 1),
                    e: m.totalShapeLength * (l - 1),
                  })
                : (d.push({ s: m.totalShapeLength * h, e: m.totalShapeLength }),
                  d.push({ s: 0, e: m.totalShapeLength * (l - 1) }));
            var c,
              u = this.addShapes(m, d[0]);
            f.push(u),
              d.length > 1 &&
                (m.shape.closed
                  ? this.addShapes(m, d[1], u)
                  : ((u.i[0] = [u.v[0][0], u.v[0][1]]),
                    (c = u.v.length - 1),
                    (u.o[c] = [u.v[c][0], u.v[c][1]]),
                    (u = this.addShapes(m, d[1])),
                    f.push(u))),
              (u.i[0] = [u.v[0][0], u.v[0][1]]),
              (c = u.v.length - 1),
              (u.o[c] = [u.v[c][0], u.v[c][1]]),
              (m.last = f),
              (m.shape.paths = f);
          }
      }
      this.dynamicProperties.length || (this.mdf = !1);
    }),
    (TrimModifier.prototype.addSegment = function (t, e, s, r, i, a) {
      (i.o[a] = e), (i.i[a + 1] = s), (i.v[a + 1] = r), (i.v[a] = t);
    }),
    (TrimModifier.prototype.addShapes = function (t, e, s) {
      var r,
        i,
        a,
        n,
        o,
        h,
        l,
        p = t.pathsData,
        m = t.shape.paths,
        f = m.length,
        d = 0;
      for (
        s
          ? (o = s.v.length - 1)
          : ((s = { c: !1, v: [], i: [], o: [] }), (o = 0)),
          r = 0;
        f > r;
        r += 1
      ) {
        for (
          h = p[r].lengths, a = m[r].c ? h.length : h.length + 1, i = 1;
          a > i;
          i += 1
        )
          if (((n = h[i - 1]), d + n.addedLength < e.s)) d += n.addedLength;
          else {
            if (d > e.e) break;
            e.s <= d && e.e >= d + n.addedLength
              ? this.addSegment(
                  m[r].v[i - 1],
                  m[r].o[i - 1],
                  m[r].i[i],
                  m[r].v[i],
                  s,
                  o
                )
              : ((l = bez.getNewSegment(
                  m[r].v[i - 1],
                  m[r].v[i],
                  m[r].o[i - 1],
                  m[r].i[i],
                  (e.s - d) / n.addedLength,
                  (e.e - d) / n.addedLength,
                  h[i - 1]
                )),
                this.addSegment(l.pt1, l.pt3, l.pt4, l.pt2, s, o)),
              (d += n.addedLength),
              (o += 1);
          }
        if (m[r].c && d <= e.e) {
          var c = h[i - 1].addedLength;
          e.s <= d && e.e >= d + c
            ? this.addSegment(
                m[r].v[i - 1],
                m[r].o[i - 1],
                m[r].i[0],
                m[r].v[0],
                s,
                o
              )
            : ((l = bez.getNewSegment(
                m[r].v[i - 1],
                m[r].v[0],
                m[r].o[i - 1],
                m[r].i[0],
                (e.s - d) / c,
                (e.e - d) / c,
                h[i - 1]
              )),
              this.addSegment(l.pt1, l.pt3, l.pt4, l.pt2, s, o));
        }
      }
      return s;
    }),
    ShapeModifiers.registerModifier("tm", TrimModifier),
    extendPrototype(ShapeModifier, RoundCornersModifier),
    (RoundCornersModifier.prototype.processKeys = function (t) {
      if (this.elem.globalData.frameId !== this.frameId || t) {
        (this.mdf = t ? !0 : !1), (this.frameId = this.elem.globalData.frameId);
        var e,
          s = this.dynamicProperties.length;
        for (e = 0; s > e; e += 1)
          this.dynamicProperties[e].getValue(),
            this.dynamicProperties[e].mdf && (this.mdf = !0);
      }
    }),
    (RoundCornersModifier.prototype.initModifierProperties = function (t, e) {
      (this.getValue = this.processKeys),
        (this.rd = PropertyFactory.getProp(
          t,
          e.r,
          0,
          null,
          this.dynamicProperties
        )),
        this.dynamicProperties.length || this.getValue(!0);
    }),
    (RoundCornersModifier.prototype.processPath = function (t, e) {
      var s,
        r,
        i,
        a,
        n,
        o,
        h,
        l,
        p,
        m,
        f = t.v.length,
        d = [],
        c = [],
        u = [];
      for (s = 0; f > s; s += 1)
        (r = t.v[s]),
          (a = t.o[s]),
          (i = t.i[s]),
          r[0] === a[0] && r[1] === a[1] && r[0] === i[0] && r[1] === i[1]
            ? (0 !== s && s !== f - 1) || t.c
              ? ((n = 0 === s ? t.v[f - 1] : t.v[s - 1]),
                (p = Math.sqrt(
                  Math.pow(r[0] - n[0], 2) + Math.pow(r[1] - n[1], 2)
                )),
                (m = Math.min(p / 2, e) / p),
                (o = [r[0] + (n[0] - r[0]) * m, r[1] - (r[1] - n[1]) * m]),
                (l = o),
                (h = [
                  o[0] - (o[0] - r[0]) * roundCorner,
                  o[1] - (o[1] - r[1]) * roundCorner,
                ]),
                d.push(o),
                c.push(h),
                u.push(l),
                (n = s === f - 1 ? t.v[0] : t.v[s + 1]),
                (p = Math.sqrt(
                  Math.pow(r[0] - n[0], 2) + Math.pow(r[1] - n[1], 2)
                )),
                (m = Math.min(p / 2, e) / p),
                (o = [r[0] + (n[0] - r[0]) * m, r[1] + (n[1] - r[1]) * m]),
                (l = [
                  o[0] - (o[0] - r[0]) * roundCorner,
                  o[1] - (o[1] - r[1]) * roundCorner,
                ]),
                (h = o),
                d.push(o),
                c.push(h),
                u.push(l))
              : (d.push(r), c.push(a), u.push(i))
            : (d.push(t.v[s]), c.push(t.o[s]), u.push(t.i[s]));
      return { v: d, o: c, i: u, c: t.c };
    }),
    (RoundCornersModifier.prototype.processShapes = function () {
      var t,
        e,
        s,
        r,
        i = this.shapes.length,
        a = this.rd.v;
      if (0 !== a) {
        var n,
          o = [];
        for (e = 0; i > e; e += 1)
          if (((n = this.shapes[e]), n.shape.mdf || this.mdf)) {
            for (
              n.shape.mdf = !0, t = n.shape.paths, r = t.length, s = 0;
              r > s;
              s += 1
            )
              o.push(this.processPath(t[s], a));
            (n.shape.paths = o), (n.last = o);
          } else n.shape.paths = n.last;
      }
      this.dynamicProperties.length || (this.mdf = !1);
    }),
    ShapeModifiers.registerModifier("rd", RoundCornersModifier),
    (SVGRenderer.prototype.createItem = function (t, e, s, r) {
      switch (t.ty) {
        case 2:
          return this.createImage(t, e, s, r);
        case 0:
          return this.createComp(t, e, s, r);
        case 1:
          return this.createSolid(t, e, s, r);
        case 4:
          return this.createShape(t, e, s, r);
        case 5:
          return this.createText(t, e, s, r);
        case 99:
          return this.createPlaceHolder(t, e);
      }
      return this.createBase(t, e, s);
    }),
    (SVGRenderer.prototype.buildItems = function (t, e, s, r, i) {
      var a,
        n = t.length;
      s || (s = this.elements),
        e || (e = this.animationItem.container),
        r || (r = this);
      var o;
      for (a = n - 1; a >= 0; a--)
        (s[a] = this.createItem(t[a], e, r, i)),
          0 === t[a].ty &&
            ((o = []),
            this.buildItems(
              t[a].layers,
              s[a].getDomElement(),
              o,
              s[a],
              s[a].placeholder
            ),
            s[a].setElements(o)),
          t[a].td && s[a + 1].setMatte(s[a].layerId);
    }),
    (SVGRenderer.prototype.includeLayers = function (t, e, s) {
      var r,
        i = t.length;
      s || (s = this.elements), e || (e = this.animationItem.container);
      var a,
        n,
        o,
        h = s.length;
      for (r = 0; i > r; r += 1)
        for (a = 0; h > a; ) {
          if (s[a].data.id == t[r].id) {
            (o = s[a]),
              (s[a] = this.createItem(t[r], e, this, o)),
              0 === t[r].ty &&
                ((n = []),
                this.buildItems(
                  t[r].layers,
                  s[a].getDomElement(),
                  n,
                  s[a],
                  s[r].placeholder
                ),
                s[a].setElements(n));
            break;
          }
          a += 1;
        }
      for (r = 0; i > r; r += 1) t[r].td && s[r + 1].setMatte(s[r].layerId);
    }),
    (SVGRenderer.prototype.createBase = function (t, e, s, r) {
      return new SVGBaseElement(t, e, this.globalData, s, r);
    }),
    (SVGRenderer.prototype.createPlaceHolder = function (t, e) {
      return new PlaceHolderElement(t, e, this.globalData);
    }),
    (SVGRenderer.prototype.createShape = function (t, e, s, r) {
      return new IShapeElement(t, e, this.globalData, s, r);
    }),
    (SVGRenderer.prototype.createText = function (t, e, s, r) {
      return new SVGTextElement(t, e, this.globalData, s, r);
    }),
    (SVGRenderer.prototype.createImage = function (t, e, s, r) {
      return new IImageElement(t, e, this.globalData, s, r);
    }),
    (SVGRenderer.prototype.createComp = function (t, e, s, r) {
      return new ICompElement(t, e, this.globalData, s, r);
    }),
    (SVGRenderer.prototype.createSolid = function (t, e, s, r) {
      return new ISolidElement(t, e, this.globalData, s, r);
    }),
    (SVGRenderer.prototype.configAnimation = function (t) {
      (this.animationItem.container = document.createElementNS(svgNS, "svg")),
        this.animationItem.container.setAttribute(
          "xmlns",
          "http://www.w3.org/2000/svg"
        ),
        this.animationItem.container.setAttribute("width", t.w),
        this.animationItem.container.setAttribute("height", t.h),
        this.animationItem.container.setAttribute(
          "viewBox",
          "0 0 " + t.w + " " + t.h
        ),
        this.animationItem.container.setAttribute(
          "preserveAspectRatio",
          this.renderConfig.preserveAspectRatio
        ),
        (this.animationItem.container.style.width = "100%"),
        (this.animationItem.container.style.height = "100%"),
        (this.animationItem.container.style.transform = "translate3d(0,0,0)"),
        (this.animationItem.container.style.transformOrigin =
          this.animationItem.container.style.mozTransformOrigin =
          this.animationItem.container.style.webkitTransformOrigin =
          this.animationItem.container.style["-webkit-transform"] =
            "0px 0px 0px"),
        this.animationItem.wrapper.appendChild(this.animationItem.container);
      var e = document.createElementNS(svgNS, "defs");
      (this.globalData.defs = e),
        this.animationItem.container.appendChild(e),
        (this.globalData.getAssetData = this.animationItem.getAssetData.bind(
          this.animationItem
        )),
        (this.globalData.getPath = this.animationItem.getPath.bind(
          this.animationItem
        )),
        (this.globalData.elementLoaded = this.animationItem.elementLoaded.bind(
          this.animationItem
        )),
        (this.globalData.frameId = 0),
        (this.globalData.compSize = { w: t.w, h: t.h }),
        (this.globalData.frameRate = t.fr);
      var s = document.createElementNS(svgNS, "clipPath"),
        r = document.createElementNS(svgNS, "rect");
      r.setAttribute("width", t.w),
        r.setAttribute("height", t.h),
        r.setAttribute("x", 0),
        r.setAttribute("y", 0);
      var i = "animationMask_" + randomString(10);
      s.setAttribute("id", i), s.appendChild(r);
      var a = document.createElementNS(svgNS, "g");
      a.setAttribute("clip-path", "url(#" + i + ")"),
        this.animationItem.container.appendChild(a),
        e.appendChild(s),
        (this.animationItem.container = a),
        (this.layers = t.layers),
        (this.globalData.fontManager = new FontManager()),
        this.globalData.fontManager.addChars(t.chars),
        this.globalData.fontManager.addFonts(t.fonts, e);
    }),
    (SVGRenderer.prototype.buildStage = function (t, e, s) {
      var r,
        i,
        a = e.length;
      for (s || (s = this.elements), r = a - 1; r >= 0; r--)
        (i = e[r]),
          void 0 !== i.parent &&
            this.buildItemParenting(i, s[r], e, i.parent, s, !0),
          0 === i.ty &&
            this.buildStage(
              s[r].getComposingElement(),
              i.layers,
              s[r].getElements()
            );
    }),
    (SVGRenderer.prototype.buildItemParenting = function (t, e, s, r, i, a) {
      t.parents || (t.parents = []), a && e.resetHierarchy();
      for (var n = 0, o = s.length; o > n; )
        s[n].ind == r &&
          (e.getHierarchy().push(i[n]),
          void 0 !== s[n].parent &&
            this.buildItemParenting(t, e, s, s[n].parent, i, !1)),
          (n += 1);
    }),
    (SVGRenderer.prototype.destroy = function () {
      (this.animationItem.wrapper.innerHTML = ""),
        (this.animationItem.container = null),
        (this.globalData.defs = null);
      var t,
        e = this.layers ? this.layers.length : 0;
      for (t = 0; e > t; t++) this.elements[t].destroy();
      (this.elements.length = 0), (this.destroyed = !0);
    }),
    (SVGRenderer.prototype.updateContainerSize = function () {}),
    (SVGRenderer.prototype.renderFrame = function (t) {
      if (this.renderedFrame != t && !this.destroyed) {
        null === t ? (t = this.renderedFrame) : (this.renderedFrame = t),
          (this.globalData.frameNum = t),
          (this.globalData.frameId += 1);
        var e,
          s = this.layers.length;
        for (e = s - 1; e >= 0; e--)
          this.elements[e].prepareFrame(t - this.layers[e].st);
        for (e = s - 1; e >= 0; e--) this.elements[e].renderFrame();
      }
    }),
    (SVGRenderer.prototype.hide = function () {
      this.animationItem.container.style.display = "none";
    }),
    (SVGRenderer.prototype.show = function () {
      this.animationItem.container.style.display = "block";
    }),
    (CanvasRenderer.prototype.createItem = function (t, e, s) {
      switch (t.ty) {
        case 0:
          return this.createComp(t, e, s);
        case 1:
          return this.createSolid(t, e, s);
        case 2:
          return this.createImage(t, e, s);
        case 4:
          return this.createShape(t, e, s);
        case 5:
          return this.createText(t, e, s);
        case 99:
          return this.createPlaceHolder(t, e, s);
        default:
          return this.createBase(t, e, s);
      }
      return this.createBase(t, e, s);
    }),
    (CanvasRenderer.prototype.buildItems = function (t, e, s) {
      e || (e = this.elements), s || (s = this);
      var r,
        i = t.length;
      for (r = 0; i > r; r++)
        if (((e[r] = this.createItem(t[r], s, s.globalData)), 0 === t[r].ty)) {
          var a = [];
          this.buildItems(t[r].layers, a, e[r], s.globalData),
            e[e.length - 1].setElements(a);
        }
    }),
    (CanvasRenderer.prototype.includeLayers = function (t, e, s) {
      var r,
        i = t.length;
      s || (s = this.elements);
      var a,
        n,
        o = s.length;
      for (r = 0; i > r; r += 1)
        for (a = 0; o > a; ) {
          if (s[a].data.id == t[r].id) {
            (s[a] = this.createItem(t[r], this)),
              0 === t[r].ty &&
                ((n = []),
                this.buildItems(t[r].layers, n, s[a]),
                s[a].setElements(n));
            break;
          }
          a += 1;
        }
    }),
    (CanvasRenderer.prototype.createBase = function (t, e, s) {
      return new CVBaseElement(t, e, s);
    }),
    (CanvasRenderer.prototype.createShape = function (t, e, s) {
      return new CVShapeElement(t, e, s);
    }),
    (CanvasRenderer.prototype.createText = function (t, e, s) {
      return new CVTextElement(t, e, s);
    }),
    (CanvasRenderer.prototype.createPlaceHolder = function (t, e) {
      return new PlaceHolderElement(t, null, e);
    }),
    (CanvasRenderer.prototype.createImage = function (t, e, s) {
      return new CVImageElement(t, e, s);
    }),
    (CanvasRenderer.prototype.createComp = function (t, e, s) {
      return new CVCompElement(t, e, s);
    }),
    (CanvasRenderer.prototype.createSolid = function (t, e, s) {
      return new CVSolidElement(t, e, s);
    }),
    (CanvasRenderer.prototype.ctxTransform = function (t) {
      if (
        1 !== t[0] ||
        0 !== t[1] ||
        0 !== t[4] ||
        1 !== t[5] ||
        0 !== t[12] ||
        0 !== t[13]
      ) {
        if (!this.renderConfig.clearCanvas)
          return void this.canvasContext.transform(
            t[0],
            t[1],
            t[4],
            t[5],
            t[12],
            t[13]
          );
        this.transformMat.cloneFromProps(t),
          this.transformMat.transform(
            this.contextData.cTr.props[0],
            this.contextData.cTr.props[1],
            this.contextData.cTr.props[2],
            this.contextData.cTr.props[3],
            this.contextData.cTr.props[4],
            this.contextData.cTr.props[5],
            this.contextData.cTr.props[6],
            this.contextData.cTr.props[7],
            this.contextData.cTr.props[8],
            this.contextData.cTr.props[9],
            this.contextData.cTr.props[10],
            this.contextData.cTr.props[11],
            this.contextData.cTr.props[12],
            this.contextData.cTr.props[13],
            this.contextData.cTr.props[14],
            this.contextData.cTr.props[15]
          ),
          this.contextData.cTr.cloneFromProps(this.transformMat.props);
        var e = this.contextData.cTr.props;
        this.canvasContext.setTransform(e[0], e[1], e[4], e[5], e[12], e[13]);
      }
    }),
    (CanvasRenderer.prototype.ctxOpacity = function (t) {
      if (1 !== t) {
        if (!this.renderConfig.clearCanvas)
          return void (this.canvasContext.globalAlpha *= 0 > t ? 0 : t);
        (this.contextData.cO *= 0 > t ? 0 : t),
          (this.canvasContext.globalAlpha = this.contextData.cO);
      }
    }),
    (CanvasRenderer.prototype.reset = function () {
      return this.renderConfig.clearCanvas
        ? ((this.contextData.cArrPos = 0),
          this.contextData.cTr.reset(),
          void (this.contextData.cO = 1))
        : void this.canvasContext.restore();
    }),
    (CanvasRenderer.prototype.save = function (t) {
      if (!this.renderConfig.clearCanvas) return void this.canvasContext.save();
      t && this.canvasContext.save();
      var e = this.contextData.cTr.props;
      (null === this.contextData.saved[this.contextData.cArrPos] ||
        void 0 === this.contextData.saved[this.contextData.cArrPos]) &&
        (this.contextData.saved[this.contextData.cArrPos] = new Array(16));
      var s,
        r = this.contextData.saved[this.contextData.cArrPos];
      for (s = 0; 16 > s; s += 1) r[s] = e[s];
      (this.contextData.savedOp[this.contextData.cArrPos] =
        this.contextData.cO),
        (this.contextData.cArrPos += 1);
    }),
    (CanvasRenderer.prototype.restore = function (t) {
      if (!this.renderConfig.clearCanvas)
        return void this.canvasContext.restore();
      t && this.canvasContext.restore(), (this.contextData.cArrPos -= 1);
      var e,
        s = this.contextData.saved[this.contextData.cArrPos],
        r = this.contextData.cTr.props;
      for (e = 0; 16 > e; e += 1) r[e] = s[e];
      this.canvasContext.setTransform(s[0], s[1], s[4], s[5], s[12], s[13]),
        (s = this.contextData.savedOp[this.contextData.cArrPos]),
        (this.contextData.cO = s),
        (this.canvasContext.globalAlpha = s);
    }),
    (CanvasRenderer.prototype.configAnimation = function (t) {
      this.animationItem.wrapper
        ? ((this.animationItem.container = document.createElement("canvas")),
          (this.animationItem.container.style.width = "100%"),
          (this.animationItem.container.style.height = "100%"),
          (this.animationItem.container.style.transformOrigin =
            this.animationItem.container.style.mozTransformOrigin =
            this.animationItem.container.style.webkitTransformOrigin =
            this.animationItem.container.style["-webkit-transform"] =
              "0px 0px 0px"),
          this.animationItem.wrapper.appendChild(this.animationItem.container),
          (this.canvasContext = this.animationItem.container.getContext("2d")))
        : (this.canvasContext = this.renderConfig.context),
        (this.globalData.canvasContext = this.canvasContext),
        (this.globalData.renderer = this),
        (this.globalData.isDashed = !1),
        (this.globalData.totalFrames = Math.floor(t.tf)),
        (this.globalData.compWidth = t.w),
        (this.globalData.compHeight = t.h),
        (this.globalData.frameRate = t.fr),
        (this.globalData.frameId = 0),
        (this.globalData.compSize = { w: t.w, h: t.h }),
        (this.layers = t.layers),
        (this.transformCanvas = {}),
        (this.transformCanvas.w = t.w),
        (this.transformCanvas.h = t.h),
        (this.globalData.fontManager = new FontManager()),
        this.globalData.fontManager.addChars(t.chars),
        this.globalData.fontManager.addFonts(t.fonts, document),
        (this.globalData.getAssetData = this.animationItem.getAssetData.bind(
          this.animationItem
        )),
        (this.globalData.getPath = this.animationItem.getPath.bind(
          this.animationItem
        )),
        (this.globalData.elementLoaded = this.animationItem.elementLoaded.bind(
          this.animationItem
        )),
        (this.globalData.addPendingElement =
          this.animationItem.addPendingElement.bind(this.animationItem));
    }),
    (CanvasRenderer.prototype.updateContainerSize = function () {
      var t, e;
      if (
        (this.animationItem.wrapper && this.animationItem.container
          ? ((t = this.animationItem.wrapper.offsetWidth),
            (e = this.animationItem.wrapper.offsetHeight),
            this.animationItem.container.setAttribute(
              "width",
              t * this.renderConfig.dpr
            ),
            this.animationItem.container.setAttribute(
              "height",
              e * this.renderConfig.dpr
            ))
          : ((t = this.canvasContext.canvas.width * this.renderConfig.dpr),
            (e = this.canvasContext.canvas.height * this.renderConfig.dpr)),
        "fit" == this.renderConfig.scaleMode)
      ) {
        var s = t / e,
          r = this.transformCanvas.w / this.transformCanvas.h;
        r > s
          ? ((this.transformCanvas.sx =
              t / (this.transformCanvas.w / this.renderConfig.dpr)),
            (this.transformCanvas.sy =
              t / (this.transformCanvas.w / this.renderConfig.dpr)),
            (this.transformCanvas.tx = 0),
            (this.transformCanvas.ty =
              ((e - this.transformCanvas.h * (t / this.transformCanvas.w)) /
                2) *
              this.renderConfig.dpr))
          : ((this.transformCanvas.sx =
              e / (this.transformCanvas.h / this.renderConfig.dpr)),
            (this.transformCanvas.sy =
              e / (this.transformCanvas.h / this.renderConfig.dpr)),
            (this.transformCanvas.tx =
              ((t - this.transformCanvas.w * (e / this.transformCanvas.h)) /
                2) *
              this.renderConfig.dpr),
            (this.transformCanvas.ty = 0));
      } else
        (this.transformCanvas.sx = this.renderConfig.dpr),
          (this.transformCanvas.sy = this.renderConfig.dpr),
          (this.transformCanvas.tx = 0),
          (this.transformCanvas.ty = 0);
      this.transformCanvas.props = [
        this.transformCanvas.sx,
        0,
        0,
        0,
        0,
        this.transformCanvas.sy,
        0,
        0,
        0,
        0,
        1,
        0,
        this.transformCanvas.tx,
        this.transformCanvas.ty,
        0,
        1,
      ];
      var i,
        a = this.elements.length;
      for (i = 0; a > i; i += 1)
        0 === this.elements[i].data.ty &&
          this.elements[i].resize(this.transformCanvas);
    }),
    (CanvasRenderer.prototype.buildStage = function (t, e, s) {
      s || (s = this.elements);
      var r,
        i,
        a = e.length;
      for (r = a - 1; r >= 0; r--)
        (i = e[r]),
          void 0 !== i.parent &&
            this.buildItemHierarchy(i, s[r], e, i.parent, s, !0),
          0 == i.ty && this.buildStage(null, i.layers, s[r].getElements());
      this.updateContainerSize();
    }),
    (CanvasRenderer.prototype.buildItemHierarchy = function (t, e, s, r, i, a) {
      var n = 0,
        o = s.length;
      for (a && e.resetHierarchy(); o > n; )
        s[n].ind === r &&
          (e.getHierarchy().push(i[n]),
          void 0 !== s[n].parent &&
            this.buildItemHierarchy(t, e, s, s[n].parent, i, !1)),
          (n += 1);
    }),
    (CanvasRenderer.prototype.destroy = function () {
      this.renderConfig.clearCanvas &&
        (this.animationItem.wrapper.innerHTML = "");
      var t,
        e = this.layers ? this.layers.length : 0;
      for (t = e - 1; t >= 0; t -= 1) this.elements[t].destroy();
      (this.elements.length = 0),
        (this.globalData.canvasContext = null),
        (this.animationItem.container = null),
        (this.destroyed = !0);
    }),
    (CanvasRenderer.prototype.renderFrame = function (t) {
      if (
        !(
          (this.renderedFrame == t && this.renderConfig.clearCanvas === !0) ||
          this.destroyed ||
          null === t
        )
      ) {
        (this.renderedFrame = t),
          (this.globalData.frameNum = t - this.animationItem.firstFrame),
          (this.globalData.frameId += 1),
          this.renderConfig.clearCanvas === !0
            ? (this.reset(),
              this.canvasContext.save(),
              this.canvasContext.clearRect(
                this.transformCanvas.tx,
                this.transformCanvas.ty,
                this.transformCanvas.w * this.transformCanvas.sx,
                this.transformCanvas.h * this.transformCanvas.sy
              ))
            : this.save(),
          this.ctxTransform(this.transformCanvas.props),
          this.canvasContext.beginPath(),
          this.canvasContext.rect(
            0,
            0,
            this.transformCanvas.w,
            this.transformCanvas.h
          ),
          this.canvasContext.closePath(),
          this.canvasContext.clip();
        var e,
          s = this.layers.length;
        for (e = 0; s > e; e++)
          this.elements[e].prepareFrame(t - this.layers[e].st);
        for (e = s - 1; e >= 0; e -= 1) this.elements[e].renderFrame();
        this.renderConfig.clearCanvas !== !0
          ? this.restore()
          : this.canvasContext.restore();
      }
    }),
    (CanvasRenderer.prototype.hide = function () {
      this.animationItem.container.style.display = "none";
    }),
    (CanvasRenderer.prototype.show = function () {
      this.animationItem.container.style.display = "block";
    }),
    (HybridRenderer.prototype.createItem = function (t, e, s, r) {
      switch (t.ty) {
        case 2:
          return this.createImage(t, e, s, r);
        case 0:
          return this.createComp(t, e, s, r);
        case 1:
          return this.createSolid(t, e, s, r);
        case 4:
          return this.createShape(t, e, s, r);
        case 5:
          return this.createText(t, e, s, r);
        case 13:
          return this.createCamera(t, e, s, r);
        case 99:
          return this.createPlaceHolder(t, e);
      }
      return this.createBase(t, e, s);
    }),
    (HybridRenderer.prototype.buildItems = function (t, e, s, r, i) {
      var a,
        n = t.length;
      s || (s = this.elements), r || (r = this);
      var o,
        h,
        l = !1;
      for (a = n - 1; a >= 0; a--)
        e
          ? (s[a] = this.createItem(t[a], e, r, i))
          : t[a].ddd
          ? (l || ((l = !0), (o = this.getThreeDContainer())),
            (s[a] = this.createItem(t[a], o, r, i)))
          : ((l = !1),
            (s[a] = this.createItem(
              t[a],
              this.animationItem.resizerElem,
              r,
              i
            ))),
          0 === t[a].ty &&
            ((h = []),
            this.buildItems(
              t[a].layers,
              s[a].getDomElement(),
              h,
              s[a],
              s[a].placeholder
            ),
            s[a].setElements(h)),
          t[a].td && s[a + 1].setMatte(s[a].layerId);
      if (
        ((this.currentContainer = this.animationItem.resizerElem),
        !e && this.threeDElements.length)
      )
        if (this.camera) this.camera.setup();
        else {
          var p = this.globalData.compSize.w,
            m = this.globalData.compSize.h;
          for (n = this.threeDElements.length, a = 0; n > a; a += 1)
            this.threeDElements[0][a].style.perspective =
              this.threeDElements[0][a].style.webkitPerspective =
                Math.sqrt(Math.pow(p, 2) + Math.pow(m, 2)) + "px";
        }
    }),
    (HybridRenderer.prototype.includeLayers = function (t, e, s) {
      var r,
        i = t.length;
      s || (s = this.elements), e || (e = this.currentContainer);
      var a,
        n,
        o,
        h = s.length;
      for (r = 0; i > r; r += 1)
        if (t[r].id)
          for (a = 0; h > a; )
            s[a].data.id == t[r].id &&
              ((o = s[a]),
              (s[a] = this.createItem(t[r], e, this, o)),
              0 === t[r].ty &&
                ((n = []),
                this.buildItems(
                  t[r].layers,
                  s[a].getDomElement(),
                  n,
                  s[a],
                  s[r].placeholder
                ),
                s[a].setElements(n))),
              (a += 1);
        else {
          var l = this.createItem(t[r], e, this);
          s.push(l),
            0 === t[r].ty &&
              ((n = []),
              this.buildItems(t[r].layers, l.getDomElement(), n, l),
              l.setElements(n));
        }
      for (r = 0; i > r; r += 1) t[r].td && s[r + 1].setMatte(s[r].layerId);
    }),
    (HybridRenderer.prototype.createBase = function (t, e, s, r) {
      return new SVGBaseElement(t, e, this.globalData, s, r);
    }),
    (HybridRenderer.prototype.createPlaceHolder = function (t, e) {
      return new PlaceHolderElement(t, e, this.globalData);
    }),
    (HybridRenderer.prototype.createShape = function (t, e, s, r) {
      return s.isSvg
        ? new IShapeElement(t, e, this.globalData, s, r)
        : new HShapeElement(t, e, this.globalData, s, r);
    }),
    (HybridRenderer.prototype.createText = function (t, e, s, r) {
      return s.isSvg
        ? new SVGTextElement(t, e, this.globalData, s, r)
        : new HTextElement(t, e, this.globalData, s, r);
    }),
    (HybridRenderer.prototype.createCamera = function (t, e, s, r) {
      return (
        (this.camera = new HCameraElement(t, e, this.globalData, s, r)),
        this.camera
      );
    }),
    (HybridRenderer.prototype.createImage = function (t, e, s, r) {
      return s.isSvg
        ? new IImageElement(t, e, this.globalData, s, r)
        : new HImageElement(t, e, this.globalData, s, r);
    }),
    (HybridRenderer.prototype.createComp = function (t, e, s, r) {
      return s.isSvg
        ? new ICompElement(t, e, this.globalData, s, r)
        : new HCompElement(t, e, this.globalData, s, r);
    }),
    (HybridRenderer.prototype.createSolid = function (t, e, s, r) {
      return s.isSvg
        ? new ISolidElement(t, e, this.globalData, s, r)
        : new HSolidElement(t, e, this.globalData, s, r);
    }),
    (HybridRenderer.prototype.getThreeDContainer = function () {
      var t = document.createElement("div");
      styleDiv(t),
        (t.style.width = this.globalData.compSize.w + "px"),
        (t.style.height = this.globalData.compSize.h + "px"),
        (t.style.transformOrigin =
          t.style.mozTransformOrigin =
          t.style.webkitTransformOrigin =
            "50% 50%");
      var e = document.createElement("div");
      return (
        styleDiv(e),
        (e.style.transform = e.style.webkitTransform =
          "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)"),
        t.appendChild(e),
        this.animationItem.resizerElem.appendChild(t),
        this.threeDElements.push([t, e]),
        e
      );
    }),
    (HybridRenderer.prototype.configAnimation = function (t) {
      var e = document.createElement("div"),
        s = this.animationItem.wrapper;
      (e.style.width = t.w + "px"),
        (e.style.height = t.h + "px"),
        (this.animationItem.resizerElem = e),
        styleDiv(e),
        (e.style.transformStyle =
          e.style.webkitTransformStyle =
          e.style.mozTransformStyle =
            "flat"),
        s.appendChild(e),
        (e.style.overflow = "hidden");
      var r = document.createElementNS(svgNS, "svg");
      r.setAttribute("width", "1"),
        r.setAttribute("height", "1"),
        styleDiv(r),
        this.animationItem.resizerElem.appendChild(r);
      var i = document.createElementNS(svgNS, "defs");
      r.appendChild(i),
        (this.globalData.defs = i),
        (this.globalData.getAssetData = this.animationItem.getAssetData.bind(
          this.animationItem
        )),
        (this.globalData.getPath = this.animationItem.getPath.bind(
          this.animationItem
        )),
        (this.globalData.elementLoaded = this.animationItem.elementLoaded.bind(
          this.animationItem
        )),
        (this.globalData.frameId = 0),
        (this.globalData.compSize = { w: t.w, h: t.h }),
        (this.globalData.frameRate = t.fr),
        (this.layers = t.layers),
        (this.globalData.fontManager = new FontManager()),
        this.globalData.fontManager.addChars(t.chars),
        this.globalData.fontManager.addFonts(t.fonts, r),
        this.updateContainerSize();
    }),
    (HybridRenderer.prototype.buildStage = function (t, e, s) {
      var r,
        i,
        a = e.length;
      for (s || (s = this.elements), r = a - 1; r >= 0; r--)
        (i = e[r]),
          void 0 !== i.parent &&
            this.buildItemParenting(i, s[r], e, i.parent, s, !0),
          0 === i.ty &&
            this.buildStage(
              s[r].getComposingElement(),
              i.layers,
              s[r].getElements()
            );
    }),
    (HybridRenderer.prototype.buildItemParenting = function (t, e, s, r, i, a) {
      t.parents || (t.parents = []), a && e.resetHierarchy();
      for (var n = 0, o = s.length; o > n; )
        s[n].ind == r &&
          (e.getHierarchy().push(i[n]),
          13 === e.data.ty && i[n].finalTransform.mProp.setInverted(),
          void 0 !== s[n].parent &&
            this.buildItemParenting(t, e, s, s[n].parent, i, !1)),
          (n += 1);
    }),
    (HybridRenderer.prototype.destroy = function () {
      (this.animationItem.wrapper.innerHTML = ""),
        (this.animationItem.container = null),
        (this.globalData.defs = null);
      var t,
        e = this.layers ? this.layers.length : 0;
      for (t = 0; e > t; t++) this.elements[t].destroy();
      (this.elements.length = 0), (this.destroyed = !0);
    }),
    (HybridRenderer.prototype.updateContainerSize = function () {
      var t,
        e,
        s,
        r,
        i = this.animationItem.wrapper.offsetWidth,
        a = this.animationItem.wrapper.offsetHeight,
        n = i / a,
        o = this.globalData.compSize.w / this.globalData.compSize.h;
      o > n
        ? ((t = i / this.globalData.compSize.w),
          (e = i / this.globalData.compSize.w),
          (s = 0),
          (r =
            (a -
              this.globalData.compSize.h * (i / this.globalData.compSize.w)) /
            2))
        : ((t = a / this.globalData.compSize.h),
          (e = a / this.globalData.compSize.h),
          (s =
            (i -
              this.globalData.compSize.w * (a / this.globalData.compSize.h)) /
            2),
          (r = 0)),
        (this.animationItem.resizerElem.style.transform =
          this.animationItem.resizerElem.style.webkitTransform =
            "matrix3d(" +
            t +
            ",0,0,0,0," +
            e +
            ",0,0,0,0,1,0," +
            s +
            "," +
            r +
            ",0,1)");
    }),
    (HybridRenderer.prototype.renderFrame = function (t) {
      if (this.renderedFrame != t && !this.destroyed) {
        null === t ? (t = this.renderedFrame) : (this.renderedFrame = t),
          (this.globalData.frameNum = t),
          (this.globalData.frameId += 1);
        var e,
          s = this.layers.length;
        for (e = 0; s > e; e++)
          this.elements[e].prepareFrame(t - this.layers[e].st);
        for (e = 0; s > e; e++) this.elements[e].renderFrame();
      }
    }),
    (HybridRenderer.prototype.hide = function () {
      this.animationItem.resizerElem.style.display = "none";
    }),
    (HybridRenderer.prototype.show = function () {
      this.animationItem.resizerElem.style.display = "block";
    }),
    (MaskElement.prototype.getMaskProperty = function (t) {
      return this.viewData[t].prop;
    }),
    (MaskElement.prototype.prepareFrame = function () {
      var t,
        e = this.dynamicProperties.length;
      for (t = 0; e > t; t += 1) this.dynamicProperties[t].getValue();
    }),
    (MaskElement.prototype.renderFrame = function () {
      var t,
        e = this.masksProperties.length;
      for (t = 0; e > t; t++)
        if (
          "n" !== this.masksProperties[t].mode &&
          this.masksProperties[t].cl !== !1 &&
          ((this.viewData[t].prop.mdf || this.firstFrame) &&
            this.drawPath(
              this.masksProperties[t],
              this.viewData[t].prop.v,
              this.viewData[t]
            ),
          this.storedData[t].x && (this.storedData[t].x.mdf || this.firstFrame))
        ) {
          var s = this.storedData[t].expan;
          this.storedData[t].x.v < 0
            ? ("erode" !== this.storedData[t].lastOperator &&
                ((this.storedData[t].lastOperator = "erode"),
                this.storedData[t].elem.setAttribute(
                  "filter",
                  "url(#" + this.storedData[t].filterId + ")"
                )),
              s.setAttribute("radius", -this.storedData[t].x.v))
            : ("dilate" !== this.storedData[t].lastOperator &&
                ((this.storedData[t].lastOperator = "dilate"),
                this.storedData[t].elem.setAttribute("filter", null)),
              this.storedData[t].elem.setAttribute(
                "stroke-width",
                2 * this.storedData[t].x.v
              ));
        }
      this.firstFrame = !1;
    }),
    (MaskElement.prototype.getMaskelement = function () {
      return this.maskElement;
    }),
    (MaskElement.prototype.createLayerSolidPath = function () {
      var t = "M0,0 ";
      return (
        (t += " h" + this.globalData.compSize.w),
        (t += " v" + this.globalData.compSize.h),
        (t += " h-" + this.globalData.compSize.w),
        (t += " v-" + this.globalData.compSize.h + " ")
      );
    }),
    (MaskElement.prototype.drawPath = function (t, e, s) {
      var r,
        i,
        a = "";
      for (i = e.v.length, r = 1; i > r; r += 1)
        1 == r && (a += " M" + bm_rnd(e.v[0][0]) + "," + bm_rnd(e.v[0][1])),
          (a +=
            " C" +
            bm_rnd(e.o[r - 1][0]) +
            "," +
            bm_rnd(e.o[r - 1][1]) +
            " " +
            bm_rnd(e.i[r][0]) +
            "," +
            bm_rnd(e.i[r][1]) +
            " " +
            bm_rnd(e.v[r][0]) +
            "," +
            bm_rnd(e.v[r][1]));
      t.cl &&
        (a +=
          " C" +
          bm_rnd(e.o[r - 1][0]) +
          "," +
          bm_rnd(e.o[r - 1][1]) +
          " " +
          bm_rnd(e.i[0][0]) +
          "," +
          bm_rnd(e.i[0][1]) +
          " " +
          bm_rnd(e.v[0][0]) +
          "," +
          bm_rnd(e.v[0][1])),
        s.lastPath !== a &&
          (t.inv
            ? s.elem.setAttribute("d", this.solidPath + a)
            : s.elem.setAttribute("d", a),
          (s.lastPath = a));
    }),
    (MaskElement.prototype.getMask = function (t) {
      for (var e = 0, s = this.masksProperties.length; s > e; ) {
        if (this.masksProperties[e].nm === t)
          return { maskPath: this.viewData[e].prop.pv };
        e += 1;
      }
    }),
    (MaskElement.prototype.destroy = function () {
      (this.element = null),
        (this.globalData = null),
        (this.maskElement = null),
        (this.data = null),
        (this.paths = null),
        (this.masksProperties = null);
    }),
    (BaseElement.prototype.checkMasks = function () {
      if (!this.data.hasMask) return !1;
      for (var t = 0, e = this.data.masksProperties.length; e > t; ) {
        if (
          "n" !== this.data.masksProperties[t].mode &&
          this.data.masksProperties[t].cl !== !1
        )
          return !0;
        t += 1;
      }
      return !1;
    }),
    (BaseElement.prototype.prepareFrame = function (t) {
      this.data.ip - this.data.st <= t && this.data.op - this.data.st > t
        ? this.isVisible !== !0 &&
          ((this.globalData.mdf = !0),
          (this.isVisible = !0),
          (this.firstFrame = !0),
          this.data.hasMask && (this.maskManager.firstFrame = !0))
        : this.isVisible !== !1 &&
          ((this.globalData.mdf = !0), (this.isVisible = !1));
      var e,
        s = this.dynamicProperties.length;
      for (e = 0; s > e; e += 1)
        this.dynamicProperties[e].getValue(),
          this.dynamicProperties[e].mdf && (this.globalData.mdf = !0);
      return (
        this.data.hasMask && this.maskManager.prepareFrame(t * this.data.sr),
        (this.currentFrameNum = t * this.data.sr),
        this.isVisible
      );
    }),
    (BaseElement.prototype.setBlendMode = function () {
      var t = "";
      switch (this.data.bm) {
        case 1:
          t = "multiply";
          break;
        case 2:
          t = "screen";
          break;
        case 3:
          t = "overlay";
          break;
        case 4:
          t = "darken";
          break;
        case 5:
          t = "lighten";
          break;
        case 6:
          t = "color-dodge";
          break;
        case 7:
          t = "color-burn";
          break;
        case 8:
          t = "hard-light";
          break;
        case 9:
          t = "soft-light";
          break;
        case 10:
          t = "difference";
          break;
        case 11:
          t = "exclusion";
          break;
        case 12:
          t = "hue";
          break;
        case 13:
          t = "saturation";
          break;
        case 14:
          t = "color";
          break;
        case 15:
          t = "luminosity";
      }
      this.layerElement.style["mix-blend-mode"] = t;
    }),
    (BaseElement.prototype.init = function () {
      this.data.sr || (this.data.sr = 1),
        (this.dynamicProperties = []),
        this.data.ef &&
          expressionsPlugin &&
          ((this.effectsManager = expressionsPlugin.getEffectsManager(
            this.data,
            this,
            this.dynamicProperties
          )),
          (this.effect = this.effectsManager.bind(this.effectsManager))),
        (this.hidden = !1),
        (this.firstFrame = !0),
        (this.isVisible = !1),
        (this.currentFrameNum = -99999),
        (this.lastNum = -99999),
        (this.finalTransform = {
          mProp: PropertyFactory.getProp(
            this,
            this.data.ks,
            2,
            null,
            this.dynamicProperties
          ),
          matMdf: !1,
          opMdf: !1,
          mat: new Matrix(),
          opacity: 1,
        }),
        (this.finalTransform.op = this.finalTransform.mProp.o),
        (this.transform = this.finalTransform.mProp),
        11 !== this.data.ty && this.createElements(),
        this.data.hasMask && this.addMasks(this.data);
    }),
    (BaseElement.prototype.getType = function () {
      return this.type;
    }),
    (BaseElement.prototype.resetHierarchy = function () {
      this.hierarchy ? (this.hierarchy.length = 0) : (this.hierarchy = []);
    }),
    (BaseElement.prototype.getHierarchy = function () {
      return this.hierarchy || (this.hierarchy = []), this.hierarchy;
    }),
    (BaseElement.prototype.getLayerSize = function () {
      return 5 === this.data.ty
        ? { w: this.data.textData.width, h: this.data.textData.height }
        : { w: this.data.width, h: this.data.height };
    }),
    (BaseElement.prototype.hide = function () {}),
    (BaseElement.prototype.mHelper = new Matrix()),
    createElement(BaseElement, SVGBaseElement),
    (SVGBaseElement.prototype.appendNodeToParent = function (t) {
      if (!this.data.hd || this.data.td)
        if (this.placeholder) {
          var e = this.placeholder.phElement;
          e.parentNode.insertBefore(t, e);
        } else this.parentContainer.appendChild(t);
    }),
    (SVGBaseElement.prototype.createElements = function () {
      if (this.data.td) {
        if (3 == this.data.td)
          (this.layerElement = document.createElementNS(svgNS, "mask")),
            this.layerElement.setAttribute("id", this.layerId),
            this.layerElement.setAttribute("mask-type", "luminance"),
            this.globalData.defs.appendChild(this.layerElement);
        else if (2 == this.data.td) {
          var t = document.createElementNS(svgNS, "mask");
          t.setAttribute("id", this.layerId),
            t.setAttribute("mask-type", "alpha");
          var e = document.createElementNS(svgNS, "g");
          t.appendChild(e),
            (this.layerElement = document.createElementNS(svgNS, "g"));
          var s = document.createElementNS(svgNS, "filter"),
            r = randomString(10);
          s.setAttribute("id", r),
            s.setAttribute("filterUnits", "objectBoundingBox"),
            s.setAttribute("x", "0%"),
            s.setAttribute("y", "0%"),
            s.setAttribute("width", "100%"),
            s.setAttribute("height", "100%");
          var i = document.createElementNS(svgNS, "feComponentTransfer");
          i.setAttribute("in", "SourceGraphic"), s.appendChild(i);
          var a = document.createElementNS(svgNS, "feFuncA");
          a.setAttribute("type", "table"),
            a.setAttribute("tableValues", "1.0 0.0"),
            i.appendChild(a),
            this.globalData.defs.appendChild(s);
          var n = document.createElementNS(svgNS, "rect");
          n.setAttribute("width", "100%"),
            n.setAttribute("height", "100%"),
            n.setAttribute("x", "0"),
            n.setAttribute("y", "0"),
            n.setAttribute("fill", "#ffffff"),
            n.setAttribute("opacity", "0"),
            e.setAttribute("filter", "url(#" + r + ")"),
            e.appendChild(n),
            e.appendChild(this.layerElement),
            this.globalData.defs.appendChild(t);
        } else {
          this.layerElement = document.createElementNS(svgNS, "g");
          var o = document.createElementNS(svgNS, "mask");
          o.setAttribute("id", this.layerId),
            o.setAttribute("mask-type", "alpha"),
            o.appendChild(this.layerElement),
            this.globalData.defs.appendChild(o);
        }
        this.data.hasMask && (this.maskedElement = this.layerElement);
      } else
        this.data.hasMask
          ? ((this.layerElement = document.createElementNS(svgNS, "g")),
            this.data.tt
              ? ((this.matteElement = document.createElementNS(svgNS, "g")),
                this.matteElement.appendChild(this.layerElement),
                this.appendNodeToParent(this.matteElement))
              : this.appendNodeToParent(this.layerElement),
            (this.maskedElement = this.layerElement))
          : this.data.tt
          ? ((this.matteElement = document.createElementNS(svgNS, "g")),
            this.matteElement.setAttribute("id", this.layerId),
            this.appendNodeToParent(this.matteElement),
            (this.layerElement = this.matteElement))
          : (this.layerElement = this.parentContainer);
      (!this.data.ln && !this.data.cl) ||
        (4 !== this.data.ty && 0 !== this.data.ty) ||
        (this.layerElement === this.parentContainer &&
          ((this.layerElement = document.createElementNS(svgNS, "g")),
          this.appendNodeToParent(this.layerElement)),
        this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
        this.data.cl && this.layerElement.setAttribute("class", this.data.cl)),
        0 !== this.data.ty ||
          (!this.finalTransform.op.k && 1 === this.finalTransform.op.p) ||
          this.layerElement !== this.parentContainer ||
          ((this.layerElement = document.createElementNS(svgNS, "g")),
          this.appendNodeToParent(this.layerElement)),
        0 !== this.data.bm &&
          (this.layerElement === this.parentContainer &&
            ((this.layerElement = document.createElementNS(svgNS, "g")),
            this.appendNodeToParent(this.layerElement)),
          this.setBlendMode()),
        this.layerElement !== this.parentContainer && (this.placeholder = null);
    }),
    (SVGBaseElement.prototype.setBlendMode =
      BaseElement.prototype.setBlendMode),
    (SVGBaseElement.prototype.renderFrame = function (t) {
      if (3 === this.data.ty) return !1;
      if (!this.isVisible) return this.isVisible;
      (this.lastNum = this.currentFrameNum),
        this.data.hasMask && this.maskManager.renderFrame(),
        (this.finalTransform.opMdf = this.finalTransform.op.mdf),
        (this.finalTransform.matMdf = this.finalTransform.mProp.mdf),
        (this.finalTransform.opacity = this.finalTransform.op.v),
        this.firstFrame &&
          ((this.finalTransform.opMdf = !0), (this.finalTransform.matMdf = !0));
      var e,
        s = this.finalTransform.mat;
      if (this.hierarchy) {
        var r,
          i = this.hierarchy.length;
        for (
          e = this.finalTransform.mProp.v.props, s.cloneFromProps(e), r = 0;
          i > r;
          r += 1
        )
          (this.finalTransform.matMdf = this.hierarchy[r].finalTransform.mProp
            .mdf
            ? !0
            : this.finalTransform.matMdf),
            (e = this.hierarchy[r].finalTransform.mProp.v.props),
            s.transform(
              e[0],
              e[1],
              e[2],
              e[3],
              e[4],
              e[5],
              e[6],
              e[7],
              e[8],
              e[9],
              e[10],
              e[11],
              e[12],
              e[13],
              e[14],
              e[15]
            );
      } else
        this.isVisible &&
          (t
            ? ((e = this.finalTransform.mProp.v.props), s.cloneFromProps(e))
            : s.cloneFromProps(this.finalTransform.mProp.v.props));
      return (
        t &&
          ((e = t.mat.props),
          s.transform(
            e[0],
            e[1],
            e[2],
            e[3],
            e[4],
            e[5],
            e[6],
            e[7],
            e[8],
            e[9],
            e[10],
            e[11],
            e[12],
            e[13],
            e[14],
            e[15]
          ),
          (this.finalTransform.opacity *= t.opacity),
          (this.finalTransform.opMdf = t.opMdf
            ? !0
            : this.finalTransform.opMdf),
          (this.finalTransform.matMdf = t.matMdf
            ? !0
            : this.finalTransform.matMdf)),
        this.data.hasMask
          ? (this.finalTransform.matMdf &&
              this.layerElement.setAttribute("transform", s.to2dCSS()),
            this.finalTransform.opMdf &&
              this.layerElement.setAttribute(
                "opacity",
                this.finalTransform.opacity
              ))
          : 0 === this.data.ty &&
            this.finalTransform.opMdf &&
            (this.finalTransform.op.k || 1 !== this.finalTransform.op.p) &&
            (this.layerElement.setAttribute(
              "opacity",
              this.finalTransform.opacity
            ),
            (this.finalTransform.opacity = 1)),
        this.isVisible
      );
    }),
    (SVGBaseElement.prototype.destroy = function () {
      (this.layerElement = null),
        (this.parentContainer = null),
        this.matteElement && (this.matteElement = null),
        this.maskManager && this.maskManager.destroy();
    }),
    (SVGBaseElement.prototype.getDomElement = function () {
      return this.layerElement;
    }),
    (SVGBaseElement.prototype.addMasks = function (t) {
      this.maskManager = new MaskElement(t, this, this.globalData);
    }),
    (SVGBaseElement.prototype.setMatte = function (t) {
      this.matteElement &&
        this.matteElement.setAttribute("mask", "url(#" + t + ")");
    }),
    (SVGBaseElement.prototype.hide = function () {}),
    (ITextElement.prototype.init = function () {
      this._parent.init.call(this), (this.lettersChangedFlag = !1);
      var t = this.data;
      (this.renderedLetters = Array.apply(null, { length: t.t.d.l.length })),
        (this.viewData = {
          m: {
            a: PropertyFactory.getProp(
              this,
              t.t.m.a,
              1,
              0,
              this.dynamicProperties
            ),
          },
        });
      var e = this.data.t;
      if (e.a.length) {
        this.viewData.a = Array.apply(null, { length: e.a.length });
        var s,
          r,
          i,
          a = e.a.length;
        for (s = 0; a > s; s += 1)
          (i = e.a[s]),
            (r = { a: {}, s: {} }),
            "r" in i.a &&
              (r.a.r = PropertyFactory.getProp(
                this,
                i.a.r,
                0,
                degToRads,
                this.dynamicProperties
              )),
            "rx" in i.a &&
              (r.a.rx = PropertyFactory.getProp(
                this,
                i.a.rx,
                0,
                degToRads,
                this.dynamicProperties
              )),
            "ry" in i.a &&
              (r.a.ry = PropertyFactory.getProp(
                this,
                i.a.ry,
                0,
                degToRads,
                this.dynamicProperties
              )),
            "sk" in i.a &&
              (r.a.sk = PropertyFactory.getProp(
                this,
                i.a.sk,
                0,
                degToRads,
                this.dynamicProperties
              )),
            "sa" in i.a &&
              (r.a.sa = PropertyFactory.getProp(
                this,
                i.a.sa,
                0,
                degToRads,
                this.dynamicProperties
              )),
            "s" in i.a &&
              (r.a.s = PropertyFactory.getProp(
                this,
                i.a.s,
                1,
                0.01,
                this.dynamicProperties
              )),
            "a" in i.a &&
              (r.a.a = PropertyFactory.getProp(
                this,
                i.a.a,
                1,
                0,
                this.dynamicProperties
              )),
            "o" in i.a &&
              (r.a.o = PropertyFactory.getProp(
                this,
                i.a.o,
                0,
                0.01,
                this.dynamicProperties
              )),
            "p" in i.a &&
              (r.a.p = PropertyFactory.getProp(
                this,
                i.a.p,
                1,
                0,
                this.dynamicProperties
              )),
            "sw" in i.a &&
              (r.a.sw = PropertyFactory.getProp(
                this,
                i.a.sw,
                0,
                0,
                this.dynamicProperties
              )),
            "sc" in i.a &&
              (r.a.sc = PropertyFactory.getProp(
                this,
                i.a.sc,
                1,
                0,
                this.dynamicProperties
              )),
            "fc" in i.a &&
              (r.a.fc = PropertyFactory.getProp(
                this,
                i.a.fc,
                1,
                0,
                this.dynamicProperties
              )),
            "fh" in i.a &&
              (r.a.fh = PropertyFactory.getProp(
                this,
                i.a.fh,
                0,
                0,
                this.dynamicProperties
              )),
            "fs" in i.a &&
              (r.a.fs = PropertyFactory.getProp(
                this,
                i.a.fs,
                0,
                0.01,
                this.dynamicProperties
              )),
            "fb" in i.a &&
              (r.a.fb = PropertyFactory.getProp(
                this,
                i.a.fb,
                0,
                0.01,
                this.dynamicProperties
              )),
            "t" in i.a &&
              (r.a.t = PropertyFactory.getProp(
                this,
                i.a.t,
                0,
                0,
                this.dynamicProperties
              )),
            (r.s = PropertyFactory.getTextSelectorProp(
              this,
              i.s,
              this.dynamicProperties
            )),
            (r.s.t = i.s.t),
            (this.viewData.a[s] = r);
      } else this.viewData.a = [];
      e.p && "m" in e.p
        ? ((this.viewData.p = {
            f: PropertyFactory.getProp(
              this,
              e.p.f,
              0,
              0,
              this.dynamicProperties
            ),
            l: PropertyFactory.getProp(
              this,
              e.p.l,
              0,
              0,
              this.dynamicProperties
            ),
            r: e.p.r,
            m: this.maskManager.getMaskProperty(e.p.m),
          }),
          (this.maskPath = !0))
        : (this.maskPath = !1);
    }),
    (ITextElement.prototype.createPathShape = function (t, e) {
      var s,
        r,
        i,
        a,
        n = e.length,
        o = "";
      for (s = 0; n > s; s += 1) {
        for (i = e[s].ks.k.i.length, a = e[s].ks.k, r = 1; i > r; r += 1)
          1 == r &&
            (o += " M" + t.applyToPointStringified(a.v[0][0], a.v[0][1])),
            (o +=
              " C" +
              t.applyToPointStringified(a.o[r - 1][0], a.o[r - 1][1]) +
              " " +
              t.applyToPointStringified(a.i[r][0], a.i[r][1]) +
              " " +
              t.applyToPointStringified(a.v[r][0], a.v[r][1]));
        (o +=
          " C" +
          t.applyToPointStringified(a.o[r - 1][0], a.o[r - 1][1]) +
          " " +
          t.applyToPointStringified(a.i[0][0], a.i[0][1]) +
          " " +
          t.applyToPointStringified(a.v[0][0], a.v[0][1])),
          (o += "z");
      }
      return o;
    }),
    (ITextElement.prototype.getMeasures = function () {
      var t,
        e,
        s,
        r,
        i = this.mHelper,
        a = this.renderType,
        n = this.data,
        o = n.t.d,
        h = o.l;
      if (this.maskPath) {
        var l = this.viewData.p.m;
        if (!this.viewData.p.n || this.viewData.p.mdf) {
          var p = l.v;
          this.viewData.p.r && (p = reversePath(p, l.closed));
          var m = { tLength: 0, segments: [] };
          r = p.v.length - 1;
          var f,
            d = 0;
          for (s = 0; r > s; s += 1)
            (f = {
              s: p.v[s],
              e: p.v[s + 1],
              to: [p.o[s][0] - p.v[s][0], p.o[s][1] - p.v[s][1]],
              ti: [
                p.i[s + 1][0] - p.v[s + 1][0],
                p.i[s + 1][1] - p.v[s + 1][1],
              ],
            }),
              bez.buildBezierData(f),
              (m.tLength += f.bezierData.segmentLength),
              m.segments.push(f),
              (d += f.bezierData.segmentLength);
          (s = r),
            l.closed &&
              ((f = {
                s: p.v[s],
                e: p.v[0],
                to: [p.o[s][0] - p.v[s][0], p.o[s][1] - p.v[s][1]],
                ti: [p.i[0][0] - p.v[0][0], p.i[0][1] - p.v[0][1]],
              }),
              bez.buildBezierData(f),
              (m.tLength += f.bezierData.segmentLength),
              m.segments.push(f),
              (d += f.bezierData.segmentLength)),
            (this.viewData.p.pi = m);
        }
        var c,
          u,
          y,
          m = this.viewData.p.pi,
          g = this.viewData.p.f.v,
          v = 0,
          b = 1,
          P = 0,
          E = !0,
          k = m.segments;
        if (0 > g && l.closed)
          for (
            m.tLength < Math.abs(g) && (g = -Math.abs(g) % m.tLength),
              v = k.length - 1,
              y = k[v].bezierData.points,
              b = y.length - 1;
            0 > g;

          )
            (g += y[b].partialLength),
              (b -= 1),
              0 > b &&
                ((v -= 1), (y = k[v].bezierData.points), (b = y.length - 1));
        (y = k[v].bezierData.points), (u = y[b - 1]), (c = y[b]);
        var S,
          x,
          M = c.partialLength;
      }
      (r = h.length), (t = 0), (e = 0);
      var C,
        D,
        w,
        T,
        F,
        I = 1.2 * n.t.d.s * 0.714,
        A = !0,
        V = this.viewData,
        _ = Array.apply(null, { length: r });
      (this.lettersChangedFlag = !1), (T = V.a.length);
      var N,
        B,
        L,
        R,
        H,
        O,
        z,
        j,
        G,
        W,
        q,
        X,
        Y,
        U,
        Z,
        J,
        K = -1,
        Q = g,
        $ = v,
        tt = b,
        et = -1,
        st = 0;
      for (s = 0; r > s; s += 1)
        if ((i.reset(), (O = 1), h[s].n))
          (t = 0),
            (e += o.yOffset),
            (e += A ? 1 : 0),
            (g = Q),
            (A = !1),
            (st = 0),
            this.maskPath &&
              ((v = $),
              (b = tt),
              (y = k[v].bezierData.points),
              (u = y[b - 1]),
              (c = y[b]),
              (M = c.partialLength),
              (P = 0)),
            (_[s] = this.emptyProp);
        else {
          if (this.maskPath) {
            if (et !== h[s].line) {
              switch (o.j) {
                case 1:
                  g += d - o.lineWidths[h[s].line];
                  break;
                case 2:
                  g += (d - o.lineWidths[h[s].line]) / 2;
              }
              et = h[s].line;
            }
            K !== h[s].ind &&
              (h[K] && (g += h[K].extra), (g += h[s].an / 2), (K = h[s].ind)),
              (g += (V.m.a.v[0] * h[s].an) / 200);
            var rt = 0;
            for (w = 0; T > w; w += 1)
              (C = V.a[w].a),
                "p" in C &&
                  ((D = V.a[w].s),
                  (B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars)),
                  (rt += B.length ? C.p.v[0] * B[0] : C.p.v[0] * B));
            for (E = !0; E; )
              P + M >= g + rt || !y
                ? ((S = (g + rt - P) / c.partialLength),
                  (R = u.point[0] + (c.point[0] - u.point[0]) * S),
                  (H = u.point[1] + (c.point[1] - u.point[1]) * S),
                  i.translate(0, -((V.m.a.v[1] * I) / 100) + e),
                  (E = !1))
                : y &&
                  ((P += c.partialLength),
                  (b += 1),
                  b >= y.length &&
                    ((b = 0),
                    (v += 1),
                    k[v]
                      ? (y = k[v].bezierData.points)
                      : l.closed
                      ? ((b = 0), (v = 0), (y = k[v].bezierData.points))
                      : ((P -= c.partialLength), (y = null))),
                  y && ((u = c), (c = y[b]), (M = c.partialLength)));
            (L = h[s].an / 2 - h[s].add), i.translate(-L, 0, 0);
          } else
            (L = h[s].an / 2 - h[s].add),
              i.translate(-L, 0, 0),
              i.translate(
                (-V.m.a.v[0] * h[s].an) / 200,
                (-V.m.a.v[1] * I) / 100,
                0
              );
          for (st += h[s].l / 2, w = 0; T > w; w += 1)
            (C = V.a[w].a),
              "t" in C &&
                ((D = V.a[w].s),
                (B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars)),
                this.maskPath
                  ? (g += B.length ? C.t * B[0] : C.t * B)
                  : (t += B.length ? C.t.v * B[0] : C.t.v * B));
          for (
            st += h[s].l / 2,
              o.strokeWidthAnim && (j = n.t.d.sw || 0),
              o.strokeColorAnim &&
                (z = n.t.d.sc
                  ? [n.t.d.sc[0], n.t.d.sc[1], n.t.d.sc[2]]
                  : [0, 0, 0]),
              o.fillColorAnim && (G = [n.t.d.fc[0], n.t.d.fc[1], n.t.d.fc[2]]),
              w = 0;
            T > w;
            w += 1
          )
            (C = V.a[w].a),
              "a" in C &&
                ((D = V.a[w].s),
                (B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars)),
                B.length
                  ? i.translate(
                      -C.a.v[0] * B[0],
                      -C.a.v[1] * B[1],
                      C.a.v[2] * B[2]
                    )
                  : i.translate(-C.a.v[0] * B, -C.a.v[1] * B, C.a.v[2] * B));
          for (w = 0; T > w; w += 1)
            (C = V.a[w].a),
              "s" in C &&
                ((D = V.a[w].s),
                (B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars)),
                B.length
                  ? i.scale(
                      1 + (C.s.v[0] - 1) * B[0],
                      1 + (C.s.v[1] - 1) * B[1],
                      1
                    )
                  : i.scale(1 + (C.s.v[0] - 1) * B, 1 + (C.s.v[1] - 1) * B, 1));
          for (w = 0; T > w; w += 1) {
            if (
              ((C = V.a[w].a),
              (D = V.a[w].s),
              (B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars)),
              "sk" in C &&
                (B.length
                  ? i.skewFromAxis(-C.sk.v * B[0], C.sa.v * B[1])
                  : i.skewFromAxis(-C.sk.v * B, C.sa.v * B)),
              "r" in C && i.rotateZ(B.length ? -C.r.v * B[2] : -C.r.v * B),
              "ry" in C && i.rotateY(B.length ? C.ry.v * B[1] : C.ry.v * B),
              "rx" in C && i.rotateX(B.length ? C.rx.v * B[0] : C.rx.v * B),
              "o" in C &&
                (O += B.length
                  ? (C.o.v * B[0] - O) * B[0]
                  : (C.o.v * B - O) * B),
              o.strokeWidthAnim &&
                "sw" in C &&
                (j += B.length ? C.sw.v * B[0] : C.sw.v * B),
              o.strokeColorAnim && "sc" in C)
            )
              for (W = 0; 3 > W; W += 1)
                z[W] = Math.round(
                  B.length
                    ? 255 * (z[W] + (C.sc.v[W] - z[W]) * B[0])
                    : 255 * (z[W] + (C.sc.v[W] - z[W]) * B)
                );
            if (o.fillColorAnim) {
              if ("fc" in C)
                for (W = 0; 3 > W; W += 1)
                  G[W] = B.length
                    ? G[W] + (C.fc.v[W] - G[W]) * B[0]
                    : G[W] + (C.fc.v[W] - G[W]) * B;
              "fh" in C &&
                (G = B.length
                  ? addHueToRGB(G, C.fh.v * B[0])
                  : addHueToRGB(G, C.fh.v * B)),
                "fs" in C &&
                  (G = B.length
                    ? addSaturationToRGB(G, C.fs.v * B[0])
                    : addSaturationToRGB(G, C.fs.v * B)),
                "fb" in C &&
                  (G = B.length
                    ? addBrightnessToRGB(G, C.fb.v * B[0])
                    : addBrightnessToRGB(G, C.fb.v * B));
            }
          }
          for (w = 0; T > w; w += 1)
            (C = V.a[w].a),
              "p" in C &&
                ((D = V.a[w].s),
                (B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars)),
                this.maskPath
                  ? B.length
                    ? i.translate(0, C.p.v[1] * B[0], -C.p.v[2] * B[1])
                    : i.translate(0, C.p.v[1] * B, -C.p.v[2] * B)
                  : B.length
                  ? i.translate(
                      C.p.v[0] * B[0],
                      C.p.v[1] * B[1],
                      -C.p.v[2] * B[2]
                    )
                  : i.translate(C.p.v[0] * B, C.p.v[1] * B, -C.p.v[2] * B));
          if (
            (o.strokeWidthAnim && (q = 0 > j ? 0 : j),
            o.strokeColorAnim &&
              (X =
                "rgb(" +
                Math.round(255 * z[0]) +
                "," +
                Math.round(255 * z[1]) +
                "," +
                Math.round(255 * z[2]) +
                ")"),
            o.fillColorAnim &&
              (Y =
                "rgb(" +
                Math.round(255 * G[0]) +
                "," +
                Math.round(255 * G[1]) +
                "," +
                Math.round(255 * G[2]) +
                ")"),
            this.maskPath)
          ) {
            if (n.t.p.p) {
              x = (c.point[1] - u.point[1]) / (c.point[0] - u.point[0]);
              var it = (180 * Math.atan(x)) / Math.PI;
              c.point[0] < u.point[0] && (it += 180),
                i.rotate((-it * Math.PI) / 180);
            }
            i.translate(R, H, 0),
              i.translate(
                (V.m.a.v[0] * h[s].an) / 200,
                (V.m.a.v[1] * I) / 100,
                0
              ),
              (g -= (V.m.a.v[0] * h[s].an) / 200),
              h[s + 1] &&
                K !== h[s + 1].ind &&
                ((g += h[s].an / 2), (g += (o.tr / 1e3) * n.t.d.s));
          } else {
            switch (
              (i.translate(t, e, 0),
              o.ps && i.translate(o.ps[0], o.ps[1] + o.ascent, 0),
              o.j)
            ) {
              case 1:
                i.translate(
                  o.justifyOffset + (o.boxWidth - o.lineWidths[h[s].line]),
                  0,
                  0
                );
                break;
              case 2:
                i.translate(
                  o.justifyOffset + (o.boxWidth - o.lineWidths[h[s].line]) / 2,
                  0,
                  0
                );
            }
            i.translate(L, 0, 0),
              i.translate(
                (V.m.a.v[0] * h[s].an) / 200,
                (V.m.a.v[1] * I) / 100,
                0
              ),
              (t += h[s].l + (o.tr / 1e3) * n.t.d.s);
          }
          "html" === a
            ? (U = i.toCSS())
            : "svg" === a
            ? (U = i.to2dCSS())
            : (Z = [
                i.props[0],
                i.props[1],
                i.props[2],
                i.props[3],
                i.props[4],
                i.props[5],
                i.props[6],
                i.props[7],
                i.props[8],
                i.props[9],
                i.props[10],
                i.props[11],
                i.props[12],
                i.props[13],
                i.props[14],
                i.props[15],
              ]),
            (J = O),
            (N = this.renderedLetters[s]),
            !N || (N.o === J && N.sw === q && N.sc === X && N.fc === Y)
              ? ("svg" !== a && "html" !== a) || (N && N.m === U)
                ? "canvas" !== a ||
                  (N &&
                    N.props[0] === Z[0] &&
                    N.props[1] === Z[1] &&
                    N.props[4] === Z[4] &&
                    N.props[5] === Z[5] &&
                    N.props[12] === Z[12] &&
                    N.props[13] === Z[13])
                  ? (F = N)
                  : ((this.lettersChangedFlag = !0),
                    (F = new LetterProps(J, q, X, Y, null, Z)))
                : ((this.lettersChangedFlag = !0),
                  (F = new LetterProps(J, q, X, Y, U)))
              : ((this.lettersChangedFlag = !0),
                (F = new LetterProps(J, q, X, Y, U, Z))),
            (this.renderedLetters[s] = F);
        }
    }),
    (ITextElement.prototype.emptyProp = new LetterProps()),
    createElement(SVGBaseElement, SVGTextElement),
    (SVGTextElement.prototype.init = ITextElement.prototype.init),
    (SVGTextElement.prototype.createPathShape =
      ITextElement.prototype.createPathShape),
    (SVGTextElement.prototype.getMeasures = ITextElement.prototype.getMeasures),
    (SVGTextElement.prototype.createElements = function () {
      this._parent.createElements.call(this);
      var t = this.data.t.d;
      (this.innerElem = document.createElementNS(svgNS, "g")),
        t.fc
          ? this.innerElem.setAttribute(
              "fill",
              "rgb(" +
                Math.round(255 * t.fc[0]) +
                "," +
                Math.round(255 * t.fc[1]) +
                "," +
                Math.round(255 * t.fc[2]) +
                ")"
            )
          : this.innerElem.setAttribute("fill", "rgba(0,0,0,0)"),
        t.sc &&
          (this.innerElem.setAttribute(
            "stroke",
            "rgb(" +
              Math.round(255 * t.sc[0]) +
              "," +
              Math.round(255 * t.sc[1]) +
              "," +
              Math.round(255 * t.sc[2]) +
              ")"
          ),
          this.innerElem.setAttribute("stroke-width", t.sw)),
        this.innerElem.setAttribute("font-size", t.s);
      var e = this.globalData.fontManager.getFontByName(t.f);
      if (e.fClass) this.innerElem.setAttribute("class", e.fClass);
      else {
        this.innerElem.setAttribute("font-family", e.fFamily);
        var s = t.fWeight,
          r = t.fStyle;
        this.innerElem.setAttribute("font-style", r),
          this.innerElem.setAttribute("font-weight", s);
      }
      var i, a;
      this.layerElement === this.parentContainer
        ? this.appendNodeToParent(this.innerElem)
        : this.layerElement.appendChild(this.innerElem);
      var n = t.l;
      if ((a = n.length)) {
        var o,
          h,
          l = this.mHelper,
          p = "",
          m = this.data.singleShape;
        if (m)
          var f = 0,
            d = 0,
            c = t.lineWidths,
            u = t.boxWidth,
            y = !0;
        for (i = 0; a > i; i += 1) {
          if (
            (this.globalData.fontManager.chars
              ? (m && 0 !== i) || (o = document.createElementNS(svgNS, "path"))
              : (o = document.createElementNS(svgNS, "text")),
            o.setAttribute("stroke-linecap", "butt"),
            o.setAttribute("stroke-linejoin", "round"),
            o.setAttribute("stroke-miterlimit", "4"),
            m &&
              n[i].n &&
              ((f = 0), (d += t.yOffset), (d += y ? 1 : 0), (y = !1)),
            l.reset(),
            this.globalData.fontManager.chars && l.scale(t.s / 100, t.s / 100),
            m)
          ) {
            switch (
              (t.ps && l.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j)
            ) {
              case 1:
                l.translate(t.justifyOffset + (u - c[n[i].line]), 0, 0);
                break;
              case 2:
                l.translate(t.justifyOffset + (u - c[n[i].line]) / 2, 0, 0);
            }
            l.translate(f, d, 0);
          }
          if (this.globalData.fontManager.chars) {
            var g,
              v = this.globalData.fontManager.getCharData(
                t.t.charAt(i),
                e.fStyle,
                this.globalData.fontManager.getFontByName(t.f).fFamily
              );
            (g = v ? v.data : null),
              g &&
                g.shapes &&
                ((h = g.shapes[0].it),
                m || (p = ""),
                (p += this.createPathShape(l, h)),
                m || o.setAttribute("d", p)),
              m || this.innerElem.appendChild(o);
          } else
            (o.textContent = n[i].val),
              o.setAttributeNS(
                "http://www.w3.org/XML/1998/namespace",
                "xml:space",
                "preserve"
              ),
              this.innerElem.appendChild(o),
              m && o.setAttribute("transform", l.to2dCSS());
          m && (f += n[i].l), this.textSpans.push(o);
        }
        this.data.ln && this.innerElem.setAttribute("id", this.data.ln),
          this.data.cl && this.innerElem.setAttribute("class", this.data.cl),
          m &&
            this.globalData.fontManager.chars &&
            (o.setAttribute("d", p), this.innerElem.appendChild(o));
      }
    }),
    (SVGTextElement.prototype.hide = function () {
      this.hidden ||
        ((this.innerElem.style.display = "none"), (this.hidden = !0));
    }),
    (SVGTextElement.prototype.renderFrame = function (t) {
      var e = this._parent.renderFrame.call(this, t);
      if (e === !1) return void this.hide();
      if (
        (this.hidden &&
          ((this.hidden = !1), (this.innerElem.style.display = "block")),
        this.data.hasMask ||
          (this.finalTransform.matMdf &&
            this.innerElem.setAttribute(
              "transform",
              this.finalTransform.mat.to2dCSS()
            ),
          this.finalTransform.opMdf &&
            this.innerElem.setAttribute(
              "opacity",
              this.finalTransform.opacity
            )),
        !this.data.singleShape && (this.getMeasures(), this.lettersChangedFlag))
      ) {
        var s,
          r,
          i = this.renderedLetters,
          a = this.data.t.d.l;
        r = a.length;
        var n;
        for (s = 0; r > s; s += 1)
          a[s].n ||
            ((n = i[s]),
            this.textSpans[s].setAttribute("transform", n.m),
            this.textSpans[s].setAttribute("opacity", n.o),
            n.sw && this.textSpans[s].setAttribute("stroke-width", n.sw),
            n.sc && this.textSpans[s].setAttribute("stroke", n.sc),
            n.fc && this.textSpans[s].setAttribute("fill", n.fc));
        this.firstFrame && (this.firstFrame = !1);
      }
    }),
    (SVGTextElement.prototype.destroy = function () {
      this._parent.destroy.call(), (this.innerElem = null);
    });
  var PlaceHolderElement = function (t, e, s) {
    if (((this.data = t), (this.globalData = s), e)) {
      this.parentContainer = e;
      var r = document.createElementNS(svgNS, "g");
      r.setAttribute("id", this.data.id),
        e.appendChild(r),
        (this.phElement = r);
    }
    this.layerId = "ly_" + randomString(10);
  };
  (PlaceHolderElement.prototype.prepareFrame = function () {}),
    (PlaceHolderElement.prototype.renderFrame = function () {}),
    (PlaceHolderElement.prototype.draw = function () {}),
    createElement(SVGBaseElement, ICompElement),
    (ICompElement.prototype.getComposingElement = function () {
      return this.layerElement;
    }),
    (ICompElement.prototype.hide = function () {
      if (!this.hidden) {
        var t,
          e = this.elements.length;
        for (t = 0; e > t; t += 1) this.elements[t].hide();
        this.hidden = !0;
      }
    }),
    (ICompElement.prototype.prepareFrame = function (t) {
      if ((this._parent.prepareFrame.call(this, t), this.isVisible !== !1)) {
        var e = t;
        this.tm &&
          ((e = this.tm.v), e === this.data.op && (e = this.data.op - 1)),
          (this.renderedFrame = e / this.data.sr);
        var s,
          r = this.elements.length;
        for (s = 0; r > s; s += 1)
          this.elements[s].prepareFrame(e / this.data.sr - this.layers[s].st);
      }
    }),
    (ICompElement.prototype.renderFrame = function (t) {
      var e,
        s = this._parent.renderFrame.call(this, t),
        r = this.layers.length;
      if (s === !1) return void this.hide();
      for (this.hidden = !1, e = 0; r > e; e += 1)
        this.data.hasMask
          ? this.elements[e].renderFrame()
          : this.elements[e].renderFrame(this.finalTransform);
      this.firstFrame && (this.firstFrame = !1);
    }),
    (ICompElement.prototype.setElements = function (t) {
      this.elements = t;
    }),
    (ICompElement.prototype.getElements = function () {
      return this.elements;
    }),
    (ICompElement.prototype.destroy = function () {
      this._parent.destroy.call();
      var t,
        e = this.layers.length;
      for (t = 0; e > t; t += 1) this.elements[t].destroy();
    }),
    createElement(SVGBaseElement, IImageElement),
    (IImageElement.prototype.createElements = function () {
      var t = this,
        e = function () {
          t.innerElem.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "href",
            t.path + t.assetData.p
          ),
            (t.maskedElement = t.innerElem);
        },
        s = new Image();
      s.addEventListener("load", e, !1),
        s.addEventListener("error", e, !1),
        (s.src = this.path + this.assetData.p),
        this._parent.createElements.call(this),
        (this.innerElem = document.createElementNS(svgNS, "image")),
        this.innerElem.setAttribute("width", this.assetData.w + "px"),
        this.innerElem.setAttribute("height", this.assetData.h + "px"),
        this.layerElement === this.parentContainer
          ? this.appendNodeToParent(this.innerElem)
          : this.layerElement.appendChild(this.innerElem),
        this.data.ln && this.innerElem.setAttribute("id", this.data.ln),
        this.data.cl && this.innerElem.setAttribute("class", this.data.cl);
    }),
    (IImageElement.prototype.hide = function () {
      this.hidden ||
        (this.innerElem.setAttribute("visibility", "hidden"),
        (this.hidden = !0));
    }),
    (IImageElement.prototype.renderFrame = function (t) {
      var e = this._parent.renderFrame.call(this, t);
      return e === !1
        ? void this.hide()
        : (this.hidden &&
            ((this.hidden = !1),
            this.innerElem.setAttribute("visibility", "visible")),
          this.data.hasMask ||
            ((this.finalTransform.matMdf || this.firstFrame) &&
              this.innerElem.setAttribute(
                "transform",
                this.finalTransform.mat.to2dCSS()
              ),
            (this.finalTransform.opMdf || this.firstFrame) &&
              this.innerElem.setAttribute(
                "opacity",
                this.finalTransform.opacity
              )),
          void (this.firstFrame && (this.firstFrame = !1)));
    }),
    (IImageElement.prototype.destroy = function () {
      this._parent.destroy.call(), (this.innerElem = null);
    }),
    createElement(SVGBaseElement, IShapeElement),
    (IShapeElement.prototype.lcEnum = { 1: "butt", 2: "round", 3: "butt" }),
    (IShapeElement.prototype.ljEnum = { 1: "miter", 2: "round", 3: "butt" }),
    (IShapeElement.prototype.buildExpressionInterface = function () {}),
    (IShapeElement.prototype.transformHelper = {
      opacity: 1,
      mat: new Matrix(),
      matMdf: !1,
      opMdf: !1,
    }),
    (IShapeElement.prototype.createElements = function () {
      this._parent.createElements.call(this),
        this.searchShapes(
          this.shapesData,
          this.viewData,
          this.dynamicProperties
        ),
        (!this.data.hd || this.data.td) &&
          (this.layerElement.appendChild(this.shapesContainer),
          styleUnselectableDiv(this.layerElement),
          styleUnselectableDiv(this.shapesContainer));
    }),
    (IShapeElement.prototype.setGradientData = function (t, e, s) {
      var r,
        i = "gr_" + randomString(10);
      (r =
        1 === e.t
          ? document.createElementNS(svgNS, "linearGradient")
          : document.createElementNS(svgNS, "radialGradient")),
        r.setAttribute("id", i),
        r.setAttribute("spreadMethod", "pad"),
        r.setAttribute("gradientUnits", "userSpaceOnUse");
      var a,
        n,
        o,
        h = [];
      for (o = 4 * e.g.p, n = 0; o > n; n += 4)
        (a = document.createElementNS(svgNS, "stop")),
          r.appendChild(a),
          h.push(a);
      t.setAttribute("gf" === e.ty ? "fill" : "stroke", "url(#" + i + ")"),
        this.globalData.defs.appendChild(r),
        (s.gf = r),
        (s.cst = h);
    }),
    (IShapeElement.prototype.setGradientOpacity = function (t, e, s) {
      if (
        (t.g.k.k[0].s && t.g.k.k[0].s.length > 4 * t.g.p) ||
        t.g.k.k.length > 4 * t.g.p
      ) {
        var r,
          i,
          a,
          n,
          o = document.createElementNS(svgNS, "mask"),
          h = document.createElementNS(svgNS, "path");
        o.appendChild(h);
        var l = "op_" + randomString(10),
          p = "mk_" + randomString(10);
        o.setAttribute("id", p),
          (r =
            1 === t.t
              ? document.createElementNS(svgNS, "linearGradient")
              : document.createElementNS(svgNS, "radialGradient")),
          r.setAttribute("id", l),
          r.setAttribute("spreadMethod", "pad"),
          r.setAttribute("gradientUnits", "userSpaceOnUse"),
          (n = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length);
        var m = [];
        for (a = 4 * t.g.p; n > a; a += 2)
          (i = document.createElementNS(svgNS, "stop")),
            i.setAttribute("stop-color", "rgb(255,255,255)"),
            r.appendChild(i),
            m.push(i);
        return (
          h.setAttribute("gf" === t.ty ? "fill" : "stroke", "url(#" + l + ")"),
          this.globalData.defs.appendChild(r),
          this.globalData.defs.appendChild(o),
          (e.of = r),
          (e.ost = m),
          (s.mElem = h),
          p
        );
      }
    }),
    (IShapeElement.prototype.searchShapes = function (t, e, s) {
      var r,
        i,
        a,
        n,
        o = t.length - 1,
        h = [],
        l = [];
      for (r = o; r >= 0; r -= 1)
        if (
          "fl" == t[r].ty ||
          "st" == t[r].ty ||
          "gf" == t[r].ty ||
          "gs" == t[r].ty
        ) {
          (e[r] = {}), (n = { type: t[r].ty, d: "", ld: "", mdf: !1 });
          var p = document.createElementNS(svgNS, "path");
          if (
            ((e[r].o = PropertyFactory.getProp(this, t[r].o, 0, 0.01, s)),
            ("st" == t[r].ty || "gs" == t[r].ty) &&
              (p.setAttribute(
                "stroke-linecap",
                this.lcEnum[t[r].lc] || "round"
              ),
              p.setAttribute(
                "stroke-linejoin",
                this.ljEnum[t[r].lj] || "round"
              ),
              p.setAttribute("fill-opacity", "0"),
              1 == t[r].lj && p.setAttribute("stroke-miterlimit", t[r].ml),
              (e[r].w = PropertyFactory.getProp(this, t[r].w, 0, null, s)),
              t[r].d))
          ) {
            var m = PropertyFactory.getDashProp(this, t[r].d, "svg", s);
            m.k ||
              (p.setAttribute("stroke-dasharray", m.dasharray),
              p.setAttribute("stroke-dashoffset", m.dashoffset)),
              (e[r].d = m);
          }
          if ("fl" == t[r].ty || "st" == t[r].ty)
            e[r].c = PropertyFactory.getProp(this, t[r].c, 1, 255, s);
          else {
            (e[r].g = PropertyFactory.getGradientProp(this, t[r].g, s)),
              2 == t[r].t &&
                ((e[r].h = PropertyFactory.getProp(this, t[r].h, 1, 0.01, s)),
                (e[r].a = PropertyFactory.getProp(
                  this,
                  t[r].a,
                  1,
                  degToRads,
                  s
                ))),
              (e[r].s = PropertyFactory.getProp(this, t[r].s, 1, null, s)),
              (e[r].e = PropertyFactory.getProp(this, t[r].e, 1, null, s)),
              this.setGradientData(p, t[r], e[r], n);
            var f = this.setGradientOpacity(t[r], e[r], n);
            f && p.setAttribute("mask", "url(#" + f + ")");
          }
          t[r].ln && p.setAttribute("id", t[r].ln),
            t[r].cl && p.setAttribute("class", t[r].cl),
            this.shapesContainer.appendChild(p),
            (n.pElem = p),
            this.stylesList.push(n),
            (e[r].style = n),
            h.push(n);
        } else if ("gr" == t[r].ty)
          (e[r] = { it: [] }), this.searchShapes(t[r].it, e[r].it, s);
        else if ("tr" == t[r].ty)
          e[r] = {
            transform: {
              mat: new Matrix(),
              opacity: 1,
              matMdf: !1,
              opMdf: !1,
              op: PropertyFactory.getProp(this, t[r].o, 0, 0.01, s),
              mProps: PropertyFactory.getProp(this, t[r], 2, null, s),
            },
            elements: [],
          };
        else if (
          "sh" == t[r].ty ||
          "rc" == t[r].ty ||
          "el" == t[r].ty ||
          "sr" == t[r].ty
        ) {
          e[r] = { elements: [], styles: [], lStr: "" };
          var d = 4;
          for (
            "rc" == t[r].ty
              ? (d = 5)
              : "el" == t[r].ty
              ? (d = 6)
              : "sr" == t[r].ty && (d = 7),
              e[r].sh = ShapePropertyFactory.getShapeProp(this, t[r], d, s),
              this.shapes.push(e[r].sh),
              this.addShapeToModifiers(e[r].sh),
              a = this.stylesList.length,
              i = 0;
            a > i;
            i += 1
          )
            this.stylesList[i].closed ||
              e[r].elements.push({
                ty: this.stylesList[i].type,
                st: this.stylesList[i],
              });
        } else if ("tm" == t[r].ty || "rd" == t[r].ty) {
          var c = ShapeModifiers.getModifier(t[r].ty);
          c.init(this, t[r], s),
            this.shapeModifiers.push(c),
            l.push(c),
            (e[r] = c);
        }
      for (o = h.length, r = 0; o > r; r += 1) h[r].closed = !0;
      for (o = l.length, r = 0; o > r; r += 1) l[r].closed = !0;
    }),
    (IShapeElement.prototype.addShapeToModifiers = function (t) {
      var e,
        s = this.shapeModifiers.length;
      for (e = 0; s > e; e += 1) this.shapeModifiers[e].addShape(t);
    }),
    (IShapeElement.prototype.renderModifiers = function () {
      if (this.shapeModifiers.length) {
        var t,
          e = this.shapes.length;
        for (t = 0; e > t; t += 1) this.shapes[t].reset();
        for (e = this.shapeModifiers.length, t = e - 1; t >= 0; t -= 1)
          this.shapeModifiers[t].processShapes();
      }
    }),
    (IShapeElement.prototype.renderFrame = function (t) {
      var e = this._parent.renderFrame.call(this, t);
      return e === !1
        ? void this.hide()
        : ((this.hidden = !1),
          this.finalTransform.matMdf &&
            !this.data.hasMask &&
            this.shapesContainer.setAttribute(
              "transform",
              this.finalTransform.mat.to2dCSS()
            ),
          (this.transformHelper.opacity = this.finalTransform.opacity),
          (this.transformHelper.matMdf = !1),
          (this.transformHelper.opMdf = this.finalTransform.opMdf),
          this.renderModifiers(),
          void this.renderShape(this.transformHelper, null, null, !0));
    }),
    (IShapeElement.prototype.hide = function () {
      if (!this.hidden) {
        var t,
          e = this.stylesList.length;
        for (t = e - 1; t >= 0; t -= 1)
          "0" !== this.stylesList[t].ld &&
            ((this.stylesList[t].ld = "0"),
            (this.stylesList[t].pElem.style.display = "none"),
            this.stylesList[t].pElem.parentNode &&
              (this.stylesList[t].parent =
                this.stylesList[t].pElem.parentNode));
        this.hidden = !0;
      }
    }),
    (IShapeElement.prototype.renderShape = function (t, e, s, r) {
      var i, a;
      if (!e)
        for (
          e = this.shapesData, a = this.stylesList.length, i = 0;
          a > i;
          i += 1
        )
          (this.stylesList[i].d = ""), (this.stylesList[i].mdf = !1);
      s || (s = this.viewData), (a = e.length - 1);
      var n, o;
      n = t;
      var h;
      for (i = a; i >= 0; i -= 1)
        if (((h = e[i].ty), "tr" == h)) {
          n = s[i].transform;
          var l = s[i].transform.mProps.v.props;
          if (
            ((n.matMdf = n.mProps.mdf),
            (n.opMdf = n.op.mdf),
            (o = n.mat),
            o.cloneFromProps(l),
            t)
          ) {
            var p = t.mat.props;
            (n.opacity = t.opacity),
              (n.opacity *= s[i].transform.op.v),
              (n.matMdf = t.matMdf ? !0 : n.matMdf),
              (n.opMdf = t.opMdf ? !0 : n.opMdf),
              o.transform(
                p[0],
                p[1],
                p[2],
                p[3],
                p[4],
                p[5],
                p[6],
                p[7],
                p[8],
                p[9],
                p[10],
                p[11],
                p[12],
                p[13],
                p[14],
                p[15]
              );
          } else n.opacity = n.op.o;
        } else
          "sh" == h || "el" == h || "rc" == h || "sr" == h
            ? this.renderPath(e[i], s[i], n)
            : "fl" == h
            ? this.renderFill(e[i], s[i], n)
            : "gf" == h
            ? this.renderGradient(e[i], s[i], n)
            : "gs" == h
            ? (this.renderGradient(e[i], s[i], n),
              this.renderStroke(e[i], s[i], n))
            : "st" == h
            ? this.renderStroke(e[i], s[i], n)
            : "gr" == h && this.renderShape(n, e[i].it, s[i].it);
      if (r) {
        for (a = this.stylesList.length, i = 0; a > i; i += 1)
          "0" === this.stylesList[i].ld &&
            ((this.stylesList[i].ld = "1"),
            (this.stylesList[i].pElem.style.display = "block")),
            (this.stylesList[i].mdf || this.firstFrame) &&
              (this.stylesList[i].pElem.setAttribute("d", this.stylesList[i].d),
              this.stylesList[i].mElem &&
                this.stylesList[i].mElem.setAttribute(
                  "d",
                  this.stylesList[i].d
                ));
        this.firstFrame && (this.firstFrame = !1);
      }
    }),
    (IShapeElement.prototype.renderPath = function (t, e, s) {
      var r,
        i,
        a,
        n,
        o = "",
        h = s.matMdf || e.sh.mdf || this.firstFrame;
      if (h) {
        var l = e.sh.paths;
        for (n = l.length, a = 0; n > a; a += 1) {
          var p = l[a];
          if (p && p.v) {
            for (r = p.v.length, i = 1; r > i; i += 1)
              1 == i &&
                (o +=
                  " M" + s.mat.applyToPointStringified(p.v[0][0], p.v[0][1])),
                (o +=
                  " C" +
                  s.mat.applyToPointStringified(p.o[i - 1][0], p.o[i - 1][1]) +
                  " " +
                  s.mat.applyToPointStringified(p.i[i][0], p.i[i][1]) +
                  " " +
                  s.mat.applyToPointStringified(p.v[i][0], p.v[i][1]));
            1 == r &&
              (o += " M" + s.mat.applyToPointStringified(p.v[0][0], p.v[0][1])),
              p.c &&
                ((o +=
                  " C" +
                  s.mat.applyToPointStringified(p.o[i - 1][0], p.o[i - 1][1]) +
                  " " +
                  s.mat.applyToPointStringified(p.i[0][0], p.i[0][1]) +
                  " " +
                  s.mat.applyToPointStringified(p.v[0][0], p.v[0][1])),
                (o += "z")),
              (e.lStr = o);
          }
        }
      } else o = e.lStr;
      for (r = e.elements.length, i = 0; r > i; i += 1)
        (e.elements[i].st.mdf = h ? !0 : e.elements[i].st.mdf),
          (e.elements[i].st.d += o);
    }),
    (IShapeElement.prototype.renderFill = function (t, e, s) {
      var r = e.style;
      (e.c.mdf || this.firstFrame) &&
        r.pElem.setAttribute(
          "fill",
          "rgb(" +
            bm_floor(e.c.v[0]) +
            "," +
            bm_floor(e.c.v[1]) +
            "," +
            bm_floor(e.c.v[2]) +
            ")"
        ),
        (e.o.mdf || s.opMdf || this.firstFrame) &&
          r.pElem.setAttribute("fill-opacity", e.o.v * s.opacity);
    }),
    (IShapeElement.prototype.renderGradient = function (t, e, s) {
      var r = e.style;
      if (e.o.mdf || s.opMdf || this.firstFrame) {
        var i = "gf" === t.ty ? "fill-opacity" : "stroke-opacity";
        r.pElem.setAttribute(i, e.o.v * s.opacity);
      }
      var a = e.gf,
        n = e.of;
      if (e.s.mdf || this.firstFrame) {
        var o = 1 === t.t ? "x1" : "cx",
          h = "x1" === o ? "y1" : "cy";
        a.setAttribute(o, e.s.v[0]),
          a.setAttribute(h, e.s.v[1]),
          n && (n.setAttribute(o, e.s.v[0]), n.setAttribute(h, e.s.v[1]));
      }
      var l, p, m, f;
      if (e.g.cmdf || this.firstFrame) {
        l = e.cst;
        var d = e.g.c;
        for (m = l.length, p = 0; m > p; p += 1)
          (f = l[p]),
            f.setAttribute("offset", d[4 * p] + "%"),
            f.setAttribute(
              "stop-color",
              "rgb(" +
                d[4 * p + 1] +
                "," +
                d[4 * p + 2] +
                "," +
                d[4 * p + 3] +
                ")"
            );
      }
      if (n && (e.g.omdf || this.firstFrame)) {
        l = e.ost;
        var c = e.g.o;
        for (m = l.length, p = 0; m > p; p += 1)
          (f = l[p]),
            f.setAttribute("offset", c[2 * p] + "%"),
            f.setAttribute("stop-opacity", c[2 * p + 1]);
      }
      if (1 === t.t)
        (e.e.mdf || this.firstFrame) &&
          (a.setAttribute("x2", e.e.v[0]),
          a.setAttribute("y2", e.e.v[1]),
          n &&
            (n.setAttribute("x2", e.e.v[0]), n.setAttribute("y2", e.e.v[1])));
      else {
        var u;
        if (
          ((e.s.mdf || e.e.mdf || this.firstFrame) &&
            ((u = Math.sqrt(
              Math.pow(e.s.v[0] - e.e.v[0], 2) +
                Math.pow(e.s.v[1] - e.e.v[1], 2)
            )),
            a.setAttribute("r", u),
            n && n.setAttribute("r", u)),
          e.e.mdf || e.h.mdf || e.a.mdf || this.firstFrame)
        ) {
          u ||
            (u = Math.sqrt(
              Math.pow(e.s.v[0] - e.e.v[0], 2) +
                Math.pow(e.s.v[1] - e.e.v[1], 2)
            ));
          var y = Math.atan2(e.e.v[1] - e.s.v[1], e.e.v[0] - e.s.v[0]),
            g = e.h.v >= 1 ? 0.99 : e.h.v,
            v = u * g,
            b = Math.cos(y + e.a.v) * v + e.s.v[0],
            P = Math.sin(y + e.a.v) * v + e.s.v[1];
          a.setAttribute("fx", b),
            a.setAttribute("fy", P),
            n && (n.setAttribute("fx", b), n.setAttribute("fy", P));
        }
      }
    }),
    (IShapeElement.prototype.renderStroke = function (t, e, s) {
      var r = e.style,
        i = e.d;
      i &&
        i.k &&
        (i.mdf || this.firstFrame) &&
        (r.pElem.setAttribute("stroke-dasharray", i.dasharray),
        r.pElem.setAttribute("stroke-dashoffset", i.dashoffset)),
        e.c &&
          (e.c.mdf || this.firstFrame) &&
          r.pElem.setAttribute(
            "stroke",
            "rgb(" +
              bm_floor(e.c.v[0]) +
              "," +
              bm_floor(e.c.v[1]) +
              "," +
              bm_floor(e.c.v[2]) +
              ")"
          ),
        (e.o.mdf || s.opMdf || this.firstFrame) &&
          r.pElem.setAttribute("stroke-opacity", e.o.v * s.opacity),
        (e.w.mdf || this.firstFrame) &&
          (r.pElem.setAttribute("stroke-width", e.w.v),
          r.mElem && r.mElem.setAttribute("stroke-width", e.w.v));
    }),
    (IShapeElement.prototype.destroy = function () {
      this._parent.destroy.call(),
        (this.shapeData = null),
        (this.viewData = null),
        (this.parentContainer = null),
        (this.placeholder = null);
    }),
    createElement(SVGBaseElement, ISolidElement),
    (ISolidElement.prototype.createElements = function () {
      this._parent.createElements.call(this);
      var t = document.createElementNS(svgNS, "rect");
      t.setAttribute("width", this.data.sw),
        t.setAttribute("height", this.data.sh),
        t.setAttribute("fill", this.data.sc),
        this.layerElement === this.parentContainer
          ? this.appendNodeToParent(t)
          : this.layerElement.appendChild(t),
        (this.innerElem = t),
        this.data.ln && this.innerElem.setAttribute("id", this.data.ln),
        this.data.cl && this.innerElem.setAttribute("class", this.data.cl);
    }),
    (ISolidElement.prototype.hide = IImageElement.prototype.hide),
    (ISolidElement.prototype.renderFrame = IImageElement.prototype.renderFrame),
    (ISolidElement.prototype.destroy = IImageElement.prototype.destroy),
    createElement(BaseElement, CVBaseElement),
    (CVBaseElement.prototype.createElements = function () {}),
    (CVBaseElement.prototype.checkBlendMode = function (t) {
      if (t.blendMode !== this.data.bm) {
        t.blendMode = this.data.bm;
        var e = "";
        switch (this.data.bm) {
          case 0:
            e = "normal";
            break;
          case 1:
            e = "multiply";
            break;
          case 2:
            e = "screen";
            break;
          case 3:
            e = "overlay";
            break;
          case 4:
            e = "darken";
            break;
          case 5:
            e = "lighten";
            break;
          case 6:
            e = "color-dodge";
            break;
          case 7:
            e = "color-burn";
            break;
          case 8:
            e = "hard-light";
            break;
          case 9:
            e = "soft-light";
            break;
          case 10:
            e = "difference";
            break;
          case 11:
            e = "exclusion";
            break;
          case 12:
            e = "hue";
            break;
          case 13:
            e = "saturation";
            break;
          case 14:
            e = "color";
            break;
          case 15:
            e = "luminosity";
        }
        t.canvasContext.globalCompositeOperation = e;
      }
    }),
    (CVBaseElement.prototype.renderFrame = function (t) {
      if (3 === this.data.ty) return !1;
      if (
        (this.checkBlendMode(
          0 === this.data.ty ? this.parentGlobalData : this.globalData
        ),
        !this.isVisible)
      )
        return this.isVisible;
      (this.finalTransform.opMdf = this.finalTransform.op.mdf),
        (this.finalTransform.matMdf = this.finalTransform.mProp.mdf),
        (this.finalTransform.opacity = this.finalTransform.op.v);
      var e,
        s = this.finalTransform.mat;
      if (this.hierarchy) {
        var r,
          i = this.hierarchy.length;
        for (
          e = this.finalTransform.mProp.v.props, s.cloneFromProps(e), r = 0;
          i > r;
          r += 1
        )
          (this.finalTransform.matMdf = this.hierarchy[r].finalTransform.mProp
            .mdf
            ? !0
            : this.finalTransform.matMdf),
            (e = this.hierarchy[r].finalTransform.mProp.v.props),
            s.transform(
              e[0],
              e[1],
              e[2],
              e[3],
              e[4],
              e[5],
              e[6],
              e[7],
              e[8],
              e[9],
              e[10],
              e[11],
              e[12],
              e[13],
              e[14],
              e[15]
            );
      } else
        t
          ? ((e = this.finalTransform.mProp.v.props), s.cloneFromProps(e))
          : s.cloneFromProps(this.finalTransform.mProp.v.props);
      return (
        t &&
          ((e = t.mat.props),
          s.transform(
            e[0],
            e[1],
            e[2],
            e[3],
            e[4],
            e[5],
            e[6],
            e[7],
            e[8],
            e[9],
            e[10],
            e[11],
            e[12],
            e[13],
            e[14],
            e[15]
          ),
          (this.finalTransform.opacity *= t.opacity),
          (this.finalTransform.opMdf = t.opMdf
            ? !0
            : this.finalTransform.opMdf),
          (this.finalTransform.matMdf = t.matMdf
            ? !0
            : this.finalTransform.matMdf)),
        this.data.hasMask &&
          (this.globalData.renderer.save(!0),
          this.maskManager.renderFrame(0 === this.data.ty ? null : s)),
        this.data.hd && (this.isVisible = !1),
        this.isVisible
      );
    }),
    (CVBaseElement.prototype.addMasks = function (t) {
      this.maskManager = new CVMaskElement(t, this, this.globalData);
    }),
    (CVBaseElement.prototype.destroy = function () {
      (this.canvasContext = null),
        (this.data = null),
        (this.globalData = null),
        this.maskManager && this.maskManager.destroy();
    }),
    (CVBaseElement.prototype.mHelper = new Matrix()),
    createElement(CVBaseElement, CVCompElement),
    (CVCompElement.prototype.ctxTransform =
      CanvasRenderer.prototype.ctxTransform),
    (CVCompElement.prototype.ctxOpacity = CanvasRenderer.prototype.ctxOpacity),
    (CVCompElement.prototype.save = CanvasRenderer.prototype.save),
    (CVCompElement.prototype.restore = CanvasRenderer.prototype.restore),
    (CVCompElement.prototype.reset = function () {
      (this.contextData.cArrPos = 0),
        this.contextData.cTr.reset(),
        (this.contextData.cO = 1);
    }),
    (CVCompElement.prototype.resize = function (t) {
      var e = Math.max(t.sx, t.sy);
      (this.canvas.width = this.data.w * e),
        (this.canvas.height = this.data.h * e),
        (this.transformCanvas = {
          sc: e,
          w: this.data.w * e,
          h: this.data.h * e,
          props: [e, 0, 0, 0, 0, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        });
      var s,
        r = this.elements.length;
      for (s = 0; r > s; s += 1)
        0 === this.elements[s].data.ty && this.elements[s].resize(t);
    }),
    (CVCompElement.prototype.prepareFrame = function (t) {
      if (
        ((this.globalData.frameId = this.parentGlobalData.frameId),
        (this.globalData.mdf = !1),
        this._parent.prepareFrame.call(this, t),
        this.isVisible !== !1)
      ) {
        var e = t;
        this.tm &&
          ((e = this.tm.v), e === this.data.op && (e = this.data.op - 1)),
          (this.renderedFrame = e / this.data.sr);
        var s,
          r = this.elements.length;
        for (s = 0; r > s; s += 1)
          this.elements[s].prepareFrame(e / this.data.sr - this.layers[s].st),
            0 === this.elements[s].data.ty &&
              this.elements[s].globalData.mdf &&
              (this.globalData.mdf = !0);
        this.globalData.mdf &&
          (this.canvasContext.clearRect(0, 0, this.data.w, this.data.h),
          this.ctxTransform(this.transformCanvas.props));
      }
    }),
    (CVCompElement.prototype.renderFrame = function (t) {
      if (this._parent.renderFrame.call(this, t) !== !1) {
        if (this.globalData.mdf) {
          var e,
            s = this.layers.length;
          for (e = s - 1; e >= 0; e -= 1) this.elements[e].renderFrame();
        }
        this.data.hasMask && this.globalData.renderer.restore(!0),
          this.firstFrame && (this.firstFrame = !1),
          this.parentGlobalData.renderer.save(),
          this.parentGlobalData.renderer.ctxTransform(
            this.finalTransform.mat.props
          ),
          this.parentGlobalData.renderer.ctxOpacity(
            this.finalTransform.opacity
          ),
          this.parentGlobalData.renderer.canvasContext.drawImage(
            this.canvas,
            0,
            0,
            this.data.w,
            this.data.h
          ),
          this.parentGlobalData.renderer.restore(),
          this.globalData.mdf && this.reset();
      }
    }),
    (CVCompElement.prototype.setElements = function (t) {
      this.elements = t;
    }),
    (CVCompElement.prototype.getElements = function () {
      return this.elements;
    }),
    (CVCompElement.prototype.destroy = function () {
      var t,
        e = this.layers.length;
      for (t = e - 1; t >= 0; t -= 1) this.elements[t].destroy();
      (this.layers = null), (this.elements = null), this._parent.destroy.call();
    }),
    createElement(CVBaseElement, CVImageElement),
    (CVImageElement.prototype.createElements = function () {
      var t = function () {
          this.globalData.elementLoaded();
        }.bind(this),
        e = function () {
          (this.failed = !0), this.globalData.elementLoaded();
        }.bind(this);
      (this.img = new Image()),
        this.img.addEventListener("load", t, !1),
        this.img.addEventListener("error", e, !1),
        (this.img.src = this.path + this.assetData.p),
        this._parent.createElements.call(this);
    }),
    (CVImageElement.prototype.renderFrame = function (t) {
      if (!this.failed && this._parent.renderFrame.call(this, t) !== !1) {
        var e = this.canvasContext;
        this.globalData.renderer.save();
        var s = this.finalTransform.mat.props;
        this.globalData.renderer.ctxTransform(s),
          this.globalData.renderer.ctxOpacity(this.finalTransform.opacity),
          e.drawImage(this.img, 0, 0),
          this.globalData.renderer.restore(this.data.hasMask),
          this.firstFrame && (this.firstFrame = !1);
      }
    }),
    (CVImageElement.prototype.destroy = function () {
      (this.img = null), this._parent.destroy.call();
    }),
    (CVMaskElement.prototype.getMaskProperty = function (t) {
      return this.viewData[t];
    }),
    (CVMaskElement.prototype.prepareFrame = function (t) {
      var e,
        s = this.dynamicProperties.length;
      for (e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(t);
    }),
    (CVMaskElement.prototype.renderFrame = function (t) {
      var e,
        s,
        r,
        i,
        a,
        n = this.element.canvasContext,
        o = this.data.masksProperties.length,
        h = !1;
      for (e = 0; o > e; e++)
        if ("n" !== this.masksProperties[e].mode) {
          h === !1 && (n.beginPath(), (h = !0)),
            this.masksProperties[e].inv &&
              (n.moveTo(0, 0),
              n.lineTo(this.element.globalData.compWidth, 0),
              n.lineTo(
                this.element.globalData.compWidth,
                this.element.globalData.compHeight
              ),
              n.lineTo(0, this.element.globalData.compHeight),
              n.lineTo(0, 0)),
            (a = this.viewData[e].v),
            (s = t ? t.applyToPointArray(a.v[0][0], a.v[0][1], 0) : a.v[0]),
            n.moveTo(s[0], s[1]);
          var l,
            p = a.v.length;
          for (l = 1; p > l; l++)
            (s = t
              ? t.applyToPointArray(a.o[l - 1][0], a.o[l - 1][1], 0)
              : a.o[l - 1]),
              (r = t ? t.applyToPointArray(a.i[l][0], a.i[l][1], 0) : a.i[l]),
              (i = t ? t.applyToPointArray(a.v[l][0], a.v[l][1], 0) : a.v[l]),
              n.bezierCurveTo(s[0], s[1], r[0], r[1], i[0], i[1]);
          (s = t
            ? t.applyToPointArray(a.o[l - 1][0], a.o[l - 1][1], 0)
            : a.o[l - 1]),
            (r = t ? t.applyToPointArray(a.i[0][0], a.i[0][1], 0) : a.i[0]),
            (i = t ? t.applyToPointArray(a.v[0][0], a.v[0][1], 0) : a.v[0]),
            n.bezierCurveTo(s[0], s[1], r[0], r[1], i[0], i[1]);
        }
      h && n.clip();
    }),
    (CVMaskElement.prototype.getMask = function (t) {
      for (var e = 0, s = this.masksProperties.length; s > e; ) {
        if (this.masksProperties[e].nm === t)
          return { maskPath: this.viewData[e].pv };
        e += 1;
      }
    }),
    (CVMaskElement.prototype.destroy = function () {
      this.element = null;
    }),
    createElement(CVBaseElement, CVShapeElement),
    (CVShapeElement.prototype.lcEnum = { 1: "butt", 2: "round", 3: "butt" }),
    (CVShapeElement.prototype.ljEnum = {
      1: "miter",
      2: "round",
      3: "butt",
    }),
    (CVShapeElement.prototype.transformHelper = {
      opacity: 1,
      mat: new Matrix(),
      matMdf: !1,
      opMdf: !1,
    }),
    (CVShapeElement.prototype.dashResetter = []),
    (CVShapeElement.prototype.createElements = function () {
      this._parent.createElements.call(this),
        this.searchShapes(
          this.shapesData,
          this.viewData,
          this.dynamicProperties
        );
    }),
    (CVShapeElement.prototype.searchShapes = function (t, e, s) {
      var r,
        i,
        a,
        n,
        o = t.length - 1,
        h = [],
        l = [];
      for (r = o; r >= 0; r -= 1)
        if ("fl" == t[r].ty || "st" == t[r].ty) {
          if (
            ((n = { type: t[r].ty, elements: [] }),
            (e[r] = {}),
            ("fl" == t[r].ty || "st" == t[r].ty) &&
              ((e[r].c = PropertyFactory.getProp(this, t[r].c, 1, 255, s)),
              e[r].c.k ||
                (n.co =
                  "rgb(" +
                  bm_floor(e[r].c.v[0]) +
                  "," +
                  bm_floor(e[r].c.v[1]) +
                  "," +
                  bm_floor(e[r].c.v[2]) +
                  ")")),
            (e[r].o = PropertyFactory.getProp(this, t[r].o, 0, 0.01, s)),
            "st" == t[r].ty &&
              ((n.lc = this.lcEnum[t[r].lc] || "round"),
              (n.lj = this.ljEnum[t[r].lj] || "round"),
              1 == t[r].lj && (n.ml = t[r].ml),
              (e[r].w = PropertyFactory.getProp(this, t[r].w, 0, null, s)),
              e[r].w.k || (n.wi = e[r].w.v),
              t[r].d))
          ) {
            var p = PropertyFactory.getDashProp(this, t[r].d, "canvas", s);
            (e[r].d = p),
              e[r].d.k ||
                ((n.da = e[r].d.dasharray), (n["do"] = e[r].d.dashoffset));
          }
          this.stylesList.push(n), (e[r].style = n), h.push(e[r].style);
        } else if ("gr" == t[r].ty)
          (e[r] = { it: [] }), this.searchShapes(t[r].it, e[r].it, s);
        else if ("tr" == t[r].ty)
          e[r] = {
            transform: {
              mat: new Matrix(),
              opacity: 1,
              matMdf: !1,
              opMdf: !1,
              op: PropertyFactory.getProp(this, t[r].o, 0, 0.01, s),
              mProps: PropertyFactory.getProp(this, t[r], 2, null, s),
            },
            elements: [],
          };
        else if (
          "sh" == t[r].ty ||
          "rc" == t[r].ty ||
          "el" == t[r].ty ||
          "sr" == t[r].ty
        ) {
          e[r] = { nodes: [], trNodes: [], tr: [0, 0, 0, 0, 0, 0] };
          var m = 4;
          "rc" == t[r].ty
            ? (m = 5)
            : "el" == t[r].ty
            ? (m = 6)
            : "sr" == t[r].ty && (m = 7),
            (e[r].sh = ShapePropertyFactory.getShapeProp(this, t[r], m, s)),
            this.shapes.push(e[r].sh),
            this.addShapeToModifiers(e[r].sh),
            (a = this.stylesList.length);
          var f = !1,
            d = !1;
          for (i = 0; a > i; i += 1)
            this.stylesList[i].closed ||
              (this.stylesList[i].elements.push(e[r]),
              "st" === this.stylesList[i].type ? (f = !0) : (d = !0));
          (e[r].st = f), (e[r].fl = d);
        } else if ("tm" == t[r].ty || "rd" == t[r].ty) {
          var c = ShapeModifiers.getModifier(t[r].ty);
          c.init(this, t[r], s),
            this.shapeModifiers.push(c),
            l.push(c),
            (e[r] = c);
        }
      for (o = h.length, r = 0; o > r; r += 1) h[r].closed = !0;
      for (o = l.length, r = 0; o > r; r += 1) l[r].closed = !0;
    }),
    (CVShapeElement.prototype.addShapeToModifiers = function (t) {
      var e,
        s = this.shapeModifiers.length;
      for (e = 0; s > e; e += 1) this.shapeModifiers[e].addShape(t);
    }),
    (CVShapeElement.prototype.renderModifiers = function () {
      if (this.shapeModifiers.length) {
        var t,
          e = this.shapes.length;
        for (t = 0; e > t; t += 1) this.shapes[t].reset();
        for (e = this.shapeModifiers.length, t = e - 1; t >= 0; t -= 1)
          this.shapeModifiers[t].processShapes();
      }
    }),
    (CVShapeElement.prototype.renderFrame = function (t) {
      this._parent.renderFrame.call(this, t) !== !1 &&
        (this.transformHelper.mat.reset(),
        (this.transformHelper.opacity = this.finalTransform.opacity),
        (this.transformHelper.matMdf = !1),
        (this.transformHelper.opMdf = this.finalTransform.opMdf),
        this.renderModifiers(),
        this.renderShape(this.transformHelper, null, null, !0),
        this.data.hasMask && this.globalData.renderer.restore(!0));
    }),
    (CVShapeElement.prototype.renderShape = function (t, e, s, r) {
      var i, a;
      if (!e)
        for (
          e = this.shapesData, a = this.stylesList.length, i = 0;
          a > i;
          i += 1
        )
          (this.stylesList[i].d = ""), (this.stylesList[i].mdf = !1);
      s || (s = this.viewData), (a = e.length - 1);
      var n, o;
      for (n = t, i = a; i >= 0; i -= 1)
        if ("tr" == e[i].ty) {
          n = s[i].transform;
          var h = s[i].transform.mProps.v.props;
          if (
            ((n.matMdf = n.mProps.mdf),
            (n.opMdf = n.op.mdf),
            (o = n.mat),
            o.cloneFromProps(h),
            t)
          ) {
            var l = t.mat.props;
            (n.opacity = t.opacity),
              (n.opacity *= s[i].transform.op.v),
              (n.matMdf = t.matMdf ? !0 : n.matMdf),
              (n.opMdf = t.opMdf ? !0 : n.opMdf),
              o.transform(
                l[0],
                l[1],
                l[2],
                l[3],
                l[4],
                l[5],
                l[6],
                l[7],
                l[8],
                l[9],
                l[10],
                l[11],
                l[12],
                l[13],
                l[14],
                l[15]
              );
          } else n.opacity = n.op.o;
        } else
          "sh" == e[i].ty ||
          "el" == e[i].ty ||
          "rc" == e[i].ty ||
          "sr" == e[i].ty
            ? this.renderPath(e[i], s[i], n)
            : "fl" == e[i].ty
            ? this.renderFill(e[i], s[i], n)
            : "st" == e[i].ty
            ? this.renderStroke(e[i], s[i], n)
            : "gr" == e[i].ty
            ? this.renderShape(n, e[i].it, s[i].it)
            : "tm" == e[i].ty;
      if (r) {
        a = this.stylesList.length;
        var p,
          m,
          f,
          d,
          c,
          u,
          y,
          g = this.globalData.renderer,
          v = this.globalData.canvasContext;
        for (
          g.save(), g.ctxTransform(this.finalTransform.mat.props), i = 0;
          a > i;
          i += 1
        )
          if (
            ((y = this.stylesList[i].type),
            "st" !== y || 0 !== this.stylesList[i].wi)
          ) {
            for (
              g.save(),
                c = this.stylesList[i].elements,
                "st" === y
                  ? ((v.strokeStyle = this.stylesList[i].co),
                    (v.lineWidth = this.stylesList[i].wi),
                    (v.lineCap = this.stylesList[i].lc),
                    (v.lineJoin = this.stylesList[i].lj),
                    (v.miterLimit = this.stylesList[i].ml || 0))
                  : (v.fillStyle = this.stylesList[i].co),
                g.ctxOpacity(this.stylesList[i].coOp),
                "st" !== y && v.beginPath(),
                m = c.length,
                p = 0;
              m > p;
              p += 1
            ) {
              for (
                "st" === y &&
                  (v.beginPath(),
                  this.stylesList[i].da
                    ? (v.setLineDash(this.stylesList[i].da),
                      (v.lineDashOffset = this.stylesList[i]["do"]),
                      (this.globalData.isDashed = !0))
                    : this.globalData.isDashed &&
                      (v.setLineDash(this.dashResetter),
                      (this.globalData.isDashed = !1))),
                  u = c[p].trNodes,
                  d = u.length,
                  f = 0;
                d > f;
                f += 1
              )
                "m" == u[f].t
                  ? v.moveTo(u[f].p[0], u[f].p[1])
                  : "c" == u[f].t
                  ? v.bezierCurveTo(
                      u[f].p1[0],
                      u[f].p1[1],
                      u[f].p2[0],
                      u[f].p2[1],
                      u[f].p3[0],
                      u[f].p3[1]
                    )
                  : v.closePath();
              "st" === y && v.stroke();
            }
            "st" !== y && v.fill(), g.restore();
          }
        g.restore(), this.firstFrame && (this.firstFrame = !1);
      }
    }),
    (CVShapeElement.prototype.renderPath = function (t, e, s) {
      var r,
        i,
        a,
        n,
        o = s.matMdf || e.sh.mdf || this.firstFrame;
      if (o) {
        var h = e.sh.paths;
        n = h.length;
        var l = e.trNodes;
        for (l.length = 0, a = 0; n > a; a += 1) {
          var p = h[a];
          if (p && p.v) {
            for (r = p.v.length, i = 1; r > i; i += 1)
              1 == i &&
                l.push({
                  t: "m",
                  p: s.mat.applyToPointArray(p.v[0][0], p.v[0][1], 0),
                }),
                l.push({
                  t: "c",
                  p1: s.mat.applyToPointArray(p.o[i - 1][0], p.o[i - 1][1], 0),
                  p2: s.mat.applyToPointArray(p.i[i][0], p.i[i][1], 0),
                  p3: s.mat.applyToPointArray(p.v[i][0], p.v[i][1], 0),
                });
            1 == r &&
              l.push({
                t: "m",
                p: s.mat.applyToPointArray(p.v[0][0], p.v[0][1], 0),
              }),
              p.c &&
                (l.push({
                  t: "c",
                  p1: s.mat.applyToPointArray(p.o[i - 1][0], p.o[i - 1][1], 0),
                  p2: s.mat.applyToPointArray(p.i[0][0], p.i[0][1], 0),
                  p3: s.mat.applyToPointArray(p.v[0][0], p.v[0][1], 0),
                }),
                l.push({ t: "z" })),
              (e.lStr = l);
          }
        }
        if (e.st) for (i = 0; 16 > i; i += 1) e.tr[i] = s.mat.props[i];
        e.trNodes = l;
      }
    }),
    (CVShapeElement.prototype.renderFill = function (t, e, s) {
      var r = e.style;
      (e.c.mdf || this.firstFrame) &&
        (r.co =
          "rgb(" +
          bm_floor(e.c.v[0]) +
          "," +
          bm_floor(e.c.v[1]) +
          "," +
          bm_floor(e.c.v[2]) +
          ")"),
        (e.o.mdf || s.opMdf || this.firstFrame) && (r.coOp = e.o.v * s.opacity);
    }),
    (CVShapeElement.prototype.renderStroke = function (t, e, s) {
      var r = e.style,
        i = e.d;
      i &&
        (i.mdf || this.firstFrame) &&
        ((r.da = i.dasharray), (r["do"] = i.dashoffset)),
        (e.c.mdf || this.firstFrame) &&
          (r.co =
            "rgb(" +
            bm_floor(e.c.v[0]) +
            "," +
            bm_floor(e.c.v[1]) +
            "," +
            bm_floor(e.c.v[2]) +
            ")"),
        (e.o.mdf || s.opMdf || this.firstFrame) && (r.coOp = e.o.v * s.opacity),
        (e.w.mdf || this.firstFrame) && (r.wi = e.w.v);
    }),
    (CVShapeElement.prototype.destroy = function () {
      (this.shapesData = null),
        (this.globalData = null),
        (this.canvasContext = null),
        (this.stylesList.length = 0),
        (this.viewData.length = 0),
        this._parent.destroy.call();
    }),
    createElement(CVBaseElement, CVSolidElement),
    (CVSolidElement.prototype.renderFrame = function (t) {
      if (this._parent.renderFrame.call(this, t) !== !1) {
        var e = this.canvasContext;
        this.globalData.renderer.save(),
          this.globalData.renderer.ctxTransform(this.finalTransform.mat.props),
          this.globalData.renderer.ctxOpacity(this.finalTransform.opacity),
          (e.fillStyle = this.data.sc),
          e.fillRect(0, 0, this.data.sw, this.data.sh),
          this.globalData.renderer.restore(this.data.hasMask),
          this.firstFrame && (this.firstFrame = !1);
      }
    }),
    createElement(CVBaseElement, CVTextElement),
    (CVTextElement.prototype.init = ITextElement.prototype.init),
    (CVTextElement.prototype.getMeasures = ITextElement.prototype.getMeasures),
    (CVTextElement.prototype.getMult = ITextElement.prototype.getMult),
    (CVTextElement.prototype.tHelper = document
      .createElement("canvas")
      .getContext("2d")),
    (CVTextElement.prototype.createElements = function () {
      this._parent.createElements.call(this);
      var t = this.data.t.d,
        e = !1;
      t.fc
        ? ((e = !0),
          (this.values.fill =
            "rgb(" +
            Math.round(255 * t.fc[0]) +
            "," +
            Math.round(255 * t.fc[1]) +
            "," +
            Math.round(255 * t.fc[2]) +
            ")"))
        : (this.values.fill = "rgba(0,0,0,0)"),
        (this.fill = e);
      var s = !1;
      t.sc &&
        ((s = !0),
        (this.values.stroke =
          "rgb(" +
          Math.round(255 * t.sc[0]) +
          "," +
          Math.round(255 * t.sc[1]) +
          "," +
          Math.round(255 * t.sc[2]) +
          ")"),
        (this.values.sWidth = t.sw));
      var r,
        i,
        a = this.globalData.fontManager.getFontByName(t.f),
        n = t.l,
        o = this.mHelper;
      (this.stroke = s),
        (this.values.fValue =
          t.s + "px " + this.globalData.fontManager.getFontByName(t.f).fFamily),
        (i = t.t.length),
        (this.tHelper.font = this.values.fValue);
      var h,
        l,
        p,
        m,
        f,
        d,
        c,
        u,
        y,
        g,
        v = this.data.singleShape;
      if (v)
        var b = 0,
          P = 0,
          E = t.lineWidths,
          k = t.boxWidth,
          S = !0;
      for (r = 0; i > r; r += 1) {
        h = this.globalData.fontManager.getCharData(
          t.t.charAt(r),
          a.fStyle,
          this.globalData.fontManager.getFontByName(t.f).fFamily
        );
        var l;
        if (
          ((l = h ? h.data : null),
          o.reset(),
          v &&
            n[r].n &&
            ((b = 0), (P += t.yOffset), (P += S ? 1 : 0), (S = !1)),
          l && l.shapes)
        ) {
          if (
            ((f = l.shapes[0].it),
            (c = f.length),
            o.scale(t.s / 100, t.s / 100),
            v)
          ) {
            switch (
              (t.ps && o.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j)
            ) {
              case 1:
                o.translate(t.justifyOffset + (k - E[n[r].line]), 0, 0);
                break;
              case 2:
                o.translate(t.justifyOffset + (k - E[n[r].line]) / 2, 0, 0);
            }
            o.translate(b, P, 0);
          }
          for (y = new Array(c), d = 0; c > d; d += 1) {
            for (
              m = f[d].ks.k.i.length, u = f[d].ks.k, g = [], p = 1;
              m > p;
              p += 1
            )
              1 == p &&
                g.push(
                  o.applyToX(u.v[0][0], u.v[0][1], 0),
                  o.applyToY(u.v[0][0], u.v[0][1], 0)
                ),
                g.push(
                  o.applyToX(u.o[p - 1][0], u.o[p - 1][1], 0),
                  o.applyToY(u.o[p - 1][0], u.o[p - 1][1], 0),
                  o.applyToX(u.i[p][0], u.i[p][1], 0),
                  o.applyToY(u.i[p][0], u.i[p][1], 0),
                  o.applyToX(u.v[p][0], u.v[p][1], 0),
                  o.applyToY(u.v[p][0], u.v[p][1], 0)
                );
            g.push(
              o.applyToX(u.o[p - 1][0], u.o[p - 1][1], 0),
              o.applyToY(u.o[p - 1][0], u.o[p - 1][1], 0),
              o.applyToX(u.i[0][0], u.i[0][1], 0),
              o.applyToY(u.i[0][0], u.i[0][1], 0),
              o.applyToX(u.v[0][0], u.v[0][1], 0),
              o.applyToY(u.v[0][0], u.v[0][1], 0)
            ),
              (y[d] = g);
          }
        } else y = [];
        v && (b += n[r].l), this.textSpans.push({ elem: y });
      }
    }),
    (CVTextElement.prototype.renderFrame = function (t) {
      if (this._parent.renderFrame.call(this, t) !== !1) {
        var e = this.canvasContext,
          s = this.finalTransform.mat.props;
        this.globalData.renderer.save(),
          this.globalData.renderer.ctxTransform(s),
          this.globalData.renderer.ctxOpacity(this.finalTransform.opacity),
          (e.font = this.values.fValue),
          (e.lineCap = "butt"),
          (e.lineJoin = "miter"),
          (e.miterLimit = 4),
          this.data.singleShape || this.getMeasures();
        var r,
          i,
          a,
          n,
          o,
          h,
          l = this.renderedLetters,
          p = this.data.t.d.l;
        i = p.length;
        var m,
          f,
          d,
          c = null,
          u = null,
          y = null;
        for (r = 0; i > r; r += 1)
          if (!p[r].n) {
            if (
              ((m = l[r]),
              m &&
                (this.globalData.renderer.save(),
                this.globalData.renderer.ctxTransform(m.props),
                this.globalData.renderer.ctxOpacity(m.o)),
              this.fill)
            ) {
              for (
                m && m.fc
                  ? c !== m.fc && ((c = m.fc), (e.fillStyle = m.fc))
                  : c !== this.values.fill &&
                    ((c = this.values.fill), (e.fillStyle = this.values.fill)),
                  f = this.textSpans[r].elem,
                  n = f.length,
                  this.globalData.canvasContext.beginPath(),
                  a = 0;
                n > a;
                a += 1
              )
                for (
                  d = f[a],
                    h = d.length,
                    this.globalData.canvasContext.moveTo(d[0], d[1]),
                    o = 2;
                  h > o;
                  o += 6
                )
                  this.globalData.canvasContext.bezierCurveTo(
                    d[o],
                    d[o + 1],
                    d[o + 2],
                    d[o + 3],
                    d[o + 4],
                    d[o + 5]
                  );
              this.globalData.canvasContext.closePath(),
                this.globalData.canvasContext.fill();
            }
            if (this.stroke) {
              for (
                m && m.sw
                  ? y !== m.sw && ((y = m.sw), (e.lineWidth = m.sw))
                  : y !== this.values.sWidth &&
                    ((y = this.values.sWidth),
                    (e.lineWidth = this.values.sWidth)),
                  m && m.sc
                    ? u !== m.sc && ((u = m.sc), (e.strokeStyle = m.sc))
                    : u !== this.values.stroke &&
                      ((u = this.values.stroke),
                      (e.strokeStyle = this.values.stroke)),
                  f = this.textSpans[r].elem,
                  n = f.length,
                  this.globalData.canvasContext.beginPath(),
                  a = 0;
                n > a;
                a += 1
              )
                for (
                  d = f[a],
                    h = d.length,
                    this.globalData.canvasContext.moveTo(d[0], d[1]),
                    o = 2;
                  h > o;
                  o += 6
                )
                  this.globalData.canvasContext.bezierCurveTo(
                    d[o],
                    d[o + 1],
                    d[o + 2],
                    d[o + 3],
                    d[o + 4],
                    d[o + 5]
                  );
              this.globalData.canvasContext.closePath(),
                this.globalData.canvasContext.stroke();
            }
            m && this.globalData.renderer.restore();
          }
        this.globalData.renderer.restore(this.data.hasMask),
          this.firstFrame && (this.firstFrame = !1);
      }
    }),
    createElement(BaseElement, HBaseElement),
    (HBaseElement.prototype.checkBlendMode = function () {}),
    (HBaseElement.prototype.setBlendMode = BaseElement.prototype.setBlendMode),
    (HBaseElement.prototype.appendNodeToParent = function (t) {
      if (!this.data.hd)
        if (this.placeholder) {
          var e = this.placeholder.phElement;
          e.parentNode.insertBefore(t, e);
        } else this.parentContainer.appendChild(t);
    }),
    (HBaseElement.prototype.createElements = function () {
      this.data.hasMask
        ? ((this.layerElement = document.createElementNS(svgNS, "svg")),
          this.appendNodeToParent(this.layerElement),
          (this.maskedElement = this.layerElement))
        : (this.layerElement = this.parentContainer),
        !this.data.ln ||
          (4 !== this.data.ty && 0 !== this.data.ty) ||
          (this.layerElement === this.parentContainer &&
            ((this.layerElement = document.createElementNS(svgNS, "g")),
            this.appendNodeToParent(this.layerElement)),
          this.layerElement.setAttribute("id", this.data.ln)),
        this.setBlendMode(),
        this.layerElement !== this.parentContainer && (this.placeholder = null);
    }),
    (HBaseElement.prototype.renderFrame = function (t) {
      if (3 === this.data.ty) return !1;
      if (this.currentFrameNum === this.lastNum || !this.isVisible)
        return this.isVisible;
      (this.lastNum = this.currentFrameNum),
        this.data.hasMask && this.maskManager.renderFrame(),
        (this.finalTransform.opMdf = this.finalTransform.op.mdf),
        (this.finalTransform.matMdf = this.finalTransform.mProp.mdf),
        (this.finalTransform.opacity = this.finalTransform.op.v),
        this.firstFrame &&
          ((this.finalTransform.opMdf = !0), (this.finalTransform.matMdf = !0));
      var e,
        s = this.finalTransform.mat;
      if (this.hierarchy) {
        var r,
          i = this.hierarchy.length;
        for (
          e = this.finalTransform.mProp.v.props, s.cloneFromProps(e), r = 0;
          i > r;
          r += 1
        )
          (this.finalTransform.matMdf = this.hierarchy[r].finalTransform.mProp
            .mdf
            ? !0
            : this.finalTransform.matMdf),
            (e = this.hierarchy[r].finalTransform.mProp.v.props),
            s.transform(
              e[0],
              e[1],
              e[2],
              e[3],
              e[4],
              e[5],
              e[6],
              e[7],
              e[8],
              e[9],
              e[10],
              e[11],
              e[12],
              e[13],
              e[14],
              e[15]
            );
      } else
        this.isVisible &&
          this.finalTransform.matMdf &&
          (t
            ? ((e = this.finalTransform.mProp.v.props), s.cloneFromProps(e))
            : s.cloneFromProps(this.finalTransform.mProp.v.props));
      return (
        t &&
          ((e = t.mat.props),
          s.cloneFromProps(e),
          (this.finalTransform.opacity *= t.opacity),
          (this.finalTransform.opMdf = t.opMdf
            ? !0
            : this.finalTransform.opMdf),
          (this.finalTransform.matMdf = t.matMdf
            ? !0
            : this.finalTransform.matMdf)),
        this.finalTransform.matMdf &&
          (this.layerElement.style.transform =
            this.layerElement.style.webkitTransform =
              s.toCSS()),
        this.finalTransform.opMdf &&
          (this.layerElement.style.opacity = this.finalTransform.opacity),
        this.isVisible
      );
    }),
    (HBaseElement.prototype.destroy = function () {
      (this.layerElement = null),
        (this.parentContainer = null),
        this.matteElement && (this.matteElement = null),
        this.maskManager &&
          (this.maskManager.destroy(), (this.maskManager = null));
    }),
    (HBaseElement.prototype.getDomElement = function () {
      return this.layerElement;
    }),
    (HBaseElement.prototype.addMasks = function (t) {
      this.maskManager = new MaskElement(t, this, this.globalData);
    }),
    (HBaseElement.prototype.hide = function () {}),
    (HBaseElement.prototype.setMatte = function () {}),
    createElement(HBaseElement, HSolidElement),
    (HSolidElement.prototype.createElements = function () {
      var t = document.createElement("div");
      styleDiv(t);
      var e = document.createElementNS(svgNS, "svg");
      e.setAttribute("width", this.data.sw),
        e.setAttribute("height", this.data.sh),
        t.appendChild(e),
        (this.layerElement = t),
        this.appendNodeToParent(t),
        (this.innerElem = t),
        this.data.ln && this.innerElem.setAttribute("id", this.data.ln),
        0 !== this.data.bm && this.setBlendMode();
      var s = document.createElementNS(svgNS, "rect");
      s.setAttribute("width", this.data.sw),
        s.setAttribute("height", this.data.sh),
        s.setAttribute("fill", this.data.sc),
        e.appendChild(s),
        this.data.hasMask && (this.maskedElement = s);
    }),
    (HSolidElement.prototype.hide = function () {
      this.hidden ||
        ((this.innerElem.style.display = "none"), (this.hidden = !0));
    }),
    (HSolidElement.prototype.renderFrame = function (t) {
      var e = this._parent.renderFrame.call(this, t);
      return e === !1
        ? void this.hide()
        : (this.hidden &&
            ((this.hidden = !1), (this.innerElem.style.display = "block")),
          void (this.firstFrame && (this.firstFrame = !1)));
    }),
    (HSolidElement.prototype.destroy = function () {
      this._parent.destroy.call(), (this.innerElem = null);
    }),
    createElement(HBaseElement, HCompElement),
    (HCompElement.prototype.getDomElement = function () {
      return this.composingElement;
    }),
    (HCompElement.prototype.getComposingElement = function () {
      return this.layerElement;
    }),
    (HCompElement.prototype.createElements = function () {
      if (
        ((this.layerElement = document.createElement("div")),
        styleDiv(this.layerElement),
        this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
        (this.layerElement.style.clip =
          "rect(0px, " + this.data.w + "px, " + this.data.h + "px, 0px)"),
        this.layerElement !== this.parentContainer && (this.placeholder = null),
        this.data.hasMask)
      ) {
        var t = document.createElementNS(svgNS, "svg");
        t.setAttribute("width", this.data.w),
          t.setAttribute("height", this.data.h);
        var e = document.createElementNS(svgNS, "g");
        t.appendChild(e),
          this.layerElement.appendChild(t),
          (this.maskedElement = e),
          (this.composingElement = e);
      } else this.composingElement = this.layerElement;
      this.appendNodeToParent(this.layerElement);
    }),
    (HCompElement.prototype.hide = ICompElement.prototype.hide),
    (HCompElement.prototype.prepareFrame = ICompElement.prototype.prepareFrame),
    (HCompElement.prototype.setElements = ICompElement.prototype.setElements),
    (HCompElement.prototype.getElements = ICompElement.prototype.getElements),
    (HCompElement.prototype.destroy = ICompElement.prototype.destroy),
    (HCompElement.prototype.renderFrame = function (t) {
      var e,
        s = this._parent.renderFrame.call(this, t),
        r = this.layers.length;
      if (s === !1) return void this.hide();
      for (this.hidden = !1, e = 0; r > e; e += 1)
        this.elements[e].renderFrame();
      this.firstFrame && (this.firstFrame = !1);
    }),
    createElement(HBaseElement, HShapeElement);
  var parent = HShapeElement.prototype._parent;
  extendPrototype(IShapeElement, HShapeElement),
    (HShapeElement.prototype._parent = parent),
    (HShapeElement.prototype.createElements = function () {
      var t = document.createElement("div");
      styleDiv(t);
      var e = document.createElementNS(svgNS, "svg");
      if (
        (999999 === this.data.bounds.l,
        e.setAttribute("width", this.data.bounds.r - this.data.bounds.l),
        e.setAttribute("height", this.data.bounds.b - this.data.bounds.t),
        e.setAttribute(
          "viewBox",
          this.data.bounds.l +
            " " +
            this.data.bounds.t +
            " " +
            (this.data.bounds.r - this.data.bounds.l) +
            " " +
            (this.data.bounds.b - this.data.bounds.t)
        ),
        (e.style.transform = e.style.webkitTransform =
          "translate(" +
          this.data.bounds.l +
          "px," +
          this.data.bounds.t +
          "px)"),
        this.data.hasMask)
      ) {
        var s = document.createElementNS(svgNS, "g");
        t.appendChild(e),
          e.appendChild(s),
          (this.maskedElement = s),
          (this.layerElement = s),
          (this.shapesContainer = s);
      } else
        t.appendChild(e),
          (this.layerElement = e),
          (this.shapesContainer = document.createElementNS(svgNS, "g")),
          this.layerElement.appendChild(this.shapesContainer);
      this.data.hd || this.parentContainer.appendChild(t),
        (this.innerElem = t),
        this.data.ln && this.innerElem.setAttribute("id", this.data.ln),
        this.searchShapes(
          this.shapesData,
          this.viewData,
          this.dynamicProperties,
          []
        ),
        this.buildExpressionInterface(),
        (this.layerElement = t),
        0 !== this.data.bm && this.setBlendMode();
    }),
    (HShapeElement.prototype.renderFrame = function (t) {
      var e = this._parent.renderFrame.call(this, t);
      return e === !1
        ? void this.hide()
        : ((this.hidden = !1),
          (this.transformHelper.opacity = this.finalTransform.opacity),
          (this.transformHelper.matMdf = !1),
          (this.transformHelper.opMdf = this.finalTransform.opMdf),
          this.renderModifiers(),
          void this.renderShape(this.transformHelper, null, null, !0));
    }),
    createElement(HBaseElement, HTextElement),
    (HTextElement.prototype.init = ITextElement.prototype.init),
    (HTextElement.prototype.getMeasures = ITextElement.prototype.getMeasures),
    (HTextElement.prototype.createPathShape =
      ITextElement.prototype.createPathShape),
    (HTextElement.prototype.createElements = function () {
      this.isMasked = this.checkMasks();
      var t = this.data.t.d,
        e = document.createElement("div");
      if ((styleDiv(e), (this.layerElement = e), this.isMasked)) {
        this.renderType = "svg";
        var s = document.createElementNS(svgNS, "svg");
        (this.cont = s),
          (this.compW = this.comp.data
            ? this.comp.data.w
            : this.globalData.compSize.w),
          (this.compH = this.comp.data
            ? this.comp.data.h
            : this.globalData.compSize.h),
          s.setAttribute("width", this.compW),
          s.setAttribute("height", this.compH);
        var r = document.createElementNS(svgNS, "g");
        s.appendChild(r),
          e.appendChild(s),
          (this.maskedElement = r),
          (this.innerElem = r);
      } else (this.renderType = "html"), (this.innerElem = e);
      this.parentContainer.appendChild(e),
        (this.innerElem.style.color = this.innerElem.style.fill =
          t.fc
            ? "rgb(" +
              Math.round(255 * t.fc[0]) +
              "," +
              Math.round(255 * t.fc[1]) +
              "," +
              Math.round(255 * t.fc[2]) +
              ")"
            : "rgba(0,0,0,0)"),
        t.sc &&
          ((this.innerElem.style.stroke =
            "rgb(" +
            Math.round(255 * t.sc[0]) +
            "," +
            Math.round(255 * t.sc[1]) +
            "," +
            Math.round(255 * t.sc[2]) +
            ")"),
          (this.innerElem.style.strokeWidth = t.sw + "px"));
      var i = this.globalData.fontManager.getFontByName(t.f);
      if (!this.globalData.fontManager.chars)
        if (
          ((this.innerElem.style.fontSize = t.s + "px"),
          (this.innerElem.style.lineHeight = t.s + "px"),
          i.fClass)
        )
          this.innerElem.className = i.fClass;
        else {
          this.innerElem.style.fontFamily = i.fFamily;
          var a = t.fWeight,
            n = t.fStyle;
          (this.innerElem.style.fontStyle = n),
            (this.innerElem.style.fontWeight = a);
        }
      var o,
        h,
        l = t.l;
      h = l.length;
      var p,
        m,
        f,
        d,
        c = this.mHelper,
        u = "";
      for (o = 0; h > o; o += 1) {
        if (
          (this.globalData.fontManager.chars
            ? ((p = document.createElementNS(svgNS, "path")),
              this.isMasked ||
                ((m = document.createElement("div")),
                (f = document.createElementNS(svgNS, "svg")),
                m.appendChild(f),
                f.appendChild(p),
                styleDiv(m)),
              p.setAttribute("stroke-linecap", "butt"),
              p.setAttribute("stroke-linejoin", "round"),
              p.setAttribute("stroke-miterlimit", "4"))
            : this.isMasked
            ? (p = document.createElementNS(svgNS, "text"))
            : ((m = document.createElement("span")),
              styleDiv(m),
              (p = document.createElement("span")),
              styleDiv(p),
              m.appendChild(p)),
          this.globalData.fontManager.chars)
        ) {
          var y,
            g = this.globalData.fontManager.getCharData(
              t.t.charAt(o),
              i.fStyle,
              this.globalData.fontManager.getFontByName(t.f).fFamily
            );
          if (
            ((y = g ? g.data : null),
            c.reset(),
            y &&
              y.shapes &&
              ((d = y.shapes[0].it),
              c.scale(t.s / 100, t.s / 100),
              (u = this.createPathShape(c, d)),
              p.setAttribute("d", u)),
            this.isMasked)
          )
            this.innerElem.appendChild(p);
          else {
            this.innerElem.appendChild(m);
            var v = t.s / 100;
            if (y && y.shapes) {
              var b = Math.ceil(y.bounds.r * v),
                P = Math.floor(y.bounds.t * v),
                E = Math.floor(y.bounds.l * v),
                k = Math.ceil(y.bounds.b * v);
              f.setAttribute("width", b - E),
                f.setAttribute("height", k - P),
                f.setAttribute(
                  "viewBox",
                  E + " " + P + " " + (b - E) + " " + (k - P)
                ),
                (f.style.transform = f.style.webkitTransform =
                  "translate(" + E + "px," + P + "px)"),
                (l[o].yOffset = P);
            } else f.setAttribute("width", 1), f.setAttribute("height", 1);
          }
        } else
          (p.textContent = l[o].val),
            p.setAttributeNS(
              "http://www.w3.org/XML/1998/namespace",
              "xml:space",
              "preserve"
            ),
            this.isMasked
              ? this.innerElem.appendChild(p)
              : (this.innerElem.appendChild(m),
                (p.style.transform = p.style.webkitTransform =
                  "translate3d(0," + -t.s / 1.2 + "px,0)"));
        this.textSpans.push(this.isMasked ? p : m), this.textPaths.push(p);
      }
    }),
    (HTextElement.prototype.hide = SVGTextElement.prototype.hide),
    (HTextElement.prototype.renderFrame = function (t) {
      var e = this._parent.renderFrame.call(this, t);
      if (e === !1) return void this.hide();
      if (
        (this.hidden &&
          ((this.hidden = !1), (this.innerElem.style.display = "block")),
        this.data.singleShape)
      ) {
        if (!this.firstFrame) return;
        this.isMasked &&
          this.finalTransform.matMdf &&
          (this.cont.setAttribute(
            "viewBox",
            -this.finalTransform.mProp.p.v[0] +
              " " +
              -this.finalTransform.mProp.p.v[1] +
              " " +
              this.compW +
              " " +
              this.compH
          ),
          (this.cont.style.transform = this.cont.style.webkitTransform =
            "translate(" +
            -this.finalTransform.mProp.p.v[0] +
            "px," +
            -this.finalTransform.mProp.p.v[1] +
            "px)"));
      }
      if ((this.getMeasures(), this.lettersChangedFlag)) {
        var s,
          r,
          i = this.renderedLetters,
          a = this.data.t.d.l;
        r = a.length;
        var n;
        for (s = 0; r > s; s += 1)
          a[s].n ||
            ((n = i[s]),
            this.isMasked
              ? this.textSpans[s].setAttribute("transform", n.m)
              : (this.textSpans[s].style.transform = this.textSpans[
                  s
                ].style.webkitTransform =
                  n.m),
            (this.textSpans[s].style.opacity = n.o),
            n.sw && this.textPaths[s].setAttribute("stroke-width", n.sw),
            n.sc && this.textPaths[s].setAttribute("stroke", n.sc),
            n.fc &&
              (this.textPaths[s].setAttribute("fill", n.fc),
              (this.textPaths[s].style.color = n.fc)));
        if (this.isMasked) {
          var o = this.innerElem.getBBox();
          this.currentBBox.w !== o.width &&
            ((this.currentBBox.w = o.width),
            this.cont.setAttribute("width", o.width)),
            this.currentBBox.h !== o.height &&
              ((this.currentBBox.h = o.height),
              this.cont.setAttribute("height", o.height)),
            (this.currentBBox.w !== o.width ||
              this.currentBBox.h !== o.height ||
              this.currentBBox.x !== o.x ||
              this.currentBBox.y !== o.y) &&
              ((this.currentBBox.w = o.width),
              (this.currentBBox.h = o.height),
              (this.currentBBox.x = o.x),
              (this.currentBBox.y = o.y),
              this.cont.setAttribute(
                "viewBox",
                this.currentBBox.x +
                  " " +
                  this.currentBBox.y +
                  " " +
                  this.currentBBox.w +
                  " " +
                  this.currentBBox.h
              ),
              (this.cont.style.transform = this.cont.style.webkitTransform =
                "translate(" +
                this.currentBBox.x +
                "px," +
                this.currentBBox.y +
                "px)"));
        }
        this.firstFrame && (this.firstFrame = !1);
      }
    }),
    (HTextElement.prototype.destroy = SVGTextElement.prototype.destroy),
    createElement(HBaseElement, HImageElement),
    (HImageElement.prototype.createElements = function () {
      var t,
        e = function () {
          this.imageElem.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "href",
            this.path + this.assetData.p
          );
        },
        s = new Image();
      if (this.data.hasMask) {
        var t = document.createElement("div");
        styleDiv(t);
        var r = document.createElementNS(svgNS, "svg");
        r.setAttribute("width", this.assetData.w),
          r.setAttribute("height", this.assetData.h),
          t.appendChild(r),
          (this.imageElem = document.createElementNS(svgNS, "image")),
          this.imageElem.setAttribute("width", this.assetData.w + "px"),
          this.imageElem.setAttribute("height", this.assetData.h + "px"),
          r.appendChild(this.imageElem),
          (this.layerElement = t),
          this.appendNodeToParent(t),
          (this.innerElem = t),
          (this.maskedElement = this.imageElem),
          s.addEventListener("load", e.bind(this), !1),
          s.addEventListener("error", e.bind(this), !1);
      } else
        styleDiv(s),
          (this.layerElement = s),
          this.appendNodeToParent(s),
          (this.innerElem = s);
      (s.src = this.path + this.assetData.p),
        this.data.ln && this.innerElem.setAttribute("id", this.data.ln);
    }),
    (HImageElement.prototype.hide = HSolidElement.prototype.hide),
    (HImageElement.prototype.renderFrame = HSolidElement.prototype.renderFrame),
    (HImageElement.prototype.destroy = HSolidElement.prototype.destroy),
    createElement(HBaseElement, HCameraElement),
    (HCameraElement.prototype.setup = function () {
      var t,
        e,
        s = this.comp.threeDElements.length;
      for (t = 0; s > t; t += 1)
        (e = this.comp.threeDElements[t]),
          (e[0].style.perspective = e[0].style.webkitPerspective =
            this.pe.v + "px"),
          (e[1].style.transformOrigin =
            e[1].style.mozTransformOrigin =
            e[1].style.webkitTransformOrigin =
              "0px 0px 0px"),
          (e[0].style.transform = e[0].style.webkitTransform =
            "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)");
    }),
    (HCameraElement.prototype.createElements = function () {}),
    (HCameraElement.prototype.hide = function () {}),
    (HCameraElement.prototype.renderFrame = function () {
      var t,
        e,
        s = this.firstFrame;
      if (this.hierarchy)
        for (e = this.hierarchy.length, t = 0; e > t; t += 1)
          s = this.hierarchy[t].finalTransform.mProp.mdf ? !0 : s;
      if (
        s ||
        (this.p && this.p.mdf) ||
        (this.px && (this.px.mdf || this.py.mdf || this.pz.mdf)) ||
        this.rx.mdf ||
        this.ry.mdf ||
        this.rz.mdf ||
        this.or.mdf ||
        (this.a && this.a.mdf)
      ) {
        if (
          (this.mat.reset(),
          this.p
            ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2])
            : this.mat.translate(-this.px.v, -this.py.v, this.pz.v),
          this.a)
        ) {
          var r = [
              this.p.v[0] - this.a.v[0],
              this.p.v[1] - this.a.v[1],
              this.p.v[2] - this.a.v[2],
            ],
            i = Math.sqrt(
              Math.pow(r[0], 2) + Math.pow(r[1], 2) + Math.pow(r[2], 2)
            ),
            a = [r[0] / i, r[1] / i, r[2] / i],
            n = Math.sqrt(a[2] * a[2] + a[0] * a[0]),
            o = Math.atan2(a[1], n),
            h = Math.atan2(a[0], -a[2]);
          this.mat.rotateY(h).rotateX(-o);
        }
        if (
          (this.mat.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v),
          this.mat
            .rotateX(-this.or.v[0])
            .rotateY(-this.or.v[1])
            .rotateZ(this.or.v[2]),
          this.mat.translate(
            this.globalData.compSize.w / 2,
            this.globalData.compSize.h / 2,
            0
          ),
          this.mat.translate(0, 0, this.pe.v),
          this.hierarchy)
        ) {
          var l;
          for (e = this.hierarchy.length, t = 0; e > t; t += 1)
            (l = this.hierarchy[t].finalTransform.mProp.iv.props),
              this.mat.transform(
                l[0],
                l[1],
                l[2],
                l[3],
                l[4],
                l[5],
                l[6],
                l[7],
                l[8],
                l[9],
                l[10],
                l[11],
                -l[12],
                -l[13],
                l[14],
                l[15]
              );
        }
        e = this.comp.threeDElements.length;
        var p;
        for (t = 0; e > t; t += 1)
          (p = this.comp.threeDElements[t]),
            (p[1].style.transform = p[1].style.webkitTransform =
              this.mat.toCSS());
      }
      this.firstFrame = !1;
    }),
    (HCameraElement.prototype.destroy = function () {});
  var animationManager = (function () {
      function t(e) {
        var s = 0,
          r = e.target;
        for (r.removeEventListener("destroy", t); E > s; )
          v[s].animation === r && (v.splice(s, 1), (s -= 1), (E -= 1)),
            (s += 1);
      }
      function e(e, s) {
        if (!e) return null;
        for (var r = 0; E > r; ) {
          if (v[r].elem == e && null !== v[r].elem) return v[r].animation;
          r += 1;
        }
        var i = new AnimationItem();
        return (
          i.setData(e, s),
          i.addEventListener("destroy", t),
          v.push({ elem: e, animation: i }),
          (E += 1),
          i
        );
      }
      function s(e) {
        var s = new AnimationItem();
        return (
          s.setParams(e),
          s.addEventListener("destroy", t),
          v.push({ elem: null, animation: s }),
          (E += 1),
          s
        );
      }
      function r(t, e) {
        var s;
        for (s = 0; E > s; s += 1) v[s].animation.setSpeed(t, e);
      }
      function i(t, e) {
        var s;
        for (s = 0; E > s; s += 1) v[s].animation.setDirection(t, e);
      }
      function a(t) {
        var e;
        for (e = 0; E > e; e += 1) v[e].animation.play(t);
      }
      function n(t, e) {
        (P = !1), (b = Date.now());
        var s;
        for (s = 0; E > s; s += 1) v[s].animation.moveFrame(t, e);
      }
      function o(t) {
        var e,
          s = t - b;
        for (e = 0; E > e; e += 1) v[e].animation.advanceTime(s);
        (b = t), requestAnimationFrame(o);
      }
      function h(t) {
        (b = t), requestAnimationFrame(o);
      }
      function l(t) {
        var e;
        for (e = 0; E > e; e += 1) v[e].animation.pause(t);
      }
      function p(t, e, s) {
        var r;
        for (r = 0; E > r; r += 1) v[r].animation.goToAndStop(t, e, s);
      }
      function m(t) {
        var e;
        for (e = 0; E > e; e += 1) v[e].animation.stop(t);
      }
      function f(t) {
        var e;
        for (e = 0; E > e; e += 1) v[e].animation.togglePause(t);
      }
      function d(t) {
        var e;
        for (e = 0; E > e; e += 1) v[e].animation.destroy(t);
      }
      function c(t, s, r) {
        var i,
          a = document.getElementsByClassName("bodymovin"),
          n = a.length;
        for (i = 0; n > i; i += 1)
          r && a[i].setAttribute("data-bm-type", r), e(a[i], t);
        if (s && 0 === n) {
          r || (r = "svg");
          var o = document.getElementsByTagName("body")[0];
          o.innerHTML = "";
          var h = document.createElement("div");
          (h.style.width = "100%"),
            (h.style.height = "100%"),
            h.setAttribute("data-bm-type", r),
            o.appendChild(h),
            e(h, t);
        }
      }
      function u() {
        var t;
        for (t = 0; E > t; t += 1) v[t].animation.resize();
      }
      function y() {
        requestAnimationFrame(h);
      }
      var g = {},
        v = [],
        b = 0,
        P = !0,
        E = 0;
      return (
        setTimeout(y, 0),
        (g.registerAnimation = e),
        (g.loadAnimation = s),
        (g.setSpeed = r),
        (g.setDirection = i),
        (g.play = a),
        (g.moveFrame = n),
        (g.pause = l),
        (g.stop = m),
        (g.togglePause = f),
        (g.searchAnimations = c),
        (g.resize = u),
        (g.start = y),
        (g.goToAndStop = p),
        (g.destroy = d),
        g
      );
    })(),
    AnimationItem = function () {
      (this._cbs = []),
        (this.name = ""),
        (this.path = ""),
        (this.isLoaded = !1),
        (this.currentFrame = 0),
        (this.currentRawFrame = 0),
        (this.totalFrames = 0),
        (this.frameRate = 0),
        (this.frameMult = 0),
        (this.playSpeed = 1),
        (this.playDirection = 1),
        (this.pendingElements = 0),
        (this.playCount = 0),
        (this.prerenderFramesFlag = !0),
        (this.animationData = {}),
        (this.layers = []),
        (this.assets = []),
        (this.isPaused = !0),
        (this.autoplay = !1),
        (this.loop = !0),
        (this.renderer = null),
        (this.animationID = randomString(10)),
        (this.scaleMode = "fit"),
        (this.timeCompleted = 0),
        (this.segmentPos = 0),
        (this.segments = []),
        (this.pendingSegment = !1);
    };
  (AnimationItem.prototype.setParams = function (t) {
    var e = this;
    t.context && (this.context = t.context),
      (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
    var s = t.animType ? t.animType : t.renderer ? t.renderer : "svg";
    switch (s) {
      case "canvas":
        this.renderer = new CanvasRenderer(this, t.rendererSettings);
        break;
      case "svg":
        this.renderer = new SVGRenderer(this, t.rendererSettings);
        break;
      case "hybrid":
      case "html":
      default:
        this.renderer = new HybridRenderer(this, t.rendererSettings);
    }
    if (
      ((this.animType = s),
      "" === t.loop ||
        null === t.loop ||
        (this.loop =
          t.loop === !1 ? !1 : t.loop === !0 ? !0 : parseInt(t.loop)),
      (this.autoplay = "autoplay" in t ? t.autoplay : !0),
      (this.name = t.name ? t.name : ""),
      (this.prerenderFramesFlag = "prerender" in t ? t.prerender : !0),
      (this.autoloadSegments = t.hasOwnProperty("autoloadSegments")
        ? t.autoloadSegments
        : !0),
      t.animationData)
    )
      e.configAnimation(t.animationData);
    else if (t.path) {
      "json" != t.path.substr(-4) &&
        ("/" != t.path.substr(-1, 1) && (t.path += "/"),
        (t.path += "data.json"));
      var r = new XMLHttpRequest();
      (this.path =
        -1 != t.path.lastIndexOf("\\")
          ? t.path.substr(0, t.path.lastIndexOf("\\") + 1)
          : t.path.substr(0, t.path.lastIndexOf("/") + 1)),
        (this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1)),
        (this.fileName = this.fileName.substr(
          0,
          this.fileName.lastIndexOf(".json")
        )),
        r.open("GET", t.path, !0),
        r.send(),
        (r.onreadystatechange = function () {
          if (4 == r.readyState)
            if (200 == r.status) e.configAnimation(JSON.parse(r.responseText));
            else
              try {
                var t = JSON.parse(r.responseText);
                e.configAnimation(t);
              } catch (s) {}
        });
    }
  }),
    (AnimationItem.prototype.setData = function (t, e) {
      var s = {
          wrapper: t,
          animationData: e ? ("object" == typeof e ? e : JSON.parse(e)) : null,
        },
        r = t.attributes;
      (s.path = r.getNamedItem("data-animation-path")
        ? r.getNamedItem("data-animation-path").value
        : r.getNamedItem("data-bm-path")
        ? r.getNamedItem("data-bm-path").value
        : r.getNamedItem("bm-path")
        ? r.getNamedItem("bm-path").value
        : ""),
        (s.animType = r.getNamedItem("data-anim-type")
          ? r.getNamedItem("data-anim-type").value
          : r.getNamedItem("data-bm-type")
          ? r.getNamedItem("data-bm-type").value
          : r.getNamedItem("bm-type")
          ? r.getNamedItem("bm-type").value
          : r.getNamedItem("data-bm-renderer")
          ? r.getNamedItem("data-bm-renderer").value
          : r.getNamedItem("bm-renderer")
          ? r.getNamedItem("bm-renderer").value
          : "canvas");
      var i = r.getNamedItem("data-anim-loop")
        ? r.getNamedItem("data-anim-loop").value
        : r.getNamedItem("data-bm-loop")
        ? r.getNamedItem("data-bm-loop").value
        : r.getNamedItem("bm-loop")
        ? r.getNamedItem("bm-loop").value
        : "";
      "" === i ||
        (s.loop = "false" === i ? !1 : "true" === i ? !0 : parseInt(i));
      var a = r.getNamedItem("data-anim-autoplay")
        ? r.getNamedItem("data-anim-autoplay").value
        : r.getNamedItem("data-bm-autoplay")
        ? r.getNamedItem("data-bm-autoplay").value
        : r.getNamedItem("bm-autoplay")
        ? r.getNamedItem("bm-autoplay").value
        : !0;
      (s.autoplay = "false" !== a),
        (s.name = r.getNamedItem("data-name")
          ? r.getNamedItem("data-name").value
          : r.getNamedItem("data-bm-name")
          ? r.getNamedItem("data-bm-name").value
          : r.getNamedItem("bm-name")
          ? r.getNamedItem("bm-name").value
          : "");

      var n = r.getNamedItem("data-anim-prerender")
        ? r.getNamedItem("data-anim-prerender").value
        : r.getNamedItem("data-bm-prerender")
        ? r.getNamedItem("data-bm-prerender").value
        : r.getNamedItem("bm-prerender")
        ? r.getNamedItem("bm-prerender").value
        : "";
      "false" === n && (s.prerender = !1), this.setParams(s);
    }),
    (AnimationItem.prototype.includeLayers = function (t) {
      t.op > this.animationData.op &&
        ((this.animationData.op = t.op),
        (this.totalFrames = Math.floor(t.op - this.animationData.ip)),
        (this.animationData.tf = this.totalFrames));
      var e,
        s,
        r = this.animationData.layers,
        i = r.length,
        a = t.layers,
        n = a.length;
      for (s = 0; n > s; s += 1)
        for (e = 0; i > e; ) {
          if (r[e].id == a[s].id) {
            r[e] = a[s];
            break;
          }
          e += 1;
        }
      if (
        ((t.chars || t.fonts) &&
          (this.renderer.globalData.fontManager.addChars(t.chars),
          this.renderer.globalData.fontManager.addFonts(
            t.fonts,
            this.renderer.globalData.defs
          )),
        t.assets)
      )
        for (i = t.assets.length, e = 0; i > e; e += 1)
          this.animationData.assets.push(t.assets[e]);
      dataManager.completeData(
        this.animationData,
        this.renderer.globalData.fontManager
      ),
        this.renderer.includeLayers(t.layers),
        this.renderer.buildStage(this.container, this.layers),
        expressionsPlugin && expressionsPlugin.initExpressions(this),
        this.renderer.renderFrame(null),
        this.loadNextSegment();
    }),
    (AnimationItem.prototype.loadNextSegment = function () {
      var t = this.animationData.segments;
      if (!t || 0 === t.length || !this.autoloadSegments)
        return (
          this.trigger("data_ready"),
          void (this.timeCompleted = this.animationData.tf)
        );
      var e = t.shift();
      this.timeCompleted = e.time * this.frameRate;
      var s = new XMLHttpRequest(),
        r = this,
        i = this.path + this.fileName + "_" + this.segmentPos + ".json";
      (this.segmentPos += 1),
        s.open("GET", i, !0),
        s.send(),
        (s.onreadystatechange = function () {
          if (4 == s.readyState)
            if (200 == s.status) r.includeLayers(JSON.parse(s.responseText));
            else
              try {
                var t = JSON.parse(s.responseText);
                r.includeLayers(t);
              } catch (e) {}
        });
    }),
    (AnimationItem.prototype.loadSegments = function () {
      var t = this.animationData.segments;
      t || (this.timeCompleted = this.animationData.tf), this.loadNextSegment();
    }),
    (AnimationItem.prototype.configAnimation = function (t) {
      (this.animationData = t),
        (this.totalFrames = Math.floor(
          this.animationData.op - this.animationData.ip
        )),
        (this.animationData.tf = this.totalFrames),
        this.renderer.configAnimation(t),
        t.assets || (t.assets = []),
        t.comps && ((t.assets = t.assets.concat(t.comps)), (t.comps = null)),
        (this.layers = this.animationData.layers),
        (this.assets = this.animationData.assets),
        (this.frameRate = this.animationData.fr),
        (this.firstFrame = Math.round(this.animationData.ip)),
        (this.frameMult = this.animationData.fr / 1e3),
        this.trigger("config_ready"),
        this.loadSegments(),
        this.updaFrameModifier(),
        this.renderer.globalData.fontManager
          ? this.waitForFontsLoaded()
          : (dataManager.completeData(
              this.animationData,
              this.renderer.globalData.fontManager
            ),
            this.checkLoaded());
    }),
    (AnimationItem.prototype.waitForFontsLoaded = (function () {
      function t() {
        this.renderer.globalData.fontManager.loaded
          ? (dataManager.completeData(
              this.animationData,
              this.renderer.globalData.fontManager
            ),
            this.renderer.buildItems(this.animationData.layers),
            this.checkLoaded())
          : setTimeout(t.bind(this), 20);
      }
      return function () {
        t.bind(this)();
      };
    })()),
    (AnimationItem.prototype.addPendingElement = function () {
      this.pendingElements += 1;
    }),
    (AnimationItem.prototype.elementLoaded = function () {
      this.pendingElements--, this.checkLoaded();
    }),
    (AnimationItem.prototype.checkLoaded = function () {
      0 === this.pendingElements &&
        (this.renderer.buildStage(this.container, this.layers),
        expressionsPlugin && expressionsPlugin.initExpressions(this),
        this.trigger("DOMLoaded"),
        (this.isLoaded = !0),
        this.gotoFrame(),
        this.autoplay && this.play());
    }),
    (AnimationItem.prototype.resize = function () {
      this.renderer.updateContainerSize();
    }),
    (AnimationItem.prototype.gotoFrame = function () {
      (this.currentFrame = subframeEnabled
        ? this.currentRawFrame
        : Math.floor(this.currentRawFrame)),
        this.timeCompleted !== this.totalFrames &&
          this.currentFrame > this.timeCompleted &&
          (this.currentFrame = this.timeCompleted),
        this.trigger("enterFrame"),
        this.renderFrame();
    }),
    (AnimationItem.prototype.renderFrame = function () {
      this.isLoaded !== !1 &&
        this.renderer.renderFrame(this.currentFrame + this.firstFrame);
    }),
    (AnimationItem.prototype.play = function (t) {
      (t && this.name != t) || (this.isPaused === !0 && (this.isPaused = !1));
    }),
    (AnimationItem.prototype.pause = function (t) {
      (t && this.name != t) || (this.isPaused === !1 && (this.isPaused = !0));
    }),
    (AnimationItem.prototype.togglePause = function (t) {
      (t && this.name != t) ||
        (this.isPaused === !0
          ? ((this.isPaused = !1), this.play())
          : ((this.isPaused = !0), this.pause()));
    }),
    (AnimationItem.prototype.stop = function (t) {
      (t && this.name != t) ||
        ((this.isPaused = !0),
        (this.currentFrame = this.currentRawFrame = 0),
        (this.playCount = 0),
        this.gotoFrame());
    }),
    (AnimationItem.prototype.goToAndStop = function (t, e, s) {
      (s && this.name != s) ||
        (this.setCurrentRawFrameValue(e ? t : t * this.frameModifier),
        (this.isPaused = !0));
    }),
    (AnimationItem.prototype.goToAndPlay = function (t, e, s) {
      this.goToAndStop(t, e, s), this.play();
    }),
    (AnimationItem.prototype.advanceTime = function (t) {
      return this.pendingSegment
        ? ((this.pendingSegment = !1),
          this.adjustSegment(this.segments.shift()),
          void (this.isPaused && this.play()))
        : void (
            this.isPaused !== !0 &&
            this.isLoaded !== !1 &&
            this.setCurrentRawFrameValue(
              this.currentRawFrame + t * this.frameModifier
            )
          );
    }),
    (AnimationItem.prototype.updateAnimation = function (t) {
      this.setCurrentRawFrameValue(this.totalFrames * t);
    }),
    (AnimationItem.prototype.moveFrame = function (t, e) {
      (e && this.name != e) ||
        this.setCurrentRawFrameValue(this.currentRawFrame + t);
    }),
    (AnimationItem.prototype.adjustSegment = function (t) {
      (this.playCount = 0),
        t[1] < t[0]
          ? (this.frameModifier > 0 &&
              (this.playSpeed < 0
                ? this.setSpeed(-this.playSpeed)
                : this.setDirection(-1)),
            (this.totalFrames = t[0] - t[1]),
            (this.firstFrame = t[1]),
            this.setCurrentRawFrameValue(this.totalFrames - 0.01))
          : t[1] > t[0] &&
            (this.frameModifier < 0 &&
              (this.playSpeed < 0
                ? this.setSpeed(-this.playSpeed)
                : this.setDirection(1)),
            (this.totalFrames = t[1] - t[0]),
            (this.firstFrame = t[0]),
            this.setCurrentRawFrameValue(0)),
        this.trigger("segmentStart");
    }),
    (AnimationItem.prototype.setSegment = function (t, e) {
      var s = -1;
      this.isPaused &&
        (this.currentRawFrame + this.firstFrame < t
          ? (s = t)
          : this.currentRawFrame + this.firstFrame > e && (s = e - t - 0.01)),
        (this.firstFrame = t),
        (this.totalFrames = e - t),
        -1 !== s && this.goToAndStop(s, !0);
    }),
    (AnimationItem.prototype.playSegments = function (t, e) {
      if ("object" == typeof t[0]) {
        var s,
          r = t.length;
        for (s = 0; r > s; s += 1) this.segments.push(t[s]);
      } else this.segments.push(t);
      e && this.adjustSegment(this.segments.shift()),
        this.isPaused && this.play();
    }),
    (AnimationItem.prototype.resetSegments = function (t) {
      (this.segments.length = 0),
        this.segments.push([
          this.animationData.ip * this.frameRate,
          Math.floor(
            this.animationData.op -
              this.animationData.ip +
              this.animationData.ip * this.frameRate
          ),
        ]),
        t && this.adjustSegment(this.segments.shift());
    }),
    (AnimationItem.prototype.checkSegments = function () {
      this.segments.length && (this.pendingSegment = !0);
    }),
    (AnimationItem.prototype.remove = function (t) {
      (t && this.name != t) || this.renderer.destroy();
    }),
    (AnimationItem.prototype.destroy = function (t) {
      (t && this.name != t) ||
        (this.renderer && this.renderer.destroyed) ||
        (this.renderer.destroy(), this.trigger("destroy"), (this._cbs = null));
    }),
    (AnimationItem.prototype.setCurrentRawFrameValue = function (t) {
      if (
        ((this.currentRawFrame = t), this.currentRawFrame >= this.totalFrames)
      ) {
        if ((this.checkSegments(), this.loop === !1))
          return (
            (this.currentRawFrame = this.totalFrames - 0.01),
            this.gotoFrame(),
            this.pause(),
            void this.trigger("complete")
          );
        if (
          (this.trigger("loopComplete"),
          (this.playCount += 1),
          (this.loop !== !0 && this.playCount == this.loop) ||
            this.pendingSegment)
        )
          return (
            (this.currentRawFrame = this.totalFrames - 0.01),
            this.gotoFrame(),
            this.pause(),
            void this.trigger("complete")
          );
        this.currentRawFrame = this.currentRawFrame % this.totalFrames;
      } else if (this.currentRawFrame < 0)
        return (
          this.checkSegments(),
          (this.playCount -= 1),
          this.playCount < 0 && (this.playCount = 0),
          this.loop === !1 || this.pendingSegment
            ? ((this.currentRawFrame = 0),
              this.gotoFrame(),
              this.pause(),
              void this.trigger("complete"))
            : (this.trigger("loopComplete"),
              (this.currentRawFrame =
                (this.totalFrames + this.currentRawFrame) % this.totalFrames),
              void this.gotoFrame())
        );
      this.gotoFrame();
    }),
    (AnimationItem.prototype.setSpeed = function (t) {
      (this.playSpeed = t), this.updaFrameModifier();
    }),
    (AnimationItem.prototype.setDirection = function (t) {
      (this.playDirection = 0 > t ? -1 : 1), this.updaFrameModifier();
    }),
    (AnimationItem.prototype.updaFrameModifier = function () {
      this.frameModifier = this.frameMult * this.playSpeed * this.playDirection;
    }),
    (AnimationItem.prototype.getPath = function () {
      return this.path;
    }),
    (AnimationItem.prototype.getAssetData = function (t) {
      for (var e = 0, s = this.assets.length; s > e; ) {
        if (t == this.assets[e].id) return this.assets[e];
        e += 1;
      }
    }),
    (AnimationItem.prototype.hide = function () {
      this.renderer.hide();
    }),
    (AnimationItem.prototype.show = function () {
      this.renderer.show();
    }),
    (AnimationItem.prototype.getAssets = function () {
      return this.assets;
    }),
    (AnimationItem.prototype.trigger = function (t) {
      if (this._cbs[t])
        switch (t) {
          case "enterFrame":
            this.triggerEvent(
              t,
              new BMEnterFrameEvent(
                t,
                this.currentFrame,
                this.totalFrames,
                this.frameMult
              )
            );
            break;
          case "loopComplete":
            this.triggerEvent(
              t,
              new BMCompleteLoopEvent(
                t,
                this.loop,
                this.playCount,
                this.frameMult
              )
            );
            break;
          case "complete":
            this.triggerEvent(t, new BMCompleteEvent(t, this.frameMult));
            break;
          case "segmentStart":
            this.triggerEvent(
              t,
              new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames)
            );
            break;
          case "destroy":
            this.triggerEvent(t, new BMDestroyEvent(t, this));
            break;
          default:
            this.triggerEvent(t);
        }
      "enterFrame" === t &&
        this.onEnterFrame &&
        this.onEnterFrame.call(
          this,
          new BMEnterFrameEvent(
            t,
            this.currentFrame,
            this.totalFrames,
            this.frameMult
          )
        ),
        "loopComplete" === t &&
          this.onLoopComplete &&
          this.onLoopComplete.call(
            this,
            new BMCompleteLoopEvent(
              t,
              this.loop,
              this.playCount,
              this.frameMult
            )
          ),
        "complete" === t &&
          this.onComplete &&
          this.onComplete.call(this, new BMCompleteEvent(t, this.frameMult)),
        "segmentStart" === t &&
          this.onSegmentStart &&
          this.onSegmentStart.call(
            this,
            new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames)
          ),
        "destroy" === t &&
          this.onDestroy &&
          this.onDestroy.call(this, new BMDestroyEvent(t, this));
    }),
    (AnimationItem.prototype.addEventListener = _addEventListener),
    (AnimationItem.prototype.removeEventListener = _removeEventListener),
    (AnimationItem.prototype.triggerEvent = _triggerEvent);
  var Expressions = (function () {
    function t(e) {
      var s,
        r = e.length;
      for (s = 0; r > s; s += 1)
        e[s].layerInterface ||
          ((e[s].layerInterface = LayerExpressionInterface(e[s])),
          e[s].data.hasMask &&
            e[s].layerInterface.registerMaskInterface(e[s].maskManager),
          0 === e[s].data.ty
            ? (e[s].compInterface = CompExpressionInterface(e[s]))
            : 4 === e[s].data.ty &&
              (e[s].layerInterface.shapeInterface =
                ShapeExpressionInterface.createShapeInterface(
                  e[s].shapesData,
                  e[s].viewData,
                  e[s].layerInterface
                ))),
          0 === e[s].data.ty && t(e[s].elements);
    }
    function e(e) {
      (e.renderer.compInterface = CompExpressionInterface(e.renderer)),
        t(e.renderer.elements);
    }
    function s(t, e, s) {
      return new EffectsManager(t, e, s);
    }
    var r = {};
    return (r.initExpressions = e), (r.getEffectsManager = s), r;
  })();
  (expressionsPlugin = Expressions),
    (function () {
      function t() {
        return this.pv;
      }
      function e(t) {
        for (
          var e,
            s,
            r = 0,
            i = this.keyframes.length - 1,
            a = 1,
            n = !0,
            o = 0,
            h = "object" == typeof this.pv ? [this.pv.length] : 0;
          n;

        ) {
          if (
            ((e = this.keyframes[r]),
            (s = this.keyframes[r + 1]),
            r == i - 1 && t >= s.t - o)
          ) {
            e.h && (e = s);
            break;
          }
          if (s.t - o > t) break;
          i - 1 > r ? (r += a) : (n = !1);
        }
        var l,
          p,
          m,
          f,
          d,
          c = 0;
        if (e.to) {
          e.bezierData || bez.buildBezierData(e);
          var u = e.bezierData;
          if (t >= s.t - o || t < e.t - o) {
            var y = t >= s.t - o ? u.points.length - 1 : 0;
            for (p = u.points[y].point.length, l = 0; p > l; l += 1)
              h[l] = u.points[y].point[l];
          } else {
            e.__fnct
              ? (d = e.__fnct)
              : ((d = BezierFactory.getBezierEasing(
                  e.o.x,
                  e.o.y,
                  e.i.x,
                  e.i.y,
                  e.n
                ).get),
                (e.__fnct = d)),
              (m = d((t - (e.t - o)) / (s.t - o - (e.t - o))));
            var g,
              v = u.segmentLength * m,
              b = 0;
            for (a = 1, n = !0, f = u.points.length; n; ) {
              if (
                ((b += u.points[c].partialLength * a),
                0 === v || 0 === m || c == u.points.length - 1)
              ) {
                for (p = u.points[c].point.length, l = 0; p > l; l += 1)
                  h[l] = u.points[c].point[l];
                break;
              }
              if (v >= b && v < b + u.points[c + 1].partialLength) {
                for (
                  g = (v - b) / u.points[c + 1].partialLength,
                    p = u.points[c].point.length,
                    l = 0;
                  p > l;
                  l += 1
                )
                  h[l] =
                    u.points[c].point[l] +
                    (u.points[c + 1].point[l] - u.points[c].point[l]) * g;
                break;
              }
              (f - 1 > c && 1 == a) || (c > 0 && -1 == a) ? (c += a) : (n = !1);
            }
          }
        } else {
          var P,
            E,
            k,
            S,
            x,
            M = !1;
          for (i = e.s.length, r = 0; i > r; r += 1) {
            if (
              (1 !== e.h &&
                (e.o.x instanceof Array
                  ? ((M = !0),
                    e.__fnct || (e.__fnct = []),
                    e.__fnct[r] ||
                      ((P = e.o.x[r] || e.o.x[0]),
                      (E = e.o.y[r] || e.o.y[0]),
                      (k = e.i.x[r] || e.i.x[0]),
                      (S = e.i.y[r] || e.i.y[0])))
                  : ((M = !1),
                    e.__fnct ||
                      ((P = e.o.x), (E = e.o.y), (k = e.i.x), (S = e.i.y))),
                M
                  ? e.__fnct[r]
                    ? (d = e.__fnct[r])
                    : ((d = BezierFactory.getBezierEasing(P, E, k, S).get),
                      (e.__fnct[r] = d))
                  : e.__fnct
                  ? (d = e.__fnct)
                  : ((d = BezierFactory.getBezierEasing(P, E, k, S).get),
                    (e.__fnct = d)),
                (m =
                  t >= s.t - o
                    ? 1
                    : t < e.t - o
                    ? 0
                    : d((t - (e.t - o)) / (s.t - o - (e.t - o))))),
              this.sh && 1 !== e.h)
            ) {
              var C = e.s[r],
                D = e.e[r];
              -180 > C - D ? (C += 360) : C - D > 180 && (C -= 360),
                (x = C + (D - C) * m);
            } else x = 1 === e.h ? e.s[r] : e.s[r] + (e.e[r] - e.s[r]) * m;
            1 === i ? (h = x) : (h[r] = x);
          }
        }
        return h;
      }
      function s(t) {
        if (void 0 !== this.vel) return this.vel;
        var e = 0.01;
        t *= this.elem.globalData.frameRate;
        var s,
          r = this.getValueAtTime(t),
          i = this.getValueAtTime(t + e);
        if (r.length) {
          s = Array.apply(null, { length: r.length });
          var a;
          for (a = 0; a < r.length; a += 1)
            s[a] = this.elem.globalData.frameRate * ((i[a] - r[a]) / e);
        } else s = (i - r) / e;
        return s;
      }
      function r(t) {
        this.propertyGroup = t;
      }
      function i(t, e, s) {
        e.x &&
          ((s.k = !0),
          (s.x = !0),
          s.getValue && (s.getPreValue = s.getValue),
          (s.getValue = ExpressionManager.initiateExpression.bind(s)(t, e, s)));
      }
      var a = (function () {
          function t(t, e) {
            return (
              (this.textIndex = t + 1),
              (this.textTotal = e),
              this.getValue(),
              this.v
            );
          }
          return function (e, s) {
            (this.pv = 1),
              (this.comp = e.comp),
              (this.mult = 0.01),
              (this.type = "textSelector"),
              (this.textTotal = s.totalChars),
              (this.selectorValue = 100),
              (this.lastValue = [1, 1, 1]),
              i.bind(this)(e, s, this),
              (this.getMult = t);
          };
        })(),
        n = PropertyFactory.getProp;
      PropertyFactory.getProp = function (a, o, h, l, p) {
        var m = n(a, o, h, l, p);
        (m.getVelocityAtTime = s),
          (m.getValueAtTime = m.kf ? e : t),
          (m.setGroupProperty = r);
        var f = m.k;
        return (
          void 0 !== o.ix &&
            Object.defineProperty(m, "propertyIndex", {
              get: function () {
                return o.ix;
              },
            }),
          i(a, o, m),
          !f && m.x && p.push(m),
          m
        );
      };
      var o = ShapePropertyFactory.getShapeProp;
      ShapePropertyFactory.getShapeProp = function (t, e, s, i, a) {
        var n = o(t, e, s, i, a),
          h = "tm" === n.ty ? n.prop : n;
        return (
          (h.setGroupProperty = r),
          void 0 !== e.ix &&
            Object.defineProperty(h, "propertyIndex", {
              get: function () {
                return e.ix;
              },
            }),
          n
        );
      };
      var h = PropertyFactory.getTextSelectorProp;
      PropertyFactory.getTextSelectorProp = function (t, e, s) {
        return 1 === e.t ? new a(t, e, s) : h(t, e, s);
      };
    })();
  var ExpressionManager = (function () {
      function duplicatePropertyValue(t) {
        if ("number" == typeof t) return t;
        if (t.i) return JSON.parse(JSON.stringify(t));
        var e,
          s = Array.apply(null, { length: t.length }),
          r = t.length;
        for (e = 0; r > e; e += 1) s[e] = t[e];
        return s;
      }
      function sum(t, e) {
        var s = typeof t,
          r = typeof e;
        if ("string" === s || "string" === r) return t + e;
        if (
          !(
            ("number" !== s && "boolean" !== s) ||
            ("number" !== r && "boolean" !== r)
          )
        )
          return t + e;
        if ("object" === s && ("number" === r || "boolean" === r))
          return (t[0] = t[0] + e), t;
        if (("number" === s || "boolean" === s) && "object" === r)
          return (e[0] = t + e[0]), e;
        if ("object" === s && "object" === r) {
          for (var i = 0, a = t.length, n = e.length, o = []; a > i || n > i; )
            (o[i] =
              "number" == typeof t[i] && "number" == typeof e[i]
                ? t[i] + e[i]
                : t[i] || e[i]),
              (i += 1);
          return o;
        }
        return 0;
      }
      function sub(t, e) {
        var s = typeof t,
          r = typeof e;
        if (
          !(
            ("number" !== s && "boolean" !== s) ||
            ("number" !== r && "boolean" !== r)
          )
        )
          return t - e;
        if ("object" === s && ("number" === r || "boolean" === r))
          return (t[0] = t[0] - e), t;
        if (("number" === s || "boolean" === s) && "object" === r)
          return (e[0] = t - e[0]), e;
        if ("object" === s && "object" === r) {
          for (var i = 0, a = t.length, n = e.length, o = []; a > i || n > i; )
            (o[i] =
              "number" == typeof t[i] && "number" == typeof e[i]
                ? t[i] - e[i]
                : t[i] || e[i]),
              (i += 1);
          return o;
        }
        return 0;
      }
      function mul(t, e) {
        var s = typeof t,
          r = typeof e;
        if (
          !(
            ("number" !== s && "boolean" !== s) ||
            ("number" !== r && "boolean" !== r)
          )
        )
          return t * e;
        var i, a;
        if ("object" === s && ("number" === r || "boolean" === r)) {
          for (
            a = t.length, arr = Array.apply(null, { length: a }), i = 0;
            a > i;
            i += 1
          )
            arr[i] = t[i] * e;
          return arr;
        }
        if (("number" === s || "boolean" === s) && "object" === r) {
          for (
            a = e.length, arr = Array.apply(null, { length: a }), i = 0;
            a > i;
            i += 1
          )
            arr[i] = t * e[i];
          return arr;
        }
        return 0;
      }
      function div(t, e) {
        var s = typeof t,
          r = typeof e;
        if (
          !(
            ("number" !== s && "boolean" !== s) ||
            ("number" !== r && "boolean" !== r)
          )
        )
          return t / e;
        var i, a;
        if ("object" === s && ("number" === r || "boolean" === r)) {
          for (
            a = t.length, arr = Array.apply(null, { length: a }), i = 0;
            a > i;
            i += 1
          )
            arr[i] = t[i] / e;
          return arr;
        }
        if (("number" === s || "boolean" === s) && "object" === r) {
          for (
            a = e.length, arr = Array.apply(null, { length: a }), i = 0;
            a > i;
            i += 1
          )
            arr[i] = t / e[i];
          return arr;
        }
        return 0;
      }
      function clamp(t, e, s) {
        if (e > s) {
          var r = s;
          (s = e), (e = r);
        }
        return Math.min(Math.max(t, e), s);
      }
      function radiansToDegrees(t) {
        return t / degToRads;
      }
      function length(t, e) {
        e || (e = helperLengthArray);
        var s,
          r = Math.min(t.length, e.length),
          i = 0;
        for (s = 0; r > s; s += 1) i += Math.pow(e[s] - t[s], 2);
        return Math.sqrt(i);
      }
      function rgbToHsl(t) {
        var e,
          s,
          r = t[0],
          i = t[1],
          a = t[2],
          n = Math.max(r, i, a),
          o = Math.min(r, i, a),
          h = (n + o) / 2;
        if (n == o) e = s = 0;
        else {
          var l = n - o;
          switch (((s = h > 0.5 ? l / (2 - n - o) : l / (n + o)), n)) {
            case r:
              e = (i - a) / l + (a > i ? 6 : 0);
              break;
            case i:
              e = (a - r) / l + 2;
              break;
            case a:
              e = (r - i) / l + 4;
          }
          e /= 6;
        }
        return [e, s, h, t[3]];
      }
      function hslToRgb(t) {
        function e(t, e, s) {
          return (
            0 > s && (s += 1),
            s > 1 && (s -= 1),
            1 / 6 > s
              ? t + 6 * (e - t) * s
              : 0.5 > s
              ? e
              : 2 / 3 > s
              ? t + (e - t) * (2 / 3 - s) * 6
              : t
          );
        }
        var s,
          r,
          i,
          a = t[0],
          n = t[1],
          o = t[2];
        if (0 == n) s = r = i = o;
        else {
          var h = 0.5 > o ? o * (1 + n) : o + n - o * n,
            l = 2 * o - h;
          (s = e(l, h, a + 1 / 3)), (r = e(l, h, a)), (i = e(l, h, a - 1 / 3));
        }
        return [s, r, i, t[3]];
      }
      function linear(t, e, s, r, i) {
        if (void 0 === r || void 0 === i) return linear(t, 0, 1, e, s);
        if (e >= t) return r;
        if (t >= s) return i;
        var a = t / (s - e);
        if (!r.length) return r + (i - r) * a;
        var n,
          o = r.length,
          h = Array.apply(null, { length: o });
        for (n = 0; o > n; n += 1) h[n] = r[n] + (i[n] - r[n]) * a;
        return h;
      }
      function seedRandom(t) {
        BMMath.seedrandom(t);
      }
      function random(t, e) {
        if (
          (void 0 === e &&
            (void 0 === t ? ((t = 0), (e = 1)) : ((e = t), (t = void 0))),
          e.length)
        ) {
          var s,
            r = e.length;
          t || (t = Array.apply(null, { length: r }));
          var i = Array.apply(null, { length: r }),
            a = BMMath.random();
          for (s = 0; r > s; s += 1) i[s] = t[s] + a * (e[s] - t[s]);
          return i;
        }
        void 0 === t && (t = 0);
        var n = BMMath.random();
        return t + n * (e - t);
      }
      function initiateExpression(elem, data, property) {
        function effect(t) {
          return elem.effectsManager(t);
        }
        function lookAt(t, e) {
          var s = [e[0] - t[0], e[1] - t[1], e[2] - t[2]],
            r =
              Math.atan2(s[0], Math.sqrt(s[1] * s[1] + s[2] * s[2])) /
              degToRads,
            i = -Math.atan2(s[1], s[2]) / degToRads;
          return [i, r, 0];
        }
        function easeOut(t, e, s) {
          return -(s - e) * t * (t - 2) + e;
        }
        function nearestKey(t) {
          var e,
            s,
            r,
            i = data.k.length;
          if (data.k.length && "number" != typeof data.k[0]) {
            for (
              s = -1, t *= elem.comp.globalData.frameRate, e = 0;
              i - 1 > e;
              e += 1
            ) {
              if (t === data.k[e].t) {
                (s = e + 1), (r = data.k[e].t);
                break;
              }
              if (t > data.k[e].t && t < data.k[e + 1].t) {
                t - data.k[e].t > data.k[e + 1].t - t
                  ? ((s = e + 2), (r = data.k[e + 1].t))
                  : ((s = e + 1), (r = data.k[e].t));
                break;
              }
            }
            -1 === s && ((s = e + 1), (r = data.k[e].t));
          } else (s = 0), (r = 0);
          var a = {};
          return (
            (a.index = s), (a.time = r / elem.comp.globalData.frameRate), a
          );
        }
        function key(t) {
          if (!data.k.length || "number" == typeof data.k[0])
            return { time: 0 };
          t -= 1;
          var e,
            s = { time: data.k[t].t / elem.comp.globalData.frameRate };
          e = t === data.k.length - 1 ? data.k[t - 1].e : data.k[t].s;
          var r,
            i = e.length;
          for (r = 0; i > r; r += 1) s[r] = e[r];
          return s;
        }
        function framesToTime(t, e) {
          return e || (e = elem.comp.globalData.frameRate), t / e;
        }
        function timeToFrames(t, e) {
          return (
            t || (t = time), e || (e = elem.comp.globalData.frameRate), t * e
          );
        }
        function execute() {
          if (
            this.frameExpressionId !== elem.globalData.frameId ||
            "textSelector" === this.type
          ) {
            if (this.lock)
              return (this.v = duplicatePropertyValue(this.pv)), !0;
            "textSelector" === this.type &&
              ((textIndex = this.textIndex),
              (textTotal = this.textTotal),
              (selectorValue = this.selectorValue)),
              transform || (transform = elem.transform),
              thisLayer ||
                ((thisLayer = elem.layerInterface),
                (thisComp = elem.comp.compInterface)),
              4 !== elemType ||
                content ||
                (content = thisLayer("ADBE Root Vectors Group")),
              (this.lock = !0),
              this.getPreValue && this.getPreValue(),
              (value = this.pv),
              (time = this.comp.renderedFrame / this.comp.globalData.frameRate),
              (velocity = velocityAtTime(time)),
              bindedFn(),
              "object" == typeof this.v && isNaN(this.v[0]),
              (this.frameExpressionId = elem.globalData.frameId);
            var t, e;
            if (this.mult)
              if ("number" == typeof this.v) this.v *= this.mult;
              else
                for (
                  e = this.v.length,
                    value === this.v &&
                      (this.v =
                        2 === e
                          ? [value[0], value[1]]
                          : [value[0], value[1], value[2]]),
                    t = 0;
                  e > t;
                  t += 1
                )
                  this.v[t] *= this.mult;
            if ("number" == typeof this.v)
              this.lastValue !== this.v &&
                ((this.lastValue = this.v), (this.mdf = !0));
            else if (this.v.i) this.mdf = !0;
            else
              for (e = this.v.length, t = 0; e > t; t += 1)
                this.v[t] !== this.lastValue[t] &&
                  ((this.lastValue[t] = this.v[t]), (this.mdf = !0));
            this.lock = !1;
          }
        }
        var val = data.x,
          elemType = elem.data.ty,
          transform,
          content,
          effect,
          thisComp = elem.comp,
          thisProperty = property;
        elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate;
        var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
          outPoint = elem.data.op / elem.comp.globalData.frameRate,
          thisLayer,
          thisComp,
          fnStr = "var fn = function(){" + val + ";this.v = $bm_rt;}";
        eval(fnStr);
        var bindedFn = fn.bind(this),
          numKeys = data.k ? data.k.length : 0,
          wiggle = function (t, e) {
            var s,
              r,
              i = this.pv.length ? this.pv.length : 1,
              a = Array.apply(null, { len: i });
            for (r = 0; i > r; r += 1) a[r] = 0;
            t = 5;
            var n = Math.floor(time * t);
            for (s = 0, r = 0; n > s; ) {
              for (r = 0; i > r; r += 1) a[r] += -e + 2 * e * BMMath.random();
              s += 1;
            }
            var o = time * t,
              h = o - Math.floor(o),
              l = Array.apply({ length: i });
            for (r = 0; i > r; r += 1)
              l[r] = this.pv[r] + a[r] + (-e + 2 * e * BMMath.random()) * h;
            return l;
          }.bind(this),
          loopIn = function (t, e, s) {
            if (!this.k) return this.pv;
            var r = time * elem.comp.globalData.frameRate,
              i = this.keyframes,
              a = i[0].t;
            if (r >= a) return this.pv;
            var n, o;
            s
              ? ((n = e
                  ? Math.abs(elem.comp.globalData.frameRate * e)
                  : Math.max(0, this.elem.data.op - a)),
                (o = a + n))
              : ((!e || e > i.length - 1) && (e = i.length - 1),
                (o = i[e].t),
                (n = o - a));
            var h, l, p;
            if ("pingpong" === t) {
              var m = Math.floor((a - r) / n);
              if (m % 2 === 0) return this.getValueAtTime(((a - r) % n) + a);
            } else {
              if ("offset" === t) {
                var f = this.getValueAtTime(a),
                  d = this.getValueAtTime(o),
                  c = this.getValueAtTime(n - ((a - r) % n) + a),
                  u = Math.floor((a - r) / n) + 1;
                if (this.pv.length) {
                  for (
                    p = new Array(f.length), l = p.length, h = 0;
                    l > h;
                    h += 1
                  )
                    p[h] = c[h] - (d[h] - f[h]) * u;
                  return p;
                }
                return c - (d - f) * u;
              }
              if ("continue" === t) {
                var y = this.getValueAtTime(a),
                  g = this.getValueAtTime(a + 0.001);
                if (this.pv.length) {
                  for (
                    p = new Array(y.length), l = p.length, h = 0;
                    l > h;
                    h += 1
                  )
                    p[h] = y[h] + ((y[h] - g[h]) * (a - r)) / 5e-4;
                  return p;
                }
                return y + ((y - g) * (a - r)) / 5e-4;
              }
            }
            return this.getValueAtTime(n - ((a - r) % n) + a);
          }.bind(this),
          loopInDuration = function (t, e) {
            return loopIn(t, e, !0);
          }.bind(this),
          loopOut = function (t, e, s) {
            if (!this.k) return this.pv;
            var r = time * elem.comp.globalData.frameRate,
              i = this.keyframes,
              a = i[i.length - 1].t;
            if (a >= r) return this.pv;
            var n, o;
            s
              ? ((n = e
                  ? Math.abs(a - elem.comp.globalData.frameRate * e)
                  : Math.max(0, a - this.elem.data.ip)),
                (o = a - n))
              : ((!e || e > i.length - 1) && (e = i.length - 1),
                (o = i[i.length - 1 - e].t),
                (n = a - o));
            var h, l, p;
            if ("pingpong" === t) {
              var m = Math.floor((r - o) / n);
              if (m % 2 !== 0)
                return this.getValueAtTime(n - ((r - o) % n) + o);
            } else {
              if ("offset" === t) {
                var f = this.getValueAtTime(o),
                  d = this.getValueAtTime(a),
                  c = this.getValueAtTime(((r - o) % n) + o),
                  u = Math.floor((r - o) / n);
                if (this.pv.length) {
                  for (
                    p = new Array(f.length), l = p.length, h = 0;
                    l > h;
                    h += 1
                  )
                    p[h] = (d[h] - f[h]) * u + c[h];
                  return p;
                }
                return (d - f) * u + c;
              }
              if ("continue" === t) {
                var y = this.getValueAtTime(a),
                  g = this.getValueAtTime(a - 0.001);
                if (this.pv.length) {
                  for (
                    p = new Array(y.length), l = p.length, h = 0;
                    l > h;
                    h += 1
                  )
                    p[h] = y[h] + ((y[h] - g[h]) * (r - a)) / 5e-4;
                  return p;
                }
                return y + ((y - g) * (r - a)) / 5e-4;
              }
            }
            return this.getValueAtTime(((r - o) % n) + o);
          }.bind(this),
          loop_out = loopOut,
          loopOutDuration = function (t, e) {
            return loopOut(t, e, !0);
          }.bind(this),
          valueAtTime = function (t) {
            return this.getValueAtTime(t * elem.comp.globalData.frameRate);
          }.bind(this),
          velocityAtTime = function (t) {
            return this.getVelocityAtTime(t);
          }.bind(this),
          time,
          velocity,
          value,
          textIndex,
          textTotal,
          selectorValue,
          index = elem.data.ind + 1,
          hasParent = !(!elem.hierarchy || !elem.hierarchy.length);
        return execute;
      }
      var ob = {},
        Math = BMMath,
        helperLengthArray = [0, 0, 0, 0, 0, 0];
      return (ob.initiateExpression = initiateExpression), ob;
    })(),
    ShapeExpressionInterface = (function () {
      function t(t, e, s) {
        return m(t, e, s);
      }
      function e(t, e, s) {
        return f(t, e, s);
      }
      function s(t, e, s) {
        return d(t, e, s);
      }
      function r(t, e, s) {
        return c(t, e, s);
      }
      function i(t, e, s) {
        return u(t, e, s);
      }
      function a(t, e, s) {
        return y(t, e, s);
      }
      function n(t, e, s) {
        return g(t, e, s);
      }
      function o(t, e, s) {
        return v(t, e, s);
      }
      function h(t, e, s) {
        return b(t, e, s);
      }
      function l(t, e, s) {
        var r,
          i = [],
          a = t.length;
        for (r = 0; a > r; r += 1)
          "gr" == t[r].ty
            ? i.push(
                ShapeExpressionInterface.createGroupInterface(t[r], e[r], s)
              )
            : "fl" == t[r].ty
            ? i.push(
                ShapeExpressionInterface.createFillInterface(t[r], e[r], s)
              )
            : "st" == t[r].ty
            ? i.push(
                ShapeExpressionInterface.createStrokeInterface(t[r], e[r], s)
              )
            : "tm" == t[r].ty
            ? i.push(
                ShapeExpressionInterface.createTrimInterface(t[r], e[r], s)
              )
            : "tr" == t[r].ty
            ? i.push(
                ShapeExpressionInterface.createTransformInterface(t[r], e[r], s)
              )
            : "el" == t[r].ty
            ? i.push(
                ShapeExpressionInterface.createEllipseInterface(t[r], e[r], s)
              )
            : "sr" == t[r].ty
            ? i.push(
                ShapeExpressionInterface.createStarInterface(t[r], e[r], s)
              )
            : "sh" == t[r].ty &&
              i.push(
                ShapeExpressionInterface.createPathInterface(t[r], e[r], s)
              );
        return i;
      }
      var p = {
          createShapeInterface: t,
          createGroupInterface: e,
          createTrimInterface: i,
          createStrokeInterface: r,
          createTransformInterface: a,
          createEllipseInterface: n,
          createStarInterface: o,
          createPathInterface: h,
          createFillInterface: s,
        },
        m = (function () {
          return function (t, e, s) {
            function r(t) {
              if ("number" == typeof t) return i[t - 1];
              for (var e = 0, s = i.length; s > e; ) {
                if (i[e]._name === t) return i[e];
                e += 1;
              }
            }
            var i;
            return (r.propertyGroup = s), (i = l(t, e, r)), r;
          };
        })(),
        f = (function () {
          return function (t, e, s) {
            var r,
              i = function (t) {
                if ("ADBE Vectors Group" === t) return i;
                if ("ADBE Vector Transform Group" === t) {
                  for (var e = 0, s = r.length; s > e; ) {
                    if ("tr" === r[e].ty) return r[e];
                    e += 1;
                  }
                  return null;
                }
                if ("number" == typeof t) return r[t - 1];
                for (var e = 0, s = r.length; s > e; ) {
                  if (r[e]._name === t) return r[e];
                  e += 1;
                }
              };
            return (
              (i.propertyGroup = function (t) {
                return 1 === t ? i : s(t - 1);
              }),
              (r = l(t.it, e.it, i.propertyGroup)),
              Object.defineProperty(i, "_name", {
                get: function () {
                  return t.nm;
                },
              }),
              (i.content = i),
              (i.nm = t.nm),
              i
            );
          };
        })(),
        d = (function () {
          return function (t, e, s) {
            e.c.setGroupProperty(s), e.o.setGroupProperty(s);
            var r = {
              get color() {
                return (
                  e.c.k && e.c.getValue(),
                  [
                    e.c.v[0] / e.c.mult,
                    e.c.v[1] / e.c.mult,
                    e.c.v[2] / e.c.mult,
                    1,
                  ]
                );
              },
              get opacity() {
                return e.o.k && e.o.getValue(), e.o.v;
              },
              _name: t.nm,
            };
            return r;
          };
        })(),
        c = (function () {
          return function (t, e, s) {
            e.c.setGroupProperty(s),
              e.o.setGroupProperty(s),
              e.w.setGroupProperty(s);
            var r = {
              get color() {
                return (
                  e.c.k && e.c.getValue(),
                  [
                    e.c.v[0] / e.c.mult,
                    e.c.v[1] / e.c.mult,
                    e.c.v[2] / e.c.mult,
                    1,
                  ]
                );
              },
              get opacity() {
                return e.o.k && e.o.getValue(), e.o.v;
              },
              get strokeWidth() {
                return e.w.k && e.w.getValue(), e.w.v;
              },
              dashOb: {},
              get dash() {
                var r,
                  i = e.d,
                  a = t.d,
                  n = a.length;
                for (r = 0; n > r; r += 1)
                  i.dataProps[r].p.k && i.dataProps[r].p.getValue(),
                    i.dataProps[r].p.setGroupProperty(s),
                    (this.dashOb[a[r].nm] = i.dataProps[r].p.v);
                return this.dashOb;
              },
              _name: t.nm,
            };
            return r;
          };
        })(),
        u = (function () {
          return function (t, e, s) {
            function r(t) {
              return 1 == t ? r : s(--t);
            }
            function i(e) {
              return e === t.e.ix
                ? i.end
                : e === t.s.ix
                ? i.start
                : e === t.o.ix
                ? i.offset
                : void 0;
            }
            return (
              (r.propertyIndex = t.ix),
              e.s.setGroupProperty(r),
              e.e.setGroupProperty(r),
              e.o.setGroupProperty(r),
              Object.defineProperty(i, "start", {
                get: function () {
                  return e.s.k && e.s.getValue(), e.s.v / e.s.mult;
                },
              }),
              Object.defineProperty(i, "end", {
                get: function () {
                  return e.e.k && e.e.getValue(), e.e.v / e.e.mult;
                },
              }),
              Object.defineProperty(i, "offset", {
                get: function () {
                  return e.o.k && e.o.getValue(), e.o.v;
                },
              }),
              Object.defineProperty(i, "_name", {
                get: function () {
                  return t.nm;
                },
              }),
              i
            );
          };
        })(),
        y = (function () {
          return function (t, e, s) {
            function r(t) {
              return 1 == t ? r : s(--t);
            }
            function i(e) {
              return t.a.ix === e
                ? i.anchorPoint
                : t.o.ix === e
                ? i.opacity
                : t.p.ix === e
                ? i.position
                : t.r.ix === e
                ? i.rotation
                : t.s.ix === e
                ? i.scale
                : t.sk && t.sk.ix === e
                ? i.skew
                : t.sa && t.sa.ix === e
                ? i.skewAxis
                : void 0;
            }
            e.transform.mProps.o.setGroupProperty(r),
              e.transform.mProps.p.setGroupProperty(r),
              e.transform.mProps.a.setGroupProperty(r),
              e.transform.mProps.s.setGroupProperty(r),
              e.transform.mProps.r.setGroupProperty(r),
              e.transform.mProps.sk &&
                (e.transform.mProps.sk.setGroupProperty(r),
                e.transform.mProps.sa.setGroupProperty(r)),
              e.transform.op.setGroupProperty(r),
              Object.defineProperty(i, "opacity", {
                get: function () {
                  return (
                    e.transform.mProps.o.k && e.transform.mProps.o.getValue(),
                    e.transform.mProps.o.v
                  );
                },
              }),
              Object.defineProperty(i, "position", {
                get: function () {
                  return (
                    e.transform.mProps.p.k && e.transform.mProps.p.getValue(),
                    [e.transform.mProps.p.v[0], e.transform.mProps.p.v[1]]
                  );
                },
              }),
              Object.defineProperty(i, "anchorPoint", {
                get: function () {
                  return (
                    e.transform.mProps.a.k && e.transform.mProps.a.getValue(),
                    [e.transform.mProps.a.v[0], e.transform.mProps.a.v[1]]
                  );
                },
              });
            var a = [];
            return (
              Object.defineProperty(i, "scale", {
                get: function () {
                  return (
                    e.transform.mProps.s.k && e.transform.mProps.s.getValue(),
                    (a[0] =
                      e.transform.mProps.s.v[0] / e.transform.mProps.s.mult),
                    (a[1] =
                      e.transform.mProps.s.v[1] / e.transform.mProps.s.mult),
                    a
                  );
                },
              }),
              Object.defineProperty(i, "rotation", {
                get: function () {
                  return (
                    e.transform.mProps.r.k && e.transform.mProps.r.getValue(),
                    e.transform.mProps.r.v / e.transform.mProps.r.mult
                  );
                },
              }),
              Object.defineProperty(i, "skew", {
                get: function () {
                  return (
                    e.transform.mProps.sk.k && e.transform.mProps.sk.getValue(),
                    e.transform.mProps.sk.v
                  );
                },
              }),
              Object.defineProperty(i, "skewAxis", {
                get: function () {
                  return (
                    e.transform.mProps.sa.k && e.transform.mProps.sa.getValue(),
                    e.transform.mProps.sa.v
                  );
                },
              }),
              Object.defineProperty(i, "_name", {
                get: function () {
                  return t.nm;
                },
              }),
              (i.ty = "tr"),
              i
            );
          };
        })(),
        g = (function () {
          return function (t, e, s) {
            function r(t) {
              return 1 == t ? r : s(--t);
            }
            function i(e) {
              return t.p.ix === e ? i.position : t.s.ix === e ? i.size : void 0;
            }
            r.propertyIndex = t.ix;
            var a = "tm" === e.sh.ty ? e.sh.prop : e.sh;
            return (
              a.s.setGroupProperty(r),
              a.p.setGroupProperty(r),
              Object.defineProperty(i, "size", {
                get: function () {
                  return a.s.k && a.s.getValue(), [a.s.v[0], a.s.v[1]];
                },
              }),
              Object.defineProperty(i, "position", {
                get: function () {
                  return a.p.k && a.p.getValue(), [a.p.v[0], a.p.v[1]];
                },
              }),
              Object.defineProperty(i, "_name", {
                get: function () {
                  return t.nm;
                },
              }),
              i
            );
          };
        })(),
        v = (function () {
          return function (t, e, s) {
            function r(t) {
              return 1 == t ? r : s(--t);
            }
            function i(e) {
              return t.p.ix === e
                ? i.position
                : t.r.ix === e
                ? i.rotation
                : t.pt.ix === e
                ? i.points
                : t.or.ix === e || "ADBE Vector Star Outer Radius" === e
                ? i.outerRadius
                : t.os.ix === e
                ? i.outerRoundness
                : !t.ir ||
                  (t.ir.ix !== e && "ADBE Vector Star Inner Radius" !== e)
                ? t.is && t.is.ix === e
                  ? i.innerRoundness
                  : void 0
                : i.innerRadius;
            }
            var a = "tm" === e.sh.ty ? e.sh.prop : e.sh;
            return (
              (r.propertyIndex = t.ix),
              a.or.setGroupProperty(r),
              a.os.setGroupProperty(r),
              a.pt.setGroupProperty(r),
              a.p.setGroupProperty(r),
              a.r.setGroupProperty(r),
              t.ir && (a.ir.setGroupProperty(r), a.is.setGroupProperty(r)),
              Object.defineProperty(i, "position", {
                get: function () {
                  return a.p.k && a.p.getValue(), a.p.v;
                },
              }),
              Object.defineProperty(i, "rotation", {
                get: function () {
                  return a.r.k && a.r.getValue(), a.r.v / a.r.mult;
                },
              }),
              Object.defineProperty(i, "points", {
                get: function () {
                  return a.pt.k && a.pt.getValue(), a.pt.v;
                },
              }),
              Object.defineProperty(i, "outerRadius", {
                get: function () {
                  return a.or.k && a.or.getValue(), a.or.v;
                },
              }),
              Object.defineProperty(i, "outerRoundness", {
                get: function () {
                  return a.os.k && a.os.getValue(), a.os.v / a.os.mult;
                },
              }),
              Object.defineProperty(i, "innerRadius", {
                get: function () {
                  return a.ir ? (a.ir.k && a.ir.getValue(), a.ir.v) : 0;
                },
              }),
              Object.defineProperty(i, "innerRoundness", {
                get: function () {
                  return a.is
                    ? (a.is.k && a.is.getValue(), a.is.v / a.is.mult)
                    : 0;
                },
              }),
              Object.defineProperty(i, "_name", {
                get: function () {
                  return t.nm;
                },
              }),
              i
            );
          };
        })(),
        b = (function () {
          return function (t, e, s) {
            var r = "tm" === e.sh.ty ? e.sh.prop : e.sh;
            r.setGroupProperty(s);
            var i = {
              get shape() {
                return r.k && r.getValue(), r.v;
              },
              get path() {
                return r.k && r.getValue(), r.v;
              },
              _name: t.nm,
            };
            return i;
          };
        })();
      return p;
    })(),
    LayerExpressionInterface = (function () {
      function t(t) {
        var e = new Matrix();
        if (
          (e.reset(),
          this._elem.finalTransform.mProp.applyToMatrix(e),
          this._elem.hierarchy && this._elem.hierarchy.length)
        ) {
          var s,
            r = this._elem.hierarchy.length;
          for (s = 0; r > s; s += 1)
            this._elem.hierarchy[s].finalTransform.mProp.applyToMatrix(e);
          return e.applyToPointArray(t[0], t[1], t[2] || 0);
        }
        return e.applyToPointArray(t[0], t[1], t[2] || 0);
      }
      return function (e) {
        function s(t) {
          r.mask = t.getMask.bind(t);
        }
        function r(t) {
          switch (t) {
            case "ADBE Root Vectors Group":
              return r.shapeInterface;
            case 4:
              return e.effectsManager;
          }
        }
        return (
          (r.toWorld = t),
          (r.toComp = t),
          (r._elem = e),
          Object.defineProperty(r, "hasParent", {
            get: function () {
              return !!e.hierarchy;
            },
          }),
          Object.defineProperty(r, "parent", {
            get: function () {
              return e.hierarchy[0].layerInterface;
            },
          }),
          Object.defineProperty(r, "rotation", {
            get: function () {
              return e.transform.rotation;
            },
          }),
          Object.defineProperty(r, "scale", {
            get: function () {
              return e.transform.scale;
            },
          }),
          Object.defineProperty(r, "position", {
            get: function () {
              return e.transform.position;
            },
          }),
          Object.defineProperty(r, "anchorPoint", {
            get: function () {
              return e.transform.anchorPoint;
            },
          }),
          Object.defineProperty(r, "transform", {
            get: function () {
              return e.transform;
            },
          }),
          Object.defineProperty(r, "_name", { value: e.data.nm }),
          Object.defineProperty(r, "content", {
            get: function () {
              return r.shapeInterface;
            },
          }),
          (r.effect = e.effectsManager),
          (r.active = !0),
          (r.registerMaskInterface = s),
          r
        );
      };
    })(),
    CompExpressionInterface = (function () {
      return function (t) {
        function e(e) {
          for (var s = 0, r = t.layers.length; r > s; ) {
            if (t.layers[s].nm === e) return t.elements[s].layerInterface;
            s += 1;
          }
        }
        return (
          (e.layer = e),
          (e.pixelAspect = 1),
          (e.height = t.globalData.compSize.h),
          (e.width = t.globalData.compSize.w),
          (e.pixelAspect = 1),
          (e.frameDuration = 1 / t.globalData.frameRate),
          e
        );
      };
    })();
  (SliderEffect.prototype.proxyFunction = function () {
    if ((this.p.k && this.p.getValue(), "number" == typeof this.p.v))
      return this.p.v;
    var t,
      e = this.p.v.length,
      s = Array.apply(null, { length: e });
    for (t = 0; e > t; t += 1) s[t] = this.p.v[t];
    return s;
  }),
    (AngleEffect.prototype.proxyFunction =
      SliderEffect.prototype.proxyFunction),
    (ColorEffect.prototype.proxyFunction =
      SliderEffect.prototype.proxyFunction),
    (PointEffect.prototype.proxyFunction =
      SliderEffect.prototype.proxyFunction),
    (CheckboxEffect.prototype.proxyFunction =
      SliderEffect.prototype.proxyFunction);
  var bodymovinjs = {};
  function play(animation) {
    animationManager.play(animation);
  }
  function pause(animation) {
    animationManager.pause(animation);
  }
  function togglePause(animation) {
    animationManager.togglePause(animation);
  }
  function setSpeed(value, animation) {
    animationManager.setSpeed(value, animation);
  }
  function setDirection(value, animation) {
    animationManager.setDirection(value, animation);
  }
  function stop(animation) {
    animationManager.stop(animation);
  }
  function moveFrame(value) {
    animationManager.moveFrame(value);
  }
  function searchAnimations() {
    if (standalone === true) {
      animationManager.searchAnimations(animationData, standalone, renderer);
    } else {
      animationManager.searchAnimations();
    }
  }
  function registerAnimation(elem) {
    return animationManager.registerAnimation(elem);
  }
  function resize() {
    animationManager.resize();
  }
  function start() {
    animationManager.start();
  }
  function goToAndStop(val, isFrame, animation) {
    animationManager.goToAndStop(val, isFrame, animation);
  }
  function setSubframeRendering(flag) {
    subframeEnabled = flag;
  }
  function loadAnimation(params) {
    if (standalone === true) {
      params.animationData = JSON.parse(animationData);
    }
    return animationManager.loadAnimation(params);
  }
  function destroy(animation) {
    return animationManager.destroy(animation);
  }
  function setQuality(value) {
    if (typeof value === "string") {
      switch (value) {
        case "high":
          defaultCurveSegments = 200;
          break;
        case "medium":
          defaultCurveSegments = 50;
          break;
        case "low":
          defaultCurveSegments = 10;
          break;
      }
    } else if (!isNaN(value) && value > 1) {
      defaultCurveSegments = value;
    }
    if (defaultCurveSegments >= 50) {
      roundValues(false);
    } else {
      roundValues(true);
    }
  }
  function installPlugin(type, plugin) {
    if (type === "expressions") {
      expressionsPlugin = plugin;
    }
  }
  function getFactory(name) {
    switch (name) {
      case "propertyFactory":
        return PropertyFactory;
      case "shapePropertyFactory":
        return ShapePropertyFactory;
      case "matrix":
        return Matrix;
    }
  }
  bodymovinjs.play = play;
  bodymovinjs.pause = pause;
  bodymovinjs.togglePause = togglePause;
  bodymovinjs.setSpeed = setSpeed;
  bodymovinjs.setDirection = setDirection;
  bodymovinjs.stop = stop;
  bodymovinjs.moveFrame = moveFrame;
  bodymovinjs.searchAnimations = searchAnimations;
  bodymovinjs.registerAnimation = registerAnimation;
  bodymovinjs.loadAnimation = loadAnimation;
  bodymovinjs.setSubframeRendering = setSubframeRendering;
  bodymovinjs.resize = resize;
  bodymovinjs.start = start;
  bodymovinjs.goToAndStop = goToAndStop;
  bodymovinjs.destroy = destroy;
  bodymovinjs.setQuality = setQuality;
  bodymovinjs.installPlugin = installPlugin;
  bodymovinjs.__getFactory = getFactory;
  bodymovinjs.version = "4.4.1";
  function checkReady() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      searchAnimations();
    }
  }
  function getQueryVariable(variable) {
    var vars = queryString.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
  }
  var standalone = "__[STANDALONE]__";
  var animationData = "__[ANIMATIONDATA]__";
  var renderer = "";
  if (standalone) {
    var scripts = document.getElementsByTagName("script");
    var index = scripts.length - 1;
    var myScript = scripts[index];
    var queryString = myScript.src.replace(/^[^\?]+\??/, "");
    renderer = getQueryVariable("renderer");
  }
  var readyStateCheckInterval = setInterval(checkReady, 100);
  return bodymovinjs;
});

var animationData = {
  assets: [],
  v: "4.4.1",
  ddd: 0,
  layers: [
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "ku Outlines",
      ks: {
        o: { k: 23 },
        r: {
          k: [
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 20,
              s: [0],
              e: [-1],
            },
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 22,
              s: [-1],
              e: [-1],
            },
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 26,
              s: [-1],
              e: [-1],
            },
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 29,
              s: [-1],
              e: [-4],
            },
            { t: 31.0000012626559 },
          ],
        },
        p: {
          k: [
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 4,
              s: [984.5, 413.5, 0],
              e: [980.5, 416.5, 0],
              to: [-0.66666668653488, 0.5, 0],
              ti: [1.25, -1, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 11,
              s: [980.5, 416.5, 0],
              e: [977, 419.5, 0],
              to: [-1.25, 1, 0],
              ti: [0.58333331346512, 4.66666650772095, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 14,
              s: [977, 419.5, 0],
              e: [976.492, 417.998, 0],
              to: [-0.16886301338673, -1.35090410709381, 0],
              ti: [-0.12700180709362, 3.65239882469177, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 15,
              s: [976.492, 417.998, 0],
              e: [976.49, 414.332, 0],
              to: [0.09374559670687, -2.69599533081055, 0],
              ti: [-0.21481230854988, 3.83022737503052, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 16,
              s: [976.49, 414.332, 0],
              e: [978.5, 386.5, 0],
              to: [0.49948182702065, -8.90604972839355, 0],
              ti: [0.12421077489853, 1.49052929878235, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 18,
              s: [978.5, 386.5, 0],
              e: [975.5, 401.5, 0],
              to: [-0.25, -3, 0],
              ti: [0.58333331346512, -1.25, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 20,
              s: [975.5, 401.5, 0],
              e: [975, 394, 0],
              to: [-0.58333331346512, 1.25, 0],
              ti: [0.08333333581686, 1.25, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 22,
              s: [975, 394, 0],
              e: [975, 394, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 26,
              s: [975, 394, 0],
              e: [973.5, 375, 0],
              to: [-0.25, -3.16666674613953, 0],
              ti: [0.08333333581686, 2.08333325386047, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 29,
              s: [973.5, 375, 0],
              e: [974.5, 381.5, 0],
              to: [-0.08333333581686, -2.08333325386047, 0],
              ti: [-0.16666667163372, -1.08333337306976, 0],
            },
            { t: 31.0000012626559 },
          ],
        },
        a: { k: [675.317, 450.933, 0] },
        s: { k: [226.222, 226.222, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [-0.464, 0.295],
                    [-0.295, -0.464],
                    [0.464, -0.295],
                    [0.295, 0.464],
                  ],
                  o: [
                    [0.464, -0.295],
                    [0.295, 0.464],
                    [-0.464, 0.295],
                    [-0.295, -0.464],
                  ],
                  v: [
                    [-0.534, -0.841],
                    [0.841, -0.534],
                    [0.534, 0.841],
                    [-0.841, 0.534],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.28, 0.23, 1] },
              o: { k: 100 },
              w: { k: 0.293 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.49, 0.19, 0.19, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [677.225, 444.239], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 1",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [-0.295, -0.464],
                    [0.464, -0.295],
                    [0.295, 0.464],
                    [-0.464, 0.295],
                  ],
                  o: [
                    [0.295, 0.464],
                    [-0.464, 0.295],
                    [-0.295, -0.464],
                    [0.464, -0.295],
                  ],
                  v: [
                    [0.841, -0.535],
                    [0.534, 0.84],
                    [-0.841, 0.534],
                    [-0.534, -0.841],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.28, 0.23, 1] },
              o: { k: 100 },
              w: { k: 0.293 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.63, 0.24, 0.24, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [674.874, 454.807], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 2",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [-2.245, -4.546],
                    [-2.858, -1.796],
                    [1.177, 4.546],
                    [2.857, 3.477],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.28, 0.23, 1] },
              o: { k: 100 },
              w: { k: 0.293 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.49, 0.19, 0.19, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [672.857, 450.796], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 3",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [-4.011, 3.392],
                    [4.011, -1.711],
                    [2.943, -3.392],
                    [-3.399, 0.642],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.28, 0.23, 1] },
              o: { k: 100 },
              w: { k: 0.293 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.63, 0.24, 0.24, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [673.749, 446.79], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 4",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0.12, -0.537],
                    [0.537, 0.119],
                    [-0.119, 0.537],
                    [-0.537, -0.119],
                  ],
                  o: [
                    [-0.119, 0.537],
                    [-0.537, -0.119],
                    [0.12, -0.537],
                    [0.537, 0.12],
                  ],
                  v: [
                    [0.972, 0.216],
                    [-0.217, 0.973],
                    [-0.973, -0.216],
                    [0.216, -0.973],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.28, 0.23, 1] },
              o: { k: 100 },
              w: { k: 0.293 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.63, 0.24, 0.24, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [669.971, 453.716], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 5",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0.119, -0.537],
                    [0.537, 0.119],
                    [-0.119, 0.537],
                    [-0.537, -0.119],
                  ],
                  o: [
                    [-0.12, 0.537],
                    [-0.537, -0.119],
                    [0.12, -0.537],
                    [0.537, 0.12],
                  ],
                  v: [
                    [0.973, 0.216],
                    [-0.216, 0.973],
                    [-0.972, -0.216],
                    [0.216, -0.973],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.28, 0.23, 1] },
              o: { k: 100 },
              w: { k: 0.293 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.63, 0.24, 0.24, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [672.322, 443.148], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 6",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [-0.203, 5.5],
                    [-2.148, 5.068],
                    [0.204, -5.5],
                    [2.148, -5.068],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.28, 0.23, 1] },
              o: { k: 100 },
              w: { k: 0.293 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.63, 0.24, 0.24, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [671.146, 448.432], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 7",
        },
      ],
      bounds: { l: 662, t: 436, b: 461, r: 681 },
      ip: 0,
      op: 900.000036657751,
      st: 0,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "圍巾",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [959, 587, 0] },
        a: { k: [411, 400, 0] },
        s: { k: [209.526, 209.526, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 1,
                    s: [
                      {
                        i: [
                          [7.516, 2.163],
                          [1.53, -2.556],
                          [-2.496, -1.694],
                          [-10.494, -0.146],
                          [-8.771, 3.866],
                          [1.608, 0.499],
                          [11.276, -0.898],
                        ],
                        o: [
                          [0, 0],
                          [-1.495, 2.496],
                          [2.496, 1.695],
                          [22.116, 0.306],
                          [3.85, -1.696],
                          [-1.608, -0.499],
                          [-22.582, 1.8],
                        ],
                        v: [
                          [-34.146, -5.616],
                          [-41.135, -4.949],
                          [-39.638, 0.844],
                          [-7.355, 7.199],
                          [38.781, 1.872],
                          [38.076, -4.451],
                          [9.488, -0.453],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [7.516, 2.163],
                          [1.53, -2.556],
                          [-2.496, -1.694],
                          [-10.469, -0.516],
                          [-8.72, 3.348],
                          [2.009, 0.96],
                          [11.471, -0.102],
                        ],
                        o: [
                          [0, 0],
                          [-1.495, 2.496],
                          [2.496, 1.695],
                          [17.625, 0.551],
                          [3.921, -1.494],
                          [-2.119, -1.034],
                          [-17.948, 0.837],
                        ],
                        v: [
                          [-34.146, -5.616],
                          [-41.135, -4.949],
                          [-39.638, 0.844],
                          [-10.855, 7.279],
                          [34.883, 2.429],
                          [24.473, -3.098],
                          [0.977, -0.215],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 2,
                    s: [
                      {
                        i: [
                          [7.516, 2.163],
                          [1.53, -2.556],
                          [-2.496, -1.694],
                          [-10.469, -0.516],
                          [-8.72, 3.348],
                          [2.009, 0.96],
                          [11.471, -0.102],
                        ],
                        o: [
                          [0, 0],
                          [-1.495, 2.496],
                          [2.496, 1.695],
                          [17.625, 0.551],
                          [3.921, -1.494],
                          [-2.119, -1.034],
                          [-17.948, 0.837],
                        ],
                        v: [
                          [-34.146, -5.616],
                          [-41.135, -4.949],
                          [-39.638, 0.844],
                          [-10.855, 7.279],
                          [34.883, 2.429],
                          [24.473, -3.098],
                          [0.977, -0.215],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [7.516, 2.163],
                          [1.53, -2.556],
                          [-2.496, -1.694],
                          [-10.42, -1.256],
                          [-8.619, 2.312],
                          [2.811, 1.883],
                          [11.862, 1.489],
                        ],
                        o: [
                          [0, 0],
                          [-1.495, 2.496],
                          [2.496, 1.695],
                          [8.643, 1.042],
                          [4.063, -1.09],
                          [-3.141, -2.104],
                          [-8.679, -1.089],
                        ],
                        v: [
                          [-34.146, -5.616],
                          [-41.135, -4.949],
                          [-39.638, 0.844],
                          [-17.855, 7.438],
                          [15.633, 6.407],
                          [7.292, -1.11],
                          [-16.045, 0.262],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 4,
                    s: [
                      {
                        i: [
                          [7.516, 2.163],
                          [1.53, -2.556],
                          [-2.496, -1.694],
                          [-10.42, -1.256],
                          [-8.619, 2.312],
                          [2.811, 1.883],
                          [11.862, 1.489],
                        ],
                        o: [
                          [0, 0],
                          [-1.495, 2.496],
                          [2.496, 1.695],
                          [8.643, 1.042],
                          [4.063, -1.09],
                          [-3.141, -2.104],
                          [-8.679, -1.089],
                        ],
                        v: [
                          [-34.146, -5.616],
                          [-41.135, -4.949],
                          [-39.638, 0.844],
                          [-17.855, 7.438],
                          [15.633, 6.407],
                          [7.292, -1.11],
                          [-16.045, 0.262],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [2.741, 1.209],
                          [1.53, -2.556],
                          [-2.496, -1.694],
                          [-4.244, -1.345],
                          [-8.619, 2.312],
                          [2.499, 2.281],
                          [6.833, 0.104],
                        ],
                        o: [
                          [0, 0],
                          [-1.495, 2.496],
                          [2.496, 1.695],
                          [4.214, 1.335],
                          [4.063, -1.09],
                          [-2.499, -2.281],
                          [-3.686, -0.056],
                        ],
                        v: [
                          [-37.487, -5.854],
                          [-41.135, -4.949],
                          [-39.638, 0.844],
                          [-31.219, 4.813],
                          [-10.139, 3.304],
                          [-18.719, -3.019],
                          [-27.738, -3.317],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 7,
                    s: [
                      {
                        i: [
                          [2.741, 1.209],
                          [1.53, -2.556],
                          [-2.496, -1.694],
                          [-4.244, -1.345],
                          [-8.619, 2.312],
                          [2.499, 2.281],
                          [6.833, 0.104],
                        ],
                        o: [
                          [0, 0],
                          [-1.495, 2.496],
                          [2.496, 1.695],
                          [4.214, 1.335],
                          [4.063, -1.09],
                          [-2.499, -2.281],
                          [-3.686, -0.056],
                        ],
                        v: [
                          [-37.487, -5.854],
                          [-41.135, -4.949],
                          [-39.638, 0.844],
                          [-31.219, 4.813],
                          [-10.139, 3.304],
                          [-18.719, -3.019],
                          [-27.738, -3.317],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0.474, -0.103],
                          [1.378, -1.247],
                          [-1.552, -1.074],
                          [0.171, -0.032],
                          [-6.829, 2.908],
                          [2.467, 0.521],
                          [2.179, 0.581],
                        ],
                        o: [
                          [0, 0],
                          [-0.174, -0.292],
                          [0.904, 0.625],
                          [1.842, 1.4],
                          [1.144, -0.487],
                          [-0.039, 0.163],
                          [-0.326, 0.223],
                        ],
                        v: [
                          [-37.487, -5.854],
                          [-41.135, -4.949],
                          [-42.024, -1.424],
                          [-38.497, 0.637],
                          [-20.997, 1.157],
                          [-30.651, -4.093],
                          [-35.017, -4.391],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 9,
                    s: [
                      {
                        i: [
                          [0.474, -0.103],
                          [1.378, -1.247],
                          [-1.552, -1.074],
                          [0.171, -0.032],
                          [-6.829, 2.908],
                          [2.467, 0.521],
                          [2.179, 0.581],
                        ],
                        o: [
                          [0, 0],
                          [-0.174, -0.292],
                          [0.904, 0.625],
                          [1.842, 1.4],
                          [1.144, -0.487],
                          [-0.039, 0.163],
                          [-0.326, 0.223],
                        ],
                        v: [
                          [-37.487, -5.854],
                          [-41.135, -4.949],
                          [-42.024, -1.424],
                          [-38.497, 0.637],
                          [-20.997, 1.157],
                          [-30.651, -4.093],
                          [-35.017, -4.391],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0.474, -0.103],
                          [1.378, -1.247],
                          [-1.552, -1.074],
                          [0.171, -0.032],
                          [-1.999, 1.356],
                          [1.87, 1.714],
                          [2.179, 0.581],
                        ],
                        o: [
                          [0, 0],
                          [-0.174, -0.292],
                          [0.904, 0.625],
                          [1.842, 1.4],
                          [1.165, -0.79],
                          [-0.039, 0.163],
                          [-0.326, 0.223],
                        ],
                        v: [
                          [-39.158, -5.973],
                          [-41.135, -4.949],
                          [-42.024, -1.424],
                          [-40.884, -0.795],
                          [-38.418, -2.304],
                          [-37.213, -5.524],
                          [-37.761, -5.942],
                        ],
                      },
                    ],
                  },
                  { t: 11.0000004480392 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [410.429, 396.77], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 6",
        },
      ],
      bounds: { l: 366, t: 389, b: 406, r: 453 },
      ip: 0,
      op: 11.0000004480392,
      st: 0,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "聖誕節動畫配件 Outlines",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [801, 559, 0] },
        a: { k: [512, 384, 0] },
        s: { k: [209.526, 209.526, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, -2.651],
                    [2.651, 0],
                    [0, 2.651],
                    [-2.651, 0],
                  ],
                  o: [
                    [0, 2.651],
                    [-2.651, 0],
                    [0, -2.651],
                    [2.651, 0],
                  ],
                  v: [
                    [4.8, 0],
                    [0, 4.8],
                    [-4.8, 0],
                    [0, -4.8],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.25, 0.44, 0.48, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.33, 0.79, 0.93, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [651.101, 414.043], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: {
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 51,
                    s: [0],
                    e: [100],
                  },
                  { t: 52.0000021180034 },
                ],
                ix: 7,
              },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 1",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, -2.651],
                    [2.651, 0],
                    [0, 2.651],
                    [-2.651, 0],
                  ],
                  o: [
                    [0, 2.651],
                    [-2.651, 0],
                    [0, -2.651],
                    [2.651, 0],
                  ],
                  v: [
                    [4.8, 0],
                    [0, 4.8],
                    [-4.8, 0],
                    [0, -4.8],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.25, 0.44, 0.48, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.33, 0.79, 0.93, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [548.101, 369.043], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: {
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 47,
                    s: [0],
                    e: [100],
                  },
                  { t: 48.0000019550801 },
                ],
                ix: 7,
              },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 2",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, -2.651],
                    [2.651, 0],
                    [0, 2.651],
                    [-2.651, 0],
                  ],
                  o: [
                    [0, 2.651],
                    [-2.651, 0],
                    [0, -2.651],
                    [2.651, 0],
                  ],
                  v: [
                    [4.8, 0],
                    [0, 4.8],
                    [-4.8, 0],
                    [0, -4.8],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [541.601, 434.543], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: {
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 56,
                    s: [0],
                    e: [100],
                  },
                  { t: 57.0000023216576 },
                ],
                ix: 7,
              },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 3",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [0, -6.924],
                    [2.25, -2.365],
                    [7.28, -1.634],
                    [3.64, 1.914],
                    [4.5, 6.924],
                    [0, 4.559],
                    [-4.5, 6.924],
                    [-3.64, 1.914],
                    [-7.28, -1.634],
                    [-2.25, -2.365],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.42, 0.25, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 2,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.73, 0.18, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [565.891, 333.327], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: {
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 50,
                    s: [0],
                    e: [100],
                  },
                  { t: 51.0000020772726 },
                ],
                ix: 7,
              },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 4",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, -2.651],
                    [2.651, 0],
                    [0, 2.651],
                    [-2.651, 0],
                  ],
                  o: [
                    [0, 2.651],
                    [-2.651, 0],
                    [0, -2.651],
                    [2.651, 0],
                  ],
                  v: [
                    [4.8, 0],
                    [0, 4.8],
                    [-4.8, 0],
                    [0, -4.8],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [604.101, 407.043], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: {
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 43,
                    s: [0],
                    e: [100],
                  },
                  { t: 44.0000017921567 },
                ],
                ix: 7,
              },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 5",
        },
      ],
      bounds: { l: 533, t: 322, b: 443, r: 657 },
      ip: 0,
      op: 90.0000036657751,
      st: 0,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "帽子",
      ks: {
        o: { k: 100 },
        r: {
          k: [
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 5,
              s: [0],
              e: [2],
            },
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 10,
              s: [2],
              e: [-1],
            },
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 12,
              s: [-1],
              e: [-3],
            },
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 18,
              s: [-3],
              e: [-5],
            },
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 20,
              s: [-5],
              e: [-5],
            },
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              n: ["0p833_0p833_0p167_0p167"],
              t: 27,
              s: [-5],
              e: [-8],
            },
            { t: 31.0000012626559 },
          ],
        },
        p: {
          k: [
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 5,
              s: [982, 334, 0],
              e: [982, 336, 0],
              to: [0, 0.33333334326744, 0],
              ti: [1.16666662693024, -1, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 10,
              s: [982, 336, 0],
              e: [975, 340, 0],
              to: [-1.16666662693024, 1, 0],
              ti: [1.66666662693024, -0.5, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 12,
              s: [975, 340, 0],
              e: [972, 339, 0],
              to: [-1.66666662693024, 0.5, 0],
              ti: [0.5, 1, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 15,
              s: [972, 339, 0],
              e: [972, 334, 0],
              to: [-0.5, -1, 0],
              ti: [0, 5.66666650772095, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 16,
              s: [972, 334, 0],
              e: [972, 305, 0],
              to: [0, -5.66666650772095, 0],
              ti: [0.83333331346512, 2.5, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 18,
              s: [972, 305, 0],
              e: [967, 319, 0],
              to: [-0.83333331346512, -2.5, 0],
              ti: [0.83333331346512, -1.83333337306976, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 20,
              s: [967, 319, 0],
              e: [967, 316, 0],
              to: [-0.83333331346512, 1.83333337306976, 0],
              ti: [0, 1.16666662693024, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 21,
              s: [967, 316, 0],
              e: [967, 312, 0],
              to: [0, -1.16666662693024, 0],
              ti: [0, 0.66666668653488, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 22,
              s: [967, 312, 0],
              e: [967, 312, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 26,
              s: [967, 312, 0],
              e: [967, 309, 0],
              to: [0, -0.5, 0],
              ti: [0.5, 2, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 27,
              s: [967, 309, 0],
              e: [963.558, 293.481, 0],
              to: [-0.24224075675011, -0.96896302700043, 0],
              ti: [0.60525190830231, 1.75912964344025, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 29,
              s: [963.558, 293.481, 0],
              e: [962, 300, 0],
              to: [-0.64402562379837, -1.87182343006134, 0],
              ti: [0.25775924324989, 0.77327769994736, 0],
            },
            { t: 31.0000012626559 },
          ],
        },
        a: { k: [0, 0, 0] },
        s: { k: [207.496, 207.496, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, -3.184],
                    [3.184, 0],
                    [0, 3.184],
                    [-3.184, 0],
                  ],
                  o: [
                    [0, 3.184],
                    [-3.184, 0],
                    [0, -3.184],
                    [3.184, 0],
                  ],
                  v: [
                    [5.765, 0],
                    [0, 5.765],
                    [-5.765, 0],
                    [0, -5.765],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.36, 0.36, 0.36, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [1, 1, 0.95, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [6.86, 4.291], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 20",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [18.469, 17.756],
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [-19.28, 10.089],
                    [10.895, -27.845],
                    [19.279, 18.379],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-4.395, 33.577], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 21",
        },
      ],
      bounds: { l: -26, t: -3, b: 57, r: 17 },
      ip: 0,
      op: 95.0000038694293,
      st: 5.00000020365417,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 5,
      ty: 4,
      nm: "雪人",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [987, 332, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [207.446, 207.446, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0.199, -0.95],
                    [1.519, 0.318],
                    [-0.199, 0.949],
                    [-1.519, -0.318],
                  ],
                  o: [
                    [-0.199, 0.95],
                    [-1.52, -0.319],
                    [0.199, -0.95],
                    [1.52, 0.318],
                  ],
                  v: [
                    [2.751, 0.576],
                    [-0.36, 1.719],
                    [-2.751, -0.577],
                    [0.36, -1.72],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.91, 0.45, 0.5, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 5,
                    s: [5.374, 104.673],
                    e: [7.374, 105.673],
                    to: [0.33333334326744, 0.16666667163372],
                    ti: [-0.83333331346512, -3.33333325386047],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 13,
                    s: [7.374, 105.673],
                    e: [10.374, 124.673],
                    to: [0.83333331346512, 3.33333325386047],
                    ti: [-3.66666674613953, -8.16666698455811],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [10.374, 124.673],
                    e: [29.374, 154.673],
                    to: [3.66666674613953, 8.16666698455811],
                    ti: [-5.16666650772095, -14.3333330154419],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [29.374, 154.673],
                    e: [41.374, 210.673],
                    to: [5.16666650772095, 14.3333330154419],
                    ti: [-2, -9.33333301544189],
                  },
                  { t: 38.0000015477717 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 1",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0.199, -0.95],
                    [1.519, 0.318],
                    [-0.199, 0.949],
                    [-1.519, -0.318],
                  ],
                  o: [
                    [-0.199, 0.95],
                    [-1.52, -0.319],
                    [0.199, -0.95],
                    [1.52, 0.318],
                  ],
                  v: [
                    [2.751, 0.576],
                    [-0.36, 1.719],
                    [-2.751, -0.577],
                    [0.36, -1.72],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.91, 0.45, 0.5, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 5,
                    s: [-42.626, 95.673],
                    e: [-43.626, 97.673],
                    to: [-0.16666667163372, 0.33333334326744],
                    ti: [1.33333337306976, -3.66666674613953],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 13,
                    s: [-43.626, 97.673],
                    e: [-50.626, 117.673],
                    to: [-1.33333337306976, 3.66666674613953],
                    ti: [2.5, -9.5],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [-50.626, 117.673],
                    e: [-58.626, 154.673],
                    to: [-2.5, 9.5],
                    ti: [2.5, -14.8333330154419],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [-58.626, 154.673],
                    e: [-65.626, 206.673],
                    to: [-2.5, 14.8333330154419],
                    ti: [1.16666662693024, -8.66666698455811],
                  },
                  { t: 38.0000015477717 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 2",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, -2.367],
                    [2.367, 0],
                    [0, 2.367],
                    [-2.366, 0],
                  ],
                  o: [
                    [0, 2.367],
                    [-2.366, 0],
                    [0, -2.367],
                    [2.367, 0],
                  ],
                  v: [
                    [4.285, 0],
                    [-0.001, 4.286],
                    [-4.286, 0],
                    [-0.001, -4.286],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 15,
                    s: [-27.028, 164.643],
                    e: [-28.028, 167.643],
                    to: [-0.16666667163372, 0.5],
                    ti: [1.33333337306976, -5.66666650772095],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [-28.028, 167.643],
                    e: [-33.067, 172.789],
                    to: [-0.54638564586639, 2.3221390247345],
                    ti: [1.05478692054749, -4.90317249298096],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 26,
                    s: [-33.067, 172.789],
                    e: [-34.275, 190.654],
                    to: [-0.83985555171967, 3.90406465530396],
                    ti: [2.07869815826416, -5.61212825775146],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 29,
                    s: [-34.275, 190.654],
                    e: [-42.028, 199.143],
                    to: [-1.68139123916626, 4.53946781158447],
                    ti: [0.52784657478333, -1.89145028591156],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 31,
                    s: [-42.028, 199.143],
                    e: [-41.234, 205.853],
                    to: [-0.56648278236389, 2.02989649772644],
                    ti: [0.26026594638824, -1.16507709026337],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 34,
                    s: [-41.234, 205.853],
                    e: [-40.028, 210.643],
                    to: [-0.65861797332764, 2.9482946395874],
                    ti: [0.23891954123974, -1.13486778736115],
                  },
                  { t: 36.0000014663101 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 16",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, -2.367],
                    [2.367, 0],
                    [0, 2.367],
                    [-2.366, 0],
                  ],
                  o: [
                    [0, 2.367],
                    [-2.366, 0],
                    [0, -2.367],
                    [2.367, 0],
                  ],
                  v: [
                    [4.286, 0],
                    [0, 4.286],
                    [-4.285, 0],
                    [0, -4.286],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 15,
                    s: [-25.93, 138.292],
                    e: [-27.93, 145.292],
                    to: [-0.33333334326744, 1.16666662693024],
                    ti: [2.33333325386047, -7.66666650772095],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [-27.93, 145.292],
                    e: [-33.313, 152.454],
                    to: [-0.97067540884018, 3.18936204910278],
                    ti: [1.80781614780426, -6.03305435180664],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 25,
                    s: [-33.313, 152.454],
                    e: [-32.928, 164.099],
                    to: [-0.99664741754532, 3.32601761817932],
                    ti: [1.32838988304138, -5.00177383422852],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 27,
                    s: [-32.928, 164.099],
                    e: [-42.43, 185.292],
                    to: [-2.05421352386475, 7.73471117019653],
                    ti: [1.30039715766907, -3.78297352790833],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [-42.43, 185.292],
                    e: [-49.279, 195.535],
                    to: [-1.24431562423706, 3.61982727050781],
                    ti: [0.98502224683762, -3.15639400482178],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 33,
                    s: [-49.279, 195.535],
                    e: [-51.43, 208.292],
                    to: [-1.91757595539093, 6.14465856552124],
                    ti: [0.82580149173737, -2.64256477355957],
                  },
                  { t: 37.0000015070409 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 17",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [-0.04, -1.63],
                    [0.996, -0.087],
                    [-2.776, 0.964],
                  ],
                  o: [
                    [-0.173, 1.802],
                    [-3.075, -0.737],
                    [1.462, -0.127],
                  ],
                  v: [
                    [3.075, -0.108],
                    [0, 2.95],
                    [0.351, -2.823],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.36, 0.36, 0.36, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 5,
                    s: [-3.125, 91.457],
                    e: [-1.625, 91.957],
                    to: [0.25, 0.08333333581686],
                    ti: [-3, -4.08333349227905],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 13,
                    s: [-1.625, 91.957],
                    e: [14.875, 115.957],
                    to: [3, 4.08333349227905],
                    ti: [-5.75, -9.16666698455811],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [14.875, 115.957],
                    e: [32.875, 146.957],
                    to: [5.75, 9.16666698455811],
                    ti: [-6.5, -15],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [32.875, 146.957],
                    e: [53.875, 205.957],
                    to: [6.5, 15],
                    ti: [-3.5, -9.83333301544189],
                  },
                  { t: 38.0000015477717 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 18",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0.101, -1.628],
                    [1, 0],
                    [-2.849, 0.721],
                  ],
                  o: [
                    [-0.328, 1.78],
                    [-3, -1],
                    [1.468, 0.001],
                  ],
                  v: [
                    [3.114, 0.08],
                    [-0.214, 2.861],
                    [0.635, -2.861],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.36, 0.36, 0.36, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 5,
                    s: [-30.161, 87.491],
                    e: [-32.235, 88.427],
                    to: [-0.34569102525711, 0.15597680211067],
                    ti: [3.17902445793152, -2.98931002616882],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 13,
                    s: [-32.235, 88.427],
                    e: [-49.235, 105.427],
                    to: [-3.17902445793152, 2.98931002616882],
                    ti: [5.16666650772095, -10.1666669845581],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [-49.235, 105.427],
                    e: [-50.134, 116.117],
                    to: [-1.51989221572876, 2.99075555801392],
                    ti: [1.41723728179932, -4.05970621109009],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 24,
                    s: [-50.134, 116.117],
                    e: [-63.235, 149.427],
                    to: [-3.40046787261963, 9.74071216583252],
                    ti: [3.05858492851257, -11.4108753204346],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [-63.235, 149.427],
                    e: [-73.5, 162.615],
                    to: [-1.03509068489075, 3.86168432235718],
                    ti: [1.11909818649292, -4.78954076766968],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 32,
                    s: [-73.5, 162.615],
                    e: [-74.702, 182.474],
                    to: [-1.52024471759796, 6.50637722015381],
                    ti: [-0.08105966448784, -6.37978315353394],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 35,
                    s: [-74.702, 182.474],
                    e: [-83.235, 202.927],
                    to: [0.10907603800297, 8.58480644226074],
                    ti: [0.87328541278839, -3.85701060295105],
                  },
                  { t: 38.0000015477717 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 19",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 5,
                    s: [
                      {
                        i: [
                          [13.591, 10.857],
                          [0, 12.458],
                          [19.04, 5.29],
                          [1.099, 0.227],
                          [1.561, 0.174],
                          [0.914, 0.053],
                          [1.029, 0],
                          [0, -25.696],
                          [-6.433, -7.98],
                          [0, -20.53],
                          [-32.723, 0],
                          [0, 32.722],
                        ],
                        o: [
                          [7.973, -8.351],
                          [0, -20.95],
                          [-1.068, -0.297],
                          [-1.509, -0.311],
                          [-0.899, -0.1],
                          [-1.012, -0.059],
                          [-25.696, 0],
                          [0, 11.048],
                          [-15.863, 10.631],
                          [0, 32.722],
                          [32.722, 0],
                          [0, -18.747],
                        ],
                        v: [
                          [38.04, -10.713],
                          [49.82, -42.827],
                          [16.934, -85.322],
                          [13.684, -86.108],
                          [9.076, -86.837],
                          [6.356, -87.068],
                          [3.294, -87.157],
                          [-43.232, -42.827],
                          [-32.941, -13.656],
                          [-59.249, 34.495],
                          [0.001, 87.156],
                          [59.25, 34.495],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [13.591, 10.857],
                          [0, 12.458],
                          [17.326, 10.681],
                          [3.146, -4.072],
                          [1.451, 0.162],
                          [2.257, 5.37],
                          [0.933, -0.315],
                          [0, -25.696],
                          [-6.433, -7.98],
                          [0, -20.53],
                          [-32.723, 0],
                          [0, 32.722],
                        ],
                        o: [
                          [7.973, -8.351],
                          [0, -20.99],
                          [-0.983, -0.585],
                          [-3.78, 4.893],
                          [-0.901, -0.1],
                          [-2.491, -5.926],
                          [-21.067, 6.372],
                          [0, 11.048],
                          [-15.863, 10.631],
                          [0, 32.722],
                          [32.722, 0],
                          [0, -18.747],
                        ],
                        v: [
                          [38.04, -10.713],
                          [50.088, -40.416],
                          [22.447, -80.532],
                          [11.541, -74.412],
                          [6.063, -63.136],
                          [3.111, -73.812],
                          [-5.276, -85.55],
                          [-43.232, -42.827],
                          [-32.941, -13.656],
                          [-59.249, 34.495],
                          [0.001, 87.157],
                          [59.25, 34.495],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 10,
                    s: [
                      {
                        i: [
                          [13.591, 10.857],
                          [0, 12.458],
                          [17.326, 10.681],
                          [3.146, -4.072],
                          [1.451, 0.162],
                          [2.257, 5.37],
                          [0.933, -0.315],
                          [0, -25.696],
                          [-6.433, -7.98],
                          [0, -20.53],
                          [-32.723, 0],
                          [0, 32.722],
                        ],
                        o: [
                          [7.973, -8.351],
                          [0, -20.99],
                          [-0.983, -0.585],
                          [-3.78, 4.893],
                          [-0.901, -0.1],
                          [-2.491, -5.926],
                          [-21.067, 6.372],
                          [0, 11.048],
                          [-15.863, 10.631],
                          [0, 32.722],
                          [32.722, 0],
                          [0, -18.747],
                        ],
                        v: [
                          [38.04, -10.713],
                          [50.088, -40.416],
                          [22.447, -80.532],
                          [11.541, -74.412],
                          [6.063, -63.136],
                          [3.111, -73.812],
                          [-5.276, -85.55],
                          [-43.232, -42.827],
                          [-32.941, -13.656],
                          [-59.249, 34.495],
                          [0.001, 87.157],
                          [59.25, 34.495],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [13.591, 10.857],
                          [0, 12.458],
                          [15.954, 14.993],
                          [4.304, -6.833],
                          [1.52, 0.17],
                          [3.322, 9.602],
                          [0.859, -0.567],
                          [0, -25.696],
                          [-6.433, -7.98],
                          [0, -20.53],
                          [-32.723, 0],
                          [0, 32.722],
                        ],
                        o: [
                          [7.973, -8.351],
                          [0, -21.023],
                          [-0.787, -0.74],
                          [-5.912, 9.386],
                          [-0.899, -0.1],
                          [-3.681, -10.638],
                          [-17.364, 11.47],
                          [0, 11.048],
                          [-15.863, 10.631],
                          [0, 32.722],
                          [32.722, 0],
                          [0, -18.747],
                        ],
                        v: [
                          [38.04, -10.713],
                          [50.303, -38.488],
                          [26.858, -76.7],
                          [12.689, -65.863],
                          [3.652, -44.175],
                          [-0.425, -66.04],
                          [-12.132, -84.264],
                          [-43.232, -42.827],
                          [-32.941, -13.656],
                          [-59.249, 34.495],
                          [0.001, 87.156],
                          [59.25, 34.495],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 14,
                    s: [
                      {
                        i: [
                          [13.591, 10.857],
                          [0, 12.458],
                          [15.954, 14.993],
                          [4.304, -6.833],
                          [1.52, 0.17],
                          [3.322, 9.602],
                          [0.859, -0.567],
                          [0, -25.696],
                          [-6.433, -7.98],
                          [0, -20.53],
                          [-32.723, 0],
                          [0, 32.722],
                        ],
                        o: [
                          [7.973, -8.351],
                          [0, -21.023],
                          [-0.787, -0.74],
                          [-5.912, 9.386],
                          [-0.899, -0.1],
                          [-3.681, -10.638],
                          [-17.364, 11.47],
                          [0, 11.048],
                          [-15.863, 10.631],
                          [0, 32.722],
                          [32.722, 0],
                          [0, -18.747],
                        ],
                        v: [
                          [38.04, -10.713],
                          [50.303, -38.488],
                          [26.858, -76.7],
                          [12.689, -65.863],
                          [3.652, -44.175],
                          [-0.425, -66.04],
                          [-12.132, -84.264],
                          [-43.232, -42.827],
                          [-32.941, -13.656],
                          [-59.249, 34.495],
                          [0.001, 87.156],
                          [59.25, 34.495],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [13.591, 10.857],
                          [-3.634, 6.668],
                          [15.954, 14.993],
                          [4.094, -11.543],
                          [2.524, -0.66],
                          [6.081, 16.876],
                          [0.328, -0.976],
                          [0, -25.696],
                          [-6.433, -7.98],
                          [0, -20.53],
                          [-32.723, 0],
                          [0, 32.722],
                        ],
                        o: [
                          [6.701, -3.271],
                          [3.647, -6.692],
                          [-0.787, -0.74],
                          [-5.623, 15.855],
                          [-2.229, 0.583],
                          [-6.738, -18.698],
                          [-5.312, 15.808],
                          [0, 11.048],
                          [-11.498, 15.097],
                          [0, 32.722],
                          [32.722, 0],
                          [0, -18.747],
                        ],
                        v: [
                          [40.45, -3.964],
                          [53.195, -17.278],
                          [36.017, -55.008],
                          [28.967, -34.644],
                          [-0.204, 2.584],
                          [-12.207, -31.359],
                          [-32.86, -66.91],
                          [-41.786, -32.703],
                          [-40.654, -7.871],
                          [-59.732, 36.906],
                          [0.001, 87.157],
                          [59.25, 40.28],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [
                      {
                        i: [
                          [13.591, 10.857],
                          [-3.634, 6.668],
                          [15.954, 14.993],
                          [4.094, -11.543],
                          [2.524, -0.66],
                          [6.081, 16.876],
                          [0.328, -0.976],
                          [0, -25.696],
                          [-6.433, -7.98],
                          [0, -20.53],
                          [-32.723, 0],
                          [0, 32.722],
                        ],
                        o: [
                          [6.701, -3.271],
                          [3.647, -6.692],
                          [-0.787, -0.74],
                          [-5.623, 15.855],
                          [-2.229, 0.583],
                          [-6.738, -18.698],
                          [-5.312, 15.808],
                          [0, 11.048],
                          [-11.498, 15.097],
                          [0, 32.722],
                          [32.722, 0],
                          [0, -18.747],
                        ],
                        v: [
                          [40.45, -3.964],
                          [53.195, -17.278],
                          [36.017, -55.008],
                          [28.967, -34.644],
                          [-0.204, 2.584],
                          [-12.207, -31.359],
                          [-32.86, -66.91],
                          [-41.786, -32.703],
                          [-40.654, -7.871],
                          [-59.732, 36.906],
                          [0.001, 87.157],
                          [59.25, 40.28],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [13.591, 10.857],
                          [-3.634, 6.668],
                          [5.831, 1.013],
                          [3.89, -12.169],
                          [4.452, -0.178],
                          [6.94, 15.746],
                          [0.328, -0.975],
                          [1.685, -13.578],
                          [-6.433, -7.98],
                          [-9.612, -18.673],
                          [-32.723, 0],
                          [-5.79, 23.132],
                        ],
                        o: [
                          [6.701, -3.271],
                          [3.647, -6.692],
                          [-1.064, -0.185],
                          [-5.344, 16.716],
                          [-3.352, 0.134],
                          [-7.689, -17.446],
                          [-5.312, 15.808],
                          [-1.361, 10.964],
                          [-11.498, 15.097],
                          [8.543, 16.598],
                          [32.722, 0],
                          [3.809, -15.218],
                        ],
                        v: [
                          [68.891, 28.816],
                          [62.354, 10.681],
                          [49.515, -14.997],
                          [44.649, 11.743],
                          [7.027, 44.522],
                          [-34.41, 15.571],
                          [-43.466, -20.633],
                          [-58.176, 3.451],
                          [-58.49, 25.391],
                          [-63.588, 68.239],
                          [0.001, 87.157],
                          [71.301, 67.757],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [
                      {
                        i: [
                          [13.591, 10.857],
                          [-3.634, 6.668],
                          [5.831, 1.013],
                          [3.89, -12.169],
                          [4.452, -0.178],
                          [6.94, 15.746],
                          [0.328, -0.975],
                          [1.685, -13.578],
                          [-6.433, -7.98],
                          [-9.612, -18.673],
                          [-32.723, 0],
                          [-5.79, 23.132],
                        ],
                        o: [
                          [6.701, -3.271],
                          [3.647, -6.692],
                          [-1.064, -0.185],
                          [-5.344, 16.716],
                          [-3.352, 0.134],
                          [-7.689, -17.446],
                          [-5.312, 15.808],
                          [-1.361, 10.964],
                          [-11.498, 15.097],
                          [8.543, 16.598],
                          [32.722, 0],
                          [3.809, -15.218],
                        ],
                        v: [
                          [68.891, 28.816],
                          [62.354, 10.681],
                          [49.515, -14.997],
                          [44.649, 11.743],
                          [7.027, 44.522],
                          [-34.41, 15.571],
                          [-43.466, -20.633],
                          [-58.176, 3.451],
                          [-58.49, 25.391],
                          [-63.588, 68.239],
                          [0.001, 87.157],
                          [71.301, 67.757],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [13.591, 10.857],
                          [0.505, 4.869],
                          [5.565, -0.479],
                          [5.357, -8.128],
                          [8.179, 0.117],
                          [6.899, 10.77],
                          [1.816, -1.118],
                          [4.954, -11.82],
                          [-2.909, -6.738],
                          [-14.173, -9.011],
                          [-32.723, 0],
                          [-15.353, 14.91],
                        ],
                        o: [
                          [0.012, -1.102],
                          [0.013, -4.755],
                          [-2.257, 0.806],
                          [-7.359, 11.165],
                          [-12.966, -0.377],
                          [-7.644, -11.932],
                          [-5.493, 10.566],
                          [-2.93, 8.63],
                          [-11.498, 15.097],
                          [14.75, 8.825],
                          [32.722, 0],
                          [7.786, -7.264],
                        ],
                        v: [
                          [82.991, 45.808],
                          [71.392, 33.458],
                          [55.118, 17.18],
                          [45.174, 36.081],
                          [7.208, 57.357],
                          [-37.105, 36.771],
                          [-47.081, 12.809],
                          [-64.865, 28.397],
                          [-69.337, 43.287],
                          [-65.456, 76.012],
                          [0.001, 87.157],
                          [78.893, 74.747],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 33,
                    s: [
                      {
                        i: [
                          [13.591, 10.857],
                          [0.505, 4.869],
                          [5.565, -0.479],
                          [5.357, -8.128],
                          [8.179, 0.117],
                          [6.899, 10.77],
                          [1.816, -1.118],
                          [4.954, -11.82],
                          [-2.909, -6.738],
                          [-14.173, -9.011],
                          [-32.723, 0],
                          [-15.353, 14.91],
                        ],
                        o: [
                          [0.012, -1.102],
                          [0.013, -4.755],
                          [-2.257, 0.806],
                          [-7.359, 11.165],
                          [-12.966, -0.377],
                          [-7.644, -11.932],
                          [-5.493, 10.566],
                          [-2.93, 8.63],
                          [-11.498, 15.097],
                          [14.75, 8.825],
                          [32.722, 0],
                          [7.786, -7.264],
                        ],
                        v: [
                          [82.991, 45.808],
                          [71.392, 33.458],
                          [55.118, 17.18],
                          [45.174, 36.081],
                          [7.208, 57.357],
                          [-37.105, 36.771],
                          [-47.081, 12.809],
                          [-64.865, 28.397],
                          [-69.337, 43.287],
                          [-65.456, 76.012],
                          [0.001, 87.157],
                          [78.893, 74.747],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [7.183, 4.923],
                          [7.404, 1.87],
                          [5.122, -2.965],
                          [7.802, -1.393],
                          [14.39, 0.61],
                          [6.831, 2.475],
                          [4.297, -1.356],
                          [10.401, -8.89],
                          [5.856, -2.498],
                          [-9.775, -0.756],
                          [-32.723, 0],
                          [-27.042, 6.716],
                        ],
                        o: [
                          [-7.52, -0.861],
                          [-6.044, -1.527],
                          [-4.245, 2.458],
                          [-10.717, 1.914],
                          [-28.989, -1.228],
                          [-7.568, -2.743],
                          [-5.794, 1.829],
                          [-5.545, 4.74],
                          [-10.775, 12.205],
                          [15.588, 1.206],
                          [32.722, 0],
                          [7.104, -1.764],
                        ],
                        v: [
                          [106.732, 75.093],
                          [86.457, 71.42],
                          [64.458, 70.808],
                          [46.048, 76.642],
                          [7.509, 78.748],
                          [-41.597, 72.106],
                          [-53.107, 68.547],
                          [-76.012, 69.974],
                          [-87.896, 71.427],
                          [-57.08, 82.942],
                          [0.001, 87.157],
                          [75.398, 83.665],
                        ],
                      },
                    ],
                  },
                  { t: 38.0000015477717 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.36, 0.36, 0.36, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [1, 1, 0.95, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-17.263, 129.195], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 22",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                    [-0.825, -1.373],
                    [1.435, -0.805],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [1.38, -0.814],
                    [0.847, 1.41],
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [-23.938, 10.875],
                    [19.107, -14.516],
                    [23.09, -13.504],
                    [22.016, -9.457],
                    [-22.189, 15.329],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.37, 0.3, 0.2, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.54, 0.44, 0.28, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 5,
                    s: [43.299, 119.761],
                    e: [43.299, 119.761],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 14,
                    s: [43.299, 119.761],
                    e: [44.299, 130.761],
                    to: [0.16666667163372, 1.83333337306976],
                    ti: [-3.83333325386047, -5.66666650772095],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [44.299, 130.761],
                    e: [66.299, 153.761],
                    to: [3.83333325386047, 5.66666650772095],
                    ti: [-8.66666698455811, -10.3333330154419],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [66.299, 153.761],
                    e: [96.299, 192.761],
                    to: [8.66666698455811, 10.3333330154419],
                    ti: [-5, -8.5],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 35,
                    s: [96.299, 192.761],
                    e: [96.299, 204.761],
                    to: [5, 8.5],
                    ti: [0, -2],
                  },
                  { t: 37.0000015070409 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: {
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 22,
                    s: [0],
                    e: [-15],
                    __fnct: [null],
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 30,
                    s: [-15],
                    e: [7.714],
                    __fnct: [null],
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 35,
                    s: [7.714],
                    e: [29],
                    __fnct: [null],
                  },
                  { t: 37.0000015070409 },
                ],
                ix: 6,
              },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 23",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                    [0.825, -1.373],
                    [-1.435, -0.805],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [-1.38, -0.814],
                    [-0.847, 1.41],
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [23.938, 10.875],
                    [-19.108, -14.516],
                    [-23.091, -13.504],
                    [-22.017, -9.457],
                    [22.188, 15.329],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.37, 0.3, 0.2, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.54, 0.44, 0.28, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 5,
                    s: [-75.399, 117.565],
                    e: [-75.399, 117.565],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 15,
                    s: [-75.399, 117.565],
                    e: [-80.399, 125.565],
                    to: [-0.83333331346512, 1.33333337306976],
                    ti: [2.66666674613953, -6.33333349227905],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [-80.399, 125.565],
                    e: [-91.399, 155.565],
                    to: [-2.66666674613953, 6.33333349227905],
                    ti: [5.16666650772095, -12.3333330154419],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [-91.399, 155.565],
                    e: [-111.399, 199.565],
                    to: [-5.16666650772095, 12.3333330154419],
                    ti: [3.33333325386047, -8.33333301544189],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 34,
                    s: [-111.399, 199.565],
                    e: [-111.399, 205.565],
                    to: [-3.33333325386047, 8.33333301544189],
                    ti: [0, -1],
                  },
                  { t: 35.0000014255792 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: {
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 21,
                    s: [0],
                    e: [14],
                    __fnct: [null],
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 30,
                    s: [14],
                    e: [-19],
                    __fnct: [null],
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 34,
                    s: [-19],
                    e: [-29],
                    __fnct: [null],
                  },
                  { t: 35.0000014255792 },
                ],
                ix: 6,
              },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 24",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [
                      {
                        i: [
                          [2.423, -2.111],
                          [13.738, 0.289],
                          [3.259, 0.144],
                          [3.199, 0.136],
                          [2.673, 0.036],
                          [-2.295, 3.547],
                          [-2.939, 0.942],
                          [-2.533, 0.419],
                          [-8.104, 0.17],
                          [-2.706, -0.044],
                          [-10.598, -2.376],
                        ],
                        o: [
                          [-2.607, 2.272],
                          [-3.28, -0.04],
                          [-3.259, -0.143],
                          [-2.743, -0.117],
                          [-5.618, -0.715],
                          [1.591, -2.459],
                          [2.435, -0.702],
                          [7.967, -0.694],
                          [2.702, -0.056],
                          [10.988, 0.613],
                          [2.126, 0.805],
                        ],
                        v: [
                          [42.436, 1.256],
                          [3.092, 6.539],
                          [-6.726, 6.236],
                          [-16.423, 5.789],
                          [-24.552, 5.543],
                          [-42.564, -0.727],
                          [-34.608, -4.633],
                          [-26.416, -5.323],
                          [-2.271, -6.761],
                          [5.842, -6.785],
                          [39.428, -2.796],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [2.423, -2.111],
                          [13.738, 0.289],
                          [3.259, 0.144],
                          [3.199, 0.136],
                          [2.673, 0.036],
                          [-2.295, 3.547],
                          [-2.939, 0.942],
                          [-2.533, 0.419],
                          [-8.104, 0.17],
                          [-2.706, -0.044],
                          [-10.598, -2.376],
                        ],
                        o: [
                          [-2.607, 2.272],
                          [-3.28, -0.04],
                          [-3.259, -0.143],
                          [-2.743, -0.117],
                          [-5.618, -0.715],
                          [1.591, -2.459],
                          [2.435, -0.702],
                          [7.967, -0.694],
                          [2.702, -0.056],
                          [10.988, 0.613],
                          [2.126, 0.805],
                        ],
                        v: [
                          [64.128, 1.739],
                          [3.092, 6.539],
                          [-6.726, 6.236],
                          [-16.423, 5.789],
                          [-24.552, 5.543],
                          [-59.918, -2.173],
                          [-34.608, -4.633],
                          [-26.416, -5.323],
                          [-2.271, -6.761],
                          [5.842, -6.785],
                          [39.428, -2.796],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [
                      {
                        i: [
                          [2.423, -2.111],
                          [13.738, 0.289],
                          [3.259, 0.144],
                          [3.199, 0.136],
                          [2.673, 0.036],
                          [-2.295, 3.547],
                          [-2.939, 0.942],
                          [-2.533, 0.419],
                          [-8.104, 0.17],
                          [-2.706, -0.044],
                          [-10.598, -2.376],
                        ],
                        o: [
                          [-2.607, 2.272],
                          [-3.28, -0.04],
                          [-3.259, -0.143],
                          [-2.743, -0.117],
                          [-5.618, -0.715],
                          [1.591, -2.459],
                          [2.435, -0.702],
                          [7.967, -0.694],
                          [2.702, -0.056],
                          [10.988, 0.613],
                          [2.126, 0.805],
                        ],
                        v: [
                          [64.128, 1.739],
                          [3.092, 6.539],
                          [-6.726, 6.236],
                          [-16.423, 5.789],
                          [-24.552, 5.543],
                          [-59.918, -2.173],
                          [-34.608, -4.633],
                          [-26.416, -5.323],
                          [-2.271, -6.761],
                          [5.842, -6.785],
                          [39.428, -2.796],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [3.207, -0.207],
                          [44.929, 1.681],
                          [3.259, 0.144],
                          [3.198, -0.148],
                          [2.673, 0.036],
                          [-2.295, 3.547],
                          [-2.939, 0.942],
                          [-2.533, 0.419],
                          [-8.104, 0.17],
                          [-2.706, -0.044],
                          [-68.054, 4.75],
                        ],
                        o: [
                          [-25.749, 1.662],
                          [-3.28, -0.04],
                          [-3.259, -0.143],
                          [-21.362, 0.985],
                          [-5.618, -0.715],
                          [1.591, -2.459],
                          [2.435, -0.702],
                          [7.967, -0.694],
                          [2.702, -0.056],
                          [10.988, 0.613],
                          [2.126, 0.805],
                        ],
                        v: [
                          [106.549, -3.564],
                          [26.231, 7.504],
                          [-6.726, 6.236],
                          [-16.423, 5.789],
                          [-62.152, 1.205],
                          [-89.323, -2.655],
                          [-34.608, -4.633],
                          [-26.416, -5.323],
                          [-3.235, -4.35],
                          [6.324, -3.41],
                          [102.095, -7.616],
                        ],
                      },
                    ],
                  },
                  { t: 38.0000015477717 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.58, 0.33, 0.41, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-16.205, 213.523], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 25",
        },
      ],
      bounds: { l: -144, t: 39, b: 227, r: 128 },
      ip: 0,
      op: 95.0000038694293,
      st: 5.00000020365417,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 6,
      ty: 4,
      nm: "圍巾後面",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [1038, 584, 0] },
        a: { k: [448, 397, 0] },
        s: { k: [209.526, 209.526, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 0,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-5.13, -4.761],
                          [-2.52, -3.48],
                          [-0.888, -1.873],
                          [-0.326, -1.103],
                          [0, 0],
                          [0.078, 0.142],
                          [0.279, 0.497],
                          [1.226, 2.085],
                          [2.879, 2.943],
                        ],
                        o: [
                          [0, 0],
                          [2.923, 2.713],
                          [1.292, 1.784],
                          [0.518, 1.093],
                          [0, 0],
                          [0, 0],
                          [-0.12, -0.217],
                          [-0.64, -1.141],
                          [-3.101, -5.277],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-8.024, -11.507],
                          [1.699, -3.601],
                          [10.24, 5.83],
                          [13.561, 11.336],
                          [14.837, 14.635],
                          [4.004, 11.97],
                          [3.884, 11.753],
                          [3.279, 10.667],
                          [0.392, 5.642],
                          [-10.001, -9.69],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-9.189, -0.736],
                          [-3.147, 0.792],
                          [-2.089, 0.959],
                          [-1.568, 0.791],
                          [0, 0],
                          [0.374, -0.053],
                          [1.197, -0.098],
                          [3.444, 0.787],
                          [2.879, 2.943],
                        ],
                        o: [
                          [0, 0],
                          [5.237, 0.419],
                          [1.613, -0.406],
                          [1.219, -0.56],
                          [0, 0],
                          [0, 0],
                          [-0.571, 0.081],
                          [-2.747, 0.226],
                          [-8.714, -1.991],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-8.024, -11.507],
                          [12.4, -5.655],
                          [23.687, -5.92],
                          [29.066, -7.927],
                          [33.212, -9.945],
                          [23.572, 0.515],
                          [22.991, 0.603],
                          [20.264, 0.903],
                          [10.073, 0.446],
                          [-10.001, -9.69],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 2,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-9.189, -0.736],
                          [-3.147, 0.792],
                          [-2.089, 0.959],
                          [-1.568, 0.791],
                          [0, 0],
                          [0.374, -0.053],
                          [1.197, -0.098],
                          [3.444, 0.787],
                          [2.879, 2.943],
                        ],
                        o: [
                          [0, 0],
                          [5.237, 0.419],
                          [1.613, -0.406],
                          [1.219, -0.56],
                          [0, 0],
                          [0, 0],
                          [-0.571, 0.081],
                          [-2.747, 0.226],
                          [-8.714, -1.991],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-8.024, -11.507],
                          [12.4, -5.655],
                          [23.687, -5.92],
                          [29.066, -7.927],
                          [33.212, -9.945],
                          [23.572, 0.515],
                          [22.991, 0.603],
                          [20.264, 0.903],
                          [10.073, 0.446],
                          [-10.001, -9.69],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-16.598, 4.66],
                          [-4.239, 3.085],
                          [-1.541, 1.623],
                          [-0.819, 0.948],
                          [0, 0],
                          [0.527, -0.396],
                          [1.842, -1.16],
                          [7.64, -1.678],
                          [2.879, 2.943],
                        ],
                        o: [
                          [0, 0],
                          [9.459, -2.656],
                          [2.174, -1.582],
                          [0.899, -0.947],
                          [0, 0],
                          [0, 0],
                          [-0.805, 0.606],
                          [-4.227, 2.662],
                          [-16.358, 3.594],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-9.694, -13.893],
                          [23.014, -10.044],
                          [42.632, -18.745],
                          [48.079, -23.565],
                          [50.632, -26.41],
                          [47.197, -15.235],
                          [46.39, -14.609],
                          [42.36, -11.848],
                          [23.848, -3.979],
                          [-11.075, -8.855],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 5,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-16.598, 4.66],
                          [-4.239, 3.085],
                          [-1.541, 1.623],
                          [-0.819, 0.948],
                          [0, 0],
                          [0.527, -0.396],
                          [1.842, -1.16],
                          [7.64, -1.678],
                          [2.879, 2.943],
                        ],
                        o: [
                          [0, 0],
                          [9.459, -2.656],
                          [2.174, -1.582],
                          [0.899, -0.947],
                          [0, 0],
                          [0, 0],
                          [-0.805, 0.606],
                          [-4.227, 2.662],
                          [-16.358, 3.594],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-9.694, -13.893],
                          [23.014, -10.044],
                          [42.632, -18.745],
                          [48.079, -23.565],
                          [50.632, -26.41],
                          [47.197, -15.235],
                          [46.39, -14.609],
                          [42.36, -11.848],
                          [23.848, -3.979],
                          [-11.075, -8.855],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-20.488, 7.7],
                          [-3.966, 5.465],
                          [-1.122, 3.138],
                          [-0.386, 1.894],
                          [0, 0],
                          [0.553, -0.71],
                          [1.997, -2.083],
                          [9.158, -3.084],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [8.288, -3.115],
                          [2.034, -2.802],
                          [0.655, -1.831],
                          [0, 0],
                          [0, 0],
                          [-0.846, 1.086],
                          [-4.584, 4.781],
                          [-19.475, 6.559],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-10.172, -13.535],
                          [33.444, -13.425],
                          [51.542, -26.65],
                          [56.238, -35.608],
                          [57.791, -41.206],
                          [61.753, -27.405],
                          [60.911, -26.284],
                          [56.603, -21.33],
                          [35.473, -7.113],
                          [-11.552, -8.975],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 8,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-20.488, 7.7],
                          [-3.966, 5.465],
                          [-1.122, 3.138],
                          [-0.386, 1.894],
                          [0, 0],
                          [0.553, -0.71],
                          [1.997, -2.083],
                          [9.158, -3.084],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [8.288, -3.115],
                          [2.034, -2.802],
                          [0.655, -1.831],
                          [0, 0],
                          [0, 0],
                          [-0.846, 1.086],
                          [-4.584, 4.781],
                          [-19.475, 6.559],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-10.172, -13.535],
                          [33.444, -13.425],
                          [51.542, -26.65],
                          [56.238, -35.608],
                          [57.791, -41.206],
                          [61.753, -27.405],
                          [60.911, -26.284],
                          [56.603, -21.33],
                          [35.473, -7.113],
                          [-11.552, -8.975],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-17.965, 12.501],
                          [2.05, 9.903],
                          [2.138, 3.159],
                          [1.388, 0.594],
                          [0, 0],
                          [-0.748, -1.061],
                          [-1.311, -3.625],
                          [12.722, -13.841],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [6.88, -4.788],
                          [-1.051, -5.078],
                          [-1.248, -1.844],
                          [1.006, -1.894],
                          [0, 0],
                          [1.144, 1.622],
                          [3.008, 8.317],
                          [-15.7, 17.081],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-9.694, -13.416],
                          [37.023, -19.152],
                          [42.683, -45.292],
                          [37.685, -58.201],
                          [33.689, -61.967],
                          [48.39, -62.007],
                          [49.646, -60.375],
                          [53.807, -52.36],
                          [45.018, -17.374],
                          [-11.313, -8.736],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 11,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-17.965, 12.501],
                          [2.05, 9.903],
                          [2.138, 3.159],
                          [1.388, 0.594],
                          [0, 0],
                          [-0.748, -1.061],
                          [-1.311, -3.625],
                          [12.722, -13.841],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [6.88, -4.788],
                          [-1.051, -5.078],
                          [-1.248, -1.844],
                          [1.006, -1.894],
                          [0, 0],
                          [1.144, 1.622],
                          [3.008, 8.317],
                          [-15.7, 17.081],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-9.694, -13.416],
                          [37.023, -19.152],
                          [42.683, -45.292],
                          [37.685, -58.201],
                          [33.689, -61.967],
                          [48.39, -62.007],
                          [49.646, -60.375],
                          [53.807, -52.36],
                          [45.018, -17.374],
                          [-11.313, -8.736],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-9.726, 19.722],
                          [8.874, 6.479],
                          [5.404, -0.671],
                          [0.019, 0.709],
                          [0, 0],
                          [-3.842, -0.203],
                          [-6.726, -7.026],
                          [9.052, -13.55],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [8.452, -17.138],
                          [-6.797, -4.962],
                          [-3.154, 0.392],
                          [1.722, -1.417],
                          [0, 0],
                          [5.874, 0.311],
                          [10.041, 10.488],
                          [-14.857, 22.24],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-9.933, -14.609],
                          [51.818, -25.834],
                          [46.82, -55.545],
                          [26.052, -59.183],
                          [20.803, -59.103],
                          [31.208, -70.359],
                          [37.659, -70.582],
                          [59.017, -61.464],
                          [60.529, -18.329],
                          [-11.194, -8.497],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 14,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-9.726, 19.722],
                          [8.874, 6.479],
                          [5.404, -0.671],
                          [0.019, 0.709],
                          [0, 0],
                          [-3.842, -0.203],
                          [-6.726, -7.026],
                          [9.052, -13.55],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [8.452, -17.138],
                          [-6.797, -4.962],
                          [-3.154, 0.392],
                          [1.722, -1.417],
                          [0, 0],
                          [5.874, 0.311],
                          [10.041, 10.488],
                          [-14.857, 22.24],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-9.933, -14.609],
                          [51.818, -25.834],
                          [46.82, -55.545],
                          [26.052, -59.183],
                          [20.803, -59.103],
                          [31.208, -70.359],
                          [37.659, -70.582],
                          [59.017, -61.464],
                          [60.529, -18.329],
                          [-11.194, -8.497],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-11.635, 19.722],
                          [22.896, 3.962],
                          [4.224, -5.524],
                          [0.019, 0.709],
                          [0, 0],
                          [-3.863, 5.952],
                          [-25.493, -2.405],
                          [10.199, -19.76],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [10.746, -18.214],
                          [-12.931, -2.238],
                          [-2.465, 3.224],
                          [1.722, -1.417],
                          [0, 0],
                          [5.906, -9.102],
                          [40.347, 3.807],
                          [-20.268, 39.268],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-10.53, -14.251],
                          [66.614, -31.084],
                          [52.07, -72.727],
                          [26.819, -61.701],
                          [23.189, -49.558],
                          [3.049, -58.427],
                          [7.951, -69.506],
                          [51.858, -87.236],
                          [82.961, -28.829],
                          [-11.433, -5.872],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 17,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-11.635, 19.722],
                          [22.896, 3.962],
                          [4.224, -5.524],
                          [0.019, 0.709],
                          [0, 0],
                          [-3.863, 5.952],
                          [-25.493, -2.405],
                          [10.199, -19.76],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [10.746, -18.214],
                          [-12.931, -2.238],
                          [-2.465, 3.224],
                          [1.722, -1.417],
                          [0, 0],
                          [5.906, -9.102],
                          [40.347, 3.807],
                          [-20.268, 39.268],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-10.53, -14.251],
                          [66.614, -31.084],
                          [52.07, -72.727],
                          [26.819, -61.701],
                          [23.189, -49.558],
                          [3.049, -58.427],
                          [7.951, -69.506],
                          [51.858, -87.236],
                          [82.961, -28.829],
                          [-11.433, -5.872],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-10.617, 20.225],
                          [21.014, 2.795],
                          [3.587, -8.169],
                          [-3.311, 4.375],
                          [0, 0],
                          [5.857, 24.563],
                          [-25.882, -0.44],
                          [10.199, -19.76],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [11.001, -21.637],
                          [-11.151, -1.559],
                          [-2.15, 5.096],
                          [0.131, 4.787],
                          [0, 0],
                          [-2.417, -10.338],
                          [40.904, 0.704],
                          [-20.268, 39.268],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-10.53, -14.251],
                          [67.409, -32.198],
                          [49.763, -73.761],
                          [25.735, -60.834],
                          [32.416, -50.751],
                          [35.504, -36.712],
                          [13.565, -52.63],
                          [48.12, -86.6],
                          [82.961, -28.829],
                          [-11.433, -5.872],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 19,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-10.617, 20.225],
                          [21.014, 2.795],
                          [3.587, -8.169],
                          [-3.311, 4.375],
                          [0, 0],
                          [5.857, 24.563],
                          [-25.882, -0.44],
                          [10.199, -19.76],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [11.001, -21.637],
                          [-11.151, -1.559],
                          [-2.15, 5.096],
                          [0.131, 4.787],
                          [0, 0],
                          [-2.417, -10.338],
                          [40.904, 0.704],
                          [-20.268, 39.268],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-10.53, -14.251],
                          [67.409, -32.198],
                          [49.763, -73.761],
                          [25.735, -60.834],
                          [32.416, -50.751],
                          [35.504, -36.712],
                          [13.565, -52.63],
                          [48.12, -86.6],
                          [82.961, -28.829],
                          [-11.433, -5.872],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-10.108, 20.476],
                          [20.073, 2.211],
                          [3.269, -9.491],
                          [-4.976, 6.208],
                          [0, 0],
                          [10.447, 20.301],
                          [-26.077, 0.542],
                          [10.199, -19.76],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [11.129, -23.348],
                          [-10.261, -1.22],
                          [-1.992, 6.033],
                          [2.676, 5.384],
                          [0, 0],
                          [-6.578, -10.956],
                          [41.182, -0.847],
                          [-20.268, 39.268],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-10.53, -14.251],
                          [67.807, -32.755],
                          [48.61, -74.278],
                          [25.193, -60.401],
                          [37.03, -51.348],
                          [45.646, -41.604],
                          [14.941, -47.413],
                          [46.251, -86.281],
                          [82.961, -28.829],
                          [-11.433, -5.872],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 21,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-10.108, 20.476],
                          [20.073, 2.211],
                          [3.269, -9.491],
                          [-4.976, 6.208],
                          [0, 0],
                          [10.447, 20.301],
                          [-26.077, 0.542],
                          [10.199, -19.76],
                          [2.674, 2.733],
                        ],
                        o: [
                          [0, 0],
                          [11.129, -23.348],
                          [-10.261, -1.22],
                          [-1.992, 6.033],
                          [2.676, 5.384],
                          [0, 0],
                          [-6.578, -10.956],
                          [41.182, -0.847],
                          [-20.268, 39.268],
                          [-4.836, -4.944],
                        ],
                        v: [
                          [-10.53, -14.251],
                          [67.807, -32.755],
                          [48.61, -74.278],
                          [25.193, -60.401],
                          [37.03, -51.348],
                          [45.646, -41.604],
                          [14.941, -47.413],
                          [46.251, -86.281],
                          [82.961, -28.829],
                          [-11.433, -5.872],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-8.581, 21.23],
                          [17.249, 0.46],
                          [2.314, -13.459],
                          [-9.971, 11.708],
                          [0, 0],
                          [22.547, 15.152],
                          [-26.66, 3.49],
                          [11.146, -19.242],
                          [9.617, 1.908],
                        ],
                        o: [
                          [0, 0],
                          [11.512, -28.482],
                          [-7.591, -0.203],
                          [-1.52, 8.841],
                          [7.687, 2.401],
                          [0, 0],
                          [-19.063, -12.81],
                          [42.018, -5.5],
                          [-17.721, 30.592],
                          [-3.283, -0.651],
                        ],
                        v: [
                          [-13.393, -14.012],
                          [69, -34.425],
                          [45.15, -75.829],
                          [23.567, -59.101],
                          [44.189, -50.751],
                          [59.128, -50.553],
                          [20.022, -39.639],
                          [40.643, -85.327],
                          [82.961, -28.829],
                          [-6.422, -5.872],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 24,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-8.581, 21.23],
                          [17.249, 0.46],
                          [2.314, -13.459],
                          [-9.971, 11.708],
                          [0, 0],
                          [22.547, 15.152],
                          [-26.66, 3.49],
                          [11.146, -19.242],
                          [9.617, 1.908],
                        ],
                        o: [
                          [0, 0],
                          [11.512, -28.482],
                          [-7.591, -0.203],
                          [-1.52, 8.841],
                          [7.687, 2.401],
                          [0, 0],
                          [-19.063, -12.81],
                          [42.018, -5.5],
                          [-17.721, 30.592],
                          [-3.283, -0.651],
                        ],
                        v: [
                          [-13.393, -14.012],
                          [69, -34.425],
                          [45.15, -75.829],
                          [23.567, -59.101],
                          [44.189, -50.751],
                          [59.128, -50.553],
                          [20.022, -39.639],
                          [40.643, -85.327],
                          [82.961, -28.829],
                          [-6.422, -5.872],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-8.581, 21.23],
                          [17.009, -2.9],
                          [-6.77, -9.772],
                          [-5.676, 5.742],
                          [0, 0],
                          [29.722, 6.621],
                          [-26.66, 3.49],
                          [8.767, -23.817],
                          [10.333, -1.194],
                        ],
                        o: [
                          [0, 0],
                          [11.512, -28.482],
                          [-11.41, 1.945],
                          [5.109, 7.374],
                          [7.687, 2.401],
                          [0, 0],
                          [-25.179, -5.609],
                          [42.018, -5.5],
                          [-8.584, 23.318],
                          [-3.325, 0.384],
                        ],
                        v: [
                          [34.572, -18.546],
                          [69.477, -41.107],
                          [44.911, -68.67],
                          [29.294, -51.942],
                          [47.053, -52.899],
                          [61.753, -58.666],
                          [30.522, -36.059],
                          [42.552, -77.929],
                          [84.87, -40.761],
                          [45.839, -6.35],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 27,
                    s: [
                      {
                        i: [
                          [-2.546, -1.866],
                          [-8.581, 21.23],
                          [17.009, -2.9],
                          [-6.77, -9.772],
                          [-5.676, 5.742],
                          [0, 0],
                          [29.722, 6.621],
                          [-26.66, 3.49],
                          [8.767, -23.817],
                          [10.333, -1.194],
                        ],
                        o: [
                          [0, 0],
                          [11.512, -28.482],
                          [-11.41, 1.945],
                          [5.109, 7.374],
                          [7.687, 2.401],
                          [0, 0],
                          [-25.179, -5.609],
                          [42.018, -5.5],
                          [-8.584, 23.318],
                          [-3.325, 0.384],
                        ],
                        v: [
                          [34.572, -18.546],
                          [69.477, -41.107],
                          [44.911, -68.67],
                          [29.294, -51.942],
                          [47.053, -52.899],
                          [61.753, -58.666],
                          [30.522, -36.059],
                          [42.552, -77.929],
                          [84.87, -40.761],
                          [45.839, -6.35],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [7.759, -3.554],
                          [-3.828, 9.51],
                          [3.119, -0.465],
                          [-7.247, 0.966],
                          [1.96, 1.685],
                          [0, 0],
                          [12.525, -4.177],
                          [-2.458, 10.229],
                          [4.203, -10.969],
                          [3.174, -2.149],
                        ],
                        o: [
                          [0, 0],
                          [3.876, -9.63],
                          [-17.853, 2.661],
                          [3.068, -0.409],
                          [7.687, -2.849],
                          [0, 0],
                          [-6.4, 2.135],
                          [4.075, -16.954],
                          [-7.698, 20.092],
                          [-2.772, 1.877],
                        ],
                        v: [
                          [54.856, -33.819],
                          [51.818, -51.607],
                          [45.15, -61.988],
                          [35.499, -49.078],
                          [37.507, -54.569],
                          [44.333, -58.905],
                          [38.874, -44.889],
                          [25.609, -54.305],
                          [64.825, -59.374],
                          [67.794, -39.758],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [
                      {
                        i: [
                          [7.759, -3.554],
                          [-3.828, 9.51],
                          [3.119, -0.465],
                          [-7.247, 0.966],
                          [1.96, 1.685],
                          [0, 0],
                          [12.525, -4.177],
                          [-2.458, 10.229],
                          [4.203, -10.969],
                          [3.174, -2.149],
                        ],
                        o: [
                          [0, 0],
                          [3.876, -9.63],
                          [-17.853, 2.661],
                          [3.068, -0.409],
                          [7.687, -2.849],
                          [0, 0],
                          [-6.4, 2.135],
                          [4.075, -16.954],
                          [-7.698, 20.092],
                          [-2.772, 1.877],
                        ],
                        v: [
                          [54.856, -33.819],
                          [51.818, -51.607],
                          [45.15, -61.988],
                          [35.499, -49.078],
                          [37.507, -54.569],
                          [44.333, -58.905],
                          [38.874, -44.889],
                          [25.609, -54.305],
                          [64.825, -59.374],
                          [67.794, -39.758],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-7.514, -5.225],
                          [-2.076, 10.039],
                          [2.431, -0.203],
                          [-3.668, 0.966],
                          [1.96, 1.685],
                          [0, 0],
                          [0.832, -4.655],
                          [-0.786, 10.49],
                          [-2.351, -8.273],
                          [-3.973, 2.69],
                        ],
                        o: [
                          [0, 0],
                          [1.251, -6.05],
                          [-7.429, 0.619],
                          [1.318, -0.347],
                          [1.722, -2.133],
                          [0, 0],
                          [-1.187, 6.641],
                          [0.734, -9.795],
                          [1.37, 4.819],
                          [3.173, -2.149],
                        ],
                        v: [
                          [61.538, -44.796],
                          [42.75, -51.845],
                          [38.468, -57.216],
                          [35.499, -49.078],
                          [33.689, -52.422],
                          [35.981, -57.473],
                          [39.829, -48.707],
                          [27.756, -53.589],
                          [48.836, -58.897],
                          [57.532, -59.088],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 32,
                    s: [
                      {
                        i: [
                          [-7.514, -5.225],
                          [-2.076, 10.039],
                          [2.431, -0.203],
                          [-3.668, 0.966],
                          [1.96, 1.685],
                          [0, 0],
                          [0.832, -4.655],
                          [-0.786, 10.49],
                          [-2.351, -8.273],
                          [-3.973, 2.69],
                        ],
                        o: [
                          [0, 0],
                          [1.251, -6.05],
                          [-7.429, 0.619],
                          [1.318, -0.347],
                          [1.722, -2.133],
                          [0, 0],
                          [-1.187, 6.641],
                          [0.734, -9.795],
                          [1.37, 4.819],
                          [3.173, -2.149],
                        ],
                        v: [
                          [61.538, -44.796],
                          [42.75, -51.845],
                          [38.468, -57.216],
                          [35.499, -49.078],
                          [33.689, -52.422],
                          [35.981, -57.473],
                          [39.829, -48.707],
                          [27.756, -53.589],
                          [48.836, -58.897],
                          [57.532, -59.088],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-7.514, -5.225],
                          [1.967, -7.243],
                          [2.392, -0.477],
                          [-3.668, 0.966],
                          [1.96, 1.685],
                          [0, 0],
                          [2.064, -4.254],
                          [0.018, 5.477],
                          [0.293, 5.065],
                          [-3.973, 2.69],
                        ],
                        o: [
                          [0, 0],
                          [-0.71, 2.616],
                          [-3.773, 0.752],
                          [1.318, -0.347],
                          [1.722, -2.133],
                          [0, 0],
                          [-1.793, 3.697],
                          [-0.012, -3.544],
                          [-0.301, -5.203],
                          [3.173, -2.149],
                        ],
                        v: [
                          [46.027, -65.318],
                          [38.694, -58.527],
                          [33.934, -55.068],
                          [34.306, -50.271],
                          [32.973, -51.944],
                          [32.401, -54.132],
                          [38.397, -50.616],
                          [28.234, -52.873],
                          [33.802, -63.669],
                          [38.203, -73.167],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 34,
                    s: [
                      {
                        i: [
                          [-7.514, -5.225],
                          [1.967, -7.243],
                          [2.392, -0.477],
                          [-3.668, 0.966],
                          [1.96, 1.685],
                          [0, 0],
                          [2.064, -4.254],
                          [0.018, 5.477],
                          [0.293, 5.065],
                          [-3.973, 2.69],
                        ],
                        o: [
                          [0, 0],
                          [-0.71, 2.616],
                          [-3.773, 0.752],
                          [1.318, -0.347],
                          [1.722, -2.133],
                          [0, 0],
                          [-1.793, 3.697],
                          [-0.012, -3.544],
                          [-0.301, -5.203],
                          [3.173, -2.149],
                        ],
                        v: [
                          [46.027, -65.318],
                          [38.694, -58.527],
                          [33.934, -55.068],
                          [34.306, -50.271],
                          [32.973, -51.944],
                          [32.401, -54.132],
                          [38.397, -50.616],
                          [28.234, -52.873],
                          [33.802, -63.669],
                          [38.203, -73.167],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-5.843, -2.838],
                          [1.967, -7.243],
                          [2.392, -0.477],
                          [-3.668, 0.966],
                          [1.96, 1.685],
                          [0, 0],
                          [-0.582, -4.692],
                          [4.433, -1.563],
                          [2.177, 6.237],
                          [-0.883, 3.578],
                        ],
                        o: [
                          [0, 0],
                          [-0.71, 2.616],
                          [-3.773, 0.752],
                          [1.318, -0.347],
                          [1.722, -2.133],
                          [0, 0],
                          [0.474, 3.817],
                          [0.257, -0.131],
                          [-1.733, -4.965],
                          [0.918, -3.721],
                        ],
                        v: [
                          [41.254, -62.932],
                          [36.069, -56.618],
                          [33.934, -55.068],
                          [34.306, -50.271],
                          [32.019, -51.467],
                          [32.401, -54.132],
                          [36.25, -51.57],
                          [29.785, -46.668],
                          [28.433, -52.454],
                          [31.521, -63.86],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 36,
                    s: [
                      {
                        i: [
                          [-5.843, -2.838],
                          [1.967, -7.243],
                          [2.392, -0.477],
                          [-3.668, 0.966],
                          [1.96, 1.685],
                          [0, 0],
                          [-0.582, -4.692],
                          [4.433, -1.563],
                          [2.177, 6.237],
                          [-0.883, 3.578],
                        ],
                        o: [
                          [0, 0],
                          [-0.71, 2.616],
                          [-3.773, 0.752],
                          [1.318, -0.347],
                          [1.722, -2.133],
                          [0, 0],
                          [0.474, 3.817],
                          [0.257, -0.131],
                          [-1.733, -4.965],
                          [0.918, -3.721],
                        ],
                        v: [
                          [41.254, -62.932],
                          [36.069, -56.618],
                          [33.934, -55.068],
                          [34.306, -50.271],
                          [32.019, -51.467],
                          [32.401, -54.132],
                          [36.25, -51.57],
                          [29.785, -46.668],
                          [28.433, -52.454],
                          [31.521, -63.86],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-5.843, -2.838],
                          [1.251, -1.039],
                          [2.392, -0.477],
                          [-3.668, 0.966],
                          [1.96, 1.685],
                          [0, 0],
                          [2.064, -4.254],
                          [0.018, 5.477],
                          [-1.017, 5.774],
                          [-0.883, 3.578],
                        ],
                        o: [
                          [0, 0],
                          [-2.085, 1.732],
                          [-3.773, 0.752],
                          [1.318, -0.347],
                          [1.722, -2.133],
                          [0, 0],
                          [-1.793, 3.697],
                          [-0.012, -3.544],
                          [0.904, -5.133],
                          [0.918, -3.721],
                        ],
                        v: [
                          [37.674, -58.637],
                          [34.875, -54.948],
                          [33.934, -55.068],
                          [32.158, -49.317],
                          [31.78, -50.512],
                          [32.401, -54.132],
                          [37.92, -51.57],
                          [32.052, -48.816],
                          [33.087, -54.124],
                          [31.044, -52.883],
                        ],
                      },
                    ],
                  },
                  { t: 37.0000015070409 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [458.407, 407.885], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 7",
        },
      ],
      bounds: { l: 443, t: 319, b: 424, r: 548 },
      ip: 0,
      op: 38.0000015477717,
      st: 0,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 7,
      ty: 4,
      nm: "圍巾後面２",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [959, 587, 0] },
        a: { k: [411, 400, 0] },
        s: { k: [209.526, 209.526, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 11,
                    s: [
                      {
                        i: [
                          [0.474, -0.103],
                          [1.378, -1.247],
                          [-1.552, -1.074],
                          [0.171, -0.032],
                          [-2.414, -0.074],
                          [1.87, 1.714],
                          [2.179, 0.581],
                        ],
                        o: [
                          [0, 0],
                          [-0.174, -0.292],
                          [0.904, 0.625],
                          [1.842, 1.4],
                          [1.242, 0.038],
                          [-0.039, 0.163],
                          [-0.326, 0.223],
                        ],
                        v: [
                          [-39.158, -5.973],
                          [-41.135, -4.949],
                          [-42.024, -1.424],
                          [-40.884, -0.795],
                          [-34.241, 0.56],
                          [-37.213, -5.524],
                          [-37.761, -5.942],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0.474, -0.103],
                          [3.167, -0.65],
                          [-0.359, 0],
                          [0.171, -0.032],
                          [-2.414, -0.074],
                          [1.87, 1.714],
                          [2.179, 0.581],
                        ],
                        o: [
                          [0, 0],
                          [-0.174, -0.292],
                          [1.878, 2.188],
                          [1.842, 1.4],
                          [1.242, 0.038],
                          [-0.039, 0.163],
                          [-0.326, 0.223],
                        ],
                        v: [
                          [-39.158, -5.973],
                          [-43.164, -5.904],
                          [-49.064, -4.406],
                          [-40.884, -0.795],
                          [-34.241, 0.56],
                          [-37.213, -5.524],
                          [-37.761, -5.942],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 13,
                    s: [
                      {
                        i: [
                          [0.474, -0.103],
                          [3.167, -0.65],
                          [-0.359, 0],
                          [0.171, -0.032],
                          [-2.414, -0.074],
                          [1.87, 1.714],
                          [2.179, 0.581],
                        ],
                        o: [
                          [0, 0],
                          [-0.174, -0.292],
                          [1.878, 2.188],
                          [1.842, 1.4],
                          [1.242, 0.038],
                          [-0.039, 0.163],
                          [-0.326, 0.223],
                        ],
                        v: [
                          [-39.158, -5.973],
                          [-43.164, -5.904],
                          [-49.064, -4.406],
                          [-40.884, -0.795],
                          [-34.241, 0.56],
                          [-37.213, -5.524],
                          [-37.761, -5.942],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0.474, -0.103],
                          [3.167, -0.65],
                          [-0.359, 0],
                          [0.171, -0.032],
                          [-2.414, -0.074],
                          [1.87, 1.714],
                          [2.179, 0.581],
                        ],
                        o: [
                          [0, 0],
                          [-0.174, -0.292],
                          [1.878, 2.188],
                          [1.842, 1.4],
                          [1.242, 0.038],
                          [-0.039, 0.163],
                          [-0.326, 0.223],
                        ],
                        v: [
                          [-25.914, -3.587],
                          [-29.92, -3.518],
                          [-35.819, -2.02],
                          [-27.639, 1.592],
                          [-20.997, 2.946],
                          [-23.969, -3.138],
                          [-24.517, -3.556],
                        ],
                      },
                    ],
                  },
                  { t: 15.0000006109625 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [410.429, 396.77], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 6",
        },
      ],
      bounds: { l: 360, t: 389, b: 401, r: 391 },
      ip: 11.0000004480392,
      op: 15.0000006109625,
      st: -10.0000004073083,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 8,
      ty: 4,
      nm: "飛出藍1",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [921, 573.5, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [-99.326, 75.008, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 36,
                    s: [
                      {
                        i: [
                          [-0.697, -6.156],
                          [-9.389, 3.314],
                          [7.395, 23.596],
                        ],
                        o: [
                          [0.874, 7.729],
                          [4.25, -1.5],
                          [-1.374, -4.386],
                        ],
                        v: [
                          [-143.251, -80.321],
                          [-133.778, -67.491],
                          [-138.255, -89.41],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-17.812, 3.843],
                          [-9.389, 3.314],
                          [24.007, 15.597],
                        ],
                        o: [
                          [7.603, -1.64],
                          [4.25, -1.5],
                          [-1.833, -1.191],
                        ],
                        v: [
                          [-58.178, 15.669],
                          [-40.65, 8.501],
                          [-95.466, -13.417],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 39,
                    s: [
                      {
                        i: [
                          [-17.812, 3.843],
                          [-9.389, 3.314],
                          [24.007, 15.597],
                        ],
                        o: [
                          [7.603, -1.64],
                          [4.25, -1.5],
                          [-1.833, -1.191],
                        ],
                        v: [
                          [-58.178, 15.669],
                          [-40.65, 8.501],
                          [-95.466, -13.417],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-46.002, 11.175],
                          [1.409, 11.01],
                          [46.156, 15.597],
                        ],
                        o: [
                          [7.558, -1.836],
                          [-0.572, -4.471],
                          [-5.853, -1.978],
                        ],
                        v: [
                          [31.427, 33.667],
                          [25.798, 13.167],
                          [-36.066, 17.246],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 41,
                    s: [
                      {
                        i: [
                          [-46.002, 11.175],
                          [1.409, 11.01],
                          [46.156, 15.597],
                        ],
                        o: [
                          [7.558, -1.836],
                          [-0.572, -4.471],
                          [-5.853, -1.978],
                        ],
                        v: [
                          [31.427, 33.667],
                          [25.798, 13.167],
                          [-36.066, 17.246],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-20.329, 26.507],
                          [1.409, 11.01],
                          [46.156, -9.733],
                        ],
                        o: [
                          [4.734, -6.172],
                          [-0.572, -4.471],
                          [-5.314, 1.121],
                        ],
                        v: [
                          [107.942, 9.669],
                          [92.749, -2.831],
                          [49.511, 27.245],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 43,
                    s: [
                      {
                        i: [
                          [-20.329, 26.507],
                          [1.409, 11.01],
                          [46.156, -9.733],
                        ],
                        o: [
                          [4.734, -6.172],
                          [-0.572, -4.471],
                          [-5.314, 1.121],
                        ],
                        v: [
                          [107.942, 9.669],
                          [92.749, -2.831],
                          [49.511, 27.245],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0.31, 47.838],
                          [1.409, 11.01],
                          [21.24, -28.706],
                        ],
                        o: [
                          [-0.05, -7.778],
                          [-0.572, -4.47],
                          [-2.169, 2.932],
                        ],
                        v: [
                          [114.487, -43.659],
                          [100.803, -36.161],
                          [90.286, 11.247],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 45,
                    s: [
                      {
                        i: [
                          [0.31, 47.838],
                          [1.409, 11.01],
                          [21.24, -28.706],
                        ],
                        o: [
                          [-0.05, -7.778],
                          [-0.572, -4.47],
                          [-2.169, 2.932],
                        ],
                        v: [
                          [114.487, -43.659],
                          [100.803, -36.161],
                          [90.286, 11.247],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [8.231, 10.768],
                          [-4.279, -10.242],
                          [8.905, -33.731],
                        ],
                        o: [
                          [-6.234, -8.156],
                          [5.436, 13.01],
                          [-0.931, 3.526],
                        ],
                        v: [
                          [104.419, -65.656],
                          [89.729, -52.159],
                          [104.885, -34.749],
                        ],
                      },
                    ],
                  },
                  { t: 47.0000019143492 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.25, 0.44, 0.48, 1] },
              o: { k: 100 },
              w: { k: 4 },
              lc: 1,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.33, 0.79, 0.93, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-53.383, -4.18], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
        },
      ],
      bounds: { l: -199, t: -97, b: 35, r: 64 },
      ip: 36.0000014663101,
      op: 48.0000019550801,
      st: -14.0000005702317,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 9,
      ty: 4,
      nm: "飛出紅3",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [935, 573.5, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [-99.326, 75.008, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 33,
                    s: [
                      {
                        i: [
                          [-0.697, -6.156],
                          [-9.389, 3.314],
                          [7.395, 23.596],
                        ],
                        o: [
                          [0.874, 7.729],
                          [4.25, -1.5],
                          [-1.374, -4.386],
                        ],
                        v: [
                          [-143.251, -80.321],
                          [-133.778, -67.491],
                          [-138.255, -89.41],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-21.084, -21.155],
                          [-9.389, 3.314],
                          [-3.428, 29.263],
                        ],
                        o: [
                          [5.491, 5.509],
                          [4.25, -1.5],
                          [0.535, -4.565],
                        ],
                        v: [
                          [-104.993, 8.336],
                          [-78.405, 5.835],
                          [-112.581, -36.748],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 36,
                    s: [
                      {
                        i: [
                          [-21.084, -21.155],
                          [-9.389, 3.314],
                          [-3.428, 29.263],
                        ],
                        o: [
                          [5.491, 5.509],
                          [4.25, -1.5],
                          [0.535, -4.565],
                        ],
                        v: [
                          [-104.993, 8.336],
                          [-78.405, 5.835],
                          [-112.581, -36.748],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-32.159, -5.156],
                          [-9.389, 3.314],
                          [33.823, 59.926],
                        ],
                        o: [
                          [7.68, 1.231],
                          [4.25, -1.5],
                          [-2.259, -4.003],
                        ],
                        v: [
                          [-44.586, 46.999],
                          [-24.038, 39.165],
                          [-92.446, -20.75],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 39,
                    s: [
                      {
                        i: [
                          [-32.159, -5.156],
                          [-9.389, 3.314],
                          [33.823, 59.926],
                        ],
                        o: [
                          [7.68, 1.231],
                          [4.25, -1.5],
                          [-2.259, -4.003],
                        ],
                        v: [
                          [-44.586, 46.999],
                          [-24.038, 39.165],
                          [-92.446, -20.75],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-30.145, 4.176],
                          [-9.389, 3.314],
                          [35.837, 41.261],
                        ],
                        o: [
                          [7.705, -1.067],
                          [4.25, -1.5],
                          [-3.014, -3.47],
                        ],
                        v: [
                          [-3.308, 69.663],
                          [-10.95, 44.498],
                          [-56.201, 21.912],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 41,
                    s: [
                      {
                        i: [
                          [-30.145, 4.176],
                          [-9.389, 3.314],
                          [35.837, 41.261],
                        ],
                        o: [
                          [7.705, -1.067],
                          [4.25, -1.5],
                          [-3.014, -3.47],
                        ],
                        v: [
                          [-3.308, 69.663],
                          [-10.95, 44.498],
                          [-56.201, 21.912],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-1.452, 24.507],
                          [9.388, -0.601],
                          [41.901, 22.036],
                        ],
                        o: [
                          [0.193, -3.254],
                          [-5.387, 0.345],
                          [-3.931, -2.068],
                        ],
                        v: [
                          [7.012, 57.331],
                          [-12.46, 43.831],
                          [-39.338, 41.577],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 43,
                    s: [
                      {
                        i: [
                          [-1.452, 24.507],
                          [9.388, -0.601],
                          [41.901, 22.036],
                        ],
                        o: [
                          [0.193, -3.254],
                          [-5.387, 0.345],
                          [-3.931, -2.068],
                        ],
                        v: [
                          [7.012, 57.331],
                          [-12.46, 43.831],
                          [-39.338, 41.577],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [2.827, 18.175],
                          [1.66, -7.988],
                          [13.939, 2.599],
                        ],
                        o: [
                          [-0.501, -3.221],
                          [-1.151, 5.535],
                          [-4.367, -0.814],
                        ],
                        v: [
                          [0.971, 51.998],
                          [-11.202, 46.164],
                          [-15.93, 54.242],
                        ],
                      },
                    ],
                  },
                  { t: 44.0000017921567 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 4 },
              lc: 1,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-53.383, -4.18], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
        },
      ],
      bounds: { l: -199, t: -97, b: 68, r: -44 },
      ip: 33.0000013441176,
      op: 45.0000018328876,
      st: -17.0000006924242,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 10,
      ty: 4,
      nm: "飛出紅2",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [961.75, 532.75, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 50,
                    s: [
                      {
                        i: [
                          [-29.367, -32.57],
                          [-9.389, 3.314],
                          [-19.867, 38.18],
                        ],
                        o: [
                          [5.209, 5.777],
                          [4.25, -1.5],
                          [2.122, -4.077],
                        ],
                        v: [
                          [-106, 35],
                          [-92.5, 20.5],
                          [-100.5, -20.75],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [7.299, -26.404],
                          [-9.389, 3.314],
                          [19.633, 17.846],
                        ],
                        o: [
                          [-2.073, 7.497],
                          [4.25, -1.5],
                          [-0.011, -4.338],
                        ],
                        v: [
                          [-81.667, 90.333],
                          [-69.167, 74.167],
                          [-92.5, 35.583],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 52,
                    s: [
                      {
                        i: [
                          [7.299, -26.404],
                          [-9.389, 3.314],
                          [19.633, 17.846],
                        ],
                        o: [
                          [-2.073, 7.497],
                          [4.25, -1.5],
                          [-0.011, -4.338],
                        ],
                        v: [
                          [-81.667, 90.333],
                          [-69.167, 74.167],
                          [-92.5, 35.583],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-20.367, -20.57],
                          [-9.389, 3.314],
                          [2.633, 32.18],
                        ],
                        o: [
                          [5.473, 5.527],
                          [4.25, -1.5],
                          [-0.375, -4.581],
                        ],
                        v: [
                          [-77.5, 128.5],
                          [-69.5, 113.5],
                          [-85, 80.25],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 53,
                    s: [
                      {
                        i: [
                          [-20.367, -20.57],
                          [-9.389, 3.314],
                          [2.633, 32.18],
                        ],
                        o: [
                          [5.473, 5.527],
                          [4.25, -1.5],
                          [-0.375, -4.581],
                        ],
                        v: [
                          [-77.5, 128.5],
                          [-69.5, 113.5],
                          [-85, 80.25],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-14.367, -12.07],
                          [-9.389, 3.314],
                          [7.633, 31.68],
                        ],
                        o: [
                          [5.955, 5.003],
                          [4.25, -1.5],
                          [-1.077, -4.468],
                        ],
                        v: [
                          [-56, 141.5],
                          [-50, 128],
                          [-75, 101.75],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 55,
                    s: [
                      {
                        i: [
                          [-14.367, -12.07],
                          [-9.389, 3.314],
                          [7.633, 31.68],
                        ],
                        o: [
                          [5.955, 5.003],
                          [4.25, -1.5],
                          [-1.077, -4.468],
                        ],
                        v: [
                          [-56, 141.5],
                          [-50, 128],
                          [-75, 101.75],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-16.867, 11.43],
                          [9.133, -3.07],
                          [4.133, 14.18],
                        ],
                        o: [
                          [9.41, -6.376],
                          [-4.272, 1.436],
                          [-1.286, -4.413],
                        ],
                        v: [
                          [-40, 144],
                          [-46, 130],
                          [-58.5, 126.25],
                        ],
                      },
                    ],
                  },
                  { t: 57.0000023216576 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 4 },
              lc: 1,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-53.383, -4.18], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
        },
      ],
      bounds: { l: -173, t: -28, b: 145, r: -86 },
      ip: 50.0000020365418,
      op: 58.0000023623884,
      st: 0,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 11,
      ty: 4,
      nm: "飛出藍3",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [921, 573.5, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [-99.326, 75.008, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 38,
                    s: [
                      {
                        i: [
                          [-15.295, -16.155],
                          [-9.389, 3.314],
                          [23, -25.732],
                        ],
                        o: [
                          [5.348, 5.648],
                          [4.25, -1.5],
                          [-1.457, 1.629],
                        ],
                        v: [
                          [123.044, -65.656],
                          [145.605, -83.489],
                          [87.769, -80.077],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [18.936, -17.488],
                          [-9.666, -14.321],
                          [47.163, -5.734],
                        ],
                        o: [
                          [-5.714, 5.277],
                          [2.521, 3.736],
                          [-2.17, 0.264],
                        ],
                        v: [
                          [123.044, -53.657],
                          [144.599, -40.827],
                          [105.892, -82.744],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 39,
                    s: [
                      {
                        i: [
                          [18.936, -17.488],
                          [-9.666, -14.321],
                          [47.163, -5.734],
                        ],
                        o: [
                          [-5.714, 5.277],
                          [2.521, 3.736],
                          [-2.17, 0.264],
                        ],
                        v: [
                          [123.044, -53.657],
                          [144.599, -40.827],
                          [105.892, -82.744],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [26.99, -1.49],
                          [-8.659, -10.988],
                          [6.892, 34.929],
                        ],
                        o: [
                          [6.854, 11.842],
                          [2.79, 3.54],
                          [-1.207, -0.954],
                        ],
                        v: [
                          [102.909, -38.992],
                          [108.354, -13.496],
                          [136.095, -68.745],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 41,
                    s: [
                      {
                        i: [
                          [26.99, -1.49],
                          [-8.659, -10.988],
                          [6.892, 34.929],
                        ],
                        o: [
                          [6.854, 11.842],
                          [2.79, 3.54],
                          [-1.207, -0.954],
                        ],
                        v: [
                          [102.909, -38.992],
                          [108.354, -13.496],
                          [136.095, -68.745],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [15.915, 2.51],
                          [-9.666, -14.321],
                          [-9.72, 32.262],
                        ],
                        o: [
                          [-7.683, -1.212],
                          [2.521, 3.736],
                          [0.631, -2.093],
                        ],
                        v: [
                          [61.63, -14.995],
                          [58.015, 3.835],
                          [96.831, -28.083],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 43,
                    s: [
                      {
                        i: [
                          [15.915, 2.51],
                          [-9.666, -14.321],
                          [-9.72, 32.262],
                        ],
                        o: [
                          [-7.683, -1.212],
                          [2.521, 3.736],
                          [0.631, -2.093],
                        ],
                        v: [
                          [61.63, -14.995],
                          [58.015, 3.835],
                          [96.831, -28.083],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [23.466, -16.155],
                          [1.409, -16.32],
                          [-34.89, 11.598],
                        ],
                        o: [
                          [-6.407, 4.411],
                          [-0.388, 4.49],
                          [2.074, -0.689],
                        ],
                        v: [
                          [-19.92, 20.335],
                          [-12.964, 43.164],
                          [32.396, 2.581],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 45,
                    s: [
                      {
                        i: [
                          [23.466, -16.155],
                          [1.409, -16.32],
                          [-34.89, 11.598],
                        ],
                        o: [
                          [-6.407, 4.411],
                          [-0.388, 4.49],
                          [2.074, -0.689],
                        ],
                        v: [
                          [-19.92, 20.335],
                          [-12.964, 43.164],
                          [32.396, 2.581],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [18.936, -20.821],
                          [-2.115, -16.32],
                          [-21.802, 17.597],
                        ],
                        o: [
                          [-5.233, 5.754],
                          [0.579, 4.47],
                          [1.701, -1.373],
                        ],
                        v: [
                          [-66.735, 60.997],
                          [-50.718, 74.494],
                          [-22.977, 36.577],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 47,
                    s: [
                      {
                        i: [
                          [18.936, -20.821],
                          [-2.115, -16.32],
                          [-21.802, 17.597],
                        ],
                        o: [
                          [-5.233, 5.754],
                          [0.579, 4.47],
                          [1.701, -1.373],
                        ],
                        v: [
                          [-66.735, 60.997],
                          [-50.718, 74.494],
                          [-22.977, 36.577],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [13.399, -11.489],
                          [-2.115, -16.32],
                          [-21.802, 17.597],
                        ],
                        o: [
                          [-5.905, 5.063],
                          [0.579, 4.47],
                          [1.701, -1.373],
                        ],
                        v: [
                          [-93.415, 66.33],
                          [-89.983, 81.827],
                          [-65.262, 61.242],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 49,
                    s: [
                      {
                        i: [
                          [13.399, -11.489],
                          [-2.115, -16.32],
                          [-21.802, 17.597],
                        ],
                        o: [
                          [-5.905, 5.063],
                          [0.579, 4.47],
                          [1.701, -1.373],
                        ],
                        v: [
                          [-93.415, 66.33],
                          [-89.983, 81.827],
                          [-65.262, 61.242],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-1.6, 13.144],
                          [-2.115, -16.32],
                          [-21.802, 17.597],
                        ],
                        o: [
                          [1.317, -10.822],
                          [0.579, 4.47],
                          [1.701, -1.373],
                        ],
                        v: [
                          [-114.054, 64.997],
                          [-127.234, 69.162],
                          [-105.031, 76.573],
                        ],
                      },
                    ],
                  },
                  { t: 51.0000020772726 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.25, 0.44, 0.48, 1] },
              o: { k: 100 },
              w: { k: 4 },
              lc: 1,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.33, 0.79, 0.93, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-53.383, -4.18], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
        },
      ],
      bounds: { l: -183, t: -100, b: 82, r: 95 },
      ip: 38.0000015477717,
      op: 52.0000021180034,
      st: -19.0000007738859,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 12,
      ty: 4,
      nm: "飛出黃2",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [921, 573.5, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [-99.326, 75.008, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 35,
                    s: [
                      {
                        i: [
                          [-8.247, -6.823],
                          [3.027, 5.744],
                          [3.871, -7.067],
                        ],
                        o: [
                          [5.993, 4.958],
                          [-6.142, -11.654],
                          [-1.905, 3.478],
                        ],
                        v: [
                          [-136.707, -112.985],
                          [-130.255, -120.152],
                          [-156.88, -111.407],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.529, -1.284],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-19.23, 2.344],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-81.837, -136.982],
                          [-84.446, -152.815],
                          [-119.629, -128.739],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 37,
                    s: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.529, -1.284],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-19.23, 2.344],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-81.837, -136.982],
                          [-84.446, -152.815],
                          [-119.629, -128.739],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.499, -1.508],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-11.68, 1.678],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-33.008, -147.648],
                          [-31.086, -166.814],
                          [-50.664, -149.403],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 39,
                    s: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.499, -1.508],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-11.68, 1.678],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-33.008, -147.648],
                          [-31.086, -166.814],
                          [-50.664, -149.403],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.499, -1.508],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-11.68, 1.678],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-33.008, -147.648],
                          [-31.086, -166.814],
                          [-50.664, -149.403],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 41,
                    s: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.499, -1.508],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-11.68, 1.678],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-33.008, -147.648],
                          [-31.086, -166.814],
                          [-50.664, -149.403],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-18.819, -9.489],
                          [17.014, -8.321],
                          [2.505, -9.191],
                        ],
                        o: [
                          [9.855, 4.969],
                          [-10.6, 5.184],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [78.242, -177.645],
                          [75.634, -192.811],
                          [46.994, -170.734],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 43,
                    s: [
                      {
                        i: [
                          [-18.819, -9.489],
                          [17.014, -8.321],
                          [2.505, -9.191],
                        ],
                        o: [
                          [9.855, 4.969],
                          [-10.6, 5.184],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [78.242, -177.645],
                          [75.634, -192.811],
                          [46.994, -170.734],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-18.939, -9.248],
                          [18.021, -4.988],
                          [2.505, -9.191],
                        ],
                        o: [
                          [17.426, 8.509],
                          [-11.372, 3.148],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [94.351, -180.311],
                          [88.722, -196.144],
                          [67.13, -181.4],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 44,
                    s: [
                      {
                        i: [
                          [-18.939, -9.248],
                          [18.021, -4.988],
                          [2.505, -9.191],
                        ],
                        o: [
                          [17.426, 8.509],
                          [-11.372, 3.148],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [94.351, -180.311],
                          [88.722, -196.144],
                          [67.13, -181.4],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.71, -30.154],
                          [15.504, 24.342],
                          [2.505, -9.191],
                        ],
                        o: [
                          [1.736, 19.314],
                          [-6.339, -9.952],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [106.936, -172.312],
                          [119.932, -192.145],
                          [80.219, -197.398],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 46,
                    s: [
                      {
                        i: [
                          [-2.71, -30.154],
                          [15.504, 24.342],
                          [2.505, -9.191],
                        ],
                        o: [
                          [1.736, 19.314],
                          [-6.339, -9.952],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [106.936, -172.312],
                          [119.932, -192.145],
                          [80.219, -197.398],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [5.606, -11.964],
                          [-10.673, 17.343],
                          [20.735, -2.068],
                        ],
                        o: [
                          [-5.269, 6.912],
                          [1.562, -5.137],
                          [-0.74, 0.799],
                        ],
                        v: [
                          [95.609, -165.646],
                          [112.885, -155.815],
                          [91.545, -182.4],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 47,
                    s: [
                      {
                        i: [
                          [5.606, -11.964],
                          [-10.673, 17.343],
                          [20.735, -2.068],
                        ],
                        o: [
                          [-5.269, 6.912],
                          [1.562, -5.137],
                          [-0.74, 0.799],
                        ],
                        v: [
                          [95.609, -165.646],
                          [112.885, -155.815],
                          [91.545, -182.4],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [13.922, 6.226],
                          [-18.087, 0.615],
                          [1.858, 15.597],
                        ],
                        o: [
                          [-12.275, -5.49],
                          [9.463, -0.322],
                          [-0.318, -2.667],
                        ],
                        v: [
                          [84.283, -158.98],
                          [88.722, -139.483],
                          [102.871, -167.401],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 48,
                    s: [
                      {
                        i: [
                          [13.922, 6.226],
                          [-18.087, 0.615],
                          [1.858, 15.597],
                        ],
                        o: [
                          [-12.275, -5.49],
                          [9.463, -0.322],
                          [-0.318, -2.667],
                        ],
                        v: [
                          [84.283, -158.98],
                          [88.722, -139.483],
                          [102.871, -167.401],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [12.895, 8.509],
                          [-16.21, -6.321],
                          [-10.727, 3.599],
                        ],
                        o: [
                          [-11.223, -7.406],
                          [8.821, 3.44],
                          [2.546, -0.854],
                        ],
                        v: [
                          [61.63, -161.646],
                          [61.539, -140.817],
                          [81.225, -148.07],
                        ],
                      },
                    ],
                  },
                  { t: 50.0000020365418 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.42, 0.25, 1] },
              o: { k: 100 },
              w: { k: 4 },
              lc: 1,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.73, 0.18, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-53.383, -4.18], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
        },
      ],
      bounds: { l: -213, t: -209, b: -112, r: 74 },
      ip: 47.0000019143492,
      op: 51.0000020772726,
      st: -15.0000006109625,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 13,
      ty: 4,
      nm: "聖誕樹 2",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [899, 554, 0] },
        a: { k: [512, 384, 0] },
        s: { k: [201.108, 201.108, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "gr",
              it: [
                {
                  ind: 0,
                  ty: "sh",
                  closed: false,
                  ks: {
                    k: {
                      i: [
                        [0, 0],
                        [0, 0],
                      ],
                      o: [
                        [0, 0],
                        [0, 0],
                      ],
                      v: [
                        [0.799, -2],
                        [-0.799, 2],
                      ],
                    },
                  },
                  nm: "Path 1",
                },
                {
                  ty: "st",
                  fillEnabled: true,
                  c: { k: [0.19, 0.34, 0.15, 1] },
                  o: { k: 100 },
                  w: { k: 2 },
                  lc: 2,
                  lj: 2,
                  nm: "Stroke 1",
                },
                {
                  ty: "tr",
                  p: { k: [518.706, 386], ix: 2 },
                  a: { k: [0, 0], ix: 1 },
                  s: { k: [100, 100], ix: 3 },
                  r: { k: 0, ix: 6 },
                  o: { k: 100, ix: 7 },
                  sk: { k: 0, ix: 4 },
                  sa: { k: 0, ix: 5 },
                  nm: "Transform",
                },
              ],
              nm: "Group 4",
            },
            {
              ty: "gr",
              it: [
                {
                  ind: 0,
                  ty: "sh",
                  closed: false,
                  ks: {
                    k: {
                      i: [
                        [0, 0],
                        [0, 0],
                      ],
                      o: [
                        [0, 0],
                        [0, 0],
                      ],
                      v: [
                        [1.401, -2.661],
                        [-1.402, 2.661],
                      ],
                    },
                  },
                  nm: "Path 1",
                },
                {
                  ty: "st",
                  fillEnabled: true,
                  c: { k: [0.19, 0.34, 0.15, 1] },
                  o: { k: 100 },
                  w: { k: 2 },
                  lc: 2,
                  lj: 2,
                  nm: "Stroke 1",
                },
                {
                  ty: "tr",
                  p: { k: [514.853, 384.305], ix: 2 },
                  a: { k: [0, 0], ix: 1 },
                  s: { k: [100, 100], ix: 3 },
                  r: { k: 0, ix: 6 },
                  o: { k: 100, ix: 7 },
                  sk: { k: 0, ix: 4 },
                  sa: { k: 0, ix: 5 },
                  nm: "Transform",
                },
              ],
              nm: "Group 5",
            },
            {
              ty: "gr",
              it: [
                {
                  ind: 0,
                  ty: "sh",
                  closed: false,
                  ks: {
                    k: {
                      i: [
                        [0, 0],
                        [0, 0],
                      ],
                      o: [
                        [0, 0],
                        [0, 0],
                      ],
                      v: [
                        [-1.534, -1.402],
                        [1.534, 1.402],
                      ],
                    },
                  },
                  nm: "Path 1",
                },
                {
                  ty: "st",
                  fillEnabled: true,
                  c: { k: [0.19, 0.34, 0.15, 1] },
                  o: { k: 100 },
                  w: { k: 2 },
                  lc: 2,
                  lj: 2,
                  nm: "Stroke 1",
                },
                {
                  ty: "tr",
                  p: { k: [576.841, 383.212], ix: 2 },
                  a: { k: [0, 0], ix: 1 },
                  s: { k: [100, 100], ix: 3 },
                  r: { k: 0, ix: 6 },
                  o: { k: 100, ix: 7 },
                  sk: { k: 0, ix: 4 },
                  sa: { k: 0, ix: 5 },
                  nm: "Transform",
                },
              ],
              nm: "Group 6",
            },
            {
              ty: "gr",
              it: [
                {
                  ind: 0,
                  ty: "sh",
                  closed: false,
                  ks: {
                    k: {
                      i: [
                        [0, 0],
                        [0, 0],
                      ],
                      o: [
                        [0, 0],
                        [0, 0],
                      ],
                      v: [
                        [-1.534, -2.479],
                        [1.534, 2.479],
                      ],
                    },
                  },
                  nm: "Path 1",
                },
                {
                  ty: "st",
                  fillEnabled: true,
                  c: { k: [0.19, 0.34, 0.15, 1] },
                  o: { k: 100 },
                  w: { k: 2 },
                  lc: 2,
                  lj: 2,
                  nm: "Stroke 1",
                },
                {
                  ty: "tr",
                  p: { k: [572.869, 384.302], ix: 2 },
                  a: { k: [0, 0], ix: 1 },
                  s: { k: [100, 100], ix: 3 },
                  r: { k: 0, ix: 6 },
                  o: { k: 100, ix: 7 },
                  sk: { k: 0, ix: 4 },
                  sa: { k: 0, ix: 5 },
                  nm: "Transform",
                },
              ],
              nm: "Group 7",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 24,
                    s: [0, 0],
                    e: [0, 0],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 26,
                    s: [0, 0],
                    e: [0, -6],
                    to: [0, -1],
                    ti: [0, 0.66666668653488],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 28,
                    s: [0, -6],
                    e: [0, -4],
                    to: [0, -0.66666668653488],
                    ti: [0, -0.33333334326744],
                  },
                  { t: 30.0000012219251 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 15",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: false,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-7.349, -3.272],
                          [-0.651, 4.461],
                          [-0.651, -2.461],
                          [7.349, 1.765],
                          [7.349, -4.461],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-7.349, -3.272],
                          [1.214, 4.337],
                          [-0.651, -2.461],
                          [7.722, 0.398],
                          [7.349, -4.461],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 34,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-7.349, -3.272],
                          [1.214, 4.337],
                          [-0.651, -2.461],
                          [7.722, 0.398],
                          [7.349, -4.461],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-7.349, -3.272],
                          [-0.651, 4.461],
                          [-0.651, -2.461],
                          [7.349, 1.765],
                          [7.349, -4.461],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 38,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-7.349, -3.272],
                          [-0.651, 4.461],
                          [-0.651, -2.461],
                          [7.349, 1.765],
                          [7.349, -4.461],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-7.349, -3.272],
                          [0.966, 4.212],
                          [-0.651, -2.461],
                          [7.474, -0.348],
                          [7.349, -4.461],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 42,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-7.349, -3.272],
                          [0.966, 4.212],
                          [-0.651, -2.461],
                          [7.474, -0.348],
                          [7.349, -4.461],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-7.349, -3.272],
                          [-0.651, 4.461],
                          [-0.651, -2.461],
                          [7.349, 1.765],
                          [7.349, -4.461],
                        ],
                      },
                    ],
                  },
                  { t: 46.0000018736184 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.19, 0.34, 0.15, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 2,
              lj: 2,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.55, 0.76, 0.26, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 32,
                    s: [574.65, 424.461],
                    e: [578.65, 420.461],
                    to: [0.66666668653488, -0.66666668653488],
                    ti: [-0.66666668653488, 0.33333334326744],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 36,
                    s: [578.65, 420.461],
                    e: [578.65, 422.461],
                    to: [0.66666668653488, -0.33333334326744],
                    ti: [-0.08333333581686, -0.08333333581686],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 40,
                    s: [578.65, 422.461],
                    e: [579.15, 420.961],
                    to: [0.08333333581686, 0.08333333581686],
                    ti: [0, 0.08333333581686],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 43,
                    s: [579.15, 420.961],
                    e: [578.65, 421.961],
                    to: [0, -0.08333333581686],
                    ti: [0.08333333581686, -0.16666667163372],
                  },
                  { t: 46.0000018736184 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "葉子右",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: false,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 29,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-5.868, 3.772],
                          [1.548, 0.085],
                          [4.548, 3.602],
                          [5.868, 0],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-3.63, 4.766],
                          [1.548, 0.085],
                          [6.04, 4.099],
                          [5.868, 0],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 31,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-3.63, 4.766],
                          [1.548, 0.085],
                          [6.04, 4.099],
                          [5.868, 0],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-5.122, 3.275],
                          [1.548, 0.085],
                          [3.553, 3.851],
                          [5.868, 0],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 34,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-5.122, 3.275],
                          [1.548, 0.085],
                          [3.553, 3.851],
                          [5.868, 0],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-1.641, 3.523],
                          [1.548, 0.085],
                          [5.791, 4.845],
                          [5.868, 0],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 36,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-1.641, 3.523],
                          [1.548, 0.085],
                          [5.791, 4.845],
                          [5.868, 0],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-6.614, 3.275],
                          [1.548, 0.085],
                          [3.056, 4.597],
                          [5.868, 0],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 38,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-6.614, 3.275],
                          [1.548, 0.085],
                          [3.056, 4.597],
                          [5.868, 0],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-1.557, -3.772],
                          [-5.868, 3.772],
                          [1.548, 0.085],
                          [4.548, 3.602],
                          [5.868, 0],
                        ],
                      },
                    ],
                  },
                  { t: 40.0000016292334 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.19, 0.34, 0.15, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 2,
              lj: 2,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.55, 0.76, 0.26, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 29,
                    s: [516.451, 419.398],
                    e: [514.452, 418.065],
                    to: [-0.31763124465942, -0.21175415813923],
                    ti: [0.75920993089676, 0.50613993406296],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 31,
                    s: [514.452, 418.065],
                    e: [515.451, 419.398],
                    to: [-0.43590223789215, -0.2906014919281],
                    ti: [0.18236875534058, 0.12157917022705],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 32,
                    s: [515.451, 419.398],
                    e: [516.451, 420.398],
                    to: [-0.5, -0.33333334326744],
                    ti: [-0.16666667163372, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 34,
                    s: [516.451, 420.398],
                    e: [513.451, 418.398],
                    to: [0.16666667163372, 0],
                    ti: [0, 0.16666667163372],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 36,
                    s: [513.451, 418.398],
                    e: [514.451, 419.398],
                    to: [0, -0.16666667163372],
                    ti: [-0.16666667163372, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 38,
                    s: [514.451, 419.398],
                    e: [513.451, 418.398],
                    to: [0.16666667163372, 0],
                    ti: [0, 0.16666667163372],
                  },
                  { t: 40.0000016292334 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "葉子左",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [3.015, 2.346],
                    [-0.372, -2.978],
                  ],
                  o: [
                    [0, 0],
                    [0.371, 2.978],
                  ],
                  v: [
                    [-0.484, -2.568],
                    [-2.159, 0],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.19, 0.34, 0.15, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 15,
                    s: [547.737, 387.657],
                    e: [547.737, 387.657],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 20,
                    s: [547.737, 387.657],
                    e: [547.737, 381.657],
                    to: [0, -1],
                    ti: [0, 0.66666668653488],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [547.737, 381.657],
                    e: [547.737, 383.657],
                    to: [0, -0.66666668653488],
                    ti: [0, -0.33333334326744],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 24,
                    s: [547.737, 383.657],
                    e: [547.737, 383.657],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 26,
                    s: [547.737, 383.657],
                    e: [547.737, 379.657],
                    to: [0, -0.66666668653488],
                    ti: [0, 0.33333334326744],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 28,
                    s: [547.737, 379.657],
                    e: [547.737, 381.657],
                    to: [0, -0.33333334326744],
                    ti: [0, -0.33333334326744],
                  },
                  { t: 30.0000012219251 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 9",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [-3.731, 2.545],
                    [0.494, -0.138],
                    [1.022, -3.497],
                    [-1.725, 0.296],
                    [4.896, 2.479],
                  ],
                  o: [
                    [0, 0],
                    [-1.361, 0.382],
                    [-1.229, 4.206],
                    [2.14, -0.367],
                    [0, 0],
                  ],
                  v: [
                    [3.263, -5.351],
                    [2.925, -5.665],
                    [-3.392, 0.184],
                    [-0.005, 5.507],
                    [-0.275, -2.065],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.19, 0.34, 0.15, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 15,
                    s: [567.487, 371.663],
                    e: [561.487, 367.663],
                    to: [-1, -0.66666668653488],
                    ti: [1, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 18,
                    s: [561.487, 367.663],
                    e: [561.487, 371.663],
                    to: [-1, 0],
                    ti: [0, -0.33333334326744],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 20,
                    s: [561.487, 371.663],
                    e: [561.487, 369.663],
                    to: [0, 0.33333334326744],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [561.487, 369.663],
                    e: [561.487, 371.663],
                    to: [0, 0],
                    ti: [0, -0.33333334326744],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 24,
                    s: [561.487, 371.663],
                    e: [561.487, 371.663],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 26,
                    s: [561.487, 371.663],
                    e: [561.487, 365.663],
                    to: [0, -1],
                    ti: [-0.33333334326744, 0.66666668653488],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 28,
                    s: [561.487, 365.663],
                    e: [563.487, 367.663],
                    to: [0.33333334326744, -0.66666668653488],
                    ti: [-0.33333334326744, -0.33333334326744],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [563.487, 367.663],
                    e: [563.487, 367.663],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 33,
                    s: [563.487, 367.663],
                    e: [563.487, 369.663],
                    to: [0, 0.33333334326744],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 35,
                    s: [563.487, 369.663],
                    e: [563.487, 367.663],
                    to: [0, 0],
                    ti: [0, 0.33333334326744],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 37,
                    s: [563.487, 367.663],
                    e: [563.487, 367.663],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 39,
                    s: [563.487, 367.663],
                    e: [563.487, 369.663],
                    to: [0, 0.33333334326744],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 41,
                    s: [563.487, 369.663],
                    e: [563.487, 367.663],
                    to: [0, 0],
                    ti: [0, 0.33333334326744],
                  },
                  { t: 43.0000017514259 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: {
                k: [
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 33,
                    s: [100, 100],
                    e: [100, 14],
                    __fnct: [null, null],
                  },
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 35,
                    s: [100, 14],
                    e: [100, 100],
                    __fnct: [null, null],
                  },
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 37,
                    s: [100, 100],
                    e: [100, 100],
                    __fnct: [null, null],
                  },
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 39,
                    s: [100, 100],
                    e: [100, 14],
                    __fnct: [null, null],
                  },
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 41,
                    s: [100, 14],
                    e: [100, 100],
                    __fnct: [null, null],
                  },
                  { t: 43.0000017514259 },
                ],
                ix: 3,
              },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 10",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [-3.731, 2.545],
                    [0.494, -0.138],
                    [1.022, -3.497],
                    [-1.725, 0.296],
                    [4.896, 2.479],
                  ],
                  o: [
                    [0, 0],
                    [-1.361, 0.382],
                    [-1.229, 4.206],
                    [2.14, -0.367],
                    [0, 0],
                  ],
                  v: [
                    [3.263, -5.351],
                    [2.925, -5.665],
                    [-3.392, 0.184],
                    [-0.005, 5.507],
                    [-0.275, -2.065],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.19, 0.34, 0.15, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 15,
                    s: [531.487, 371.663],
                    e: [531.487, 366.663],
                    to: [0, -0.83333331346512],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 18,
                    s: [531.487, 366.663],
                    e: [531.487, 371.663],
                    to: [0, 0],
                    ti: [0, -0.5],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 20,
                    s: [531.487, 371.663],
                    e: [531.487, 369.663],
                    to: [0, 0.5],
                    ti: [0, 0.16666667163372],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [531.487, 369.663],
                    e: [531.487, 370.663],
                    to: [0, -0.16666667163372],
                    ti: [0, 0.5],
                  },
                  {
                    i: { x: 1, y: 1 },
                    o: { x: 0, y: 0 },
                    n: "1_1_0_0",
                    t: 24,
                    s: [531.487, 370.663],
                    e: [531.487, 370.663],
                    to: [0, -0.23867093026638],
                    ti: [0, 0.87726157903671],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 26,
                    s: [531.487, 370.663],
                    e: [531.487, 364.663],
                    to: [0, -0.96054410934448],
                    ti: [0, 0.08710969239473],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 28,
                    s: [531.487, 364.663],
                    e: [531.487, 367.663],
                    to: [0, -0.16666667163372],
                    ti: [0, -0.5],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 30,
                    s: [531.487, 367.663],
                    e: [531.487, 367.663],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 33,
                    s: [531.487, 367.663],
                    e: [531.487, 370.163],
                    to: [0, 0.41666665673256],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 35,
                    s: [531.487, 370.163],
                    e: [531.487, 367.663],
                    to: [0, 0],
                    ti: [0, 0.41666665673256],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 37,
                    s: [531.487, 367.663],
                    e: [531.487, 367.663],
                    to: [0, 0],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 39,
                    s: [531.487, 367.663],
                    e: [531.487, 370.163],
                    to: [0, 0.41666665673256],
                    ti: [0, 0],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 41,
                    s: [531.487, 370.163],
                    e: [531.487, 367.663],
                    to: [0, 0],
                    ti: [0, 0.41666665673256],
                  },
                  { t: 43.0000017514259 },
                ],
                ix: 2,
              },
              a: { k: [0, 0], ix: 1 },
              s: {
                k: [
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 33,
                    s: [100, 100],
                    e: [100, 14],
                    __fnct: [null, null],
                  },
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 35,
                    s: [100, 14],
                    e: [100, 100],
                    __fnct: [null, null],
                  },
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 37,
                    s: [100, 100],
                    e: [100, 100],
                    __fnct: [null, null],
                  },
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 39,
                    s: [100, 100],
                    e: [100, 14],
                    __fnct: [null, null],
                  },
                  {
                    i: { x: [0.833, 0.833], y: [0.833, 0.833] },
                    o: { x: [0.167, 0.167], y: [0.167, 0.167] },
                    n: ["0p833_0p833_0p167_0p167", "0p833_0p833_0p167_0p167"],
                    t: 41,
                    s: [100, 14],
                    e: [100, 100],
                    __fnct: [null, null],
                  },
                  { t: 43.0000017514259 },
                ],
                ix: 3,
              },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 11",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 5,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [2.85, -57.772],
                          [-26.668, -49.092],
                          [-17.041, -40.913],
                          [-47.461, -22.424],
                          [-33.558, -19.641],
                          [-43.626, 21.578],
                          [-33.02, 18.982],
                          [-64.599, 62.405],
                          [-51.176, 63.778],
                          [-62.721, 70.538],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.337, 66.875],
                          [36.1, 63.432],
                          [47.693, 55.433],
                          [18.494, 19.228],
                          [28.97, 21.954],
                          [26.206, -19.063],
                          [37.426, -22.837],
                          [13.401, -41.71],
                          [23.218, -41.932],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [8.463, -5.229],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-10.978, -16.976],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-26.849, -49.363],
                          [-17.267, -41.501],
                          [-47.461, -22.424],
                          [-33.558, -19.641],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [26.545, -19.086],
                          [37.856, -22.814],
                          [11.164, -39.789],
                          [21.432, -41.593],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 15,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [8.463, -5.229],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-10.978, -16.976],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-26.849, -49.363],
                          [-17.267, -41.501],
                          [-47.461, -22.424],
                          [-33.558, -19.641],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [26.545, -19.086],
                          [37.856, -22.814],
                          [11.164, -39.789],
                          [21.432, -41.593],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [7.939, -4.809],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-10.741, -15.385],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-26.565, -48.51],
                          [-17.48, -42.921],
                          [-47.39, -22.637],
                          [-34.908, -17.936],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [27.753, -16.955],
                          [37.074, -22.388],
                          [13.792, -36.095],
                          [21.148, -40.173],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 16,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [7.939, -4.809],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-10.741, -15.385],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-26.565, -48.51],
                          [-17.48, -42.921],
                          [-47.39, -22.637],
                          [-34.908, -17.936],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [27.753, -16.955],
                          [37.074, -22.388],
                          [13.792, -36.095],
                          [21.148, -40.173],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [5.242, -6.685],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-6.846, -16.088],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-27.109, -46.912],
                          [-19.185, -44.094],
                          [-47.319, -22.85],
                          [-36.257, -16.231],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [28.961, -14.824],
                          [36.293, -21.962],
                          [15.757, -39.694],
                          [20.781, -40.99],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 17,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [5.242, -6.685],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-6.846, -16.088],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-27.109, -46.912],
                          [-19.185, -44.094],
                          [-47.319, -22.85],
                          [-36.257, -16.231],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [28.961, -14.824],
                          [36.293, -21.962],
                          [15.757, -39.694],
                          [20.781, -40.99],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [5.017, -11.462],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-4.177, -2.005],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-5.668, -18.663],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-27.63, -47.605],
                          [-19.042, -47.166],
                          [-47.283, -22.956],
                          [-36.932, -15.378],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [29.564, -13.758],
                          [35.902, -21.749],
                          [12.265, -44.975],
                          [21.592, -41.895],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 18,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [5.017, -11.462],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-4.177, -2.005],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-5.668, -18.663],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-27.63, -47.605],
                          [-19.042, -47.166],
                          [-47.283, -22.956],
                          [-36.932, -15.378],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [29.564, -13.758],
                          [35.902, -21.749],
                          [12.265, -44.975],
                          [21.592, -41.895],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [6.892, -3.971],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-10.265, -12.204],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-27.654, -54.264],
                          [-18.9, -50.238],
                          [-47.248, -23.063],
                          [-37.607, -14.526],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [30.168, -12.693],
                          [35.512, -21.536],
                          [14.739, -45.283],
                          [25.387, -47.773],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 20,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [6.892, -3.971],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-10.265, -12.204],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-27.654, -54.264],
                          [-18.9, -50.238],
                          [-47.248, -23.063],
                          [-37.607, -14.526],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [30.168, -12.693],
                          [35.512, -21.536],
                          [14.739, -45.283],
                          [25.387, -47.773],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [6.368, -3.552],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-4.248, 1.83],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-10.028, -10.613],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-27.328, -51.174],
                          [-18.865, -50.54],
                          [-47.177, -23.276],
                          [-38.957, -12.821],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [31.376, -10.562],
                          [34.73, -21.109],
                          [14.094, -46.147],
                          [24.149, -46.477],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 21,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [6.368, -3.552],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-4.248, 1.83],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-10.028, -10.613],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-27.328, -51.174],
                          [-18.865, -50.54],
                          [-47.177, -23.276],
                          [-38.957, -12.821],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [31.376, -10.562],
                          [34.73, -21.109],
                          [14.094, -46.147],
                          [24.149, -46.477],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [5.704, -10.289],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-28.341, -53.838],
                          [-18.758, -51.446],
                          [-46.964, -23.915],
                          [-43.006, -7.707],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [34.999, -4.169],
                          [27.165, -19.085],
                          [17.379, -49.237],
                          [26.405, -52.533],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 22,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [5.704, -10.289],
                          [-6.187, 0.207],
                          [19.816, -17.724],
                          [-11.354, 1.743],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.405, 2.859],
                          [2.432, 5.909],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-28.341, -53.838],
                          [-18.758, -51.446],
                          [-46.964, -23.915],
                          [-43.006, -7.707],
                          [-44.553, 21.284],
                          [-33.585, 18.914],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [19.738, 19.115],
                          [30.439, 21.593],
                          [34.999, -4.169],
                          [27.165, -19.085],
                          [17.379, -49.237],
                          [26.405, -52.533],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.461, -7.057],
                          [-6.187, 0.207],
                          [18.124, -17.659],
                          [-10.148, 0.977],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.113, 2.924],
                          [3.784, 8.004],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-28.341, -53.838],
                          [-18.758, -51.446],
                          [-43.98, -26.899],
                          [-41.825, -9.198],
                          [-45.858, 21.222],
                          [-35.76, 20.406],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [22.535, 20.917],
                          [32.179, 22.152],
                          [34.004, -5.722],
                          [31.392, -16.847],
                          [15.888, -49.237],
                          [26.405, -52.533],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 23,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.461, -7.057],
                          [-6.187, 0.207],
                          [18.124, -17.659],
                          [-10.148, 0.977],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-7.113, 2.924],
                          [3.784, 8.004],
                          [-5.075, 1.876],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-28.341, -53.838],
                          [-18.758, -51.446],
                          [-43.98, -26.899],
                          [-41.825, -9.198],
                          [-45.858, 21.222],
                          [-35.76, 20.406],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [22.535, 20.917],
                          [32.179, 22.152],
                          [34.004, -5.722],
                          [31.392, -16.847],
                          [15.888, -49.237],
                          [26.405, -52.533],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.07, -8.407],
                          [-3.537, -5.365],
                          [10.441, -21.738],
                          [-7.737, -0.556],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-6.528, 3.053],
                          [8.274, 10.428],
                          [-5.558, -2.582],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-28.341, -53.838],
                          [-18.758, -51.446],
                          [-43.59, -20.577],
                          [-36.479, -15.911],
                          [-54.933, 11.65],
                          [-40.111, 23.39],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [28.129, 24.522],
                          [40.633, 20.536],
                          [25.551, -14.549],
                          [32.919, -14.467],
                          [17.131, -49.734],
                          [26.405, -52.533],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 25,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.07, -8.407],
                          [-3.537, -5.365],
                          [10.441, -21.738],
                          [-7.737, -0.556],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-6.528, 3.053],
                          [8.274, 10.428],
                          [-5.558, -2.582],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-28.341, -53.838],
                          [-18.758, -51.446],
                          [-43.59, -20.577],
                          [-36.479, -15.911],
                          [-54.933, 11.65],
                          [-40.111, 23.39],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [28.129, 24.522],
                          [40.633, 20.536],
                          [25.551, -14.549],
                          [32.919, -14.467],
                          [17.131, -49.734],
                          [26.405, -52.533],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [6.784, -11.916],
                          [-5.663, -2.58],
                          [10.752, -22.67],
                          [-6.531, -1.323],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-6.236, 3.117],
                          [9.119, 13.523],
                          [-5.263, 2.685],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-28.341, -53.838],
                          [-18.758, -51.446],
                          [-47.298, -18.808],
                          [-37.088, -17.701],
                          [-57.232, 15.068],
                          [-42.287, 24.881],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [30.926, 26.325],
                          [42.87, 19.604],
                          [25.451, -16.649],
                          [34.453, -19.518],
                          [16.136, -49.535],
                          [26.405, -52.533],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 26,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [6.784, -11.916],
                          [-5.663, -2.58],
                          [10.752, -22.67],
                          [-6.531, -1.323],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-6.236, 3.117],
                          [9.119, 13.523],
                          [-5.263, 2.685],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -78.927],
                          [-28.341, -53.838],
                          [-18.758, -51.446],
                          [-47.298, -18.808],
                          [-37.088, -17.701],
                          [-57.232, 15.068],
                          [-42.287, 24.881],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [30.926, 26.325],
                          [42.87, 19.604],
                          [25.451, -16.649],
                          [34.453, -19.518],
                          [16.136, -49.535],
                          [26.405, -52.533],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [5.344, -1.115],
                          [-6.601, -1.064],
                          [10.783, -21.271],
                          [-5.928, -1.706],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-6.09, 3.149],
                          [11.344, 16.5],
                          [-5.995, -1.781],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.309, -82.159],
                          [-29.584, -55.081],
                          [-20.499, -52.44],
                          [-48.095, -24.388],
                          [-35.155, -20.212],
                          [-58.382, 16.529],
                          [-43.374, 25.627],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [32.324, 27.226],
                          [40.757, 22.867],
                          [25.712, -18.135],
                          [37.334, -18.998],
                          [18.125, -51.176],
                          [26.653, -54.522],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 27,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [5.344, -1.115],
                          [-6.601, -1.064],
                          [10.783, -21.271],
                          [-5.928, -1.706],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-6.09, 3.149],
                          [11.344, 16.5],
                          [-5.995, -1.781],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.309, -82.159],
                          [-29.584, -55.081],
                          [-20.499, -52.44],
                          [-48.095, -24.388],
                          [-35.155, -20.212],
                          [-58.382, 16.529],
                          [-43.374, 25.627],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [32.324, 27.226],
                          [40.757, 22.867],
                          [25.712, -18.135],
                          [37.334, -18.998],
                          [18.125, -51.176],
                          [26.653, -54.522],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.898, -9.209],
                          [-6.794, -3.774],
                          [10.814, -19.873],
                          [-5.325, -2.089],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.944, 3.182],
                          [9.191, 16.386],
                          [-3.655, 5.157],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-0.812, -85.392],
                          [-30.827, -56.324],
                          [-22.239, -53.435],
                          [-47.898, -22.757],
                          [-34.963, -21.232],
                          [-59.532, 17.99],
                          [-44.462, 26.373],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [33.723, 28.127],
                          [39.141, 24.39],
                          [28.708, -19.62],
                          [43.943, -25.936],
                          [20.114, -52.817],
                          [26.902, -56.511],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 28,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.898, -9.209],
                          [-6.794, -3.774],
                          [10.814, -19.873],
                          [-5.325, -2.089],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.944, 3.182],
                          [9.191, 16.386],
                          [-3.655, 5.157],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-0.812, -85.392],
                          [-30.827, -56.324],
                          [-22.239, -53.435],
                          [-47.898, -22.757],
                          [-34.963, -21.232],
                          [-59.532, 17.99],
                          [-44.462, 26.373],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [33.723, 28.127],
                          [39.141, 24.39],
                          [28.708, -19.62],
                          [43.943, -25.936],
                          [20.114, -52.817],
                          [26.902, -56.511],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [9.661, -17.331],
                          [-4.119, -2.856],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [10.543, 18.481],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-58.351, 19.419],
                          [-46.638, 27.865],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [36.52, 29.93],
                          [40.881, 24.949],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 29,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [9.661, -17.331],
                          [-4.119, -2.856],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [10.543, 18.481],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-58.351, 19.419],
                          [-46.638, 27.865],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [36.52, 29.93],
                          [40.881, 24.949],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [4.66, -24.783],
                          [-4.119, -2.856],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [10.543, 18.481],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-54.87, 28.37],
                          [-46.638, 27.865],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [36.52, 29.93],
                          [40.881, 24.949],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 31,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [4.66, -24.783],
                          [-4.119, -2.856],
                          [16.199, -8.688],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [10.543, 18.481],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-54.87, 28.37],
                          [-46.638, 27.865],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [36.52, 29.93],
                          [40.881, 24.949],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [17.092, -7.877],
                          [-4.119, -2.856],
                          [12.942, -12.032],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [10.312, 19.714],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-65.313, 11.463],
                          [-45.643, 17.423],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [45.47, 16.007],
                          [62.263, 10.032],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 33,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [17.092, -7.877],
                          [-4.119, -2.856],
                          [12.942, -12.032],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [10.312, 19.714],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-65.313, 11.463],
                          [-45.643, 17.423],
                          [-65.142, 62.36],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [45.47, 16.007],
                          [62.263, 10.032],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [16.097, -16.33],
                          [-4.119, -2.856],
                          [8.467, -18.994],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-8.548, 0.516],
                          [11.307, 16.73],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-63.821, 17.927],
                          [-46.638, 20.903],
                          [-59.672, 63.354],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [47.459, 18.99],
                          [61.766, 16.496],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 34,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [16.097, -16.33],
                          [-4.119, -2.856],
                          [8.467, -18.994],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-8.548, 0.516],
                          [11.307, 16.73],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-63.821, 17.927],
                          [-46.638, 20.903],
                          [-59.672, 63.354],
                          [-51.515, 63.778],
                          [-62.856, 70.402],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [46.857, 66.83],
                          [36.687, 63.477],
                          [49.004, 55.434],
                          [47.459, 18.99],
                          [61.766, 16.496],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [16.097, -16.33],
                          [-4.119, -2.856],
                          [4.489, -19.491],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [11.307, 16.73],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-63.821, 15.441],
                          [-46.638, 20.903],
                          [-60.169, 69.818],
                          [-47.04, 66.762],
                          [-57.386, 75.872],
                          [-30.602, 71.2],
                          [-36.356, 73.799],
                          [52.327, 70.808],
                          [49.616, 63.477],
                          [78.341, 54.439],
                          [47.459, 18.99],
                          [62.263, 13.015],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 36,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [16.097, -16.33],
                          [-4.119, -2.856],
                          [4.489, -19.491],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [11.307, 16.73],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-63.821, 15.441],
                          [-46.638, 20.903],
                          [-60.169, 69.818],
                          [-47.04, 66.762],
                          [-57.386, 75.872],
                          [-30.602, 71.2],
                          [-36.356, 73.799],
                          [52.327, 70.808],
                          [49.616, 63.477],
                          [78.341, 54.439],
                          [47.459, 18.99],
                          [62.263, 13.015],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [16.097, -16.33],
                          [-4.119, -2.856],
                          [17.418, -15.513],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-9.709, 9.811],
                          [9.736, 19.9],
                          [-5.652, 3.246],
                          [11.307, 16.73],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-63.821, 15.441],
                          [-46.638, 20.903],
                          [-77.075, 55.896],
                          [-60.466, 60.795],
                          [-68.326, 64.933],
                          [-31.348, 70.454],
                          [-35.859, 74.794],
                          [59.288, 64.344],
                          [49.616, 61.985],
                          [78.341, 48.969],
                          [47.459, 18.99],
                          [62.263, 13.015],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 38,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [16.097, -16.33],
                          [-4.119, -2.856],
                          [17.418, -15.513],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-9.709, 9.811],
                          [9.736, 19.9],
                          [-5.652, 3.246],
                          [11.307, 16.73],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-63.821, 15.441],
                          [-46.638, 20.903],
                          [-77.075, 55.896],
                          [-60.466, 60.795],
                          [-68.326, 64.933],
                          [-31.348, 70.454],
                          [-35.859, 74.794],
                          [59.288, 64.344],
                          [49.616, 61.985],
                          [78.341, 48.969],
                          [47.459, 18.99],
                          [62.263, 13.015],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [16.097, -16.33],
                          [-4.119, -2.856],
                          [17.418, -15.513],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-39.387, 14.327],
                          [2.016, 0.765],
                          [-10.207, 4.342],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [11.307, 16.73],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-63.821, 15.441],
                          [-46.638, 20.903],
                          [-75.086, 63.354],
                          [-59.969, 63.778],
                          [-65.342, 68.413],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [57.797, 68.322],
                          [49.616, 63.477],
                          [77.347, 57.92],
                          [47.459, 18.99],
                          [62.263, 13.015],
                          [32.463, -20.603],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 40,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [16.097, -16.33],
                          [-4.119, -2.856],
                          [17.418, -15.513],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-39.387, 14.327],
                          [2.016, 0.765],
                          [-10.207, 4.342],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [11.307, 16.73],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-63.821, 15.441],
                          [-46.638, 20.903],
                          [-75.086, 63.354],
                          [-59.969, 63.778],
                          [-65.342, 68.413],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [57.797, 68.322],
                          [49.616, 63.477],
                          [77.347, 57.92],
                          [47.459, 18.99],
                          [62.263, 13.015],
                          [32.463, -20.603],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [4.797, -2.294],
                          [-2.711, 0.903],
                          [4.936, -2.989],
                          [-6.187, 0.207],
                          [16.097, -16.33],
                          [-4.119, -2.856],
                          [17.418, -15.513],
                          [-5.631, 1.042],
                          [3.476, -1.112],
                          [-12.653, 3.613],
                          [0, 0],
                          [-33.232, 19.737],
                          [2.016, 0.765],
                          [-7.787, 4.587],
                          [1.945, 8.343],
                          [-5.652, 3.246],
                          [11.307, 16.73],
                          [-5.169, 2.281],
                          [10.626, 17.671],
                          [-6.237, 2.493],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-9.315, -5.841],
                        ],
                        v: [
                          [-1.806, -84.397],
                          [-31.324, -56.821],
                          [-23.234, -52.44],
                          [-46.758, -22.315],
                          [-33.334, -20.038],
                          [-63.821, 15.441],
                          [-46.638, 20.903],
                          [-76.081, 60.868],
                          [-59.969, 63.778],
                          [-65.84, 66.922],
                          [-31.348, 70.454],
                          [-36.356, 73.799],
                          [57.797, 66.333],
                          [49.616, 63.477],
                          [78.341, 54.439],
                          [47.459, 18.99],
                          [62.263, 13.015],
                          [32.463, -20.602],
                          [45.561, -21.912],
                          [20.611, -52.618],
                          [28.394, -56.013],
                        ],
                      },
                    ],
                  },
                  { t: 42.0000017106951 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.19, 0.34, 0.15, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 2,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.55, 0.76, 0.26, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [546.298, 377.927], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 12",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, 0],
                    [1.075, -14.826],
                    [4.177, 1.07],
                    [0.242, 23.934],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [-0.773, 10.66],
                    [-5.494, -1.407],
                    [-0.169, -16.653],
                    [0, 0],
                  ],
                  v: [
                    [3.928, -27.375],
                    [4.015, 2.6],
                    [-1.311, 26.943],
                    [-2.572, -4.115],
                    [-3.611, -27.931],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.35, 0.26, 0.18, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.52, 0.38, 0.26, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [553.363, 467.112], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 13",
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: {
                  i: [
                    [0, 0],
                    [-0.938, -15.234],
                    [-2.689, 0.281],
                    [0.812, 20.546],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0.657, 10.666],
                    [5.013, -0.524],
                    [-0.657, -16.642],
                    [0, 0],
                  ],
                  v: [
                    [-4.697, -27.699],
                    [-4.516, 0.035],
                    [1.467, 27.342],
                    [2.681, -4.276],
                    [1.997, -28.141],
                  ],
                },
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.35, 0.26, 0.18, 1] },
              o: { k: 100 },
              w: { k: 2 },
              lc: 1,
              lj: 1,
              ml: 10,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.52, 0.38, 0.26, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [538.09, 467.322], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Group 14",
        },
      ],
      bounds: { l: 462, t: 285, b: 504, r: 632 },
      ip: 5.00000020365417,
      op: 95.0000038694293,
      st: 5.00000020365417,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 14,
      ty: 4,
      nm: "飛出黃1",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [921, 573.5, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [-99.326, 75.008, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 35,
                    s: [
                      {
                        i: [
                          [-8.247, -6.823],
                          [3.027, 5.744],
                          [3.871, -7.067],
                        ],
                        o: [
                          [5.993, 4.958],
                          [-6.142, -11.654],
                          [-1.905, 3.478],
                        ],
                        v: [
                          [-136.707, -112.985],
                          [-130.255, -120.152],
                          [-156.88, -111.407],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.529, -1.284],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-19.23, 2.344],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-81.837, -136.982],
                          [-84.446, -152.815],
                          [-119.629, -128.739],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 37,
                    s: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.529, -1.284],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-19.23, 2.344],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-81.837, -136.982],
                          [-84.446, -152.815],
                          [-119.629, -128.739],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.499, -1.508],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-11.68, 1.678],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-33.008, -147.648],
                          [-31.086, -166.814],
                          [-50.664, -149.403],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 39,
                    s: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.499, -1.508],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-11.68, 1.678],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-33.008, -147.648],
                          [-31.086, -166.814],
                          [-50.664, -149.403],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.499, -1.508],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-11.68, 1.678],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-33.008, -147.648],
                          [-31.086, -166.814],
                          [-50.664, -149.403],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 41,
                    s: [
                      {
                        i: [
                          [-10.915, -1.849],
                          [10.499, -1.508],
                          [6.388, -7.067],
                        ],
                        o: [
                          [10.882, 1.843],
                          [-11.68, 1.678],
                          [-2.659, 2.942],
                        ],
                        v: [
                          [-33.008, -147.648],
                          [-31.086, -166.814],
                          [-50.664, -149.403],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-18.819, -9.489],
                          [17.014, -8.321],
                          [2.505, -9.191],
                        ],
                        o: [
                          [9.855, 4.969],
                          [-10.6, 5.184],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [78.242, -177.645],
                          [75.634, -192.811],
                          [46.994, -170.734],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 43,
                    s: [
                      {
                        i: [
                          [-18.819, -9.489],
                          [17.014, -8.321],
                          [2.505, -9.191],
                        ],
                        o: [
                          [9.855, 4.969],
                          [-10.6, 5.184],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [78.242, -177.645],
                          [75.634, -192.811],
                          [46.994, -170.734],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-18.939, -9.248],
                          [18.021, -4.988],
                          [2.505, -9.191],
                        ],
                        o: [
                          [17.426, 8.509],
                          [-11.372, 3.148],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [94.351, -180.311],
                          [88.722, -196.144],
                          [67.13, -181.4],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 44,
                    s: [
                      {
                        i: [
                          [-18.939, -9.248],
                          [18.021, -4.988],
                          [2.505, -9.191],
                        ],
                        o: [
                          [17.426, 8.509],
                          [-11.372, 3.148],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [94.351, -180.311],
                          [88.722, -196.144],
                          [67.13, -181.4],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-2.71, -30.154],
                          [15.504, 24.342],
                          [2.505, -9.191],
                        ],
                        o: [
                          [1.736, 19.314],
                          [-6.339, -9.952],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [106.936, -172.312],
                          [119.932, -192.145],
                          [80.219, -197.398],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 46,
                    s: [
                      {
                        i: [
                          [-2.71, -30.154],
                          [15.504, 24.342],
                          [2.505, -9.191],
                        ],
                        o: [
                          [1.736, 19.314],
                          [-6.339, -9.952],
                          [-1.163, 4.265],
                        ],
                        v: [
                          [106.936, -172.312],
                          [119.932, -192.145],
                          [80.219, -197.398],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [5.606, -11.964],
                          [-10.673, 17.343],
                          [20.735, -2.068],
                        ],
                        o: [
                          [-5.269, 6.912],
                          [1.562, -5.137],
                          [-0.74, 0.799],
                        ],
                        v: [
                          [95.609, -165.646],
                          [112.885, -155.815],
                          [91.545, -182.4],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 47,
                    s: [
                      {
                        i: [
                          [5.606, -11.964],
                          [-10.673, 17.343],
                          [20.735, -2.068],
                        ],
                        o: [
                          [-5.269, 6.912],
                          [1.562, -5.137],
                          [-0.74, 0.799],
                        ],
                        v: [
                          [95.609, -165.646],
                          [112.885, -155.815],
                          [91.545, -182.4],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [13.922, 6.226],
                          [-18.087, 0.615],
                          [1.858, 15.597],
                        ],
                        o: [
                          [-12.275, -5.49],
                          [9.463, -0.322],
                          [-0.318, -2.667],
                        ],
                        v: [
                          [84.283, -158.98],
                          [88.722, -139.483],
                          [102.871, -167.401],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 48,
                    s: [
                      {
                        i: [
                          [13.922, 6.226],
                          [-18.087, 0.615],
                          [1.858, 15.597],
                        ],
                        o: [
                          [-12.275, -5.49],
                          [9.463, -0.322],
                          [-0.318, -2.667],
                        ],
                        v: [
                          [84.283, -158.98],
                          [88.722, -139.483],
                          [102.871, -167.401],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [12.895, 8.509],
                          [-16.21, -6.321],
                          [-10.727, 3.599],
                        ],
                        o: [
                          [-11.223, -7.406],
                          [8.821, 3.44],
                          [2.546, -0.854],
                        ],
                        v: [
                          [61.63, -161.646],
                          [61.539, -140.817],
                          [81.225, -148.07],
                        ],
                      },
                    ],
                  },
                  { t: 50.0000020365418 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.42, 0.25, 1] },
              o: { k: 100 },
              w: { k: 4 },
              lc: 1,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.73, 0.18, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-53.383, -4.18], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
        },
      ],
      bounds: { l: -213, t: -209, b: -112, r: 74 },
      ip: 35.0000014255792,
      op: 48.0000019550801,
      st: -15.0000006109625,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 15,
      ty: 4,
      nm: "飛出藍2",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [921, 573.5, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [-99.326, 75.008, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 31,
                    s: [
                      {
                        i: [
                          [-0.697, -6.156],
                          [-9.389, 3.314],
                          [7.395, 23.596],
                        ],
                        o: [
                          [0.874, 7.729],
                          [4.25, -1.5],
                          [-1.374, -4.386],
                        ],
                        v: [
                          [-143.251, -80.321],
                          [-133.778, -67.491],
                          [-138.255, -89.41],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-17.812, 3.843],
                          [-9.389, 3.314],
                          [24.007, 15.597],
                        ],
                        o: [
                          [7.603, -1.64],
                          [4.25, -1.5],
                          [-1.833, -1.191],
                        ],
                        v: [
                          [-58.178, 15.669],
                          [-40.65, 8.501],
                          [-95.466, -13.417],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 34,
                    s: [
                      {
                        i: [
                          [-17.812, 3.843],
                          [-9.389, 3.314],
                          [24.007, 15.597],
                        ],
                        o: [
                          [7.603, -1.64],
                          [4.25, -1.5],
                          [-1.833, -1.191],
                        ],
                        v: [
                          [-58.178, 15.669],
                          [-40.65, 8.501],
                          [-95.466, -13.417],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-15.295, -16.155],
                          [-9.389, 3.314],
                          [37.095, -33.731],
                        ],
                        o: [
                          [5.348, 5.648],
                          [4.25, -1.5],
                          [-1.617, 1.47],
                        ],
                        v: [
                          [84.786, -60.323],
                          [105.334, -88.822],
                          [7.226, -57.413],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 36,
                    s: [
                      {
                        i: [
                          [-15.295, -16.155],
                          [-9.389, 3.314],
                          [37.095, -33.731],
                        ],
                        o: [
                          [5.348, 5.648],
                          [4.25, -1.5],
                          [-1.617, 1.47],
                        ],
                        v: [
                          [84.786, -60.323],
                          [105.334, -88.822],
                          [7.226, -57.413],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-15.295, -16.155],
                          [-9.389, 3.314],
                          [23, -25.732],
                        ],
                        o: [
                          [5.348, 5.648],
                          [4.25, -1.5],
                          [-1.457, 1.629],
                        ],
                        v: [
                          [123.044, -65.656],
                          [145.605, -83.489],
                          [87.769, -80.077],
                        ],
                      },
                    ],
                  },
                  { t: 38.0000015477717 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.25, 0.44, 0.48, 1] },
              o: { k: 100 },
              w: { k: 4 },
              lc: 1,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.33, 0.79, 0.93, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-53.383, -4.18], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
        },
      ],
      bounds: { l: -199, t: -100, b: 14, r: 95 },
      ip: 31.0000012626559,
      op: 39.0000015885026,
      st: -19.0000007738859,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 16,
      ty: 4,
      nm: "飛出紅1",
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [961.75, 532.75, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              closed: true,
              ks: {
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 32,
                    s: [
                      {
                        i: [
                          [7.659, 3.773],
                          [-8.537, -5.122],
                          [-5.993, -1.042],
                        ],
                        o: [
                          [-7.659, -3.773],
                          [3.75, 2.25],
                          [5.75, 1],
                        ],
                        v: [
                          [211.5, -43.5],
                          [210.5, -34.75],
                          [220.5, -41.25],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [39.5, -8.75],
                          [-9.389, 3.314],
                          [-39.867, -9.82],
                        ],
                        o: [
                          [-7.594, 1.682],
                          [4.25, -1.5],
                          [4.463, 1.099],
                        ],
                        v: [
                          [99.5, -72],
                          [101.25, -60],
                          [163, -54.25],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 34,
                    s: [
                      {
                        i: [
                          [39.5, -8.75],
                          [-9.389, 3.314],
                          [-39.867, -9.82],
                        ],
                        o: [
                          [-7.594, 1.682],
                          [4.25, -1.5],
                          [4.463, 1.099],
                        ],
                        v: [
                          [99.5, -72],
                          [101.25, -60],
                          [163, -54.25],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [47.25, -12.75],
                          [-9.389, 3.314],
                          [-49.867, 4.68],
                        ],
                        o: [
                          [-7.51, 2.026],
                          [4.25, -1.5],
                          [4.576, -0.429],
                        ],
                        v: [
                          [60, -73],
                          [61, -61.5],
                          [142.5, -72.75],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 36,
                    s: [
                      {
                        i: [
                          [47.25, -12.75],
                          [-9.389, 3.314],
                          [-49.867, 4.68],
                        ],
                        o: [
                          [-7.51, 2.026],
                          [4.25, -1.5],
                          [4.576, -0.429],
                        ],
                        v: [
                          [60, -73],
                          [61, -61.5],
                          [142.5, -72.75],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [47.25, -12.75],
                          [-9.389, 3.314],
                          [-49.867, 4.68],
                        ],
                        o: [
                          [-7.51, 2.026],
                          [4.25, -1.5],
                          [4.576, -0.429],
                        ],
                        v: [
                          [60, -73],
                          [61, -61.5],
                          [105, -71.75],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 38,
                    s: [
                      {
                        i: [
                          [47.25, -12.75],
                          [-9.389, 3.314],
                          [-49.867, 4.68],
                        ],
                        o: [
                          [-7.51, 2.026],
                          [4.25, -1.5],
                          [4.576, -0.429],
                        ],
                        v: [
                          [60, -73],
                          [61, -61.5],
                          [105, -71.75],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [47.25, -12.75],
                          [-9.389, 3.314],
                          [-49.867, 4.68],
                        ],
                        o: [
                          [-7.51, 2.026],
                          [4.25, -1.5],
                          [4.576, -0.429],
                        ],
                        v: [
                          [-15, -48.5],
                          [-14, -37],
                          [30, -47.25],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 43,
                    s: [
                      {
                        i: [
                          [47.25, -12.75],
                          [-9.389, 3.314],
                          [-49.867, 4.68],
                        ],
                        o: [
                          [-7.51, 2.026],
                          [4.25, -1.5],
                          [4.576, -0.429],
                        ],
                        v: [
                          [-15, -48.5],
                          [-14, -37],
                          [30, -47.25],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [47.25, -12.75],
                          [-9.389, 3.314],
                          [-31.867, 1.68],
                        ],
                        o: [
                          [-7.51, 2.026],
                          [4.25, -1.5],
                          [4.59, -0.242],
                        ],
                        v: [
                          [-54.5, -44.5],
                          [-40.5, -36.5],
                          [-6.5, -45.75],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 45,
                    s: [
                      {
                        i: [
                          [47.25, -12.75],
                          [-9.389, 3.314],
                          [-31.867, 1.68],
                        ],
                        o: [
                          [-7.51, 2.026],
                          [4.25, -1.5],
                          [4.59, -0.242],
                        ],
                        v: [
                          [-54.5, -44.5],
                          [-40.5, -36.5],
                          [-6.5, -45.75],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [19.133, -30.57],
                          [-9.389, 3.314],
                          [-31.867, 1.68],
                        ],
                        o: [
                          [-4.127, 6.593],
                          [4.25, -1.5],
                          [4.59, -0.242],
                        ],
                        v: [
                          [-85, -29.5],
                          [-68.5, -31],
                          [-27, -48.75],
                        ],
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 47,
                    s: [
                      {
                        i: [
                          [19.133, -30.57],
                          [-9.389, 3.314],
                          [-31.867, 1.68],
                        ],
                        o: [
                          [-4.127, 6.593],
                          [4.25, -1.5],
                          [4.59, -0.242],
                        ],
                        v: [
                          [-85, -29.5],
                          [-68.5, -31],
                          [-27, -48.75],
                        ],
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-29.367, -32.57],
                          [-9.389, 3.314],
                          [-19.867, 38.18],
                        ],
                        o: [
                          [5.209, 5.777],
                          [4.25, -1.5],
                          [2.122, -4.077],
                        ],
                        v: [
                          [-106, 35],
                          [-92.5, 20.5],
                          [-100.5, -20.75],
                        ],
                      },
                    ],
                  },
                  { t: 50.0000020365418 },
                ],
              },
              nm: "Path 1",
            },
            {
              ty: "st",
              fillEnabled: true,
              c: { k: [0.48, 0.26, 0.25, 1] },
              o: { k: 100 },
              w: { k: 4 },
              lc: 1,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
            },
            {
              ty: "fl",
              fillEnabled: true,
              c: { k: [0.93, 0.36, 0.33, 1] },
              o: { k: 100 },
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { k: [-53.383, -4.18], ix: 2 },
              a: { k: [0, 0], ix: 1 },
              s: { k: [100, 100], ix: 3 },
              r: { k: 0, ix: 6 },
              o: { k: 100, ix: 7 },
              sk: { k: 0, ix: 4 },
              sa: { k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
        },
      ],
      bounds: { l: -173, t: -85, b: 35, r: 172 },
      ip: 32.0000013033867,
      op: 50.0000020365418,
      st: 0,
      bm: 0,
      sr: 1,
    },
  ],
  ip: 0,
  op: 68.0000027696968,
  fr: 29.9700012207031,
  w: 1920,
  h: 1080,
};
var params = {
  container: document.getElementById("bodymovin"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  animationData: animationData,
};

var anim;

anim = bodymovin.loadAnimation(params);
console.log(anim);
console.log(bodymovin);

// setInterval(() => {
// //   anim.autoplay = true;
// //   console.log("111");
// }, 2000);

// setInterval(() => {
//     anim.togglePause()
// //   anim.autoplay = true;
// //   console.log("111");
// }, 3000);
