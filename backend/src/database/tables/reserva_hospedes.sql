create table 
reserva_hospede (
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  idhospede bigint references tb_hospedes(idhospede),
  idreserva bigint references tb_reservas(id),
  primary key (idreserva, idhospede)
);