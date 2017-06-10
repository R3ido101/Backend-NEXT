import chai, { expect } from 'chai';

import * as utils from '../src/utils';
import * as dateFns from 'date-fns';

describe('Utils', function () {
    describe('getTimeStringUnits', function () {
        it('should return correctly for seconds', async function () {
            const input = '1S';
            const expectedOutput = 'S';

            expect(utils.getTimeStringUnits(input)).to.equal(expectedOutput);
        });

        it('should return correctly for minutes', async function () {
            const input = '1MI';
            const expectedOutput = 'MI';

            expect(utils.getTimeStringUnits(input)).to.equal(expectedOutput);
        });

        it('should return correctly for hours', async function () {
            const input = '1H';
            const expectedOutput = 'H';

            expect(utils.getTimeStringUnits(input)).to.equal(expectedOutput);
        });

        it('should return correctly for days', async function () {
            const input = '1D';
            const expectedOutput = 'D';

            expect(utils.getTimeStringUnits(input)).to.equal(expectedOutput);
        });

        it('should return correctly for months', async function () {
            const input = '1MO';
            const expectedOutput = 'MO';

            expect(utils.getTimeStringUnits(input)).to.equal(expectedOutput);
        });

        it('should return correctly for months', async function () {
            const input = '1MO';
            const expectedOutput = 'MO';

            expect(utils.getTimeStringUnits(input)).to.equal(expectedOutput);
        });

        it('should return correctly for years', async function () {
            const input = '1Y';
            const expectedOutput = 'Y';

            expect(utils.getTimeStringUnits(input)).to.equal(expectedOutput);
        });

        it('should return seconds for invalid units', async function () {
            const input = '1G';
            const expectedOutput = 'S';

            expect(utils.getTimeStringUnits(input)).to.equal(expectedOutput);
        });
    });

    describe('isValidTimeString', function () {
        it('should return true for valid time strings', async function () {
            expect(utils.isValidTimeString('S')).to.equal(true);
            expect(utils.isValidTimeString('MI')).to.equal(true);
            expect(utils.isValidTimeString('H')).to.equal(true);
            expect(utils.isValidTimeString('D')).to.equal(true);
            expect(utils.isValidTimeString('MO')).to.equal(true);
            expect(utils.isValidTimeString('Y')).to.equal(true);
        });

        it('should return false for invalid time strings', async function () {
            expect(utils.isValidTimeString('Z')).to.equal(false);
            expect(utils.isValidTimeString('P')).to.equal(false);
            expect(utils.isValidTimeString('Q')).to.equal(false);
            expect(utils.isValidTimeString('W')).to.equal(false);
            expect(utils.isValidTimeString('1')).to.equal(false);
            expect(utils.isValidTimeString(null)).to.equal(false);
            expect(utils.isValidTimeString(1)).to.equal(false);
        });
    });

    describe('getSafeString', function () {
        it('should return non valid characters stripped out', async function () {
            expect(utils.getSafeString('Hello World')).to.equal('HelloWorld');
            expect(utils.getSafeString('HI ^&^&% Mom')).to.equal('HIMom');
            expect(utils.getSafeString('Something-___-&&(*&@Else')).to.equal('Something-___-Else');
            expect(utils.getSafeString('12836*#@124241')).to.equal('12836124241');
        });
    });

    describe('convertTimeStringToMilliseconds', function () {
        it('should return correctly for 1S', async function () {
            const expectedOutput = 1000;

            expect(utils.convertTimeStringToMilliseconds('1S')).to.equal(expectedOutput);
        });

        it('should return correctly for 1MI', async function () {
            const expectedOutput = 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1MI')).to.equal(expectedOutput);
        });

        it('should return correctly for 1H', async function () {
            const expectedOutput = 60 * 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1H')).to.equal(expectedOutput);
        });

        it('should return correctly for 1D', async function () {
            const expectedOutput = 24 * 60 * 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1D')).to.equal(expectedOutput);
        });

        it('should return correctly for 1MO', async function () {
            const expectedOutput = 30 * 24 * 60 * 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1MO')).to.equal(expectedOutput);
        });

        it('should return correctly for 1Y', async function () {
            const expectedOutput = 12 * 30 * 24 * 60 * 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1Y')).to.equal(expectedOutput);
        });
    });

    describe('addTimeStringToDate', function () {
        it('should add 1 second to the given date', async function () {
            const date = new Date();
            const expectedOutput = dateFns.addSeconds(date, 1);

            expect(utils.addTimeStringToDate('1S', date)).to.deep.equal(expectedOutput);
        });

        it('should add 1 minute to the given date', async function () {
            const date = new Date();
            const expectedOutput = dateFns.addMinutes(date, 1);

            expect(utils.addTimeStringToDate('1MI', date)).to.deep.equal(expectedOutput);
        });

        it('should add 1 hour to the given date', async function () {
            const date = new Date();
            const expectedOutput = dateFns.addHours(date, 1);

            expect(utils.addTimeStringToDate('1H', date)).to.deep.equal(expectedOutput);
        });

        it('should add 1 day to the given date', async function () {
            const date = new Date();
            const expectedOutput = dateFns.addDays(date, 1);

            expect(utils.addTimeStringToDate('1D', date)).to.deep.equal(expectedOutput);
        });

        it('should add 1 month to the given date', async function () {
            const date = new Date();
            const expectedOutput = dateFns.addMonths(date, 1);

            expect(utils.addTimeStringToDate('1MO', date)).to.deep.equal(expectedOutput);
        });

        it('should add 1 year to the given date', async function () {
            const date = new Date();
            const expectedOutput = dateFns.addYears(date, 1);

            expect(utils.addTimeStringToDate('1Y', date)).to.deep.equal(expectedOutput);
        });
    });
});