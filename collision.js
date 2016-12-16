function cross(v1, v2) {
  return v1.x * v2.y - v2.x * v1.y;
}

function lineIntersect(l1v1, l1v2, l2v1, l2v2) {
  var base = p5.Vector.sub(l1v1, l2v1);
  var l1_vector = p5.Vector.sub(l1v2, l1v1);
  var l2_vector = p5.Vector.sub(l2v2, l2v1);
  var direction_cross = cross(l2_vector, l1_vector);
  var t = cross(base, l1_vector) / direction_cross;
  var u = cross(base, l2_vector) / direction_cross;
  if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return true;
  } else {
    return false;
  }
}

function closestPointOnLine(linevector1, linevector2, pointvector){
  var ydifference = linevector2.y - linevector1.y;
  var xdifference = linevector1.x - linevector2.x;
  // Using Cramer's rule
  var C1 = ydifference * linevector1.x + xdifference * linevector1.y;
  var C2 = ydifference * pointvector.y - xdifference * pointvector.x;
  var determinant = ydifference * ydifference + xdifference * xdifference;
  var out;
  if(determinant != 0){
    out = createVector(
      (ydifference * C1 - xdifference * C2) / determinant,
      (ydifference * C2 + xdifference * C1) / determinant
    );
  } else {
    out = pointvector.clone();
  }

  var v1 = p5.Vector.sub(linevector1, linevector2).magSq();
  var d1 = p5.Vector.sub(out, linevector1).magSq();
  var d2 = p5.Vector.sub(out, linevector2).magSq();
  return d1 <= v1 && d2 <= v1 ? out : (d1 <= d2 ? linevector1.copy() : linevector2.copy());
}

function lineToCircleIntersect(lv1, lv2, cp1, cr) {
  var lv1c = lv1.copy();
  var lv2c = lv2.copy();
  var closest = closestPointOnLine(lv1, lv2, cp1);
  closest.sub(cp1);
  return closest.dot(closest) <= cr * cr;
}
