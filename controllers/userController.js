const { User: userModel } = require('../models/User')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const crypto = require('crypto')
const mailer = require('../modules/mailer')

dotenv.config();

const userController = {
    create: async (req, res) => {
        try {
            const { name, surname, email, password, age, image } = req.body;

            if (!name) return res.status(400).json({ msg: 'Nome é obrigatório' });
            if (!surname) return res.status(400).json({ msg: 'Sobrenome é obrigatório' }); 
            if (!email) return res.status(400).json({ msg: 'Email é obrigatório' });
            if (!password) return res.status(400).json({ msg: 'Senha é obrigatória' });
            if (!age) return res.status(400).json({ msg: 'Idade é obrigatória' });
            if (!image) return res.status(400).json({ msg: 'Foto de perfil é o brigatória' }); 

            const userExists = await userModel.findOne({ email });
            if (userExists) return res.status(422).json({ msg: "Este email já está cadastrado" });

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = {
                name,
                surname,
                email,
                password: hashedPassword,
                age,
                image
            };

            const response = await userModel.create(newUser);
            res.status(201).json({ response, msg: "Usuário criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    user: async (req, res) => {
        try {
            const id = req.user.id;

            const user = await userModel.findById(id, '-password');
            if (!user) return res.status(404).json({ msg: 'Usuário não encontrado!' });

            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    forgot_password: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await userModel.findOne({ email });
            if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });

            const token = crypto.randomBytes(3).toString('hex');
            const now = new Date();
            now.setMinutes(now.getMinutes() + 10);

            await userModel.findByIdAndUpdate(user._id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            });

            await mailer.sendMail({
                to: user.email,
                from: 'lucas12chves@gmail.com',
                subject: 'Recuperação de senha GoDress',
                html: `
                <h1>Esqueceu sua senha?</h1>
                <p>Use esse token para recuperá-la: <div style="color: blue; font-weight: 600;">${token}</div></p>
                <p>Este token é apenas válido por 10 minutos.</p>
            `
            });

            res.status(200).json({ msg: 'Email de recuperação enviado com sucesso!' });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    reset_password: async (req, res) => {
        try {
            const { email, token, password } = req.body;

            const user = await userModel.findOne({ email }).select('+passwordResetToken passwordResetExpires');
            if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

            if (token !== user.passwordResetToken) return res.status(422).json({ msg: 'Token inválido!' });

            const now = new Date();
            if (now > user.passwordResetExpires) return res.status(422).json({ msg: 'Token expirado, gere um novo' });

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            await userModel.findByIdAndUpdate(user._id, {
                '$set': { password: hashedPassword }
            });

            res.status(200).json({ msg: 'Senha alterada com sucesso' });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = userController;