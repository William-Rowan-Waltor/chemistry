/* ═══ AURORA — flowing generative field on warm paper (OPTIMIZED V3 ZERO LAG) ═══ */
(() => {
  "use strict";
  const canvas = document.getElementById('gl');
  const badge = document.getElementById('fps');
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Default to true (120 FPS Siêu mượt, 0% CPU/GPU load)
  let isPerf = localStorage.getItem('hoa11_12_perf') !== 'gpu';
  let rafId = null;
  let gl = null;

  window.setPerformanceMode = function(perf) {
    isPerf = !!perf;
    try { localStorage.setItem('hoa11_12_perf', isPerf ? 'perf' : 'gpu'); } catch(e){}
    if (isPerf) {
      document.body.classList.add('perf-mode');
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      if (badge) badge.textContent = '⚡ Siêu mượt · 120 FPS';
    } else {
      document.body.classList.remove('perf-mode');
      if (!gl) initGL();
      if (!rafId && gl) {
        if (typeof resize === 'function') resize();
        rafId = requestAnimationFrame(tick);
      }
      if (badge) badge.textContent = '🎨 Nền WebGL';
    }
  };

  if (isPerf) {
    document.body.classList.add('perf-mode');
    if (badge) badge.textContent = '⚡ Siêu mượt · 120 FPS';
    return;
  }

  function initGL() {
    try { gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' }); }
    catch (e) { gl = null; }
    if (!gl) {
      document.body.classList.add('no-webgl');
      if (badge) badge.textContent = 'Nền tĩnh · không WebGL2';
      return;
    }

    const VERT = `#version 300 es
    in vec2 p;
    void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

    const FRAG = `#version 300 es
    precision mediump float;
    out vec4 o;
    uniform vec2 res;
    uniform float t;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
                 mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p){
      return 0.65*noise(p) + 0.35*noise(p*2.05);
    }
    void main(){
      vec2 uv = (gl_FragCoord.xy - 0.5*res) / res.y;
      float time = t*0.04;
      vec2 q = vec2(fbm(uv*1.2 + time), fbm(uv*1.2 - time + 3.1));
      float f = fbm(uv*1.6 + q);
      vec3 paper = vec3(0.988, 0.965, 0.934);
      vec3 tint  = vec3(0.975, 0.905, 0.805);
      vec3 swirl = vec3(0.94, 0.82, 0.64) + 0.06*sin(3.0*uv.xyx + time);
      vec3 col = mix(paper, tint, clamp(f*1.2, 0.0, 1.0));
      col = mix(col, swirl, clamp(length(q)*0.35, 0.0, 0.5));
      o = vec4(col, 1.0);
    }`;

    function compile(type, src){
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }
    let prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'res');
    const uT = gl.getUniformLocation(prog, 't');

    window.resize = function(){
      if (!canvas || !gl) return;
      const w = Math.floor(canvas.clientWidth || window.innerWidth), h = Math.floor(canvas.clientHeight || window.innerHeight);
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    window.addEventListener('resize', window.resize);
    window.resize();

    let last = 0;
    const start = (typeof performance !== 'undefined' ? performance.now() : 0);
    window.tick = function(now){
      if (isPerf) return;
      if (now - last < 28) { // Capped at ~35 FPS for zero GPU strain
        rafId = requestAnimationFrame(window.tick);
        return;
      }
      last = now;
      const t = (now - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) rafId = requestAnimationFrame(window.tick);
    };
    rafId = requestAnimationFrame(window.tick);
  }

  if (!isPerf) initGL();
})();