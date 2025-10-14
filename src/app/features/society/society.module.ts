import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Standalone Components
import { FlatTableComponent } from './components/flat-table/flat-table.component';
import { FlatDetailsComponent } from './components/flat-details/flat-details.component';
import { SocietyListPageComponent } from './pages/society-list/society-list.component';

import { RoleGuard } from './guards/role.guard';

@NgModule({
  declarations: [ /* No standalone components here */ ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FlatTableComponent,
    FlatDetailsComponent,
    SocietyListPageComponent   // import instead of declare
  ],
  providers: [RoleGuard]
})
export class SocietyModule {}
