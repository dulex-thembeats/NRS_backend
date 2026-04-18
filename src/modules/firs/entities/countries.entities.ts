/**
 * Represents a country entity with ISO and regional information.
 */
export class CountryEntity {
  /**
   * The name of the country.
   */
  readonly name: string;

  /**
   * The ISO 3166-1 alpha-2 code of the country.
   */
  readonly alpha2: string;

  /**
   * The ISO 3166-1 alpha-3 code of the country.
   */
  readonly alpha3: string;

  /**
   * The numeric country code (ISO 3166-1 numeric).
   */
  readonly countryCode: string;

  /**
   * The ISO 3166-2 code of the country.
   */
  readonly iso31662: string;

  /**
   * The region where the country is located.
   */
  readonly region: string;

  /**
   * The sub-region where the country is located.
   */
  readonly subRegion: string;

  /**
   * The intermediate region, if any.
   */
  readonly intermediateRegion: string;

  /**
   * The code of the region.
   */
  readonly regionCode: string;

  /**
   * The code of the sub-region.
   */
  readonly subRegionCode: string;

  /**
   * The code of the intermediate region, if any.
   */
  readonly intermediateRegionCode: string;

  /**
   * Create a new CountryEntity.
   * @param params The parameters to create a country entity.
   */
  constructor(params: {
    name: string;
    alpha2: string;
    alpha3: string;
    countryCode: string;
    iso31662: string;
    region: string;
    subRegion: string;
    intermediateRegion: string;
    regionCode: string;
    subRegionCode: string;
    intermediateRegionCode: string;
  }) {
    this.name = params.name;
    this.alpha2 = params.alpha2;
    this.alpha3 = params.alpha3;
    this.countryCode = params.countryCode;
    this.iso31662 = params.iso31662;
    this.region = params.region;
    this.subRegion = params.subRegion;
    this.intermediateRegion = params.intermediateRegion;
    this.regionCode = params.regionCode;
    this.subRegionCode = params.subRegionCode;
    this.intermediateRegionCode = params.intermediateRegionCode;
  }
}
