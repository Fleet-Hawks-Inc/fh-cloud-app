import csc from "country-state-city";

/**
 * Utility function to get country, state and cities.
 */
export class CountryStateCity {
  /**
   * Get All countries
   * @returns Countries
   */
  public static GetAllCountries = (): Array<any> => {
    const cscRep = csc.getAllCountries();
    let countries: any = [];
    cscRep.forEach((country) => {
      countries.push({
        countryName: country.name,
        countryCode: country.isoCode,
      });
    });
    return countries;
  };

  /**
   * Get specific countries defined in array
   * @param countryCode Array of country Code
   * @returns countries
   */
  public static GetSpecificCountriesByCode = (
    countryCode: string[]
  ): Array<any> => {
    let countries: [any];
    countryCode.forEach((countryCode) => {
      const cscRep = csc.getCountryByCode(countryCode);
      if (cscRep) {
        countries.push({
          countryName: cscRep.name,
          countryCode: cscRep.isoCode,
        });
      }
    });

    return countries;
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
    countryCodes.forEach((code) => {
      const cssRep = csc.getStatesOfCountry(code);
      if (cssRep.length > 0) {
        let stateObj: any;
        cssRep.forEach((state) => {
          stateObj = { stateName: state.name, stateCode: state.isoCode };
          states.push(stateObj);
        });
      }
    });
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
    let cities: [any];
    const cssRep = csc.getCitiesOfState(countryCode, stateCode);
    if (cssRep.length > 0) {
      let cityObj: any;
      cssRep.forEach((city) => {
        cityObj = { cityName: city.name };
      });
      cities.push(cityObj);
    }
    return cities;
  };

  /**
   * Get Country Name
   * @param countryCodes one or more state code
   * @returns
   */
  public static GetCountryName = (countryCode: string): string => {
    const cscRep = csc.getCountryByCode(countryCode);

    if (cscRep) {
      return cscRep.name;
    } else {
      return countryCode;
    }
  };

  /**
   * Get State Name
   * @param countryCodes one or more state code
   * @returns
   */
  public static GetStateName = (stateCode: string): string => {
    const cscRep = csc.getStateByCode(stateCode);

    if (cscRep) {
      return cscRep.name;
    } else {
      return stateCode;
    }
  };
  /**
   *
   * @param countryCode
   * @returns cities
   */
  public static GetCitiesByCountryCode = (countryCode: string): Array<any> => {
    const cscRep: any = csc.getCitiesOfCountry(countryCode);
    const cities: any = [];
    if (cscRep.length > 0) {
      let cityObj: any;
      cscRep.forEach((city) => {
        cityObj = { cityName: city.name, stateCode: city.stateCode };
        cities.push(cityObj);
      });
    }
    return cities;
  };
}
