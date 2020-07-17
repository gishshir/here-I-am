import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';



@NgModule({
  declarations: [],
  imports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule, MatButtonToggleModule],
  exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule, MatButtonToggleModule]
})
export class MaterialModule { }
