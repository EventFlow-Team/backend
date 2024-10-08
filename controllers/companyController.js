const { Company: companyModel } = require('../models/Company')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const companyController = {
    create: async (req, res) => {
        try {
            const { name, password, image } = req.body;

            if (!name) return res.status(400).json({ msg: 'Nome é obrigatório' });
            if (!password) return res.status(400).json({ msg: 'Senha é obrigatória' });
            if (!image) return res.status(400).json({ msg: 'Foto de perfil é o brigatória' }); 

            const companyExists = await companyModel.findOne({ name });
            if (companyExists) return res.status(422).json({ msg: "Esta empresa já está cadastrado" });

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newCompany = {
                name,
                password: hashedPassword,
                image
            };

            const response = await companyModel.create(newCompany);
            res.status(201).json({ response, msg: "Usuário criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { name, password } = req.body;

            if (!name) return res.status(400).json({ msg: 'Nome é obrigatório' });
            if (!password) return res.status(400).json({ msg: 'Senha é obrigatória' });

            const company = await companyModel.findOne({ name });
            if (!company) return res.status(404).json({ msg: "Usuário não encontrado" });

            const checkPassword = await bcrypt.compare(password, company.password);
            if (!checkPassword) return res.status(422).json({ msg: 'Senha inválida!' });

            const secret = process.env.JWT_SECRET;
            const token = jwt.sign({ id: company._id }, secret);
            const id = company._id;

            res.status(200).json({ msg: 'Autenticação realizada com sucesso!', id, token });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    company: async (req, res) => {
        try {
            const id = req.company.id;

            const company = await companyModel.findById(id, '-password');
            if (!company) return res.status(404).json({ msg: 'Usuário não encontrado!' });

            res.status(200).json({ company });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = companyController;