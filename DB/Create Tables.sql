-- first tables -- 

create table rarity
(
	id binary(16) primary key,
    name varchar(100) not null unique
);

create table opus
(
	id binary(16) primary key,
    name varchar(100) not null unique,
    opus_code int
);

create table card_type
(
	id binary(16) primary key,
    name varchar(100) not null unique
);

create table element
(
	id binary(16) primary key,
    name varchar(100) not null unique
);

create table job
(
	id binary(16) primary key,
    name varchar(100) not null unique
);

create table category
(
	id binary(16) primary key,
    name varchar(100) not null unique
);

create table image_type
(
	id binary(16) primary key,
    name varchar(100) not null unique
);

-- seconds -- 

create table card
(
	id binary(16) primary key,
    name varchar(100),
    code varchar(20) unique,
    rarity_id binary(16),
    foreign key (rarity_id) references rarity (id),
    opus_id binary(16),
    foreign key (opus_id) references opus (id),
    cost int,
    card_type_id binary(16),
    foreign key (card_type_id) references card_type (id),
    exburst bool,
    multiplayable bool,
    power int,
    abilities mediumtext,
    create_at datetime,
    update_at datetime
);

-- third -- 

create table card_element
(
	card_id binary(16),
    element_id binary(16),
    primary key (card_id, element_id),
    foreign key (card_id) references card (id) on delete cascade on update cascade,
    foreign key (element_id) references element (id) on delete cascade on update cascade
);

create table card_job
(
	card_id binary(16),
    job_id binary(16),
    primary key (card_id, job_id),
    foreign key (card_id) references card (id) on delete cascade on update cascade,
    foreign key (job_id) references job (id) on delete cascade on update cascade
);

create table card_category
(
	card_id binary(16),
    category_id binary(16),
    primary key (card_id, category_id),
    foreign key (card_id) references card (id) on delete cascade on update cascade,
    foreign key (category_id) references category (id) on delete cascade on update cascade
);

create table image
(
	id binary(16) primary key,
    card_id binary(16),
    foreign key (card_id) references card (id) on delete cascade,
    image_type_id binary(16),
    foreign key (image_type_id) references image_type (id),
    src mediumtext
);

-- alter table image add foreign key (card_id) references card (id) on delete cascade;

create table user
(
	id binary(16) primary key,
    email varchar(100) unique,
    password varchar(500)
);