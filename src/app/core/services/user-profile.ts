import { Injectable, signal, WritableSignal } from '@angular/core';

export interface UserProfile {
  exp: any;
  nombreCompleto: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  currentUser = signal<UserProfile | null>(null);
   selectedRole: WritableSignal<string | null> = signal(null); 

  constructor() { }

  setCurrentUser(profile: UserProfile | null): void {
    this.currentUser.set(profile);
    if (profile && profile.roles.length > 0) {
      this.selectedRole.set(profile.roles[0]);
    }
  }

   changeSelectedRole(role: string): void {
    this.selectedRole.set(role);
    console.log(`Rol cambiado a: ${role}`); 
  }
}