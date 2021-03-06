import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleArticuloComponent } from './articulo/detalle-articulo.component';
import { ListaArticuloComponent } from './articulo/lista-articulo.component';
import { PrincipalComponent } from './menu/principal.component';

const routes: Routes = [
  {
    path:'',
    component: PrincipalComponent,
    children: [
      {path: 'lista', component: ListaArticuloComponent},
      {path: 'detalle/:id', component: DetalleArticuloComponent},
      {path: '**', redirectTo: 'lista', pathMatch: 'full'}
    ]
  }
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StripeRoutingModule { }
