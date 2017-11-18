
class Celula { 
	vida: boolean;
	x:number;
	y:number;
	vecinos: Array<Celula>;
    
    constructor(x:number,y:number) {
		this.vida = Math.random() >= 0.5;
		this.setPosicionX(x);
		this.setPosicionY(y);
		this.vecinos = new Array<Celula>();
	}
	
	getPosicionX(){
		return this.x;
	}
	getPosicionY(){
		return this.y;
	}

	setPosicionX(x:number){
		this.x = x;
	}

	setPosicionY(y:number){
		this.y = y;
	}

    estaViva() { 
        return this.vida;
    }

    matar() { 
        this.vida = false;
	}
	
	revivir(){
		this.vida = true;
	}

	obtenerVecinos(ancho,alto,vecindario){
		if (this.getPosicionX() > 0 && this.getPosicionY() > 0){
			var vecino1 = vecindario.getCelula(this.getPosicionX() - 1,this.getPosicionY() - 1);
			this.vecinos.push(vecino1);			
		}
		if (this.getPosicionX() > 0){
			var vecino2 = vecindario.getCelula(this.getPosicionX() - 1,this.getPosicionY());
			this.vecinos.push(vecino2);			
		}
		if (this.getPosicionX() > 0 && this.getPosicionY() < alto-1){
			var vecino3 = vecindario.getCelula(this.getPosicionX() - 1,this.getPosicionY() + 1);
			this.vecinos.push(vecino3);			
		}
		if (this.getPosicionY() > 0){
			var vecino4 = vecindario.getCelula(this.getPosicionX(),this.getPosicionY() - 1);
			this.vecinos.push(vecino4);			
		}
		if (this.getPosicionY() < alto-1){
			var vecino5 = vecindario.getCelula(this.getPosicionY(),this.getPosicionY() + 1);
			this.vecinos.push(vecino5);			
		}
		if (this.getPosicionX() < ancho-1 && this.getPosicionY() > 0){
			var vecino6 = vecindario.getCelula(this.getPosicionX() + 1,this.getPosicionY() - 1);
			this.vecinos.push(vecino6);			
		}
		if (this.getPosicionX() < ancho-1){
			var vecino7 = vecindario.getCelula(this.getPosicionX() + 1,this.getPosicionY());
			this.vecinos.push(vecino7);			
		}
		if (this.getPosicionX() < ancho-1 && this.getPosicionY() < alto-1){
			var vecino8 = vecindario.getCelula(this.getPosicionX() + 1,this.getPosicionY() + 1);
			this.vecinos.push(vecino8);			
		}
	}

}


class Vecindario { 
	celulas: Celula[][];
	generacion: number;
	ancho:number;
	alto:number;
    
    constructor() {
    }

    init(ancho: number, alto: number) { 
		this.celulas = [];
		this.ancho = ancho;
		this.alto = alto;
        for(var i: number = 0; i < ancho; i++) {
            this.celulas[i] = [];
            for(var j: number = 0; j<alto; j++) {
				var celula = new Celula(i,j);
				//celula.obtenerVecinos(ancho,alto,this);
                this.celulas[i][j] = celula
            }
        }
	}

	
	
	crecimiento(){
		for(var i: number = 0; i < this.celulas.length; i++) {
            for(var j: number = 0; j<this.celulas[i].length; j++) {
				var celula = this.celulas[i][j];
				console.log(celula);
				celula.obtenerVecinos(this.ancho,this.alto,this);
				var vecinosVivos = celula.vecinos.filter(vecino => vecino.vida === true).length;
				var btnCelula=document.getElementById('celula-'+i+j);
				if ((celula.estaViva()) && (vecinosVivos <2 || vecinosVivos > 3)) { 
					celula.matar();
					btnCelula.style.backgroundColor = 'white';
				}
				if ((!celula.estaViva())&& vecinosVivos == 3){
					celula.revivir();
					btnCelula.style.backgroundColor = 'black';
				}
            }
        }
	}

    getCelula(x: number, y: number) { 
        return this.celulas[x][y];
    }
}



class TejidoPrinter3D { 
    vecindario: Vecindario;
    elementoAncho: number = 50;
    
    constructor(vecindario:Vecindario) {
        this.vecindario = vecindario;
    }

    imprimir(ancho: number, alto: number,vecindario) { 
		let btnImprimir = document.createElement('button');
		btnImprimir.id='crecimiento';
		document.body.appendChild(btnImprimir);
		
        for(var i: number = 0; i < ancho; i++) {
            for(var j: number = 0; j<alto; j++) {
                let celula = this.vecindario.getCelula(i, j);
                this.imprimirCelula(celula, i, j,vecindario,ancho,alto); 
            }
		}

		btnImprimir.onclick = function () {
			vecindario.crecimiento();
		}

		
		
    }

    imprimirCelula(celula: Celula, x, y,vecindario:Vecindario,ancho: number, alto: number) { 
		
		let btnCelula = document.createElement('button');
		btnCelula.id='celula-'+x+y;
		if (celula.estaViva()) { 
			
			btnCelula.style.backgroundColor = 'black';
		}else{
			btnCelula.style.backgroundColor = 'white';
		}
	
        //btnCelula.textContent = 'x';
        btnCelula.style.width = this.elementoAncho+'px';
        btnCelula.style.height = this.elementoAncho+'px';
        btnCelula.style.position = 'absolute';
        btnCelula.style.marginTop = (100+x*this.elementoAncho)+'px';
        btnCelula.style.marginLeft = (50+y*this.elementoAncho)+'px';

        btnCelula.onclick = function () {
			if (celula.estaViva()) { 
                celula.matar();
                btnCelula.style.backgroundColor = 'white';
            }else{
				celula.revivir();
				btnCelula.style.backgroundColor = 'black';
			}  
			celula.obtenerVecinos(ancho,alto,vecindario); 
			//console.log(celula.obtenerVecinos(tejido));
			console.log(celula);
		}
		
        document.body.appendChild(btnCelula);
    }
}

window.onload = () => 
{
	let vecindario = new Vecindario();
	vecindario.init(10,10);
	
	let printer = new TejidoPrinter3D(vecindario);
	printer.imprimir(10,10,vecindario);
}

