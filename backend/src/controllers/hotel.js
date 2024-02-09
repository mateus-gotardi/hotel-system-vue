const database = require('../database/index');
const reservaHospedeController = require('./reservaHospede')

exports.post = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).send('Invalid body')
    }
    const { nome, cnpj, pais, estado, cidade } = req.body
    if (!nome || !cnpj || !pais || !estado || !cidade) {
        return res.status(403).send("dados faltando")
    }
    const { data, error } = await database
        .from('tb_hotel')
        .insert({
            nome, cnpj, estado, cidade, pais
        })
        .select();
    if (error) {
        return res.status(500).send(error)
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
    let id = req.params.id;
    if (!req.body) {
        return res.status(400).send('Invalid body')
    }
    const { nome, cnpj, pais, estado, cidade } = req.body
    if (!nome || !cnpj || !pais || !estado || !cidade) {
        return res.status(403).send("dados faltando")
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
        return res.status(200).send(data)
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
        console.log(`reservasDeletadas`, reservasDeletadas)
        if (reservasDeletadas.includes(false)) {
            return res.status(500).send('erro ao apagar hotel')
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
            return res.status(200).send('hotel excluido com sucesso')
        }
    }
};