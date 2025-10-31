class PlanoCartesiano {
  constructor(canvasId, config = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = config.width || 500;
    this.height = config.height || 420;
    this.scale = config.scale || 20;
    this.rangoX = config.rangoX || 12;
    this.rangoY = config.rangoY || 10;
    this.puntoMarcado = null;
    this.esInteractivo = config.interactivo || false;
    
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    if (this.esInteractivo) {
      this.agregarEventos();
    }
  }
  
  dibujar() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.dibujarFondo();
    this.dibujarGrid();
    this.dibujarEjes();
    this.dibujarNumeros();
    if (this.puntoMarcado) {
      this.dibujarPunto(this.puntoMarcado.x, this.puntoMarcado.y, '#e74c3c', 6);
    }
  }
  
  dibujarFondo() {
    this.ctx.fillStyle = '#f8f9fa';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  
  dibujarGrid() {
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 0.5;
    
    for (let i = -this.rangoX; i <= this.rangoX; i++) {
      const x = this.coordenadaAPixel(i, 0).x;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    
    for (let j = -this.rangoY; j <= this.rangoY; j++) {
      const y = this.coordenadaAPixel(0, j).y;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }
  
  dibujarEjes() {
    this.ctx.strokeStyle = '#2c3e50';
    this.ctx.lineWidth = 2;
    
    const origen = this.coordenadaAPixel(0, 0);
    
    // Eje X
    this.ctx.beginPath();
    this.ctx.moveTo(0, origen.y);
    this.ctx.lineTo(this.width, origen.y);
    this.ctx.stroke();
    
    // Eje Y
    this.ctx.beginPath();
    this.ctx.moveTo(origen.x, 0);
    this.ctx.lineTo(origen.x, this.height);
    this.ctx.stroke();
  }
  
  dibujarNumeros() {
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.font = '11px Arial';
    this.ctx.textAlign = 'center';
    
    for (let i = -this.rangoX; i <= this.rangoX; i++) {
      if (i === 0) continue;
      const pos = this.coordenadaAPixel(i, 0);
      this.ctx.fillText(i.toString(), pos.x, pos.y + 15);
    }
    
    this.ctx.textAlign = 'right';
    for (let j = -this.rangoY; j <= this.rangoY; j++) {
      if (j === 0) continue;
      const pos = this.coordenadaAPixel(0, j);
      this.ctx.fillText(j.toString(), pos.x - 8, pos.y + 4);
    }
    
    const origen = this.coordenadaAPixel(0, 0);
    this.ctx.fillText('0', origen.x - 8, origen.y + 15);
  }
  
  dibujarPunto(x, y, color = '#e74c3c', radio = 5) {
    const pos = this.coordenadaAPixel(x, y);
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radio, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
  
  coordenadaAPixel(x, y) {
    return {
      x: this.width / 2 + x * this.scale,
      y: this.height / 2 - y * this.scale
    };
  }
  
  pixelACoordenada(px, py) {
    return {
      x: Math.round((px - this.width / 2) / this.scale),
      y: Math.round((this.height / 2 - py) / this.scale)
    };
  }
  
  marcarPunto(x, y) {
    this.puntoMarcado = { x, y };
    this.dibujar();
  }
  
  limpiarPunto() {
    this.puntoMarcado = null;
    this.dibujar();
  }
  
  agregarEventos() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const coord = this.pixelACoordenada(px, py);
      
      if (Math.abs(coord.x) <= this.rangoX && Math.abs(coord.y) <= this.rangoY) {
        this.marcarPunto(coord.x, coord.y);
        
        const evento = new CustomEvent('puntoMarcado', {
          detail: { x: coord.x, y: coord.y }
        });
        this.canvas.dispatchEvent(evento);
      }
    });
    
    this.canvas.style.cursor = 'crosshair';
  }
  
  obtenerPuntoMarcado() {
    return this.puntoMarcado;
  }
}