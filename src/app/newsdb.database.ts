import { Injectable } from "@angular/core";
import Dexie from 'dexie';
import { promise } from 'protractor';
import { NewsArticle, Key, Country } from './models';

@Injectable()
export class NewsAGDatabase extends Dexie {

  private newsResults: Dexie.Table<NewsArticle, number>;
  private keyRecords: Dexie.Table<Key, string>;
  private countryList: Dexie.Table<Country, string>;

  constructor() {
    super('NewsAG')
    this.version(1).stores({
      newsResults: '++id,country',
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