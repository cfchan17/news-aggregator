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
  newsArticles: NewsArticle[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private newsdb: NewsAGDatabase, private http: HttpClient) { }

  ngOnInit(): void {
    this.newsdb.getCountryByCode(this.activatedRoute.snapshot.params['country'])
      .then(result => {
        this.country = result;
        
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
                    
                    this.newsArticles = this.newsArticles.concat(this.getFreshArticles(queryResult));
                    this.newsdb.addNewsArticles(this.newsArticles);
                  });
              }
            }
            else {
              this.getHttpNewsArticles(this.country)
                .then(queryResult => {
                  this.newsArticles = this.newsArticles.concat(this.getFreshArticles(queryResult));
                  this.newsdb.addNewsArticles(this.newsArticles);
                });
            }
          });
      });
  }

  getFreshArticles(articles: NewsArticle[]): NewsArticle[] {
    let keepArticles: NewsArticle[] = [];
    articles.forEach(v => {
      let currentDatetime = new Date();
      let articleDatetime = new Date(v.publishedAt);
      if (currentDatetime.getTime() - articleDatetime.getTime() <= 300000) {
        keepArticles.push(v);
      }
    });
    return keepArticles;
  }

  async getHttpNewsArticles(country: Country): Promise<NewsArticle[]> {
    const ENDPOINT = 'https://newsapi.org/v2/top-headlines';
    const key = await this.newsdb.getAPIKey();
    const apiKey = key[0].apiKey;
    let params = new HttpParams().set('country', country.alpha2Code);
    let headers = new HttpHeaders({'X-Api-Key': apiKey});
    const result = await this.http.get<any>(ENDPOINT, {headers: headers, params: params})
      .toPromise();

    result.articles.map(element => {
      element['country'] = country.alpha2Code;
      element['timestamp'] = new Date().toUTCString();
      element['saved'] = false;
      element.source = element.source.name;
      return element as NewsArticle;
    });
    return result.articles;
  }

  goBack() {
    this.router.navigate(['/']);
  }

}
