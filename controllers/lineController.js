const { Line: lineModel } = require('../models/Line');
const { Stand: standModel } = require('../models/Stand');

const lineController = {
    create: async (req, res) => {
        try {
            const { userId, name, timeEstimate, group, steps } = req.body;
            const companyId = req.company.id;
            const standId = req.params.id;

            if (!name) return res.status(422).json({ msg: "Nome é obrigatório" });
            if (!timeEstimate) return res.status(422).json({ msg: "Tempo estimado é obrigatório" });
            if (!group) return res.status(422).json({ msg: "Grupo é obrigatório" });
            if (!steps) return res.status(422).json({ msg: "Passos é obrigatório" });

            const lineExists = await lineModel.findOne({ companyId, standId, name });
            if (lineExists) return res.status(422).json({ msg: "Esta fila já está cadastrado" });

            const stand = await standModel.findOne({ _id: standId });
            if (!stand) return res.status(404).json({ msg: "Stand não encontrado" });

            const newLine = {
                companyId,
                standId,
                userId,
                name,
                timeEstimate,
                group,
                steps,
                status: stand.status,
            };

            const response = await lineModel.create(newLine);
            res.status(201).json({ response, msg: "Fila criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    userLines: async (req, res) => {
        try {
            const userId = req.user.id;

            const line = await lineModel.find({ userId });
            if (!line) return res.status(404).json({ msg: "Nenhuma fila encontrada" });

            res.status(200).json({ line });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    standLines: async (req, res) => {
        try {
            const standId = req.params.id;

            const line = await lineModel.find({ standId });
            if (!line) return res.status(404).json({ msg: "Nenhuma fila encontrada" });

            res.status(200).json({ line });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    addUser: async (req, res) => {
        try {
            const userId = req.user.id;
            const lineId = req.params.id;

            const userExists = await lineModel.findOne({ _id: lineId, userId: userId });
            if(userExists) return res.status(422).json({ msg: 'Usuário já adicionado a fila' });

            const line = await lineModel.findByIdAndUpdate(lineId, { $push: { userId: userId } }, { new: true });
            if(!line) return res.status(404).json({ msg: 'Fila não encontrado' });
            
            res.status(200).json({ msg: "Usuário adicionado com sucesso", line });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    removeUser: async (req, res) => {
        try {
            const userId = req.user.id;
            const lineId = req.params.id;

            const line = await lineModel.findByIdAndUpdate(lineId, { $pull: { userId: userId } }, { new: true });
            if(!line) return res.status(404).json({ msg: 'Fila não encontrado' });
            
            res.status(200).json({ msg: "Usuário removido com sucesso", line });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = lineController;   