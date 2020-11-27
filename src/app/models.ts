export interface NewsArticle {
    id?: number;
    title: string;
    country: string;
}

export interface Key {
    apiKey: string;
}

export interface Country {
    alpha2Code: string;
    name: string;
    flag: string;
}