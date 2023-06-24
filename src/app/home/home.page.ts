import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage {
  constructor() {}

  historicoOperacoes: Array<any> = [];
  caracteresEspeciais: Array<string> = ['+', '-', '/', '%', '*', '.'];
  operacao: string = '';
  resultado: number = 0;

  addOperacao(char: string) {
    const ultimoCaracterEhEspecial = this.caracteresEspeciais.includes(this.operacao.slice(-1));
    const novoCaracterEhEspecial = this.caracteresEspeciais.includes(char);

    // Realizar Validação
    if (true) {
      this.operacao += char;
      this.preResultado();
    }
  }

  mudarOperacao(operacao: string) {
    this.operacao = operacao;
    this.preResultado();
  }
  preResultado() {
    this.resultado = eval(this.operacao);
  }

  realizarOperacao() {
    if (this.operacao != '') {
      this.resultado = eval(this.operacao);
      this.historicoOperacoes.push({
        operacao: this.operacao,
        resultado: this.resultado,
      });
      this.operacao = String(this.resultado);
    }
  }

  limparOperacao() {
    this.operacao = '';
    this.resultado = 0;
  }

  limparCharOperacao() {
    this.operacao = this.operacao.slice(0, -1);
    this.preResultado();
  }

  salvarHistorico() {
    this.historicoOperacoes.push(this.operacao);
  }
}
