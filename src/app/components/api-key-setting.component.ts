import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Key } from '../models';
import { NewsAGDatabase } from '../newsdb.database';

@Component({
  selector: 'app-api-key-setting',
  templateUrl: './api-key-setting.component.html',
  styleUrls: ['./api-key-setting.component.css']
})
export class ApiKeySettingComponent implements OnInit {

  apiForm: FormGroup;

  constructor(private router: Router, private newsdb: NewsAGDatabase, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.apiForm = this.fb.group({
      apiKeyInput: ['', Validators.required]
    });
  }

  async onDelete() {
    await this.newsdb.deleteAPIKey(this.apiForm.value.apiKeyInput);
    this.apiForm.reset();
  }

  async onAdd() {
    const key: Key = {apiKey: this.apiForm.value.apiKeyInput};
    await this.newsdb.saveAPIKey(key);
    this.apiForm.reset();
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
