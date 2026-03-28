import React, { useEffect, useRef } from 'react';

const NeuralVortex = ({ theme }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const glRef = useRef();
  const programRef = useRef();
  const uniformsRef = useRef({});
  const pointerRef = useRef({ x: 0, y: 0, tX: 0, tY: 0 });

  const getVertexShader = () => `
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 vUv;
    
    void main() {
      vUv = 0.5 * (a_position + 1.0);
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const getFragmentShader = () => `
    precision mediump float;
    varying vec2 vUv;
    
    uniform float u_time;
    uniform float u_ratio;
    uniform vec2 u_pointer_position;
    uniform float u_scroll_progress;
    uniform int u_color_mode;
    uniform int u_shader_complexity;
    
    vec2 rotate(vec2 uv, float th) {
      float c = cos(th);
      float s = sin(th);
      return mat2(c, s, -s, c) * uv;
    }
    
    float neuro_shape(vec2 uv, float t, float p, int complexity) {
      vec2 sine_acc = vec2(0.0);
      vec2 res = vec2(0.0);
      float scale = 8.0;
      
      for (int j = 0; j < 20; j++) {
        if (j >= complexity) break;
        
        uv = rotate(uv, 1.0);
        sine_acc = rotate(sine_acc, 1.0);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer) + 2.4 * p;
        res += (0.5 + 0.5 * cos(layer)) / scale;
        scale *= 1.2;
      }
      
      return res.x + res.y;
    }
    
    void main() {
      vec2 uv = 0.5 * vUv;
      uv.x *= u_ratio;
      
      vec2 pointer = vUv - u_pointer_position;
      pointer.x *= u_ratio;
      float p = clamp(length(pointer), 0.0, 1.0);
      p = 0.5 * pow(1.0 - p, 2.0);
      
      float t = 0.001 * u_time;
      vec3 color = vec3(0.0);
      
      float noise = neuro_shape(uv, t, p, u_shader_complexity);
      noise = 1.2 * pow(noise, 3.0);
      noise += pow(noise, 10.0);
      noise = max(0.0, noise - 0.5);
      noise *= (1.0 - length(vUv - 0.5));
      
      if (u_color_mode == 1) {
        color = vec3(0.792, 0.659, 0.298); // Gold
        color = mix(color, vec3(0.400, 0.200, 0.050), 0.25);
        color += vec3(0.300, 0.100, 0.150) * sin(2.0 * u_scroll_progress + 1.5);
      } else {
        color = vec3(0.5, 0.15, 0.65); // Purple fallback
      }
      
      gl_FragColor = vec4(color * noise, noise);
    }
  `;

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vs = compileShader(getVertexShader(), gl.VERTEX_SHADER);
    const fs = compileShader(getFragmentShader(), gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    uniformsRef.current = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_ratio: gl.getUniformLocation(program, 'u_ratio'),
      u_pointer_position: gl.getUniformLocation(program, 'u_pointer_position'),
      u_scroll_progress: gl.getUniformLocation(program, 'u_scroll_progress'),
      u_color_mode: gl.getUniformLocation(program, 'u_color_mode'),
      u_shader_complexity: gl.getUniformLocation(program, 'u_shader_complexity'),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uniformsRef.current.u_ratio, canvas.width / canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    const handlePointer = (e) => {
      pointerRef.current.tX = e.clientX;
      pointerRef.current.tY = e.clientY;
    };
    window.addEventListener('pointermove', handlePointer);

    const animate = (time) => {
      // Throttle for performance
      if (Math.floor(time / 16) % 2 === 0) {
        pointerRef.current.x += (pointerRef.current.tX - pointerRef.current.x) * 0.1;
        pointerRef.current.y += (pointerRef.current.tY - pointerRef.current.y) * 0.1;

        gl.uniform1f(uniformsRef.current.u_time, time);
        gl.uniform2f(uniformsRef.current.u_pointer_position, 
          pointerRef.current.x / window.innerWidth, 
          1.0 - pointerRef.current.y / window.innerHeight
        );
        gl.uniform1f(uniformsRef.current.u_scroll_progress, window.pageYOffset / (2 * window.innerHeight));
        gl.uniform1i(uniformsRef.current.u_color_mode, 1);
        gl.uniform1i(uniformsRef.current.u_shader_complexity, 10); // Reduced complexity from 15 to 10 for better FPS

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointer);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="neuro-canvas"
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${
        theme === 'light' ? 'opacity-75 mix-blend-lighten' : 'opacity-85'
      }`}
      style={{ filter: theme === 'light' ? 'brightness(1.2) contrast(1.4) saturate(1.1)' : 'none' }}
    />
  );
};

export default NeuralVortex;
