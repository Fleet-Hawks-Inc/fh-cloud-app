import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
declare var H: any;
@Injectable({
  providedIn: 'root'
})
export class LeafletMapService {
  private platform: any;
  private readonly apiKey = environment.mapConfig.apiKey;
  
  constructor() { }

  
  
  /*
  AutoSuggest Search Api v7
*/ 
searchLocation = async (query) => {
  this.platform = new H.service.Platform({
    'apikey': this.apiKey,
  });
  if(query != ''){
    const service = this.platform.getSearchService();
    const result = await service.geocode({ q: query });
    if (result && result.items.length > 0) {
      //console.log(result);
      const response = await service.autosuggest(
        {
          at: `${result.items[0].position.lat},${result.items[0].position.lng}`,
          limit: 5,
          q: query
        }
      );
      return response.items
    }
  }
  
}

// returns the response
public searchEntries(query) {
  return this.searchLocation(query);
}




}
