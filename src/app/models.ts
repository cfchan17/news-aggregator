export interface NewsArticle {
    id?: number;
    source: string;
    country: string;
    timestamp: string;
    saved: boolean;
    author: string;
    title: string;
    description: string;
    url:string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface Key {
    apiKey: string;
}

export interface Country {
    alpha2Code: string;
    name: string;
    flag: string;
}