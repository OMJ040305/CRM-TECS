import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/users.model';

@Component({
  selector: 'app-consultar',
  imports: [CommonModule],
  templateUrl: './consultar.html',
  styleUrl: './consultar.css'
})
export class Consultar implements OnInit {

  instituciones: User[] = [];

/*  Instituciones: Omit<User, 'id'> = {
      user: '',
      correo: '',
      password: '',
      name: '',
      cct: '',
      telefono: 0,
      representante: '',
      puestoRepresentante: '',
      direccion: ''
  }
*/
constructor(
  private userService: UserService
){}

  ngOnInit(): void{
    this.loadUser();
  }

loadUser(){
  //this.instituciones = this.userService.getUsers();
  
}

}
