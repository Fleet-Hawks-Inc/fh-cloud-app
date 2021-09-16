import { Injectable } from '@angular/core';
import { ApiService } from '.';

@Injectable({
  providedIn: 'root'
})
export class CountryStateCityService {

  /** URL for API's */
  private getAllCountriesUrl = 'address/getAllCountries';
  private getSpecificCountryNameByCode = 'address/getSpecificCountryNameByCode';
  private getCitiesByStateCodes = 'address/getCitiesByStateCodes';
  private getStateName = 'address/getStateName';
  private getCitiesByCountryCode = 'address/getCitiesByCountryCode';
  private getStateNameFromCode = 'address/getStateNameFromCode';
  private getStatesByCountryCode = 'address/getStatesByCountryCode';

  /**
   * Constructor
   */
  constructor(private apiService: ApiService) { }

  /**
   * Get All countries
   * @returns Countries
   */
  public GetAllCountries = async (): Promise<any[]> => {

    let countries: any = [];
    countries = await this.apiService.getData(this.getAllCountriesUrl).toPromise();
    return countries;
  }

  /**
   * Get specific countries defined in array
   * @param countryCode Array of country Code
   * @returns countries
   */
  public GetSpecificCountryNameByCode = async (
    countryCode: string
  ): Promise<string> => {
    const response = await this.apiService.getData(`${this.getSpecificCountryNameByCode}/${countryCode}`).toPromise();
    if (response) {
      return response.name;
    } else {
      return 'Others';
    }


  };

  /**
   * Get States for specific countryCode
   * @param countryCodes one or more state code
   * @returns
   */
  public GetStatesByCountryCode = async (
    countryCodes: string[]
  ): Promise<any[]> => {
    let states: any = [];
    states = await this.apiService.postData(this.getStatesByCountryCode, { 'codes': countryCodes }).toPromise();
    return states;
  };

  /**
    * Get cities by country code and state code
    * @param countryCodes one or more state code
    * @returns
    */
  public GetCitiesByStateCodes = async (
    countryCode: string,
    stateCode: string
  ): Promise<any[]> => {
    let cities: any = [];
    cities = await this.apiService.getData(`${this.getCitiesByStateCodes}/${countryCode}/${stateCode}`).toPromise();
    return cities;
  };

  /**
   * Get State Name
   * @param countryCodes one or more state code
   * @returns
   */
  public GetStateName = async (stateCode: string): Promise<string> => {

    const response = await this.apiService.getData(`${this.getStateName}/${stateCode}`).toPromise();
    if (response) {
      return response.name;
    } else {
      return 'Others'
    };

  };

  /**
   * Get cities by countryCode
   * @param countryCode
   * @returns cities
   */
  public GetCitiesByCountryCode = async (countryCode: string): Promise<any[]> => {

    let cities: any = [];
    cities = await this.apiService.getData(`${this.getCitiesByCountryCode}/${countryCode}`).toPromise();
    return cities;
  };

  /**
  * Get State Name
  * @param countryCodes one or more state code
  * @returns
  */
  public GetStateNameFromCode = async (stateCode: string, countryCode: string): Promise<string> => {
    const response = await this.apiService.getData(`${this.getStateNameFromCode}/${stateCode}/${countryCode}`).toPromise();
    if (response) {
      return response.name;
    } else {
      return 'Others';
    }
  }
}
