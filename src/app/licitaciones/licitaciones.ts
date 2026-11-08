import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormField, form } from '@angular/forms/signals';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface Licitacion {
  id: string;
  title: string;
  valueAmount: number;
}

interface FilterData {
  results: "perfil" | "competidores" | "libre";
  category: string;
  search: string;
  minAmount: number | null;
  maxAmount: number | null;
  minDate: Date | null;
  maxDate: Date | null;
}

interface CuentaResponse {
  cuenta: number;
  mediana: number;
}

@Component({
  imports: [CurrencyPipe, DecimalPipe, FormField,],
  selector: 'app-licitaciones',
  styleUrl: './licitaciones.css',
  templateUrl: './licitaciones.html',
})

export class Licitaciones implements OnInit {
  // TODO: Obtener de la base de datos.
  // Cargar desde CPV en función de los campos de texto.
  categories = [
    { id: 0, name: "Estado" },
    { id: 1, name: "Tipo" },
    { id: 2, name: "Sector" },
  ];

  cuenta = signal(0);
  mediana = signal(0);

  // TODO: Obtener de la base de datos.
  // Perfil configuración.

  filterModel = signal<FilterData>({
    results: "perfil",
    category: "",
    search: "",
    minAmount: null,
    maxAmount: null,
    minDate: null,
    maxDate: null,
  });

  filterForm = form(this.filterModel);
  
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterModel.set({
        results: params['results'] || "perfil",
        category: params['category'] || "",
        search: params['search'] || "",
        minAmount: Number(params['minAmount']) || null,
        maxAmount: Number(params['maxAmount']) || null,
        minDate: params["minDate"] ? new Date(params['minDate']) : null,
        maxDate: params["maxDate"] ? new Date(params['maxDate']) : null,
      });
    });

    this.onSubmit(null);
  }

  onSubmit(event: Event | null) {
    if (event) event.preventDefault();
    
    const credentials = this.filterModel();

    console.log('Filtering:', credentials);

    let params = new HttpParams();

    if (credentials.results) params = params.append('results', credentials.results.toString());
    if (credentials.category) params = params.append('category', credentials.category); // Corregido 'categoru'
    if (credentials.search) params = params.append('search', credentials.search);
    if (credentials.minAmount) params = params.append('minAmount', credentials.minAmount.toString());
    if (credentials.maxAmount) params = params.append('maxAmount', credentials.maxAmount.toString());
    if (credentials.minDate) params = params.append('minDate', credentials.minDate.toString());
    if (credentials.maxDate) params = params.append('maxDate', credentials.maxDate.toString());

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        results: credentials['results'] || null,
        category: credentials['category'] || null,
        search: credentials['search'] || null,
        minAmount: credentials['minAmount'] || null,
        maxAmount: credentials['maxAmount'] || null,
        minDate: credentials['minDate'] ? credentials['minDate'].toISOString().split('T')[0] : null,
        maxDate: credentials['maxDate'] ? credentials['maxDate'].toISOString().split('T')[0] : null,
      },
      queryParamsHandling: 'merge', // Mantiene otros parámetros que existan (ej. paginación)
    });

    this.http.get<Licitacion[]>('/api/', { params })
      .subscribe({
        next: (config) => {
          console.log('Datos recibidos:', config);
        },
        error: (error) => {
          console.error('Error en la petición:', error);
        }
      });
    this.http.get<CuentaResponse>('/api/cuenta-licitaciones', { params })
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