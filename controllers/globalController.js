const { Company: companyModel } = require('../models/Company');
const { User: userModel } = require('../models/User');
const { Event: eventModel } = require('../models/Event');
const { Stand: standModel } = require('../models/Stand');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;
    return jwt.sign({ id }, secret, { expiresIn: '1d' });
};

const globalController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email) return res.status(400).json({ msg: 'O email é obrigatório' });
            if (!password) return res.status(400).json({ msg: 'A senha é obrigatória' });

            let user = await userModel.findOne({ email });
            if (user) {
                const checkPassword = await bcrypt.compare(password, user.password);
                if (!checkPassword) return res.status(422).json({ msg: 'Senha inválida para usuário!' });

                const token = generateToken(user._id);
                return res.status(200).json({ msg: 'Autenticação de usuário realizada com sucesso!', id: user._id, token });
            }

            let company = await companyModel.findOne({ companyCode: email });
            if (company) {
                const checkPassword = await bcrypt.compare(password, company.password);
                if (!checkPassword) return res.status(422).json({ msg: 'Senha inválida para empresa!' });

                const token = generateToken(company._id);
                return res.status(200).json({ msg: 'Autenticação de empresa realizada com sucesso!', id: company._id, token });
            }

            return res.status(404).json({ msg: "Usuário ou Empresa não encontrados" });

        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = globalController;
