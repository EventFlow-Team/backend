const { Stand: standModel } = require('../models/Stand');
const { Event: eventModel } = require('../models/Event');

const standController = {
    create: async (req, res) => {
        try {
            const { eventId, name, description, location, startDate, breakDate, finishDate, status, kind, image, giftDescription, giftImage, buffetMenu } = req.body;
            const companyId = req.company.id;

            if (!eventId) return res.status(400).json({ msg: 'Evento é obrigatório' });
            if (!name) return res.status(400).json({ msg: 'Nome é obrigatório' });
            if (!description) return res.status(400).json({ msg: 'Descrição é obrigatória' });
            if (!location) return res.status(400).json({ msg: 'Local é obrigatório' });
            if (!startDate) return res.status(400).json({ msg: 'Data de inicio é obrigatória' });
            if (!finishDate) return res.status(400).json({ msg: 'Data de término é obrigatória' });
            if (!status) return res.status(400).json({ msg: 'Status é obrigatório' });
            if (!image) return res.status(400).json({ msg: 'Foto é obrigatória' });

            const standExists = await standModel.findOne({ companyId, eventId, name });
            if (standExists) return res.status(422).json({ msg: "Este stand já está cadastrado" });

            const event = await eventModel.findOne({ _id: eventId });
            const eventStartDate = new Date(event.startDate);
            const eventFinishDate = new Date(event.finishDate);

            if (startDate < eventStartDate || startDate > eventFinishDate) return res.status(400).json({ msg: 'Data de início inválida' });
            if (startDate > finishDate) return res.status(400).json({ msg: 'Data de início não pode ser maior que a data de término' });
            if (breakDate < startDate || breakDate > finishDate) return res.status(400).json({ msg: 'Data de intervalo inválida' });

            const newStand = {
                companyId: companyId,
                eventId,
                name,
                description,
                location,
                startDate,
                breakDate: event.breakDate,
                finishDate,
                status,
                kind,
                image,
                rating: 0,
                giftDescription,
                giftImage,
                buffetMenu
            };

            const response = await standModel.create(newStand);
            res.status(201).json({ response, msg: "Stand criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    stands: async (req, res) => {
        try {
            const companyId = req.company.id;
            const stands = await standModel.find({ companyId });

            res.status(200).json({ stands });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
}

module.exports = standController;   