const twgl = require('twgl.js');
const fs = require('./shaders/fs.glsl');
const vs = require('./shaders/vs.glsl');

function drawTriangle() {

    var gl = document.querySelector("canvas").getContext("webgl2");
    var programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    console.log(programInfo);

    var arrays = {
        position: {
            data: [
                0, 0.5, 0,  // Vertex #1
                -0.5, -0.5, 0, // Vertex #2
                0.5, -0.5, 0 // Vertex #3
            ],
            numComponents: 3
        }
    };
    var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    function render() {
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const uniforms = {
            color: [1, 0, 0, 1]
        };

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        twgl.setUniforms(programInfo, uniforms);

        // Clear canvas
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        twgl.drawBufferInfo(gl, bufferInfo);
    }

    render();

}

module.exports = drawTriangle;
