class Ejercicio {
  constructor(tipo, numero) {
    this.tipo = tipo; // 'seleccion' o 'dibujo'
    this.numero = numero;
    this.puntoObjetivo = this.generarPuntoAleatorio();
    this.respuestaUsuario = null;
    this.esCorrecta = false;
  }
  
  generarPuntoAleatorio() {
    const x = Math.floor(Math.random() * 17) - 8; // -8 a 8
    const y = Math.floor(Math.random() * 17) - 8;
    return { x, y };
  }
  
  verificarRespuesta(respuesta) {
    if (this.tipo === 'seleccion') {
      this.respuestaUsuario = respuesta;
      this.esCorrecta = (respuesta.x === this.puntoObjetivo.x && respuesta.y === this.puntoObjetivo.y);
    } else if (this.tipo === 'dibujo') {
      this.respuestaUsuario = respuesta;
      this.esCorrecta = (respuesta.x === this.puntoObjetivo.x && respuesta.y === this.puntoObjetivo.y);
    }
    return this.esCorrecta;
  }
  
  obtenerInstruccion() {
    if (this.tipo === 'seleccion') {
      return `Identifica dónde está el punto`;
    } else {
      return `Dibuja el punto (${this.puntoObjetivo.x}, ${this.puntoObjetivo.y}) en el plano`;
    }
  }
}