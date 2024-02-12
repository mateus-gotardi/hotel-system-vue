const database = require('../database/index');

exports.createOrUpdate = async (req, res, next) => {
    if (!req.body || req.body.hospedes.length === 0) {
        if (req.body.hospedes.length === 0) {
            return res.status(400).send({ message: 'Reserva precisa ter pelo menos um hospede' })
        }
        return res.status(400).send({ message: 'requisição inválida' })
    }
    const dataExists = await dataExist('tb_reservas', req.body.numeroreserva, 'numeroreserva')
    if (dataExists && req.method === 'POST' && req.url === '/cadastrarReservaHospede') {
        return res.status(400).send({ message: 'reserva ja existe' })
    }
    const { idhotel, numeroreserva, apartamento, datacheckin, datacheckout, status, hospedes } = req.body
    if (!idhotel || !numeroreserva || !apartamento || !datacheckin || !status || !hospedes) {
        return res.status(403).send("dados faltando")
    }
    const save = await salvarReservaEDetalhes(req.body)
    if (!save) {
        return res.status(500).send("error")
    } else {
        await tirarHospedesDaRelação(save.reservas, save.id)
        return res.status(200).send('reservado com sucesso')
    }
};
exports.delete = async (req, res, next) => {
    let id = req.params.id;
    const deleteReserva = await this.deleteReservas(id)
    if (deleteReserva) {
        res.status(200).send(`Reserva apagada com sucesso`);
    } else {
        res.status(400).send('erro ao apagar')
    }
};
exports.getOne = async (req, res, next) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).send('Not Found');
    }
    const resposta = await buscarReservaEHospedes(id)
    if (resposta) {
        res.status(200).send(resposta);
    } else {
        res.status(400).send('erro');
    }
}
exports.get = async (req, res, next) => {
    const { data: reservas } = await database
        .from('tb_reservas')
        .select()
        .order('inserted_at', { ascending: false });
    res.status(200).send(reservas);
}
exports.getByHotel = async (req, res, next) => {
    let id = req.params.id
    const { data: reservas } = await database
        .from('tb_reservas')
        .select()
        .eq('idhotel', id)
        .order('inserted_at', { ascending: false });

    res.status(200).send(reservas);
}

// functions

exports.deleteReservas = async (id) => {
    const { error: erroRelacao } = await database
        .from('reserva_hospede')
        .delete()
        .eq('idreserva', id)
    if (!erroRelacao) {
        const { error: erroReserva } = await database
            .from('tb_reservas')
            .delete()
            .eq('id', id)
        if (!erroReserva) {
            return true
        }
    }
    return false
}
async function salvarReservaEDetalhes(reserva) {
    let novaReservaId = ''
    let reservas = []
    try {
        const novaReserva = await atualizarOuCriarReserva({
            numeroreserva: reserva.numeroreserva,
            idhotel: reserva.idhotel,
            status: reserva.status,
            datacheckin: reserva.datacheckin,
            datacheckout: reserva.datacheckout,
            apartamento: reserva.apartamento,
        })
        novaReservaId = novaReserva.id
        let hospedeData = {}
        await reserva.hospedes.map(async (hospede) => {
            try {
                hospedeData = await atualizarOuCriarHospedes(hospede);
            } catch {
                return false
            } finally {
                try {
                    reservas.push(await criarRelacaoReservaHospede(novaReserva.id, hospedeData.idhospede))
                } catch { return false } finally {
                    return true;
                }
            }
        })
    } catch {
        return false
    } finally {
        return { reservas, id: novaReservaId }
    }
}

async function atualizarOuCriarHospedes(hospede) {
    if (await dataExist('tb_hospedes', hospede.idhospede, 'idhospede')) {
        const { data, error } = await database
            .from('tb_hospedes')
            .update({ nome: hospede.nome, sobrenome: hospede.sobrenome })
            .eq('idhospede', hospede.idhospede)
            .select()
        if (data) {
            return data[0]
        }
        if (error) {
            console.log('hospedes erro', error)
            return false
        }
    } else {
        const { data, error } = await database
            .from('tb_hospedes')
            .insert({ nome: hospede.nome, sobrenome: hospede.sobrenome })
            .select()
        if (data) {
            return data[0]
        }
        if (error) {
            console.log('hospedes erro', error)
            return false
        }
    }
}

async function atualizarOuCriarReserva(reserva) {
    if (await dataExist('tb_reservas', reserva.numeroreserva, 'numeroreserva')) {
        const { data, error } = await database
            .from('tb_reservas')
            .update(reserva)
            .eq('numeroreserva', reserva.numeroreserva)
            .select()
        if (data) {
            return data[0]
        }
        if (error) {
            console.log('reserva erro', error)
            return false
        }
    } else {
        const { data, error } = await database
            .from('tb_reservas')
            .insert(reserva)
            .select()
        if (data) {
            return data[0]
        }
        if (error) {
            console.log('reserva erro', error)
            return false
        }
    }
}

async function criarRelacaoReservaHospede(idreserva, idhospede) {
    const prevRelation = await relationExists(idreserva, idhospede)
    if (!prevRelation) {
        const { data, error } = await database
            .from('reserva_hospede')
            .insert({ idhospede, idreserva })
            .select()
        if (data) return data
        if (error) {
            console.log('relação erro', error)
            return false
        }
    } else return prevRelation
}

async function tirarHospedesDaRelação(novasReservas, idreserva) {
    const { data: reservas, error } = await database
        .from('reserva_hospede')
        .select()
        .eq('idreserva', idreserva)

    if (error) return error
    const reservasVelhas = reservas.filter(reserva => {
        return !novasReservas.some(novaReserva =>
            novaReserva.idhospede === reserva.idhospede &&
            novaReserva.idreserva === reserva.idreserva
        );
    });
    try {
        reservasVelhas.map(async (reserva) => {
            const { error } = await database
                .from('reserva_hospede')
                .delete()
                .eq('idhospede', reserva.idhospede)
                .eq('idreserva', reserva.idreserva)
            if (error) console.log(error)
        })
    } catch (e) {
        console.log(e)
    }
}

async function dataExist(from, key, keyType) {
    const { data, error } = await database
        .from(from)
        .select()
        .eq(keyType, key)

    if (error || data.length === 0) {
        return false
    }
    else {
        return data
    }
}

async function relationExists(idreserva, idhospede) {
    const { data, error } = await database
        .from('reserva_hospede')
        .select()
        .eq('idhospede', idhospede)
        .eq('idreserva', idreserva)

    if (error || data.length == 0) {
        return false
    }
    else {
        return data[0]
    }
}

async function buscarReservaEHospedes(id) {
    try {
        const reservas_hospedes = await dataExist('reserva_hospede', id, 'idreserva')
        const reserva = await dataExist('tb_reservas', id, 'id');
        let hospedesPromises = reservas_hospedes.map(async (relation) => {
            let hospede = await dataExist('tb_hospedes', relation.idhospede, 'idhospede')
            return ({ idhospede: hospede[0].idhospede, nome: hospede[0].nome, sobrenome: hospede[0].sobrenome })
        })
        const hospedes = await Promise.all(hospedesPromises)
        return {
            idhotel: reserva[0].idhotel,
            numeroreserva: parseInt(reserva[0].numeroreserva) || reserva[0].numeroreserva,
            apartamento: parseInt(reserva[0].apartamento) || reserva[0].apartamento,
            datacheckin: reserva[0].datacheckin,
            datacheckout: reserva[0].datacheckout,
            status: parseInt(reserva[0].status) || reserva[0].status,
            hospedes: hospedes,
        }
    } catch (e) {
        console.log(e)
        return false
    }
}