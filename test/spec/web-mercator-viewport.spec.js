import test from 'tape-catch';
import {WebMercatorViewport} from 'viewport-mercator-project';
import {equals, config} from 'math.gl';

import VIEWPORT_PROPS from '../utils/sample-viewports';

config.EPSILON = 0.000001;

test('WebMercatorViewport#imports', t => {
  t.ok(WebMercatorViewport, 'WebMercatorViewport import ok');
  t.end();
});

test('WebMercatorViewport#constructor', t => {
  t.ok(new WebMercatorViewport() instanceof WebMercatorViewport,
    'Created new WebMercatorViewport with default args');
  t.end();
});

test('WebMercatorViewport#constructor - 0 width/height', t => {
  const viewport = new WebMercatorViewport(Object.assign({}, VIEWPORT_PROPS.flat, {
    width: 0,
    height: 0
  }));
  t.ok(viewport instanceof WebMercatorViewport,
    'WebMercatorViewport constructed successfully with 0 width and height');
  t.end();
});

test('WebMercatorViewport.projectFlat', t => {
  for (const vc in VIEWPORT_PROPS) {
    const viewport = new WebMercatorViewport(VIEWPORT_PROPS[vc]);
    for (const tc in VIEWPORT_PROPS) {
      const {longitude, latitude} = VIEWPORT_PROPS[tc];
      const lnglatIn = [longitude, latitude];
      const xy = viewport.projectFlat(lnglatIn);
      const lnglat = viewport.unprojectFlat(xy);
      t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
      t.ok(equals(lnglatIn, lnglat));
    }
  }
  t.end();
});

test('WebMercatorViewport.project#3D', t => {
  for (const vc in VIEWPORT_PROPS) {
    const viewport = new WebMercatorViewport(VIEWPORT_PROPS[vc]);
    for (const tc in VIEWPORT_PROPS) {
      const {longitude, latitude} = VIEWPORT_PROPS[tc];
      const lnglatZIn = [longitude, latitude, 100];
      const [x, y, z] = viewport.project(lnglatZIn);
      const lnglatZ1 = viewport.unproject([x, y, z]);
      const lnglatZ2 = viewport.unproject([x, y], {targetZ: 100});
      t.comment(`Comparing [${lnglatZIn}] to [${lnglatZ1}] & [${lnglatZ2}]`);
      t.ok(equals(lnglatZIn, lnglatZ1), 'unproject with pixel depth');
      t.ok(equals(lnglatZIn, lnglatZ2), 'unproject with target Z');
    }
  }
  t.end();
});

test('WebMercatorViewport.project#2D', t => {
  // Cross check positions
  for (const vc in VIEWPORT_PROPS) {
    const viewport = new WebMercatorViewport(VIEWPORT_PROPS[vc]);
    for (const tc in VIEWPORT_PROPS) {
      const {longitude, latitude} = VIEWPORT_PROPS[tc];
      const lnglatIn = [longitude, latitude];
      const xy = viewport.project(lnglatIn);
      const lnglat = viewport.unproject(xy);
      t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
      t.ok(equals(lnglatIn, lnglat));
    }
  }
  t.end();
});