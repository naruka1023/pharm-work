import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyFieldPipe } from '../pharmacist/pipe/empty-field.pipe';
import { EmptyFieldPipePipe } from '../pharmacist/pipe/empty-field-pipe.pipe';
import { SalaryTypePipe } from '../pharmacist/pipe/salary-type.pipe';

@NgModule({
  declarations: [EmptyFieldPipePipe, EmptyFieldPipe, SalaryTypePipe],
  imports: [CommonModule],
  exports: [EmptyFieldPipePipe, EmptyFieldPipe, SalaryTypePipe],
})
export class PipeModule {}
