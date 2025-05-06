const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('customCursor');
const audio = document.getElementById('sparklerAudio');
const bg = document.getElementById('background');

let sparks = [];
let lastPoint = null;

// Track mouse movements to follow the sparkler
document.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;

  if (x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height) {
    if (lastPoint) {
      sparks.push({ x: lastPoint.x, y: lastPoint.y, time: Date.now() });
    }
    lastPoint = { x, y, time: Date.now() };
  }
});

// Smooth interpolation for a brush-like effect
function interpolatePoints(p1, p2, smoothness = 10) {
  const points = [];
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const step = dist / smoothness;

  for (let i = 0; i < smoothness; i++) {
    points.push({
      x: p1.x + (dx * i) / smoothness,
      y: p1.y + (dy * i) / smoothness,
    });
  }
  return points;
}

// Draw the sparkler trail with smoother lines and seamless fade
function draw() {
    const now = Date.now();
  
    // Clear the canvas completely each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    ctx.beginPath();
  
    for (let i = 0; i < sparks.length - 1; i++) {
      const a = sparks[i];
      const b = sparks[i + 1];
  
      const elapsed = now - a.time;
      const lifespan = 2500; // Trail visible for 2.5 seconds
  
      if (elapsed < lifespan) {
        const alpha = 1 - elapsed / lifespan;
  
        ctx.strokeStyle = `rgba(255, 255, 69, ${alpha})`;
        ctx.lineWidth = 6;
  
        const steps = 10;
        for (let j = 0; j < steps; j++) {
          const t = j / steps;
          const x = a.x + t * (b.x - a.x);
          const y = a.y + t * (b.y - a.y);
          const nextX = a.x + (t + 1 / steps) * (b.x - a.x);
          const nextY = a.y + (t + 1 / steps) * (b.y - a.y);
  
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
        }
      }
    }
  
    ctx.stroke();
  
    // Keep only recent sparks
    sparks = sparks.filter(p => now - p.time < 2500);
  
    requestAnimationFrame(draw);
  }  
  
draw();

// Resize canvas to fill the screen
function resizeElements() {
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  // Set canvas and background to fill the entire screen
  [canvas, bg].forEach(el => {
    el.style.left = '0px';
    el.style.top = '0px';
    el.style.width = `${winW}px`;
    el.style.height = `${winH}px`;
  });

  canvas.width = winW;
  canvas.height = winH;
}
window.addEventListener('resize', resizeElements);
resizeElements();

// Entry popup functionality
function enterSite() {
  // Hide the popup
  document.getElementById('entryPopup').style.display = 'none';
  // Start playing the audio
  audio.play();
}
