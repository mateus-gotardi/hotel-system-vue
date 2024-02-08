create table
  tb_hospedes (
    id bigint primary key generated always as identity,
    inserted_at timestamp with time zone default timezone ('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone ('utc'::text, now()) not null,
    nome text,
    sobrenome text
  );