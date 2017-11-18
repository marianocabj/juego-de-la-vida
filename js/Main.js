var Celula = (function () {
    function Celula(x, y) {
        this.vida = Math.random() >= 0.5;
        this.setPosicionX(x);
        this.setPosicionY(y);
        this.vecinos = new Array();
    }
    Celula.prototype.getPosicionX = function () {
        return this.x;
    };
    Celula.prototype.getPosicionY = function () {
        return this.y;
    };
    Celula.prototype.setPosicionX = function (x) {
        this.x = x;
    };
    Celula.prototype.setPosicionY = function (y) {
        this.y = y;
    };
    Celula.prototype.estaViva = function () {
        return this.vida;
    };
    Celula.prototype.matar = function () {
        this.vida = false;
    };
    Celula.prototype.revivir = function () {
        this.vida = true;
    };
    Celula.prototype.obtenerVecinos = function (ancho, alto, vecindario) {
        if (this.getPosicionX() > 0 && this.getPosicionY() > 0) {
            var vecino1 = vecindario.getCelula(this.getPosicionX() - 1, this.getPosicionY() - 1);
            this.vecinos.push(vecino1);
        }
        if (this.getPosicionX() > 0) {
            var vecino2 = vecindario.getCelula(this.getPosicionX() - 1, this.getPosicionY());
            this.vecinos.push(vecino2);
        }
        if (this.getPosicionX() > 0 && this.getPosicionY() < alto) {
            var vecino3 = vecindario.getCelula(this.getPosicionX() - 1, this.getPosicionY() + 1);
            this.vecinos.push(vecino3);
        }
        if (this.getPosicionY() > 0) {
            var vecino4 = vecindario.getCelula(this.getPosicionX(), this.getPosicionY() - 1);
            this.vecinos.push(vecino4);
        }
        if (this.getPosicionY() < alto) {
            var vecino5 = vecindario.getCelula(this.getPosicionY(), this.getPosicionY() + 1);
            this.vecinos.push(vecino5);
        }
        if (this.getPosicionX() < ancho && this.getPosicionY() > 0) {
            var vecino6 = vecindario.getCelula(this.getPosicionX() + 1, this.getPosicionY() - 1);
            this.vecinos.push(vecino6);
        }
        if (this.getPosicionX() < ancho) {
            var vecino7 = vecindario.getCelula(this.getPosicionX() + 1, this.getPosicionY());
            this.vecinos.push(vecino7);
        }
        if (this.getPosicionX() < ancho && this.getPosicionY() < alto) {
            var vecino8 = vecindario.getCelula(this.getPosicionX() + 1, this.getPosicionY() + 1);
            this.vecinos.push(vecino8);
        }
    };
    return Celula;
}());
var Vecindario = (function () {
    function Vecindario() {
    }
    Vecindario.prototype.init = function (ancho, alto) {
        this.celulas = [];
        this.ancho = ancho;
        this.alto = alto;
        for (var i = 0; i < ancho; i++) {
            this.celulas[i] = [];
            for (var j = 0; j < alto; j++) {
                var celula = new Celula(i, j);
                //celula.obtenerVecinos(ancho,alto,this);
                this.celulas[i][j] = celula;
            }
        }
    };
    Vecindario.prototype.crecimiento = function () {
        for (var i = 0; i < this.celulas.length; i++) {
            for (var j = 0; j < this.celulas[i].length; j++) {
                var celula = this.celulas[i][j];
                celula.obtenerVecinos(this.ancho, this.alto, this);
                var vecinosVivos = celula.vecinos.filter(function (vecino) { return vecino.vida === true; }).length;
                var btnCelula = document.getElementById('celula-' + i + j);
                if ((celula.estaViva()) && (vecinosVivos < 2 || vecinosVivos > 3)) {
                    celula.matar();
                    btnCelula.style.backgroundColor = 'white';
                }
                if ((!celula.estaViva()) && vecinosVivos == 3) {
                    celula.revivir();
                    btnCelula.style.backgroundColor = 'black';
                }
            }
        }
    };
    Vecindario.prototype.getCelula = function (x, y) {
        return this.celulas[x][y];
    };
    return Vecindario;
}());
var TejidoPrinter3D = (function () {
    function TejidoPrinter3D(vecindario) {
        this.elementoAncho = 50;
        this.vecindario = vecindario;
    }
    TejidoPrinter3D.prototype.imprimir = function (ancho, alto, vecindario) {
        var btnImprimir = document.createElement('button');
        btnImprimir.id = 'crecimiento';
        document.body.appendChild(btnImprimir);
        for (var i = 0; i < ancho; i++) {
            for (var j = 0; j < alto; j++) {
                var celula = this.vecindario.getCelula(i, j);
                this.imprimirCelula(celula, i, j, vecindario, ancho, alto);
            }
        }
        btnImprimir.onclick = function () {
            vecindario.crecimiento();
        };
    };
    TejidoPrinter3D.prototype.imprimirCelula = function (celula, x, y, vecindario, ancho, alto) {
        var btnCelula = document.createElement('button');
        btnCelula.id = 'celula-' + x + y;
        if (celula.estaViva()) {
            btnCelula.style.backgroundColor = 'black';
        }
        else {
            btnCelula.style.backgroundColor = 'white';
        }
        //btnCelula.textContent = 'x';
        btnCelula.style.width = this.elementoAncho + 'px';
        btnCelula.style.height = this.elementoAncho + 'px';
        btnCelula.style.position = 'absolute';
        btnCelula.style.marginTop = (100 + x * this.elementoAncho) + 'px';
        btnCelula.style.marginLeft = (50 + y * this.elementoAncho) + 'px';
        btnCelula.onclick = function () {
            if (celula.estaViva()) {
                celula.matar();
                btnCelula.style.backgroundColor = 'white';
            }
            else {
                celula.revivir();
                btnCelula.style.backgroundColor = 'black';
            }
            celula.obtenerVecinos(ancho, alto, vecindario);
            //console.log(celula.obtenerVecinos(tejido));
            console.log(celula);
        };
        document.body.appendChild(btnCelula);
    };
    return TejidoPrinter3D;
}());
window.onload = function () {
    var vecindario = new Vecindario();
    vecindario.init(10, 10);
    var printer = new TejidoPrinter3D(vecindario);
    printer.imprimir(10, 10, vecindario);
};
