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
  operacao: string = '';
  resultado: number = 0;

  addOperacao(char: string): void {
    if (this.operacaoEhValida(this.operacao, char)) {
      this.operacao += char;
      this.calcResultado();
    }
  }

  operacaoEhValida(
    operacao: string = this.operacao,
    char: string = ''
  ): boolean {
    const ultimoCharOperacaoEhNumber = !isNaN(Number(operacao.slice(-1)));
    const regexOperacoes = /[+%./(*-]/;

    if (operacao === '' && char === '-') {
      return true;
    }

    if (operacao === '' && regexOperacoes.test(char)) {
      return false;
    }

    if (ultimoCharOperacaoEhNumber && regexOperacoes.test(char)) {
      return true;
    }

    try {
      const aux = eval(operacao + char);
      return (
        typeof aux === 'number' && Number.isFinite(aux) && !Number.isNaN(aux)
      );
    } catch (_) {
      return false;
    }
  }

  mudarOperacao(novaOperacao: string): void {
    this.operacao = novaOperacao;
    this.calcResultado();
  }

  inverterSinal(): void {
    this.finalizaOperacao();
    this.resultado = this.resultado * -1;
    this.operacao = this.resultado.toLocaleString();
  }

  calcResultado(operacao: string = this.operacao): void {
    try {
      operacao ? (this.resultado = eval(operacao)) : (this.resultado = 0);
    } catch (_) {
      this.resultado = 0;
    }
  }

  finalizaOperacao(): void {
    if (isNaN(Number(this.operacao.slice(0, -1)))) {
      this.calcResultado();
      this.salvarHistorico(this.operacao, this.resultado);
      this.operacao = String(this.resultado);
    }
  }

  limparOperacao(): void {
    this.operacao = '';
    this.resultado = 0;
  }

  limparCharOperacao(): void {
    this.operacao = this.operacao.slice(0, -1);
    this.calcResultado();
  }

  salvarHistorico(operacao: string, resultado: number): void {
    if (operacao.slice(0, -1) != resultado.toString()) {
      this.historicoOperacoes.push({
        operacao: operacao,
        resultado: resultado,
      });
    }
  }
}
