/**
 * NOORTOMARK Neural Vortex Background Component
 * WebGL-powered interactive background with pointer tracking and scroll animation
 * 
 * @author NOORTOMARK
 * @version 1.0.0
 * @license Proprietary
 */

class NeuralVortexBackground {
  /**
   * Initialize Neural Vortex Background
   * @param {string} containerId - Canvas element ID (default: 'neuro-canvas')
   * @param {Object} options - Configuration options
   */
  constructor(containerId = 'neuro-canvas', options = {}) {
    this.containerId = containerId;
    this.canvas = null;
    this.gl = null;
    this.shaderProgram = null;
    this.uniforms = {};
    this.animationId = null;
    this.pointer = { x: 0, y: 0, tX: 0, tY: 0 };
    
    // Auto-detect theme
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const colorMode = theme === 'light' ? 'gold' : 'gold';
    
    // Configuration
    this.config = {
      enablePointer: true,
      enableScroll: true,
      opacity: theme === 'light' ? 0.4 : 0.85,
      shaderComplexity: 15, // Loop iterations (higher = more complex)
      colorMode: colorMode, // Auto-adapt to theme
      ...options,
    };
  }

  /**
   * Initialize WebGL and start animation
   */
  init() {
    this.canvas = document.getElementById(this.containerId);
    
    if (!this.canvas) {
      console.error(`Canvas with id "${this.containerId}" not found`);
      return false;
    }

    // Get WebGL context
    this.gl = this.canvas.getContext('webgl', { alpha: true, antialias: false })
      || this.canvas.getContext('experimental-webgl', { alpha: true, antialias: false });

    if (!this.gl) {
      console.warn('WebGL not supported on this device');
      return false;
    }

    // Setup WebGL
    this.setupShaders();
    this.setupGeometry();
    this.setupUniformLocations();
    this.resizeCanvas();
    this.setupEventListeners();
    this.animate();

    console.log('Neural Vortex Background initialized successfully');
    return true;
  }

  /**
   * Get vertex shader source
   */
  getVertexShader() {
    return `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
  }

  /**
   * Get fragment shader source (adapted for NOORTOMARK premium aesthetic)
   */
  getFragmentShader() {
    return `
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
      
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = 8.0;
        
        for (int j = 0; j < 20; j++) {
          if (j >= u_shader_complexity) break;
          
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
        
        // Pointer interaction
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0.0, 1.0);
        p = 0.5 * pow(1.0 - p, 2.0);
        
        float t = 0.001 * u_time;
        vec3 color = vec3(0.0);
        
        // Generate noise shape
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.0);
        noise += pow(noise, 10.0);
        noise = max(0.0, noise - 0.5);
        noise *= (1.0 - length(vUv - 0.5));
        
        // Color modes
        if (u_color_mode == 1) {
          // Gold (default - NOORTOMARK)
          color = vec3(0.792, 0.659, 0.298); // #c9a84c
          color = mix(color, vec3(0.400, 0.200, 0.050), 0.25);
          color += vec3(0.300, 0.100, 0.150) * sin(2.0 * u_scroll_progress + 1.5);
        } else if (u_color_mode == 2) {
          // Purple
          color = vec3(0.5, 0.15, 0.65);
          color = mix(color, vec3(0.02, 0.7, 0.9), 0.32);
          color += vec3(0.15, 0.0, 0.6) * sin(2.0 * u_scroll_progress + 1.2);
        } else if (u_color_mode == 3) {
          // Cyan Neon
          color = vec3(0.02, 0.7, 0.9);
          color = mix(color, vec3(0.792, 0.659, 0.298), 0.15);
          color += vec3(0.0, 0.5, 0.8) * sin(2.0 * u_scroll_progress + 1.0);
        }
        
        color = color * noise;
        gl_FragColor = vec4(color, noise);
      }
    `;
  }

  /**
   * Compile and attach shaders
   */
  setupShaders() {
    const vertexShader = this.compileShader(this.getVertexShader(), this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(this.getFragmentShader(), this.gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to compile shaders');
      return;
    }

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      console.error('Shader program link error:', this.gl.getProgramInfoLog(this.shaderProgram));
    }

    this.gl.useProgram(this.shaderProgram);
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
  }

  /**
   * Compile individual shader
   */
  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        `Shader compilation error (${type === this.gl.VERTEX_SHADER ? 'vertex' : 'fragment'}):`,
        this.gl.getShaderInfoLog(shader)
      );
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Setup geometry buffer
   */
  setupGeometry() {
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  /**
   * Cache uniform locations
   */
  setupUniformLocations() {
    this.uniforms = {
      u_time: this.gl.getUniformLocation(this.shaderProgram, 'u_time'),
      u_ratio: this.gl.getUniformLocation(this.shaderProgram, 'u_ratio'),
      u_pointer_position: this.gl.getUniformLocation(this.shaderProgram, 'u_pointer_position'),
      u_scroll_progress: this.gl.getUniformLocation(this.shaderProgram, 'u_scroll_progress'),
      u_color_mode: this.gl.getUniformLocation(this.shaderProgram, 'u_color_mode'),
      u_shader_complexity: this.gl.getUniformLocation(this.shaderProgram, 'u_shader_complexity'),
    };
  }

  /**
   * Handle canvas resize
   */
  resizeCanvas() {
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * devicePixelRatio;
    this.canvas.height = height * devicePixelRatio;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.uniforms.u_ratio, this.canvas.width / this.canvas.height);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Resize handler
    const handleResize = () => this.resizeCanvas();
    window.addEventListener('resize', handleResize);

    // Pointer tracking
    if (this.config.enablePointer) {
      window.addEventListener('pointermove', (e) => {
        this.pointer.tX = e.clientX;
        this.pointer.tY = e.clientY;
      });

      window.addEventListener('touchmove', (e) => {
        if (e.touches[0]) {
          this.pointer.tX = e.touches[0].clientX;
          this.pointer.tY = e.touches[0].clientY;
        }
      });

      window.addEventListener('mouseleave', () => {
        this.pointer.tX = window.innerWidth / 2;
        this.pointer.tY = window.innerHeight / 2;
      });
    }

    // Store cleanup function
    this._cleanup = () => {
      window.removeEventListener('resize', handleResize);
    };
  }

  /**
   * Animation loop
   */
  animate() {
    const currentTime = performance.now();

    // Smooth pointer easing
    this.pointer.x += (this.pointer.tX - this.pointer.x) * 0.2;
    this.pointer.y += (this.pointer.tY - this.pointer.y) * 0.2;

    // Update uniforms
    this.gl.uniform1f(this.uniforms.u_time, currentTime);

    if (this.config.enablePointer) {
      this.gl.uniform2f(
        this.uniforms.u_pointer_position,
        this.pointer.x / window.innerWidth,
        1.0 - this.pointer.y / window.innerHeight
      );
    }

    if (this.config.enableScroll) {
      const scrollProgress = window.pageYOffset / (2 * window.innerHeight);
      this.gl.uniform1f(this.uniforms.u_scroll_progress, scrollProgress);
    }

    // Color mode mapping
    const colorMap = { gold: 1, purple: 2, cyan: 3 };
    this.gl.uniform1i(this.uniforms.u_color_mode, colorMap[this.config.colorMode] || 1);
    this.gl.uniform1i(this.uniforms.u_shader_complexity, this.config.shaderComplexity);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this._cleanup) {
      this._cleanup();
    }
    if (this.gl) {
      const ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
  }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const vortex = new NeuralVortexBackground('neuro-canvas');
    window.neuralVortex = vortex; // Make accessible globally
    vortex.init();
  });
} else {
  const vortex = new NeuralVortexBackground('neuro-canvas');
  window.neuralVortex = vortex;
  vortex.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NeuralVortexBackground;
}
