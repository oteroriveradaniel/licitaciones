import { Routes } from '@angular/router';
import { Licitaciones } from './licitaciones/licitaciones';
import { Inicio } from './inicio/inicio';

export const routes: Routes = [
    {
        path: '',
        component: Inicio,
        title: "Inicio | dordev",
    },
    {
        path: 'licitaciones',
        component: Licitaciones,
        title: "Licitaciones | dordev",
    },
    // {path: '/licitaciones/login', component: LoginPage,},
    // {path: '**', component: NotFound},
];