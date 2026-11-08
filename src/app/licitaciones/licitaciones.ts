import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormField, form } from '@angular/forms/signals';
import { HttpClient, HttpParams } from '@angular/common/http';

interface Licitacion {
  id: string;
  title: string;
  valueAmount: number;
}

interface FilterData {
  results: "perfil" | "competidores" | "libre";
  category: string;
  search: string;
  minAmount: number;
  maxAmount: number;
  minDate: Date;
  maxDate: Date;
}

interface CuentaResponse {
  cuenta: number;
  mediana: number;
}

@Component({
  imports: [CurrencyPipe, DecimalPipe, FormField, ],
  selector: 'app-licitaciones',
  styleUrl: './licitaciones.css',
  templateUrl: './licitaciones.html',
})

export class Licitaciones {
  // TODO: Obtener de la base de datos.
  // Cargar desde CPV en función de los campos de texto.
  categories = [
    {id: 0, name: "Estado"}, 
    {id: 1, name: "Tipo"}, 
    {id: 2, name: "Sector"}, 
  ];

  cuenta = signal(0);
  mediana = signal(0);
    
  // TODO: Obtener de la base de datos.
  // Perfil configuración.

  filterModel = signal<FilterData>({
    results: "perfil",
    category: "",
    search: "",
    minAmount: 0,
    maxAmount: 1000000,
    minDate: new Date("2013-01-01"), 
    maxDate: new Date("2026-01-01"),
  });

  filterForm = form(this.filterModel);

  http = inject(HttpClient);

  onSubmit(event: Event) {
    event.preventDefault();    

    const credentials = this.filterModel();

    console.log('Logging in with:', credentials);

    let params = new HttpParams();

    if (credentials.results) params = params.append('results', credentials.results.toString());
    if (credentials.category) params = params.append('category', credentials.category); // Corregido 'categoru'
    if (credentials.search) params = params.append('search', credentials.search);
    if (credentials.minAmount) params = params.append('minAmount', credentials.minAmount.toString());
    if (credentials.maxAmount) params = params.append('maxAmount', credentials.maxAmount.toString());
    if (credentials.minDate) params = params.append('minDate', credentials.minDate.toString());
    if (credentials.maxDate) params = params.append('maxDate', credentials.maxDate.toString());


    this.http.get<Licitacion[]>('/api/', {params})
    .subscribe({
    next: (config) => {
      console.log('Datos recibidos:', config);
    },
    error: (error) => {
      console.error('Error en la petición:', error);
    }
  });
    this.http.get<CuentaResponse>('/api/cuenta-licitaciones', {params})
    .subscribe({
    next: (config) => {
      console.log('Datos recibidos:', config);
      this.cuenta.set(config["cuenta"]);
      this.mediana.set(config["mediana"]);
    },
    error: (error) => {
      console.error('Error en la petición:', error);
    }
  });
  }
}