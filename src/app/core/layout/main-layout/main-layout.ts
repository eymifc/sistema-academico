
import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserProfileService } from '../../services/user-profile';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Menu } from '../../../features/admin/interfaces/menu.interface';
import { MenuService } from '../../services/menu';
import { Role } from '../../../features/admin/interfaces/role.interface';
import { RoleService } from '../../../features/admin/services/role';
import { Auth } from '../../../auth/services/auth';


import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../../../auth/components/login/login';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
    MatDialogModule 
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent implements OnInit {
  currentDate = new Date();
  mainMenu = signal<Menu[]>([]);
  allRoles = signal<Role[]>([]);
  
  currentUser;
  userDisplayText;
  selectedRole;


  isAuthenticated = computed(() => !!this.currentUser());


  constructor(
    private userProfileService: UserProfileService, 
    private menuService: MenuService, 
    private roleService: RoleService, 
    private authService: Auth,
    private dialog: MatDialog 
  ) {
    this.currentUser = this.userProfileService.currentUser;
    this.selectedRole = this.userProfileService.selectedRole;

    this.userDisplayText = computed(() => {
      const user = this.currentUser();
      return user ? user.nombreCompleto : 'Invitado'; 
    });

    effect(() => {
      const roleName = this.selectedRole();
      if (roleName && this.allRoles().length > 0) {
        const role = this.allRoles().find(r => r.nombre === roleName);
        if (role) {
          this.menuService.getMenusByRoleId(role.codr).subscribe(menus => {
            this.mainMenu.set(menus);
          });
        }
      } else {
      
        this.mainMenu.set([]);
      }
    });
  }

  ngOnInit(): void {

    if (this.isAuthenticated()) {
      this.loadAllRoles();
    }
  }

  loadAllRoles(): void {
    this.roleService.getRoles().subscribe(roles => {
      this.allRoles.set(roles); 
    });
  }
  
  onRoleChange(newRole: string): void {
    this.userProfileService.changeSelectedRole(newRole);
  }


  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '450px',
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo de login se cerró');

      if(this.isAuthenticated()){
          this.loadAllRoles();
      }
    });
  }

  logout(): void {
        this.authService.logout();
  }
}