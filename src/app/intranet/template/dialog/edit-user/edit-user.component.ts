import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
  @Input() userEmail!: string;
  @Input() userName!: string;
  visible: boolean = false;

  position: string = 'center';

  showDialog() {
    this.visible = true;
  }
}
