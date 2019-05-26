"use strict";

const lab = exports.lab = require('lab').script();
const describe = lab.describe;
const it = lab.it;

const exchangeRate = require('../index');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('getBaseRate', () => {

  it('should fail when base is null', function () {
    const result = exchangeRate.getBaseRate(null, ["USD"]);

    return expect(result).to.eventually.be.rejected.and.to.have.property('message', 'need a base currency');
  });

  it('should fail when base is not string', function () {
    const result = exchangeRate.getBaseRate(["USD"], null);

    return expect(result).to.eventually.be.rejected.and.to.have.property('message', 'need a single string base currency');
  });

  it('should fail when symbols is null', function () {
    const result = exchangeRate.getBaseRate("USD", null);

    return expect(result).to.eventually.be.rejected.and.to.have.property('message', 'need at least one currency to convert against');
  });

  it('should return rate for a single conversion', function () {
    const result = exchangeRate.getBaseRate("USD", "CAD");

    return expect(result).to.eventually.be.not.null;
  });

  it('should return rate for lower case currencies', function () {
    const result = exchangeRate.getBaseRate("usd", "cad");

    return expect(result).to.eventually.be.not.null;
  });

  it('should return rate for a multiple string conversion', function () {
    const result = exchangeRate.getBaseRate("CAD", "USD,INR");

    return expect(result).to.eventually.be.not.null;
  });

  it('should return rate for a multiple object conversion', function () {
    const result = exchangeRate.getBaseRate("CAD", ["USD", "INR"]);

    return expect(result).to.eventually.be.not.null;
  });
});

describe('convert', () => {

  it('should fail when value is null', function () {
    const result = exchangeRate.convert(null, "USD", "CAD");

    return expect(result).to.eventually.be.rejected.and.to.have.property('message', 'need a value');
  });

  it('should fail when base is null', function () {
    const result = exchangeRate.convert(10, null, "CAD");

    return expect(result).to.eventually.be.rejected.and.to.have.property('message', 'need a base currency');
  });

  it('should fail when symbols is null', function () {
    const result = exchangeRate.convert(10, "USD", null);

    return expect(result).to.eventually.be.rejected.and.to.have.property('message', 'need a single string currency to convert to');
  });

  it('should fail when symbols is not string', function () {
    const result = exchangeRate.convert(10, "USD", ["CAD"]);

    return expect(result).to.eventually.be.rejected.and.to.have.property('message', 'need a single string currency to convert to');
  });

  it('should return rate', function () {
    const result = exchangeRate.convert(10, "USD", "CAD");

    result.then(item => {
      console.log(item)
      return true;
    })
    //return expect(result).to.eventually.be.not.null;
  });
});