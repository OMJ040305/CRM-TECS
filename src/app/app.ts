import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderInstitucional } from './components/header-institucional/header-institucional';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderInstitucional],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Portal TecNM';
}
