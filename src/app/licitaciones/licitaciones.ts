import { Component } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, DecimalPipe, ],
  selector: 'app-licitaciones',
  styleUrl: './licitaciones.css',
  templateUrl: './licitaciones.html',
})
export class Licitaciones {}
