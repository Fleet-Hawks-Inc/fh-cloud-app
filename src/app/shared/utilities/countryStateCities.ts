

/**
 * Utility function to get country, state and cities.
 */
export class CountryStateCity {
  /**
   * Get All countries
   * @returns Countries
   */
  public static GetAllCountries = (): Array<any> => {
   
    let countries: any = [];
   
    return countries;
  }

  /**
   * Get specific countries defined in array
   * @param countryCode Array of country Code
   * @returns countries
   */
  public static GetSpecificCountryNameByCode = (
    countryCode: string
  ): string => {
   return "";

  };

  /**
   * Get States for specific countryCode
   * @param countryCodes one or more state code
   * @returns
   */
  public static GetStatesByCountryCode = (
    countryCodes: string[]
  ): Array<any> => {
    let states: any = [];

    return states;
  };

  /**
   * Get cities by country code and state code
   * @param countryCodes one or more state code
   * @returns
   */
  public static GetCitiesByStateCodes = (
    countryCode: string,
    stateCode: string
  ): Array<any> => {
    let cities: any = [];

    return cities;
  };

  /**
   * Get State Name
   * @param countryCodes one or more state code
   * @returns
   */
  public static GetStateName = (stateCode: string): string => {
  
      return "stateCode";
    
  };
  /**
   *
   * @param countryCode
   * @returns cities
   */
  public static GetCitiesByCountryCode = (countryCode: string): Array<any> => {
  
    const cities: any = [];
  
    return cities;
  };

  /**
  * Get State Name
  * @param countryCodes one or more state code
  * @returns
  */
  public static GetStateNameFromCode = (stateCode: string, countryCode: string): string => {
   return ""
  }
}
