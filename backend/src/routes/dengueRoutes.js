const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/dengue-cases - time-series of reported cases with optional ward_id, from, to filters
router.get('/', async (req, res, next) => {
    try {
        const { ward_id, from, to } = req.query;
        let query = supabase.from('dengue_cases').select('*').order('report_date', { ascending: true });

        if (ward_id) {
            query = query.eq('ward_id', ward_id);
        }
        if (from) {
            query = query.gte('report_date', from);
        }
        if (to) {
            query = query.lte('report_date', to);
        }

        const { data, error } = await query;
        if (error) throw error;

        res.json({
            count: data.length,
            records: data
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
