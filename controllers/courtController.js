import Court from "../models/court.js";

class CourtController{

    static createCourt = async (req, res, next) => {
        try {
            const { name, location } = req.body;
            if (!name || !location) {
                return res.status(400).json({ message: 'Name and location are required' });
            }
            // Check if court name already exists
            const existingCourt = await Court.findOne({ name });
            if (existingCourt) {
                return res.status(400).json({ message: 'Court name already exists' });
            }
            const court = await Court.create({ name, location });
            res.status(201).json({ message: 'Court created successfully', court });
        } catch (error) {
            next(error);
        }
    };

    static getCourts = async (req, res, next) => {
        try {
            const courts = await Court.find();
            res.status(200).json(courts);
        } catch (error) {
            next(error);
        }
    };

    static updateCourt = async (req, res, next) => {
        try {
            const courtId = req.params.courtId;
            const { name, location } = req.body;
            if (!name && !location) {
                return res.status(400).json({ message: 'Name or location is required for update' });
            }
            const court = await Court.findByIdAndUpdate(courtId, req.body, { new: true });
            if (!court) {
                return res.status(404).json({ message: 'Court not found' });
            }
            res.status(200).json({ message: 'Court updated successfully', court });
        } catch (error) {
            next(error);
        }
    };

    static deleteCourt = async (req, res, next) => {
        try {
            const courtId = req.params.courtId;
            const court = await Court.findByIdAndDelete(courtId);
            if (!court) {
                return res.status(404).json({ message: 'Court not found' });
            }
            res.status(200).json({ message: 'Court deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    static getCourtById = async (req, res, next) => {
        try {
            const courtId = req.params.courtId;
            const court = await Court.findById(courtId);
            if (!court) {
                return res.status(404).json({ message: 'Court not found' });
            }
            res.status(200).json(court);
        } catch (error) {
            next(error);
        }
    };
}

export default CourtController;