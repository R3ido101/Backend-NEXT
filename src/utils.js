import crypto from 'crypto';

import { addSeconds, addMinutes, addHours, addDays, addMonths, addYears } from 'date-fns';

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random unique id.
 *
 * @param {number} [len=32]
 * @returns {string}
 */
export function generateUID(len = 32) {
    // eslint-disable-next-line prefer-const
    let buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charlen = chars.length;

    // eslint-disable-next-line no-loops/no-loops
    for (let i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

/**
 * This will create a safe string from the given string.
 *
 * @param {string} string
 * @returns {string}
 */
export function getSafeString(string) {
    return string.replace(/[^A-Za-z0-9-_]*/g, '');
}

/**
 * This will check the given time string and see if it's valid or not.
 *
 * @param {string} string
 * @returns {boolean}
 */
export function isValidTimeString(string) {
    if (typeof string !== 'string') {
        return false;
    }

    const minus1 = string.substr(-1).toUpperCase();

    if (string.length >= 2 && minus1 === 'I' || minus1 === 'O') {
        const minus2 = string.substr(-2).toUpperCase();

        return minus2 === 'MI' || minus2 === 'MO';
    }

    return minus1 === 'S' || minus1 === 'H' || minus1 === 'D' || minus1 === 'Y';
}

/**
 * This will determine and return the time string units for the give time string.
 *
 * Valid time string units are:
 *
 * S
 * MI
 * H
 * D
 * MO
 * Y
 *
 * @param {string} string
 * @returns {string}
 */
export function getTimeStringUnits(string) {
    const isValid = isValidTimeString(string);

    if (!isValid) {
        return 'S';
    }

    const minus1 = string.substr(-1).toUpperCase();

    if (minus1 === 'I' || minus1 === 'O') {
        return string.substr(-2).toUpperCase();
    }

    return minus1;
}

/**
 * This will convert a time string to milliseconds.
 *
 * For instance passing in 20S will return 20000.
 *
 * @param {string} timestring
 * @returns {number}
 */
export function convertTimeStringToMilliseconds(timestring) {
    if (!timestring) {
        return 0;
    }

    const isValid = isValidTimeString(timestring);

    if (!isValid) {
        return 0;
    }

    const units = getTimeStringUnits(timestring);
    const amount = parseInt(timestring.substr(0, timestring.length - units.length), 10);

    switch (units) {
        case 'S':
            return amount * 1000;
        case 'MI':
            return amount * 60 * 1000;
        case 'H':
            return amount * 60 * 60 * 1000;
        case 'D':
            return amount * 24 * 60 * 60 * 1000;
        case 'MO':
            return amount * 30 * 24 * 60 * 60 * 1000;
        case 'Y':
            return amount * 12 * 30 * 24 * 60 * 60 * 1000;
        default:
            return 0;
    }
}

/**
 * This will take the message and hash it with SHA256.
 *
 * @param {Buffer|string[]|string} message
 * @returns {string}
 */
export function sha256(message) {
    const c = crypto.createHash('sha256');

    if (Buffer.isBuffer(message)) {
        c.update(message);
    } else if (Array.isArray(message)) {
        // array of byte values
        c.update(new Buffer(message));
    } else {
        // otherwise, treat as a binary string
        c.update(new Buffer(message, 'binary'));
    }

    const buf = c.digest();

    return buf.toString('hex');
}

/**
 * This will take the errors given by the validation library of Objeciton.js and converts them into something friendlier
 * for us.
 *
 * @param {object} errors
 * @returns {object}
 */
export function formatValidationErrors(errors) {
    // eslint-disable-next-line prefer-const
    let newErrors = {};

    Object.keys(errors).forEach((property) => {
        // eslint-disable-next-line immutable/no-mutation
        newErrors[property] = errors[property].map((errorList) => (errorList.message));
    });

    return newErrors;
}

/**
 * This adds a stringified length of time to a given date (or now if not provided).
 *
 * Examples of stringified time is '1D', '33S', '3M' etc.
 *
 * @param {string} string
 * @param {Date} [date=new Data()]
 * @returns {Date}
 */
export function addTimeStringToDate(string, date = new Date()) {
    if (!string) {
        return new Date();
    }

    const isValid = isValidTimeString(string);

    if (!isValid) {
        return date;
    }

    const units = getTimeStringUnits(string);
    const amount = parseInt(string.substr(0, string.length - units.length), 10);

    switch (units) {
        case 'S':
            return addSeconds(date, amount);
        case 'MI':
            return addMinutes(date, amount);
        case 'H':
            return addHours(date, amount);
        case 'D':
            return addDays(date, amount);
        case 'MO':
            return addMonths(date, amount);
        case 'Y':
            return addYears(date, amount);
        default:
            return date;
    }
}
