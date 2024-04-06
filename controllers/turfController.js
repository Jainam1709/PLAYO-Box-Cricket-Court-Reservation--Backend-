import Turf from "../models/turf.js";
import Court from "../models/court.js";

class TurfController{

static addTurf = async (req, res, next) => {
    try {
        const courtId = req.params.courtId;
        const court = await Court.findById(courtId);
        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }
        const { name, pricePerHour, amenities } = req.body;
        if (!name || !pricePerHour) {
            return res.status(400).json({ message: 'Name and price per hour are required' });
        }
        const turf = new Turf({ court: courtId, name, pricePerHour, amenities });
        await turf.save();
        court.turfs.push(turf);
        await court.save();
        res.status(201).json({ message: 'Turf created successfully', turf });
    } catch (error) {
        next(error);
    }
};

static getAllTurfs = async (req, res, next) => {
    try {
        const courtId = req.params.courtId;
        const court = await Court.findById(courtId).populate('turfs');
        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }
        res.status(200).json(court.turfs);
    } catch (error) {
        next(error);
    }
};

static getTurfById = async (req, res, next) => {
    try {
        const turfId = req.params.turfId;
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' });
        }
        res.status(200).json(turf);
    } catch (error) {
        next(error);
    }
};

static updateTurf = async (req, res, next) => {
    try {
        const turfId = req.params.turfId;
        const { name, pricePerHour, amenities, extraBalls } = req.body;
        if (!name && !pricePerHour && !amenities && !extraBalls) {
            return res.status(400).json({ message: 'At least one field is required for update' });
        }
        const turf = await Turf.findByIdAndUpdate(turfId, req.body, { new: true });
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' });
        }
        res.status(200).json({ message: 'Turf updated successfully', turf });
    } catch (error) {
        next(error);
    }
};

static deleteTurf = async (req, res, next) => {
    try {
        const turfId = req.params.turfId;
        const turf = await Turf.findByIdAndDelete(turfId);
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' });
        }
        res.status(200).json({ message: 'Turf deleted successfully' });
    } catch (error) {
        next(error);
    }
};
}

export default TurfController;