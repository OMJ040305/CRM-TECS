import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  backdropClick(ev: MouseEvent) {
    if ((ev.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
