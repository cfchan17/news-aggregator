import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Country, NewsArticle } from '../models';
import { NewsAGDatabase } from '../newsdb.database';

@Component({
  selector: 'app-news-results',
  templateUrl: './news-results.component.html',
  styleUrls: ['./news-results.component.css']
})
export class NewsResultsComponent implements OnInit {

  country: Country;
  newsArticles: NewsArticle[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private newsdb: NewsAGDatabase, private http: HttpClient) { }

  ngOnInit(): void {
    this.newsdb.getCountryByCode(this.activatedRoute.snapshot.params['country'])
      .then(result => {
        this.country = result;
        this.newsdb.getNewsArticlesByCountry(result)
          .then(res => {
            if(res.length == 0) {
              console.log(res.length);
            }
          });
        /*
        this.newsdb.getNewsArticlesByCountry(result)
          .then(articles => {
            if(articles.length > 0) {
              this.newsArticles = articles;
              const nonSavedArticles = this.newsArticles.filter(obj => {
                if(!obj.saved) {
                  return obj;
                }
              });

              if(nonSavedArticles.length == 0) {
                this.getHttpNewsArticles(this.country)
                  .then(queryResult => {
                    this.newsArticles.concat(queryResult);
                  });
              }
            }
            else {
              console.log('>>>>>>>>>>>');
              this.getHttpNewsArticles(this.country)
                .then(queryResult => {
                  console.log(queryResult);
                  this.newsArticles.concat(queryResult);
                });
            }
          });*/
      });
  }

  async getHttpNewsArticles(country: Country): Promise<NewsArticle[]> {
    const ENDPOINT = 'https://newsapi.org/v2/top-headlines';
    const apiKey = await this.newsdb.getAPIKey();
    let params = new HttpParams().set('country', country.alpha2Code);
    let headers = new HttpHeaders({'X-Api-Key': apiKey.apiKey});
    const result = await this.http.get<any>(ENDPOINT, {headers: headers, params: params})
      .toPromise();
    return result.articles.map(element => {
      element['country'] = country.alpha2Code;
      element['timestamp'] = new Date().toUTCString();
      element['saved'] = false;
      return element as NewsArticle;
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

}
