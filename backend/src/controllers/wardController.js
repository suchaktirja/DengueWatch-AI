// Ward controller
const getAllWards = (req, res) => {
    res.json({
        message: 'Ward API is working',
        wards: []
    });
};

module.exports = {
    getAllWards
};
