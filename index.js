"use strict";

const Promise = require('bluebird');
const requestAsync = Promise.promisify(require('request'));
const AgentKeepAlive = require('agentkeepalive');

const httpAgent = new AgentKeepAlive({
    timeout: 60000,
    freeSocketTimeout: 30000 // free socket keepalive for 30 seconds
});

const url = "http://api.exchangeratesapi.io/latest";

const _getBaseRate = (base, symbols) => {
    if (!base) {
        return Promise.reject(new Error("need a base currency"));
    }

    if (!symbols) {
        return Promise.reject(new Error("need at least one currency to convert against"));
    }

    const requestOptions = {
        agent: httpAgent,
        time: true,
        method: 'GET',
        uri: `${url}?base=${base}&symbols=${symbols}`,
        json: true
    };

    return requestAsync(requestOptions)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.log("Request failed: ", JSON.stringify({ error: err, stack: err.stack }));
            throw err;
        });
};

const _convert = (value, base, symbol) => {
    if (!value) {
        return Promise.reject(new Error("need a value"));
    }

    return _getBaseRate(base, symbol).then((result) => {
        if (result) {
            return result.rates.symbol * value;
        }
    })
        .catch((err) => {
            return Promise.reject(err);
        });
};

module.exports = {
    getBaseRate: _getBaseRate,
    convert: _convert
};