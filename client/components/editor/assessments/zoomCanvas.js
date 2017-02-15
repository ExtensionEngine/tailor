var zoomCanvas = function (self, resizeScale) {
  var canvas = self.$refs.canvas;
  var ctx = canvas.getContext('2d');
  self.$nextTick(() => {
    if (self.img.naturalWidth > self.$refs.canvas.parentElement.clientWidth) {
      let ratio = self.img.naturalWidth / (self.$refs.canvas.parentElement.clientWidth - 10);
      canvas.width = self.$refs.canvas.parentElement.clientWidth - 10;
      canvas.height = (self.img.naturalHeight / ratio);
    } else {
      canvas.width = self.img.naturalWidth;
      canvas.height = self.img.naturalHeight;
    }
    if (canvas.width === self.width) resizeScale = 1;
    if (canvas.width !== self.width) resizeScale = canvas.width / self.width;
    self.width = canvas.width;
    redraw();
    resizeScale = 1;
  });

  trackTransforms(ctx);

  function redraw() {
    let p1 = ctx.transformedPoint(0, 0);
    let p2 = ctx.transformedPoint(canvas.width, canvas.height);
    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.drawImage(self.img, 0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.lineCap = 'butt';

    if (self.areas.length === 0) return;

    let scale = ctx.getTransform().a;

    self.areas.forEach(outerItem => {
      ctx.beginPath();
      outerItem.forEach((innerItem, index) => {
        if (resizeScale === 1) {
          innerItem.x = ctx.transformedPoint(innerItem.x, innerItem.y).x * scale + ctx.getTransform().e;
          innerItem.y = ctx.transformedPoint(innerItem.x, innerItem.y).y * scale + ctx.getTransform().f;
        } else {
          innerItem.x *= resizeScale;
          innerItem.y *= resizeScale;
        }
        if (index === 0 || index / 2 === 0) {
          ctx.moveTo(innerItem.x, innerItem.y);
        } else {
          ctx.lineTo(innerItem.x, innerItem.y);
          ctx.stroke();
        }
      });
    });
    resizeScale = 1;
  }

  self.lastX = canvas.width / 2;
  self.lastY = canvas.height / 2;

  var dragStart, dragged;

  canvas.addEventListener('mousedown', function(evt) {
    if (self.start) return;
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    self.lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    self.lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    dragStart = ctx.transformedPoint(self.lastX, self.lastY);
    dragged = false;
  }, false);

  canvas.addEventListener('mousemove', function(evt) {
    if (self.start) return;
    self.lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    self.lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    dragged = true;

    if (dragStart) {
      let pt = ctx.transformedPoint(self.lastX, self.lastY);
      let scale = ctx.getTransform().a;
      ctx.save();
      ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
      let XLeft = ctx.getTransform().e;
      let YTop = ctx.getTransform().f;
      let XRight = XLeft + scale * canvas.width;
      let YBottom = YTop + scale * canvas.height;
      if (XLeft > 0 || XRight < canvas.width || YTop > 0 || YBottom < canvas.height) {
        ctx.restore();
      } else redraw();
    }
  }, false);

  canvas.addEventListener('mouseup', function(evt) {
    if (self.start) return;
    dragStart = null;
    if (!dragged) return;
  }, false);

  var zoomPoint = null;
  var scaleFactor = 1.1;

  function checkBoundaries(pt) {
    let scale = ctx.getTransform().a;
    let XLeft = ctx.getTransform().e;
    let YTop = ctx.getTransform().f;
    let XRight = XLeft + scale * canvas.width;
    let YBottom = YTop + scale * canvas.height;

    if (XLeft > 0 || XRight < canvas.width || YTop > 0 || YBottom < canvas.height) {
      zoomPoint = pt;
      if (XLeft > 0) {
        zoomPoint.x = 0;
      } else if (YTop > 0) {
        zoomPoint.y = 0;
      } else if (XRight < canvas.width) {
        zoomPoint.x = canvas.width;
      } else if (YBottom < canvas.height) {
        zoomPoint.y = canvas.height;
      }
      return false;
    }
    return true;
  }

  function drawLoop(pt, scale, factor) {
    if (scale !== 1 && scale < 1.0001) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      redraw();
      return;
    }
    if (checkBoundaries(pt)) {
      redraw();
    } else {
      ctx.restore();
      ctx.save();
      ctx.translate(zoomPoint.x, zoomPoint.y);
      ctx.scale(factor, factor);
      ctx.translate(-zoomPoint.x, -zoomPoint.y);
      if (drawLoop(pt, factor)) {
        zoomPoint = null;
        return true;
      }
    }
  }

  var zoom = (clicks) => {
    let factor = Math.pow(scaleFactor, clicks);
    let pt = ctx.transformedPoint(self.lastX, self.lastY);
    let scale = ctx.getTransform().a;
    if (scale > 6 && clicks > 0) return;
    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.scale(factor, factor);
    ctx.translate(-pt.x, -pt.y);
    drawLoop(pt, scale, factor);
  };

  var handleScroll = function(evt) {
    let delta = evt.wheelDelta ? evt.wheelDelta / 200 : evt.detail ? -evt.detail : 0;
    if (delta) {
      for (let i = Math.abs(delta); i >= 0; i -= 0.4) {
        if (delta < 0) zoom(-0.4);
        if (delta > 0) zoom(0.4);
      }
    }
    return evt.preventDefault() && false;
  };

  canvas.addEventListener('DOMMouseScroll', handleScroll, false);
  canvas.addEventListener('mousewheel', handleScroll, false);

  // Adds ctx.getTransform() - returns an SVGMatrix
  // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
  function trackTransforms(ctx) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let xform = svg.createSVGMatrix();
    ctx.getTransform = function() { return xform; };

    let savedTransforms = [];
    let save = ctx.save;
    ctx.save = function() {
      savedTransforms.push(xform.translate(0, 0));
      return save.call(ctx);
    };

    let restore = ctx.restore;
    ctx.restore = function() {
      xform = savedTransforms.pop();
      return restore.call(ctx);
    };

    let scale = ctx.scale;
    ctx.scale = function(sx, sy) {
      xform = xform.scaleNonUniform(sx, sy);
      return scale.call(ctx, sx, sy);
    };

    let rotate = ctx.rotate;
    ctx.rotate = function(radians) {
      xform = xform.rotate(radians * 180 / Math.PI);
      return rotate.call(ctx, radians);
    };

    let translate = ctx.translate;
    ctx.translate = function(dx, dy) {
      xform = xform.translate(dx, dy);
      return translate.call(ctx, dx, dy);
    };

    let transform = ctx.transform;
    ctx.transform = function(a, b, c, d, e, f) {
      let m2 = svg.createSVGMatrix();
      m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
      xform = xform.multiply(m2);
      return transform.call(ctx, a, b, c, d, e, f);
    };

    let setTransform = ctx.setTransform;
    ctx.setTransform = function(a, b, c, d, e, f) {
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx, a, b, c, d, e, f);
    };

    let pt = svg.createSVGPoint();
    ctx.transformedPoint = function(x, y) {
      pt.x = x; pt.y = y;
      return pt.matrixTransform(xform.inverse());
    };
  }
};

module.exports = zoomCanvas;
