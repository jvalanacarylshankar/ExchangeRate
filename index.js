"use strict";

const Promise = require('bluebird');
const requestAsync = Promise.promisify(require('request'));
const AgentKeepAlive = require('agentkeepalive');

const httpAgent = new AgentKeepAlive({
  timeout: 60000,
  freeSocketTimeout: 30000 // free socket keepalive for 30 seconds
});

const config = {
  appId: "786d5594b71e4ab0ae71c5a9ae2c7f8a",
  get: `http://openexchangerates.org/latest.json`,
};

const _getBaseRate = (base, symbols) => {
  if (!base) {
    return Promise.reject(new Error("need a base currency"));
  }

  if (typeof base !== "string" || base.includes(",") || base.includes(" ")) {
    return Promise.reject(new Error("need a single string base currency"));
  }

  if (!symbols) {
    return Promise.reject(new Error("need at least one currency to convert against"));
  }

  const requestOptions = {
    agent: httpAgent,
    time: true,
    method: 'GET',
    uri: `${config.get}?app_id=${config.appId}&base=${base}&symbols=${symbols.toString()}`,
    json: true
  };

  return requestAsync(requestOptions)
    .then((response) => {
      return Promise.resolve(response.rates);
    })
    .catch((err) => {
      console.log("Request failed: ", JSON.stringify({ error: err, stack: err.stack }));
      throw err;
    });
};

const _convert = (value, from, to) => {
  if (!value) {
    return Promise.reject(new Error("need a value"));
  }

  if (typeof to !== "string" || to.includes(",") || to.includes(" ")) {
    return Promise.reject(new Error("need a single string currency to convert to"));
  }

  return _getBaseRate(from, to).then((result) => {
    return Promise.resolve({ rate: result[to] * value })
  })
    .catch((err) => {
      return Promise.reject(err);
    });
};

module.exports = {
  getBaseRate: _getBaseRate,
  convert: _convert
};