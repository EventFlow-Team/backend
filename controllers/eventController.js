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
            if (finishDate < startDate) return res.status(400).json({ msg: "Data de término não pode ser menor que a data de início" })

            const newEvent = {
                companyId: companyId,
                userId,
                name,
                description,
                startDate,
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

    events: async (req, res) => {
        try {
            const events = await eventModel.find();

            res.status(200).json({ events });
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

    userEvents: async (req, res) => {
        try {
            const userId = req.user.id;
            const events = await eventModel.find({ userId });

            res.status(200).json({ events });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    eventById: async (req, res) => {
        try {
            const eventId = req.params.id;
            const event = await eventModel.findById(eventId);

            res.status(200).json({ event });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    addUser: async (req, res) => {
        try {
            const userId = req.user.id;
            const eventId = req.params.id;

            const userExists = await eventModel.findOne({ _id: eventId, userId: userId });
            if(userExists) return res.status(422).json({ msg: 'Usuário já adicionado ao evento' });

            const event = await eventModel.findByIdAndUpdate(eventId, { $push: { userId: userId } }, { new: true });
            if(!event) return res.status(404).json({ msg: 'Evento não encontrado' });
            
            res.status(200).json({ msg: "Usuário adicionado com sucesso", event });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    removeUser : async (req, res) => {
        try {
            const userId = req.user.id;
            const eventId = req.params.id;

            const userExists = await eventModel.findOne({ _id: eventId, userId: userId });
            if(!userExists) return res.status(422).json({ msg: 'Usuário não encontrado no evento' });

            const event = await eventModel.findByIdAndUpdate(eventId, { $pull: { userId: userId } }, { new: true });
            if(!event) return res.status(404).json({ msg: 'Evento não encontrado' });

            res.status(200).json({ msg: "Usuário removido com sucesso", event });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = eventController;