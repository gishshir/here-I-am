import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [],
  imports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule],
  exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule]
})
export class MaterialModule { }
