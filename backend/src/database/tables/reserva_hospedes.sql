create table 
    reserva_hospede (
    inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    idhospede bigint references tb_hotel(id),
    idreserva bigint references tb_hospedes(id),
    primary key (idreserva, idhospede)
    );