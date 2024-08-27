import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { ImcCalculatorService } from './imc-calculator.service';
import { ImcCalculatorRequest } from './imc-calculator.dtos';

@Controller('imc')
export class ImcCalculatorController {
  constructor(private readonly imcCalcService: ImcCalculatorService) {}

  @Get('hello')
  getHello() {
    return this.imcCalcService.hello();
  }

  @Get('table')
  getTable() {
    return this.imcCalcService.getTable();
  }

  @Get('table/html')
  @Render('imcTable.hbs')
  getTableHtml() {
    return { data: this.imcCalcService.getTable() };
  }

  @Post('calculate')
  calculate(@Body() request: ImcCalculatorRequest) {
    return this.imcCalcService.calculateAndTranslate(request);
  }

  @Get()
  @Render('imcFormulario.hbs')
  showForm() {
    return { fields: [
      { label: 'Altura (em metros):', type: 'number', name: 'altura' },
      { label: 'Peso (em kg):', type: 'number', name: 'peso' },
    ]};
  }

  @Post()
  @Render('imcResultado.hbs')
  calculateImc(@Body() body: { altura: string; peso: string }) {
    const altura = parseFloat(body.altura);
    const peso = parseFloat(body.peso);
    const imc = peso / (altura * altura);
    let categoria = '';

    if (imc < 18.5) {
      categoria = 'Abaixo do peso';
    } else if (imc >= 18.5 && imc < 24.9) {
      categoria = 'Peso normal';
    } else if (imc >= 25 && imc < 29.9) {
      categoria = 'Sobrepeso';
    } else {
      categoria = 'Obesidade';
    }

    return { imc: imc.toFixed(2), categoria };
  }
}
