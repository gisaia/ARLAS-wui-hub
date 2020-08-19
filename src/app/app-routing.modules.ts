import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicHubComponent } from './components/dynamic-hub/dynamic-hub.component';



const routes: Routes = [
  { path: '', component: DynamicHubComponent },
  { path: 'callback', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }