import type { Business } from "../include/data.js";

export class FluentBusinesses {
  private data: Business[];

  constructor(data: Business[]) {
    this.data = data;
  }

  getData(): Business[] {
    return this.data;
  }

  fromCityInState(city: string, state: string): FluentBusinesses {
    const filteredData = this.data.filter(business => business.city === city && business.state === state);
    return new FluentBusinesses(filteredData);
  }

  hasStarsGeq(stars: number): FluentBusinesses {
    // TODO
    const filteredData = this.data.filter(business => business.stars !== undefined && business.stars >= stars);
    return new FluentBusinesses(filteredData);
  }

  inCategory(category: string): FluentBusinesses {
    // TODO
    const filteredData = this.data.filter(
      business => business.categories !== undefined && business.categories.includes(category)
    );
    return new FluentBusinesses(filteredData);
  }

  hasHoursOnDays(days: string[]): FluentBusinesses {
    // TODO
    const filteredData = this.data.filter(
      business =>
        business.hours !== undefined && days.every(day => business.hours !== undefined && day in business.hours)
    );
    return new FluentBusinesses(filteredData);
  }

  hasAmbience(ambience: string): FluentBusinesses {
    // TODO
    const filteredData = this.data.filter(
      business => business.attributes?.Ambience !== undefined && business.attributes.Ambience[ambience]
    );
    return new FluentBusinesses(filteredData);
  }

  // private hasSameValueFor(bus1: Business, bus2: Business, key: keyof Business): boolean {
  //   return bus1[key] === bus2[key];
  // }

  private higherByKey(
    bus1: Business | undefined,
    bus2: Business | undefined,
    key: keyof Business
  ): Business | undefined {
    const val1 = bus1 ? bus1[key] : undefined;
    const val2 = bus2 ? bus2[key] : undefined;

    if (val1 === val2) return undefined;
    if (val1 === undefined) return val2 === undefined ? undefined : bus2;
    if (val2 === undefined) return bus1;

    return val1 > val2 ? bus1 : bus2;
  }

  private higherStars(bus1: Business | undefined, bus2: Business | undefined): Business | undefined {
    return this.higherByKey(bus1, bus2, "stars");
  }

  private higherReviews(bus1: Business | undefined, bus2: Business | undefined): Business | undefined {
    return this.higherByKey(bus1, bus2, "review_count");
  }

  // private higherStars(bus1: Business, bus2: Business): Business | undefined {
  //   if (this.hasSameValueFor(bus1, bus2, "stars")) return undefined;
  //   if (bus1.stars === undefined && bus2.stars !== undefined) return bus2;
  //   if (bus1.stars !== undefined && bus2.stars === undefined) return bus1;
  //   return bus1.stars !== undefined && bus2.stars !== undefined && bus1.stars > bus2.stars ? bus1 : bus2;
  // }

  // private higherReviews(bus1: Business, bus2: Business): Business | undefined {
  //   if (this.hasSameValueFor(bus1, bus2, "review_count")) return undefined;
  //   if (bus1.review_count === undefined && bus2.review_count !== undefined) return bus2;
  //   if (bus1.review_count !== undefined && bus2.review_count === undefined) return bus1;
  //   return bus1.review_count !== undefined && bus2.review_count !== undefined && bus1.review_count > bus2.review_count
  //     ? bus1
  //     : bus2;
  // }

  bestPlace(): Business | undefined {
    // TODO
    const best = this.data.reduce((acc, business) => {
      if (business.stars === undefined) return acc;
      const x = this.higherStars(business, acc);
      const y = this.higherReviews(business, acc);
      return x ? x : y ? y : acc;
    }, undefined as Business | undefined); // { business_id: "undefined" }
    return best;
    // return best.business_id === "undefined" ? undefined : best;
    // return Object.keys(best).length === 0 ? undefined : best;
  }

  mostReviews(): Business | undefined {
    // TODO
    const most = this.data.reduce((acc, business) => {
      if (business.review_count === undefined) return acc;
      const x = this.higherReviews(business, acc);
      const y = this.higherStars(business, acc);
      return x ? x : y ? y : acc;
    }, undefined as Business | undefined);
    return most;
    // return most.business_id === "undefined" ? undefined : most;
    // return Object.keys(most).length === 0 ? undefined : most;
  }
}
