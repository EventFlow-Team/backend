const { Stand: standModel } = require('../models/Stand');
const { Event: eventModel } = require('../models/Event');

const standController = {
    create: async (req, res) => {
        try {
            const { name, description, location, startDate, breakDate, finishDate, status, kind, image, giftDescription, giftImage, buffetMenu } = req.body;
            const companyId = req.company.id;
            const eventId = req.params.id;

            if (!eventId) return res.status(400).json({ msg: 'Evento é obrigatório' });
            if (!name) return res.status(400).json({ msg: 'Nome é obrigatório' });
            if (!description) return res.status(400).json({ msg: 'Descrição é obrigatória' });
            if (!location) return res.status(400).json({ msg: 'Local é obrigatório' });
            if (!startDate) return res.status(400).json({ msg: 'Data de início é obrigatória' });
            if (!finishDate) return res.status(400).json({ msg: 'Data de término é obrigatória' });
            if (!status) return res.status(400).json({ msg: 'Status é obrigatório' });
            if (!image) return res.status(400).json({ msg: 'Foto é obrigatória' });

            const standExists = await standModel.findOne({ companyId, eventId, name });
            if (standExists) return res.status(422).json({ msg: "Este stand já está cadastrado" });

            const event = await eventModel.findOne({ _id: eventId });
            if (!event) return res.status(404).json({ msg: "Evento não encontrado" });

            if (startDate > finishDate) return res.status(400).json({ msg: 'Data de início não pode ser maior que a data de término' });
            if (finishDate < startDate) return res.status(400).json({ msg: "Data de término não pode ser menor que a data de início" })

            const newStand = {
                companyId,
                eventId,
                name,
                description,
                location,
                startDate,
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

    companyStands: async (req, res) => {
        try {
            const companyId = req.company.id;
            const stands = await standModel.find({ companyId });

            res.status(200).json({ stands });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    eventStands: async (req, res) => {
        try {
            const eventId = req.params.id;

            const stands = await standModel.find({ eventId });
            if (!stands) return res.status(404).json({ msg: "Nenhum stand encontrado" });

            res.status(200).json({ stands });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    
    standById: async (req, res) => {
        try {
            const standId = req.params.id;

            const stand = await standModel.findOne({ _id: standId });
            if (!stand) return res.status(404).json({ msg: "Stand não encontrado" });

            res.status(200).json({ stand });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    updateStand: async (req, res) => {
        try {
            const standId = req.params.id;
            const companyId = req.company.id;
            const { name, description, location, startDate, finishDate, status, kind, image, giftDescription, giftImage, buffetMenu } = req.body;

            const stand = await standModel.findOne({ _id: standId, companyId });
            if (!stand) return res.status(404).json({ msg: "Stand não encontrado" });

            if (startDate > finishDate) return res.status(400).json({ msg: 'Data de início não pode ser maior que a data de término' });
            if (finishDate < startDate) return res.status(400).json({ msg: "Data de término não pode ser menor que a data de início" })

            const updatedStand = {
                name,
                description,
                location,
                startDate,
                finishDate,
                status,
                kind,
                image,
                giftDescription,
                giftImage,
                buffetMenu
            };

            const response = await standModel.findOneAndUpdate({ _id: standId }, updatedStand, { new: true });
            res.status(200).json({ response, msg: "Stand atualizado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    standRating: async (req, res) => {
        try {
            const standId = req.params.id;
            const { rating } = req.body;

            const stand = await standModel.findOne({ _id: standId });
            if (!stand) return res.status(404).json({ msg: "Stand não encontrado" });

            const response = await standModel.findByIdAndUpdate(standId, { $push: { rating: rating }}, { new: true });
            res.status(200).json({ response, msg: "Avaliação realizada com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

}

module.exports = standController;   