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
  resultado: any = 0;

  addOperacao(char: string): void {
    if (this.operacaoEhValida(this.operacao, char)) {
      this.operacao += char;
      if (char === '%') this.calcPorcentagem();
      this.calcResultado();
    }
  }

  operacaoEhValida(
    operacao: string = this.operacao,
    char: string = ''
  ): boolean {
    const ultimoChar: any = operacao?.at(-1);
    const regexCharsEspeciais = /[+%./*-]/;
    const regexPorcentagemBlock = /[%.]/;
    const regexDecimalErrado = /[.]\d+[.]/;

    const ultimoCharEhEspecial = regexCharsEspeciais.test(ultimoChar);
    const charEhEspecial = regexCharsEspeciais.test(char);

    if (regexDecimalErrado.test(operacao + char)) return false;
    if (operacao === '' && charEhEspecial) return false;
    if (!ultimoCharEhEspecial && charEhEspecial) return true;
    if (ultimoCharEhEspecial && charEhEspecial) return false;
    if (ultimoChar === '%' && !regexPorcentagemBlock.test(char) && charEhEspecial) return true;
    
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
    const regexOperacoes = /[+/()*-]/;
    const ultimoNumero: any = this.operacao.split(regexOperacoes).at(-1);

    if (ultimoNumero != '') {
      const pos = this.operacao.lastIndexOf(ultimoNumero);
      this.operacao = `${this.operacao.substring(0, pos)}(-${ultimoNumero})`;
      this.calcResultado();
    }
  }

  calcPorcentagem(): void {
    const numeros: any = this.operacao.match(/\d+/g);
    const porcentagem = Number(numeros?.at(-1)) / 100;

    if (numeros?.length > 1) {
      const operacaoSemPorcentagem = this.operacao.split(/\d+%/)[0];
      const penultimoNumero = numeros?.at(-2);
      const resultado = eval(`${penultimoNumero}*${porcentagem}`);
      this.operacao = operacaoSemPorcentagem + resultado.toString();
    } else {
      this.operacao = porcentagem.toString();
    }
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
    if (this.operacao.at(-1) === ')') {
      const regexNumeroNegativo = /(-\d+[.]*\d*)/;
      const ultimoNumero: any = this.operacao.match(regexNumeroNegativo)?.at(-1);
      this.operacao =
        this.operacao.slice(0, -(ultimoNumero?.length + 3)) +
        Number(ultimoNumero) * -1;
    } else {
      this.operacao = this.operacao.slice(0, -1);
    }
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
