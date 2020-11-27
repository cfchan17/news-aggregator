import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsAGDatabase } from './newsdb.database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private newsdb: NewsAGDatabase, private router: Router) { }

  ngOnInit(): void {
    this.newsdb.checkForAPIKey()
      .then(result => {
        if(result) {
          this.router.navigate(['countries']);
        }
        else {
          this.router.navigate(['settings'])
        }
      });
  }
}
