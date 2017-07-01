import * as utils from '../src/utils';
import * as dateFns from 'date-fns';

describe('Utils', () => {
    describe('getTimeStringUnits', () => {
        it('should return correctly for seconds', async () => {
            const input = '1S';
            const expectedOutput = 'S';

            expect(utils.getTimeStringUnits(input)).toEqual(expectedOutput);
        });

        it('should return correctly for minutes', async () => {
            const input = '1MI';
            const expectedOutput = 'MI';

            expect(utils.getTimeStringUnits(input)).toEqual(expectedOutput);
        });

        it('should return correctly for hours', async () => {
            const input = '1H';
            const expectedOutput = 'H';

            expect(utils.getTimeStringUnits(input)).toEqual(expectedOutput);
        });

        it('should return correctly for days', async () => {
            const input = '1D';
            const expectedOutput = 'D';

            expect(utils.getTimeStringUnits(input)).toEqual(expectedOutput);
        });

        it('should return correctly for months', async () => {
            const input = '1MO';
            const expectedOutput = 'MO';

            expect(utils.getTimeStringUnits(input)).toEqual(expectedOutput);
        });

        it('should return correctly for months', async () => {
            const input = '1MO';
            const expectedOutput = 'MO';

            expect(utils.getTimeStringUnits(input)).toEqual(expectedOutput);
        });

        it('should return correctly for years', async () => {
            const input = '1Y';
            const expectedOutput = 'Y';

            expect(utils.getTimeStringUnits(input)).toEqual(expectedOutput);
        });

        it('should return seconds for invalid units', async () => {
            const input = '1G';
            const expectedOutput = 'S';

            expect(utils.getTimeStringUnits(input)).toEqual(expectedOutput);
        });
    });

    describe('isValidTimeString', () => {
        it('should return true for valid time strings', async () => {
            expect(utils.isValidTimeString('S')).toEqual(true);
            expect(utils.isValidTimeString('MI')).toEqual(true);
            expect(utils.isValidTimeString('H')).toEqual(true);
            expect(utils.isValidTimeString('D')).toEqual(true);
            expect(utils.isValidTimeString('MO')).toEqual(true);
            expect(utils.isValidTimeString('Y')).toEqual(true);
        });

        it('should return false for invalid time strings', async () => {
            expect(utils.isValidTimeString('Z')).toEqual(false);
            expect(utils.isValidTimeString('P')).toEqual(false);
            expect(utils.isValidTimeString('Q')).toEqual(false);
            expect(utils.isValidTimeString('W')).toEqual(false);
            expect(utils.isValidTimeString('1')).toEqual(false);
            expect(utils.isValidTimeString(null)).toEqual(false);
            expect(utils.isValidTimeString(1)).toEqual(false);
        });
    });

    describe('getSafeString', () => {
        it('should return non valid characters stripped out', async () => {
            expect(utils.getSafeString('Hello World')).toEqual('HelloWorld');
            expect(utils.getSafeString('HI ^&^&% Mom')).toEqual('HIMom');
            expect(utils.getSafeString('Something-___-&&(*&@Else')).toEqual('Something-___-Else');
            expect(utils.getSafeString('12836*#@124241')).toEqual('12836124241');
        });
    });

    describe('convertTimeStringToMilliseconds', () => {
        it('should return correctly for 1S', async () => {
            const expectedOutput = 1000;

            expect(utils.convertTimeStringToMilliseconds('1S')).toEqual(expectedOutput);
        });

        it('should return correctly for 1MI', async () => {
            const expectedOutput = 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1MI')).toEqual(expectedOutput);
        });

        it('should return correctly for 1H', async () => {
            const expectedOutput = 60 * 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1H')).toEqual(expectedOutput);
        });

        it('should return correctly for 1D', async () => {
            const expectedOutput = 24 * 60 * 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1D')).toEqual(expectedOutput);
        });

        it('should return correctly for 1MO', async () => {
            const expectedOutput = 30 * 24 * 60 * 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1MO')).toEqual(expectedOutput);
        });

        it('should return correctly for 1Y', async () => {
            const expectedOutput = 12 * 30 * 24 * 60 * 60 * 1000;

            expect(utils.convertTimeStringToMilliseconds('1Y')).toEqual(expectedOutput);
        });
    });

    describe('addTimeStringToDate', () => {
        it('should add 1 second to the given date', async () => {
            const date = new Date();
            const expectedOutput = dateFns.addSeconds(date, 1);

            expect(utils.addTimeStringToDate('1S', date)).toEqual(expectedOutput);
        });

        it('should add 1 minute to the given date', async () => {
            const date = new Date();
            const expectedOutput = dateFns.addMinutes(date, 1);

            expect(utils.addTimeStringToDate('1MI', date)).toEqual(expectedOutput);
        });

        it('should add 1 hour to the given date', async () => {
            const date = new Date();
            const expectedOutput = dateFns.addHours(date, 1);

            expect(utils.addTimeStringToDate('1H', date)).toEqual(expectedOutput);
        });

        it('should add 1 day to the given date', async () => {
            const date = new Date();
            const expectedOutput = dateFns.addDays(date, 1);

            expect(utils.addTimeStringToDate('1D', date)).toEqual(expectedOutput);
        });

        it('should add 1 month to the given date', async () => {
            const date = new Date();
            const expectedOutput = dateFns.addMonths(date, 1);

            expect(utils.addTimeStringToDate('1MO', date)).toEqual(expectedOutput);
        });

        it('should add 1 year to the given date', async () => {
            const date = new Date();
            const expectedOutput = dateFns.addYears(date, 1);

            expect(utils.addTimeStringToDate('1Y', date)).toEqual(expectedOutput);
        });
    });
});