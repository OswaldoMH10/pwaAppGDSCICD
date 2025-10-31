class SistemaEjercicios {
  constructor() {
    this.ejercicios = [];
    this.ejercicioActual = 0;
    this.planoActual = null;
    this.puntuacion = 0;
    this.ejerciciosCompletados = 0;
  }
  
  inicializar() {
    this.generarEjercicios();
    this.mostrarEjercicio(0);
  }
  
  generarEjercicios() {
    // 5 ejercicios de selección
    for (let i = 0; i < 5; i++) {
      this.ejercicios.push(new Ejercicio('seleccion', i + 1));
    }
    
    // 5 ejercicios de dibujo
    for (let i = 0; i < 5; i++) {
      this.ejercicios.push(new Ejercicio('dibujo', i + 6));
    }
  }
  
  mostrarEjercicio(indice) {
    if (indice >= this.ejercicios.length) {
      this.mostrarResultados();
      return;
    }
    
    this.ejercicioActual = indice;
    const ejercicio = this.ejercicios[indice];
    
    const contenedor = document.getElementById('ejercicioContenedor');
    contenedor.innerHTML = '';
    
    const ejercicioDiv = document.createElement('div');
    ejercicioDiv.className = 'ejercicio-item';
    ejercicioDiv.innerHTML = `
      <h3>Ejercicio ${indice + 1} de ${this.ejercicios.length}</h3>
      <p class="instruccion">${ejercicio.obtenerInstruccion()}</p>
      <div class="canvas-wrapper">
        <canvas id="plano-${indice}"></canvas>
      </div>
    `;
    
    contenedor.appendChild(ejercicioDiv);
    
    if (ejercicio.tipo === 'seleccion') {
      this.crearEjercicioSeleccion(ejercicio, indice);
    } else {
      this.crearEjercicioDibujo(ejercicio, indice);
    }
    
    const botonesDiv = document.createElement('div');
    botonesDiv.className = 'botones-navegacion';
    botonesDiv.innerHTML = `
      <button id="btn-verificar" class="btn-verificar">Verificar</button>
      <button id="btn-siguiente" class="btn-siguiente" style="display:none;">Siguiente</button>
    `;
    contenedor.appendChild(botonesDiv);
    
    document.getElementById('btn-verificar').addEventListener('click', () => {
      this.verificarEjercicioActual();
    });
    
    document.getElementById('btn-siguiente').addEventListener('click', () => {
      this.mostrarEjercicio(this.ejercicioActual + 1);
    });
  }
  
  crearEjercicioSeleccion(ejercicio, indice) {
    this.planoActual = new PlanoCartesiano(`plano-${indice}`, {
      width: 500,
      height: 420,
      scale: 20,
      rangoX: 12,
      rangoY: 10,
      interactivo: false
    });
    
    this.planoActual.dibujar();
    this.planoActual.marcarPunto(ejercicio.puntoObjetivo.x, ejercicio.puntoObjetivo.y);
    
    const opcionesDiv = document.createElement('div');
    opcionesDiv.className = 'opciones-respuesta';
    opcionesDiv.id = 'opciones-respuesta';
    
    const opciones = this.generarOpciones(ejercicio.puntoObjetivo);
    
    opciones.forEach((opcion, i) => {
      const boton = document.createElement('button');
      boton.className = 'opcion-btn';
      boton.textContent = `(${opcion.x}, ${opcion.y})`;
      boton.dataset.x = opcion.x;
      boton.dataset.y = opcion.y;
      boton.addEventListener('click', (e) => {
        document.querySelectorAll('.opcion-btn').forEach(b => b.classList.remove('seleccionada'));
        boton.classList.add('seleccionada');
        ejercicio.respuestaUsuario = { x: parseInt(opcion.x), y: parseInt(opcion.y) };
      });
      opcionesDiv.appendChild(boton);
    });
    
    document.getElementById('ejercicioContenedor').appendChild(opcionesDiv);
  }
  
  crearEjercicioDibujo(ejercicio, indice) {
    this.planoActual = new PlanoCartesiano(`plano-${indice}`, {
      width: 500,
      height: 420,
      scale: 20,
      rangoX: 12,
      rangoY: 10,
      interactivo: true
    });
    
    this.planoActual.dibujar();
    
    this.planoActual.canvas.addEventListener('puntoMarcado', (e) => {
      ejercicio.respuestaUsuario = e.detail;
    });
  }
  
  generarOpciones(correcta) {
    const opciones = [correcta];
    
    while (opciones.length < 4) {
      const x = Math.floor(Math.random() * 17) - 8;
      const y = Math.floor(Math.random() * 17) - 8;
      
      const yaExiste = opciones.some(op => op.x === x && op.y === y);
      if (!yaExiste) {
        opciones.push({ x, y });
      }
    }
    
    // Mezclar opciones
    for (let i = opciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }
    
    return opciones;
  }
  
  verificarEjercicioActual() {
    const ejercicio = this.ejercicios[this.ejercicioActual];
    
    if (!ejercicio.respuestaUsuario) {
      alert('Por favor, selecciona o dibuja una respuesta');
      return;
    }
    
    const esCorrecta = ejercicio.verificarRespuesta(ejercicio.respuestaUsuario);
    
    if (esCorrecta) {
      this.puntuacion++;
    }
    
    this.ejerciciosCompletados++;
    this.mostrarRetroalimentacion(esCorrecta, ejercicio);
    
    document.getElementById('btn-verificar').style.display = 'none';
    document.getElementById('btn-siguiente').style.display = 'inline-block';
  }
  
  mostrarRetroalimentacion(esCorrecta, ejercicio) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback ${esCorrecta ? 'correcto' : 'incorrecto'}`;
    
    if (esCorrecta) {
      feedbackDiv.innerHTML = `
        <span class="icono">✓</span>
        <span>¡Correcto! Excelente trabajo.</span>
      `;
    } else {
      feedbackDiv.innerHTML = `
        <span class="icono">✗</span>
        <span>Incorrecto. La respuesta correcta debe ser el punto (${ejercicio.puntoObjetivo.x}, ${ejercicio.puntoObjetivo.y})</span>
      `;
      
      if (ejercicio.tipo === 'dibujo' && this.planoActual) {
        this.planoActual.marcarPunto(ejercicio.puntoObjetivo.x, ejercicio.puntoObjetivo.y);
      }
    }
    
    const contenedor = document.getElementById('ejercicioContenedor');
    contenedor.appendChild(feedbackDiv);
    
    // Deshabilitar interacción
    if (ejercicio.tipo === 'seleccion') {
      document.querySelectorAll('.opcion-btn').forEach(btn => {
        btn.disabled = true;
        const x = parseInt(btn.dataset.x);
        const y = parseInt(btn.dataset.y);
        if (x === ejercicio.puntoObjetivo.x && y === ejercicio.puntoObjetivo.y) {
          btn.classList.add('correcta');
        }
      });
    }
  }
  
  mostrarResultados() {
    const contenedor = document.getElementById('ejercicioContenedor');
    const porcentaje = (this.puntuacion / this.ejercicios.length * 100).toFixed(1);
    
    let mensaje = '';
    let clase = '';
    
    if (porcentaje >= 90) {
      mensaje = '¡Excelente trabajo! Dominas las coordenadas cartesianas.';
      clase = 'excelente';
    } else if (porcentaje >= 70) {
      mensaje = '¡Buen trabajo! Vas por buen camino.';
      clase = 'bueno';
    } else if (porcentaje >= 50) {
      mensaje = 'Bien, pero puedes mejorar. ¡Sigue practicando!';
      clase = 'regular';
    } else {
      mensaje = 'Necesitas más práctica. ¡No te rindas!';
      clase = 'necesita-practica';
    }
    
    contenedor.innerHTML = `
      <div class="resultados ${clase}">
        <h2>¡Ejercicios Completados!</h2>
        <div class="puntuacion-final">
          <div class="numero-grande">${this.puntuacion}</div>
          <div class="de-total">de ${this.ejercicios.length}</div>
        </div>
        <div class="porcentaje">${porcentaje}%</div>
        <p class="mensaje">${mensaje}</p>
        <button class="btn-reintentar" onclick="location.reload()">Intentar de nuevo</button>
      </div>
    `;
  }
}