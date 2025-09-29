// src/app/features/public/contact/contact.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule], 
  templateUrl: './contact.html',
  styleUrl: './contact.css' 
})
export class ContactComponent {

}