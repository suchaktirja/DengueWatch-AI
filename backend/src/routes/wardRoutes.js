const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/wards - retrieve all wards with optional ?city= filter
router.get('/', async (req, res, next) => {
    try {
        const { city } = req.query;
        let query = supabase.from('wards').select('*').order('ward_number');
        if (city && city !== 'All cities') {
            query = query.eq('city', city);
        }

        const { data: wards, error: wardsErr } = await query;
        if (wardsErr) throw wardsErr;

        // Fetch latest prediction per ward
        const { data: predictions, error: predErr } = await supabase
            .from('risk_predictions')
            .select('ward_id, risk_score, risk_level, predicted_cases, confidence_pct, prediction_date')
            .order('prediction_date', { ascending: false });

        if (predErr) throw predErr;

        // Fetch recent case sums per ward
        const { data: cases, error: casesErr } = await supabase
            .from('dengue_cases')
            .select('ward_id, reported_cases, report_date')
            .order('report_date', { ascending: false });

        if (casesErr) throw casesErr;

        const predMap = {};
        if (predictions) {
            for (const p of predictions) {
                if (!predMap[p.ward_id]) predMap[p.ward_id] = p;
            }
        }

        const casesMap = {};
        if (cases) {
            for (const c of cases) {
                casesMap[c.ward_id] = (casesMap[c.ward_id] || 0) + c.reported_cases;
            }
        }

        const enriched = wards.map(w => ({
            ...w,
            total_reported_cases: casesMap[w.id] || 0,
            latest_prediction: predMap[w.id] || null
        }));

        res.json({
            count: enriched.length,
            wards: enriched
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/wards/:id - retrieve a single ward with detailed observations
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data: ward, error: wardErr } = await supabase
            .from('wards')
            .select('*')
            .eq('id', id)
            .single();

        if (wardErr) {
            if (wardErr.code === 'PGRST116') {
                return res.status(404).json({ message: `Ward ${id} not found` });
            }
            throw wardErr;
        }

        const { data: latestPrediction } = await supabase
            .from('risk_predictions')
            .select('*')
            .eq('ward_id', id)
            .order('prediction_date', { ascending: false })
            .limit(1)
            .maybeSingle();

        res.json({
            ward,
            latest_prediction: latestPrediction || null
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
