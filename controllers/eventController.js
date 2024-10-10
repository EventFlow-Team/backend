const { Event: eventModel } = require('../models/Event');
const { Stand: standModel } = require('../models/Stand');

const eventController = {
    create: async (req, res) => {
        try {
            const { userId, name, description, startDate, breakDate, finishDate, status, location, kind, image } = req.body;
            const companyId = req.company.id;

            if (!name) return res.status(400).json({ msg: 'Nome é obrigatório' });
            if (!description) return res.status(400).json({ msg: 'Descrição é obrigatória' });
            if (!startDate) return res.status(400).json({ msg: 'Data de inicio é obrigatória' });
            if (!finishDate) return res.status(400).json({ msg: 'Data de término é obrigatória' });
            if (!status) return res.status(400).json({ msg: 'Status é obrigatório' });
            if (!location) return res.status(400).json({ msg: 'Local é obrigatório' });
            if (!image) return res.status(400).json({ msg: 'Foto é brigatória' });

            const eventExists = await eventModel.findOne({ companyId, name });
            if (eventExists) return res.status(422).json({ msg: "Este evento já está cadastrado" });

            if (startDate > finishDate) return res.status(400).json({ msg: 'Data de início não pode ser maior que a data de término' });
            if (breakDate < startDate || breakDate > finishDate) return res.status(400).json({ msg: 'Data de intervalo inválida' });

            const newEvent = {
                companyId: companyId,
                userId,
                name,
                description,
                startDate,
                breakDate,
                finishDate,
                status,
                location,
                kind,
                image,
                rating: 0
            };

            const response = await eventModel.create(newEvent);
            res.status(201).json({ response, msg: "Evento criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    companyEvents: async (req, res) => {
        try {
            const companyId = req.company.id;
            const events = await eventModel.find({ companyId });

            res.status(200).json({ events });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    events: async (req, res) => {
        try {
            const events = await eventModel.find();

            res.status(200).json({ events });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    eventRating: async (req, res) => {
        try {
            const { eventId } = req.params;

            const stands = await standModel.find({ eventId });
            if (stands.length === 0) return res.status(404).json({ msg: 'Nenhum stand encontrado para este evento!!!!' });

            const totalRating = stands.reduce((acc, stand) => acc + stand.rating, 0);
            const averageRating = totalRating / stands.length;

            await eventModel.findByIdAndUpdate(eventId, { rating: averageRating });

            res.status(200).json({ msg: 'Rating do evento atualizado com sucesso', rating: averageRating });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = eventController;