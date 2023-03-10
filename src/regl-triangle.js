const regl = require('regl')();
const vs = require('./shaders/vs.glsl');
const fs = require('./shaders/fs.glsl');

function drawTriangle() {

    // This clears the color buffer to black and the depth buffer to 1
    regl.clear({
        color: [0, 0, 0, 1],
        depth: 1
    })

    // In regl, draw operations are specified declaratively using. Each JSON
    // command is a complete description of all state. This removes the need to
    // .bind() things like buffers or shaders. All the boilerplate of setting up
    // and tearing down state is automated.
    regl({

        // In a draw call, we can pass the shader source code to regl
        frag: fs,
        vert: vs,

        attributes: {
            position: [
                0, 0.5,  // Vertex #1
                -0.5, -0.5, // Vertex #2
                0.5, -0.5 // Vertex #3
            ]
        },

        uniforms: {
            color: [1, 0, 0, 1]
        },

        count: 3
    })();

}

module.exports = drawTriangle;
