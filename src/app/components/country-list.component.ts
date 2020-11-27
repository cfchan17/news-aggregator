import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from '../models';
import { NewsAGDatabase } from '../newsdb.database';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {

  countryList: Country[];

  private createCountryCodeString = (s: string[]):string => {
    return s.join(';');
  }

  constructor(private router: Router, private http: HttpClient, private newsdb: NewsAGDatabase) { }

  ngOnInit(): void {
    const ENDPOINT: string = "https://restcountries.eu/rest/v2/alpha";

    const countryCodes: string[] = [
      'ae', 'ar', 'at', 'au', 'be', 'bg', 'br',
      'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de',
      'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id',
      'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt',
      'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no',
      'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru',
      'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr',
      'tw', 'ua', 'us', 've', 'za'
    ];

    this.newsdb.checkForCountries()
      .then(haveCountries => {
        if(haveCountries) {
          this.newsdb.getAllCountries()
            .then(result => {
              this.countryList = result;
            });
        }
        else {
          let params = new HttpParams().set('codes', this.createCountryCodeString(countryCodes));
          params = params.set('fields', 'name;flag;alpha2Code');
      
          this.http.get<any>(ENDPOINT, {params: params})
            .toPromise()
            .then(result => {

              result = result.map(c => {
                c.alpha2Code = c.alpha2Code.toLowerCase();
                return c as Country;
              });

              this.newsdb.saveCountries(result);

              this.countryList = result;
            });
        }
      });
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
  
}
