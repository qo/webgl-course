var fs = require('./shaders/fs.glsl');
var vs = require('./shaders/vs.glsl');

function drawTriangle() {
    // Get canvas object from the DOM
    var canvas = document.querySelector("canvas");

    // Init WebGL context
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    // Init shaders
    if (!initShaders(gl, vs, fs)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    // Vertices
    var dim = 3;
    var vertices = new Float32Array([
        0, 0.5, 0,  // Vertex #1
        -0.5, -0.5, 0, // Vertex #2
        0.5, -0.5, 0 // Vertex #3
    ]);

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assign the vertices in buffer object to a_Position variable
    var position = gl.getAttribLocation(gl.program, 'position');
    if (position < 0) {
        console.log('Failed to get the storage location of position');
        return -1;
    }
    gl.vertexAttribPointer(position, dim, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    var color = gl.getUniformLocation(gl.program, 'color');
    if (color < 0) {
        console.log('Failed to get the storage location of color');
        return -1;
    }
    gl.uniform4f(color, 1, 0, 0, 1);

    // Return number of vertices
    return vertices.length / dim;
}

function initShaders(gl, vs_source, fs_source) {
    // Compile shaders
    var vertexShader = makeShader(gl, vs_source, gl.VERTEX_SHADER);
    var fragmentShader = makeShader(gl, fs_source, gl.FRAGMENT_SHADER);

    // Create program
    var glProgram = gl.createProgram();

    // Attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program");
        return false;
    }

    // Use program
    gl.useProgram(glProgram);
    gl.program = glProgram;

    return true;
}

function makeShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
        return;
    }
    return shader;
}

module.exports = drawTriangle;
