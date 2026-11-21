const { test, describe } = require('node:test');
const assert = require('node:assert');
const calculateRainfallLag = require('../src/services/rainfallLag');

describe('Rainfall Lag Utility Tests', () => {

    test('1. Normal 1–4 week rainfall lags', () => {
        const input = [
            { ward_id: 'W1', observation_date: '2025-08-04', rainfall_mm: 10 },
            { ward_id: 'W1', observation_date: '2025-08-11', rainfall_mm: 20 },
            { ward_id: 'W1', observation_date: '2025-08-18', rainfall_mm: 30 },
            { ward_id: 'W1', observation_date: '2025-08-25', rainfall_mm: 40 },
            { ward_id: 'W1', observation_date: '2025-09-01', rainfall_mm: 50 }
        ];

        const out = calculateRainfallLag(input);
        assert.strictEqual(out.length, 5);

        const last = out[4];
        assert.strictEqual(last.observation_date, '2025-09-01');
        assert.strictEqual(last.rainfall_lag_1_week, 40);
        assert.strictEqual(last.rainfall_lag_2_weeks, 30);
        assert.strictEqual(last.rainfall_lag_3_weeks, 20);
        assert.strictEqual(last.rainfall_lag_4_weeks, 10);
    });

    test('2. Unordered records are sorted chronologically within ward', () => {
        const input = [
            { ward_id: 'W1', observation_date: '2025-08-18', rainfall_mm: 30 },
            { ward_id: 'W1', observation_date: '2025-08-04', rainfall_mm: 10 },
            { ward_id: 'W1', observation_date: '2025-08-11', rainfall_mm: 20 }
        ];

        const out = calculateRainfallLag(input);
        assert.deepStrictEqual(
            out.map(r => r.observation_date),
            ['2025-08-04', '2025-08-11', '2025-08-18']
        );
        assert.strictEqual(out[2].rainfall_lag_1_week, 20);
        assert.strictEqual(out[2].rainfall_lag_2_weeks, 10);
        assert.strictEqual(out[2].rainfall_lag_3_weeks, null);
    });

    test('3. Multiple wards are strictly isolated', () => {
        const input = [
            { ward_id: 'WARD-A', observation_date: '2025-08-04', rainfall_mm: 100 },
            { ward_id: 'WARD-B', observation_date: '2025-08-04', rainfall_mm: 200 },
            { ward_id: 'WARD-A', observation_date: '2025-08-11', rainfall_mm: 110 },
            { ward_id: 'WARD-B', observation_date: '2025-08-11', rainfall_mm: 220 }
        ];

        const out = calculateRainfallLag(input);
        const wardA_week2 = out.find(r => r.ward_id === 'WARD-A' && r.observation_date === '2025-08-11');
        const wardB_week2 = out.find(r => r.ward_id === 'WARD-B' && r.observation_date === '2025-08-11');

        assert.strictEqual(wardA_week2.rainfall_lag_1_week, 100);
        assert.strictEqual(wardB_week2.rainfall_lag_1_week, 200);
    });

    test('4. Missing intermediate weeks return null without substitution', () => {
        const input = [
            { ward_id: 'W1', observation_date: '2025-08-04', rainfall_mm: 10 },
            // 2025-08-11 is missing
            { ward_id: 'W1', observation_date: '2025-08-18', rainfall_mm: 30 }
        ];

        const out = calculateRainfallLag(input);
        const aug18 = out.find(r => r.observation_date === '2025-08-18');

        assert.strictEqual(aug18.rainfall_lag_1_week, null);
        assert.strictEqual(aug18.rainfall_lag_2_weeks, 10);
    });

    test('5. Zero rainfall values are preserved as numeric 0', () => {
        const input = [
            { ward_id: 'W1', observation_date: '2025-08-04', rainfall_mm: 0 },
            { ward_id: 'W1', observation_date: '2025-08-11', rainfall_mm: 15 }
        ];

        const out = calculateRainfallLag(input);
        const aug11 = out.find(r => r.observation_date === '2025-08-11');

        assert.strictEqual(aug11.rainfall_lag_1_week, 0);
    });

    test('6. Invalid dates do not crash and produce null lags', () => {
        const input = [
            { ward_id: 'W1', observation_date: 'not-a-date', rainfall_mm: 10 },
            { ward_id: 'W1', observation_date: '2025-08-04', rainfall_mm: 20 },
            { ward_id: 'W1', observation_date: null, rainfall_mm: 30 }
        ];

        const out = calculateRainfallLag(input);
        assert.strictEqual(out.length, 3);

        const invalid1 = out.find(r => r.observation_date === 'not-a-date');
        assert.strictEqual(invalid1.rainfall_lag_1_week, null);
    });

    test('7. Malformed ISO timestamps are rejected and produce null lags', () => {
        const input = [
            { ward_id: 'W1', observation_date: '2025-08-04garbage', rainfall_mm: 10 },
            { ward_id: 'W1', observation_date: '2025-08-04', rainfall_mm: 20 }
        ];

        const out = calculateRainfallLag(input);
        assert.strictEqual(out.length, 2);

        const malformed = out.find(r => r.observation_date === '2025-08-04garbage');
        assert.strictEqual(malformed.rainfall_lag_1_week, null);
        assert.strictEqual(malformed.rainfall_lag_2_weeks, null);
    });

    test('8. Missing rainfall values are handled safely', () => {
        const input = [
            { ward_id: 'W1', observation_date: '2025-08-04' },
            { ward_id: 'W1', observation_date: '2025-08-11', rainfall_mm: 25 },
            { ward_id: 'W1', observation_date: '2025-08-18', rainfall_mm: 35 }
        ];

        const out = calculateRainfallLag(input);
        const aug11 = out.find(r => r.observation_date === '2025-08-11');
        const aug18 = out.find(r => r.observation_date === '2025-08-18');

        assert.strictEqual(aug11.rainfall_lag_1_week, null);
        assert.strictEqual(aug18.rainfall_lag_1_week, 25);
        assert.strictEqual(aug18.rainfall_lag_2_weeks, null);
    });

    test('9. Records with missing ward_id are isolated without colliding', () => {
        const input = [
            { observation_date: '2025-08-04', rainfall_mm: 10 },
            { ward_id: null, observation_date: '2025-08-11', rainfall_mm: 20 },
            { ward_id: 'W1', observation_date: '2025-08-04', rainfall_mm: 50 }
        ];

        const out = calculateRainfallLag(input);
        assert.strictEqual(out.length, 3);

        const unassigned = out.filter(r => !r.ward_id);
        assert.strictEqual(unassigned.length, 2);
        for (const r of unassigned) {
            assert.strictEqual(r.rainfall_lag_1_week, null);
        }
    });

    test('10. Duplicate records with identical rainfall values throw descriptive error', () => {
        const input = [
            { ward_id: 'DN-17', observation_date: '2025-08-04', rainfall_mm: 25 },
            { ward_id: 'DN-17', observation_date: '2025-08-04', rainfall_mm: 25 }
        ];

        assert.throws(
            () => calculateRainfallLag(input),
            (err) => {
                assert.ok(err.message.includes('DN-17'), 'Error must identify ward_id');
                assert.ok(err.message.includes('2025-08-04'), 'Error must identify observation_date');
                return true;
            }
        );
    });

    test('11. Duplicate records with conflicting rainfall values throw descriptive error', () => {
        const input = [
            { ward_id: 'DN-17', observation_date: '2025-08-04', rainfall_mm: 10 },
            { ward_id: 'DN-17', observation_date: '2025-08-04', rainfall_mm: 99 }
        ];

        assert.throws(
            () => calculateRainfallLag(input),
            (err) => {
                assert.ok(err.message.includes('DN-17'), 'Error must identify ward_id');
                assert.ok(err.message.includes('2025-08-04'), 'Error must identify observation_date');
                return true;
            }
        );
    });

    test('12. Empty and invalid inputs return an empty array safely', () => {
        assert.deepStrictEqual(calculateRainfallLag([]), []);
        assert.deepStrictEqual(calculateRainfallLag(null), []);
        assert.deepStrictEqual(calculateRainfallLag(undefined), []);
        assert.deepStrictEqual(calculateRainfallLag(123), []);
        assert.deepStrictEqual(calculateRainfallLag('invalid string'), []);
        assert.deepStrictEqual(calculateRainfallLag({}), []);
    });

    test('13. Original input array and record objects remain immutable', () => {
        const input = [
            { ward_id: 'W1', observation_date: '2025-08-04', rainfall_mm: 10, meta: { tags: ['rain'] } },
            { ward_id: 'W1', observation_date: '2025-08-11', rainfall_mm: 20, meta: { tags: ['rain'] } }
        ];

        const jsonSnapshot = JSON.stringify(input);
        const out = calculateRainfallLag(input);

        // Input array and contents unchanged
        assert.strictEqual(JSON.stringify(input), jsonSnapshot);
        // Returned array is a separate reference
        assert.notStrictEqual(out, input);
        assert.notStrictEqual(out[0], input[0]);
        // Lag properties not attached to input objects
        assert.strictEqual('rainfall_lag_1_week' in input[0], false);
    });
});
