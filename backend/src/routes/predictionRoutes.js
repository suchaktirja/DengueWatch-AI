const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/risk-predictions - latest precomputed risk predictions
router.get('/', async (req, res, next) => {
    try {
        const { ward_id } = req.query;
        let query = supabase
            .from('risk_predictions')
            .select('*, wards(ward_name, city, district_name)')
            .order('prediction_date', { ascending: false });

        if (ward_id) {
            query = query.eq('ward_id', ward_id);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Group by ward_id to return the latest prediction per ward
        const latestByWard = {};
        for (const item of data) {
            if (!latestByWard[item.ward_id]) {
                latestByWard[item.ward_id] = item;
            }
        }

        const results = Object.values(latestByWard);

        res.json({
            count: results.length,
            predictions: results
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
