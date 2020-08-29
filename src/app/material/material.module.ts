import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';




@NgModule({
  declarations: [],
  imports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule, MatButtonToggleModule, MatIconModule,
    MatSnackBarModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatChipsModule,
    MatTableModule, MatPaginatorModule],
  exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule, MatButtonToggleModule, MatIconModule,
    MatSnackBarModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatChipsModule,
    MatTableModule, MatPaginatorModule]
})
export class MaterialModule { }
