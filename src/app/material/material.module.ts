import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [],
  imports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule, MatButtonToggleModule, MatIconModule],
  exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule, MatButtonToggleModule, MatIconModule]
})
export class MaterialModule { }
