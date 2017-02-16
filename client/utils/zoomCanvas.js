import isEmpty from 'lodash/isEmpty';

export default function (component, resizeScale) {
  let canvas = component.$refs.canvas;
  let ctx = canvas.getContext('2d');
  component.$nextTick(() => {
    const canvasWrapperWidth = component.$refs.canvas.parentElement.clientWidth;
    const imgHeight = component.img.naturalHeight;
    const imgWidth = component.img.naturalWidth;

    if (imgWidth > canvasWrapperWidth) {
      let ratio = imgWidth / (canvasWrapperWidth - 10);
      canvas.width = canvasWrapperWidth - 10;
      canvas.height = imgHeight / ratio;
    } else {
      canvas.width = imgWidth;
      canvas.height = imgHeight;
    }
    if (canvas.width === component.width) resizeScale = 1;
    else resizeScale = canvas.width / component.width;

    component.width = canvas.width;
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
    ctx.drawImage(component.img, 0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.lineCap = 'butt';

    if (isEmpty(component.areas)) return;

    let scale = ctx.getTransform().a;

    component.areas.forEach(outerItem => {
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

  component.lastX = canvas.width / 2;
  component.lastY = canvas.height / 2;

  let dragStart, dragged;

  canvas.addEventListener('mousedown', function(evt) {
    if (component.start) return;
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    component.lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    component.lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    dragStart = ctx.transformedPoint(component.lastX, component.lastY);
    dragged = false;
  }, false);

  canvas.addEventListener('mousemove', function(evt) {
    if (component.start) return;
    component.lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    component.lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    dragged = true;

    if (dragStart) {
      let pt = ctx.transformedPoint(component.lastX, component.lastY);
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
    if (component.start) return;
    dragStart = null;
    if (!dragged) return;
  }, false);

  let zoomPoint = null;
  let scaleFactor = 1.1;

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

  const zoom = clicks => {
    let factor = Math.pow(scaleFactor, clicks);
    let pt = ctx.transformedPoint(component.lastX, component.lastY);
    let scale = ctx.getTransform().a;
    if (scale > 6 && clicks > 0) return;
    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.scale(factor, factor);
    ctx.translate(-pt.x, -pt.y);
    drawLoop(pt, scale, factor);
  };

  const handleScroll = evt => {
    let delta = evt.wheelDelta ? evt.wheelDelta / 200 : evt.detail ? -evt.detail : 0;
    if (delta) {
      for (let i = Math.abs(delta); i >= 0; i -= 0.4) {
        if (delta < 0) zoom(-0.4);
        if (delta > 0) zoom(0.4);
      }
    }
    return evt.preventDefault() && false;
  };

  // Store handler reference in canvas element
  canvas.handleScroll = canvas.handleScroll || handleScroll;
  if (component.drawing) {
    canvas.addEventListener('DOMMouseScroll', canvas.handleScroll, false);
    canvas.addEventListener('mousewheel', canvas.handleScroll, false);
  } else {
    canvas.removeEventListener('DOMMouseScroll', canvas.handleScroll, false);
    canvas.removeEventListener('mousewheel', canvas.handleScroll, false);
  }

  // Adds ctx.getTransform() - returns an SVGMatrix
  // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
  function trackTransforms(ctx) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let xform = svg.createSVGMatrix();
    ctx.getTransform = () => xform;

    let savedTransforms = [];
    let save = ctx.save;
    ctx.save = () => {
      savedTransforms.push(xform.translate(0, 0));
      return save.call(ctx);
    };

    let restore = ctx.restore;
    ctx.restore = () => {
      xform = savedTransforms.pop();
      return restore.call(ctx);
    };

    let scale = ctx.scale;
    ctx.scale = (sx, sy) => {
      xform = xform.scaleNonUniform(sx, sy);
      return scale.call(ctx, sx, sy);
    };

    let rotate = ctx.rotate;
    ctx.rotate = radians => {
      xform = xform.rotate(radians * 180 / Math.PI);
      return rotate.call(ctx, radians);
    };

    let translate = ctx.translate;
    ctx.translate = (dx, dy) => {
      xform = xform.translate(dx, dy);
      return translate.call(ctx, dx, dy);
    };

    let transform = ctx.transform;
    ctx.transform = (a, b, c, d, e, f) => {
      let m2 = svg.createSVGMatrix();
      m2.a = a;
      m2.b = b;
      m2.c = c;
      m2.d = d;
      m2.e = e;
      m2.f = f;
      xform = xform.multiply(m2);
      return transform.call(ctx, a, b, c, d, e, f);
    };

    let setTransform = ctx.setTransform;
    ctx.setTransform = (a, b, c, d, e, f) => {
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx, a, b, c, d, e, f);
    };

    let pt = svg.createSVGPoint();
    ctx.transformedPoint = (x, y) => {
      pt.x = x;
      pt.y = y;
      return pt.matrixTransform(xform.inverse());
    };
  }
};
