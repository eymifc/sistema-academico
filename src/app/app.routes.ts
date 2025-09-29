

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { RoleListComponent } from './features/admin/pages/role-list/role-list';
import { GestionUsuarios } from './features/admin/pages/gestion-usuarios/gestion-usuarios';
import { ContactComponent } from './features/public/contact/contact';

export const routes: Routes = [
    { 
        path: '', 
        component: MainLayoutComponent,
        children: [
 
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
            
     
            { path: 'dashboard', component: DashboardComponent },
            { path: 'contacto', component: ContactComponent },
            

            { path: 'roles', component: RoleListComponent, canActivate: [authGuard] } ,
            { path: 'usuario', component: GestionUsuarios, canActivate: [authGuard]}
        ]
    },

    { path: '**', redirectTo: '' }
];