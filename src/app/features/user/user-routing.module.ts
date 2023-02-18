import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressComponent } from './components/address/address.component';
import { UserComponent } from './components/user/user.component';





const routes: Routes = [
  {
    path: "",
    component: UserComponent
  },
  {
    path: "addresses",
    component: AddressComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }