const database = require('../database/index');
const { validarCNPJ } = require('../utils');
const reservaHospedeController = require('./reservaHospede')

exports.post = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).send('Invalid body')
    }
    const { nome, cnpj, pais, estado, cidade } = req.body
    if (!validarCNPJ(cnpj)) {
        return res.status(403).send({ message: "CNPJ inválido" })
    }
    if (!nome || !cnpj || !pais || !estado || !cidade) {
        return res.status(403).send({ message: "dados faltando" })
    }
    const { data, error } = await database
        .from('tb_hotel')
        .insert({
            nome, cnpj, estado, cidade, pais
        })
        .select();
    if (error) {
        if (error.code === '23505') {
            return res.status(400).send({ status: '23505', message: 'CNPJ ja cadastrado' })
        }
        return res.status(400).send(error)
    } else {
        return res.status(200).send(data)
    }
};
exports.getOne = async (req, res, next) => {
    let id = req.params.id;
    const { data, error } = await database
        .from('tb_hotel')
        .select()
        .eq("id", id)
    if (error) return res.status(500).send(error)
    return res.status(200).send(data)
}
exports.get = async (req, res, next) => {
    const { data, error } = await database
        .from('tb_hotel')
        .select()
    if (error) return res.status(500).send(error)
    return res.status(200).send(data)
}
exports.put = async (req, res, next) => {
    let id = req.body.id;
    if (!req.body) {
        return res.status(400).send({ message: 'Dados inválidos' })
    }
    const { nome, cnpj, pais, estado, cidade } = req.body
    if (!validarCNPJ(cnpj)) {
        return res.status(403).send({ message: "CNPJ inválido" })
    }
    if (!nome || !cnpj || !pais || !estado || !cidade) {
        return res.status(403).send({ message: "Dados faltando" })
    }
    const { data, error } = await database
        .from('tb_hotel')
        .update({
            nome, cnpj, estado, cidade, pais
        })
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).send(error)
    } else {
        return res.status(200).send({ message: 'hotel editado com sucesso' })
    }
};
exports.delete = async (req, res, next) => {
    let id = req.params.id;
    try {
        const { data: reservas, error: selectReservasErro } = await database
            .from('tb_reservas')
            .select()
            .eq('idhotel', id)
        if (selectReservasErro) { return res.status(500).send(selectReservasErro) }
        const deleteReservasPromise = reservas.map(async (reserva) => {
            return await reservaHospedeController.deleteReservas(reserva.id)
        })
        const reservasDeletadas = await Promise.all(deleteReservasPromise)
        if (reservasDeletadas.includes(false)) {
            return res.status(500).send({ message: 'erro ao apagar hotel' })
        }
    } catch (e) {
        console.log(e)
    } finally {
        const { error } = await database
            .from('tb_hotel')
            .delete()
            .eq('id', id)
        if (error) {
            return res.status(500).send(error)
        } else {
            return res.status(200).send({ message: 'hotel excluido com sucesso' })
        }
    }
};