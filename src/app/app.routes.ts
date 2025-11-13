import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Consultar } from './components/consultar/consultar';
import { RegisterComponent } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';


export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
