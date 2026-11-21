/**
 * Rainfall Lag Feature Calculation Utility
 * 
 * Computes weekly rainfall lag features (1, 2, 3, and 4 weeks earlier)
 * for weekly weather records partitioned by ward.
 */

/**
 * Safely parses a date input into a standardized UTC Date object at midnight,
 * or returns null if the date is invalid or malformed.
 * 
 * @param {string|Date} input 
 * @returns {Date|null}
 */
function parseCalendarDate(input) {
    if (!input) return null;

    if (typeof input === 'string') {
        const trimmed = input.trim();

        // Exact YYYY-MM-DD format (e.g. "2025-08-04")
        const dateOnlyMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dateOnlyMatch) {
            const year = parseInt(dateOnlyMatch[1], 10);
            const month = parseInt(dateOnlyMatch[2], 10) - 1; // 0-indexed
            const day = parseInt(dateOnlyMatch[3], 10);

            const utcDate = new Date(Date.UTC(year, month, day));
            // Strict calendar validation (prevents overflow like Feb 31 or invalid months)
            if (
                utcDate.getUTCFullYear() === year &&
                utcDate.getUTCMonth() === month &&
                utcDate.getUTCDate() === day
            ) {
                return utcDate;
            }
            return null;
        }

        // Standard ISO 8601 timestamp (e.g. "2025-08-04T00:00:00.000Z")
        const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/);
        if (isoMatch) {
            const d = new Date(trimmed);
            if (!isNaN(d.getTime())) {
                return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
            }
        }

        // Malformed strings or non-standard formats return null
        return null;
    }

    if (input instanceof Date && !isNaN(input.getTime())) {
        return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
    }

    return null;
}

/**
 * Formats a Date object to a YYYY-MM-DD string key in UTC.
 * 
 * @param {Date} date 
 * @returns {string|null}
 */
function formatDateKey(date) {
    if (!date) return null;
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Calculates a date shifted backwards by a specific number of calendar days.
 * 
 * @param {Date} date 
 * @param {number} days 
 * @returns {string|null} YYYY-MM-DD string of the earlier date
 */
function getEarlierDateKey(date, days) {
    if (!date) return null;
    const shiftedTime = date.getTime() - (days * 24 * 60 * 60 * 1000);
    const shiftedDate = new Date(shiftedTime);
    return formatDateKey(shiftedDate);
}

/**
 * Calculates 1, 2, 3, and 4-week rainfall lag features for each ward.
 * 
 * @param {Array<Object>} records - Array of weekly weather records.
 * @returns {Array<Object>} A new array of records with lag properties added.
 */
function calculateRainfallLag(records) {
    // Return empty array if input is not an array or is empty
    if (!Array.isArray(records) || records.length === 0) {
        return [];
    }

    // Step 1: Group records by ward_id (Map prevents prototype collisions)
    const wardGroups = new Map();
    const unassignedRecords = [];

    // Collision-safe nested map: Map<wardId, Set<dateIdentifier>>
    const seenDatesByWard = new Map();

    for (const record of records) {
        if (!record || typeof record !== 'object') continue;

        const wardId = record.ward_id;
        if (wardId === undefined || wardId === null || wardId === '') {
            unassignedRecords.push({ ...record });
            continue;
        }

        // Parse date and validate uniqueness per ward
        const parsedDate = parseCalendarDate(record.observation_date);
        const dateKey = formatDateKey(parsedDate);
        const dateIdentifier = dateKey || (record.observation_date !== undefined && record.observation_date !== null ? String(record.observation_date).trim() : null);

        if (dateIdentifier) {
            if (!seenDatesByWard.has(wardId)) {
                seenDatesByWard.set(wardId, new Set());
            }

            const wardDates = seenDatesByWard.get(wardId);
            if (wardDates.has(dateIdentifier)) {
                const displayDate = record.observation_date !== undefined && record.observation_date !== null
                    ? String(record.observation_date)
                    : dateIdentifier;
                throw new Error(
                    `Duplicate record detected for ward_id "${wardId}" and observation_date "${displayDate}". Each ward must have unique observation dates.`
                );
            }
            wardDates.add(dateIdentifier);
        }

        if (!wardGroups.has(wardId)) {
            wardGroups.set(wardId, []);
        }

        // Store a shallow copy along with its parsed date
        wardGroups.get(wardId).push({
            original: { ...record },
            parsedDate: parsedDate,
            dateKey: dateKey
        });
    }

    const processedResults = [];

    // Step 2: Process each ward independently
    for (const [wardId, wardItems] of wardGroups) {
        // Sort chronologically within the ward
        wardItems.sort((a, b) => {
            const timeA = a.parsedDate ? a.parsedDate.getTime() : Infinity;
            const timeB = b.parsedDate ? b.parsedDate.getTime() : Infinity;
            return timeA - timeB;
        });

        // Fast collision-safe lookup map: dateKey -> rainfall_mm
        const rainfallByDate = new Map();
        for (const item of wardItems) {
            if (item.dateKey) {
                const rainfall = item.original.rainfall_mm;
                if (typeof rainfall === 'number' && !isNaN(rainfall)) {
                    rainfallByDate.set(item.dateKey, rainfall);
                }
            }
        }

        // Calculate lag features for each record
        for (const item of wardItems) {
            let lag1 = null;
            let lag2 = null;
            let lag3 = null;
            let lag4 = null;

            if (item.parsedDate) {
                // 1 week earlier = exactly 7 calendar days
                const key1 = getEarlierDateKey(item.parsedDate, 7);
                if (key1 && rainfallByDate.has(key1)) {
                    lag1 = rainfallByDate.get(key1);
                }

                // 2 weeks earlier = exactly 14 calendar days
                const key2 = getEarlierDateKey(item.parsedDate, 14);
                if (key2 && rainfallByDate.has(key2)) {
                    lag2 = rainfallByDate.get(key2);
                }

                // 3 weeks earlier = exactly 21 calendar days
                const key3 = getEarlierDateKey(item.parsedDate, 21);
                if (key3 && rainfallByDate.has(key3)) {
                    lag3 = rainfallByDate.get(key3);
                }

                // 4 weeks earlier = exactly 28 calendar days
                const key4 = getEarlierDateKey(item.parsedDate, 28);
                if (key4 && rainfallByDate.has(key4)) {
                    lag4 = rainfallByDate.get(key4);
                }
            }

            processedResults.push({
                ...item.original,
                rainfall_lag_1_week: lag1,
                rainfall_lag_2_weeks: lag2,
                rainfall_lag_3_weeks: lag3,
                rainfall_lag_4_weeks: lag4
            });
        }
    }

    // Attach any unassigned records with null lags
    for (const record of unassignedRecords) {
        processedResults.push({
            ...record,
            rainfall_lag_1_week: null,
            rainfall_lag_2_weeks: null,
            rainfall_lag_3_weeks: null,
            rainfall_lag_4_weeks: null
        });
    }

    return processedResults;
}

// Export for CommonJS
module.exports = calculateRainfallLag;
module.exports.calculateRainfallLag = calculateRainfallLag;
