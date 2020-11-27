import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CountryListComponent } from './components/country-list.component';
import { ApiKeySettingComponent } from './components/api-key-setting.component';
import { NewsResultsComponent } from './components/news-results.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsAGDatabase } from './newsdb.database';

const ROUTES: Routes = [
  {path: '', component: AppComponent},
  {path: 'countries', component: CountryListComponent},
  {path: 'settings', component: ApiKeySettingComponent},
  {path: 'results/:country', component: NewsResultsComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    CountryListComponent,
    ApiKeySettingComponent,
    NewsResultsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [NewsAGDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
