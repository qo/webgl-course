// Calling the regl module with no arguments creates a full screen canvas and
// WebGL context, and then uses this context to initialize a new REGL instance
const regl = require('regl')();
const mat4 = require('gl-mat4');
const vs = require('./shaders/vs.glsl');
const fs = require('./shaders/fs.glsl');

const cubePosition = [
    [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5], // positive z face.
    [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], // positive x face
    [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], // negative z face
    [-0.5, +0.5, -0.5], [-0.5, +0.5, +0.5], [-0.5, -0.5, +0.5], [-0.5, -0.5, -0.5], // negative x face.
    [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5], // top face
    [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5]  // bottom face
];

const cubeUv = [
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive z face.
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive x face.
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative z face.
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative x face.
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // top face
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]  // bottom face
];

const cubeElements = [
    [2, 1, 0], [2, 0, 3],       // positive z face.
    [6, 5, 4], [6, 4, 7],       // positive x face.
    [10, 9, 8], [10, 8, 11],    // negative z face.
    [14, 13, 12], [14, 12, 15], // negative x face.
    [18, 17, 16], [18, 16, 19], // top face.
    [20, 21, 22], [23, 20, 22]  // bottom face
];

const drawCube = regl({
    frag: fs,
    vert: vs,
    attributes: {
        position: cubePosition,
        uv: cubeUv
    },
    elements: cubeElements,
    uniforms: {
        view: ({tick}) => {
            const t = 0.01 * tick
            return mat4.lookAt([],
                [5 * Math.cos(t), 2.5 * Math.sin(t), 5 * Math.sin(t)],
                [0, 0.0, 0],
                [0, 1, 0])
        },
        projection: ({viewportWidth, viewportHeight}) =>
            mat4.perspective([],
                Math.PI / 4,
                viewportWidth / viewportHeight,
                0.01,
                10),
        tex: regl.prop('texture')
    }
});

require('resl')({
    manifest: {
        texture: {
            type: 'image',
            src: 'wood.jpg',
            parser: (data) => regl.texture({
                data: data,
                mag: 'linear',
                min: 'linear'
            })
        }
    },
    onDone: ({texture}) => {
        regl.frame(() => {
            regl.clear({
                color: [0, 0, 0, 255],
                depth: 1
            })
            drawCube({texture})
        })
    }
});
