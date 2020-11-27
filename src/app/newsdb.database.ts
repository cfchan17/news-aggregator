import { Injectable } from "@angular/core";
import Dexie from 'dexie';
import { NewsArticle, Key, Country } from './models';

@Injectable()
export class NewsAGDatabase extends Dexie {

  private newsResults: Dexie.Table<NewsArticle, number>;
  private keyRecords: Dexie.Table<Key, string>;
  private countryList: Dexie.Table<Country, string>;

  constructor() {
    super('NewsAG')
    this.version(1).stores({
      newsResults: '++id, country',
      keyRecords: 'apiKey',
      countryList: 'alpha2Code'
    })

    this.newsResults = this.table('newsResults');
    this.keyRecords = this.table('keyRecords');
    this.countryList = this.table('countryList')
  }

  async checkForAPIKey(): Promise<boolean> {
    const count = await this.keyRecords.count();
    if(count <= 0) {
        return false;
    }
    else {
        return true;
    }
  }

  async saveAPIKey(k:Key): Promise<any> {
    return await this.keyRecords.put(k);
  }

  async getAPIKey(): Promise<Key[]> {
      const key = await this.keyRecords.toArray();
      return key
  }

  async deleteAPIKey(k: string): Promise<any> {
      return await this.keyRecords.delete(k);
  }

  async checkForCountries(): Promise<boolean> {
    const count = await this.countryList.count();
    if(count <= 0) {
        return false;
    }
    else {
        return true;
    }
  }

  async saveCountries(countries: Country[]): Promise<any> {
      return await this.countryList.bulkAdd(countries);
  }

  async getAllCountries(): Promise<Country[]> {
      return await this.countryList.toArray();
  }

  async getCountryByCode(code: string): Promise<Country> {
      return await this.countryList.get(code);
  }

  async getNewsArticlesByCountry(country: Country): Promise<NewsArticle[]> {
    const resultArray = await this.newsResults.where('country').equals(country.alpha2Code).toArray();
    if(resultArray.length > 0) {
        let finalArray: NewsArticle[] = [];
        let deleteArray: NewsArticle[] = [];
        for(let i = 0; i < resultArray.length; i++) {
            let cachedDatetime: Date = new Date(resultArray[i].timestamp);
            if(resultArray[i].saved) {
                finalArray.push(resultArray[i]);
            }
            else if(new Date().getTime() - cachedDatetime.getTime() <= 300000) {
                finalArray.push(resultArray[i]);
            }
            else {
                deleteArray.push(resultArray[i]);
            }
        }
        //article delete
        return finalArray;
    }
    else {
        return resultArray;
    }
  }

  async addNewsArticles(newsArticles: NewsArticle[]): Promise<any> {
    return await this.newsResults.bulkPut(newsArticles);
  }

/* hehe
  async saveSearchOption(s: SearchOption): Promise<any> {
    const gen = s.genre == Genre.Anime? 0: 1
    s.q = normaizeSearchText(s.q)
    // select count(*)  from searchOption where q = 'abc' and genre = 'anime'
    const resultCount = await this.searchOption
        .where('q').equals(s.q)
        .and(doc => doc.genre == gen)
        .count()

    if (resultCount <= 0)
      return this.searchOption.add(s)
  }

  getSearchOptions(): Promise<SearchOption[]> {
    return this.searchOption.orderBy('q').toArray()
  }
  */
}