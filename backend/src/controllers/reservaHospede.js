const database = require('../database/index');

exports.post = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).send('Invalid body')
    }
    const { idhotel, numeroreserva, apartamento, datacheckin, datacheckout, status, hospedes } = req.body
    if (!idhotel || !numeroreserva || !apartamento || !datacheckin || !status || !hospedes) {
        return res.status(403).send("dados faltando")
    }
    const save = await salvarReservaEDetalhes(req.body)
    if (!save) {
        return res.status(500).send("error")
    } else {
        return res.status(200).send('reservado com sucesso')
    }
};
exports.put = (req, res, next) => {
    let id = req.params.id;
    res.status(201).send(`Requisição recebida com sucesso! ${id}`);
};
exports.delete = (req, res, next) => {
    let id = req.params.id;
    res.status(200).send(`Requisição recebida com sucesso! ${id}`);
};
exports.getOne = (req, res, next) => {
    let id = req.params.id;
    res.status(200).send(`Requisição recebida'em! ${id}`);
}
exports.get = (req, res, next) => {
    let id = req.params.id;
    res.status(200).send(`Requisição recebida'em! ${id}`);
}

async function salvarReservaEDetalhes(data) {
    try {
        // Inserir hóspedes na tb_hospedes se não existirem
        const hospedes = data.hospedes;
        hospedes.map((hospede) => {
            const hospedeData = {
                nome: hospede.nome,
                sobrenome: hospede.sobrenome,
            }
            const { data, error } = database
                .from('tb_hospedes')
                .select()
                .eq('id', hospede.hospedeid)
            if (error) {
                console.log(error)
            }
        })

        // Inserir detalhes da reserva na tb_reservas
        const reservaData = {
            idhotel: data.idhotel,
            numeroreserva: data.numeroreserva,
            apartamento: data.apartamento,
            datacheckin: data.datacheckin,
            datacheckout: data.datacheckout || '',
            status: data.status
        };
        const { data: reserva, error: reservaError } = await database
            .from('tb_reservas')
            .upsert(reservaData)
            .single();
        if (reservaError) throw reservaError;

        // Criar relações entre reserva e hóspedes na tb_reservas_hospedes
        const reservaHospedesData = hospedes.map(hospede => ({
            idreserva: reserva.id,
            idhospede: hospede.idhospede
        }));
        await database.from('reservas_hospedes').insert(reservaHospedesData);

        console.log('Reserva e detalhes salvos com sucesso!');
        return true
    } catch (error) {
        console.error('Erro ao salvar reserva e detalhes:', error.message);
        return false;
    }

}