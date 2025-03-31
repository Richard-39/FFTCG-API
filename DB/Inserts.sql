-- Basic insert --

insert into rarity (id, name) values 
(UUID_TO_BIN(UUID()), 'Legend'),
(UUID_TO_BIN(UUID()), 'Hero'),
(UUID_TO_BIN(UUID()), 'Rare'),
(UUID_TO_BIN(UUID()), 'Common'),
(UUID_TO_BIN(UUID()), 'Starter'),
(UUID_TO_BIN(UUID()), 'Promo'),
(UUID_TO_BIN(UUID()), 'Boss');
select BIN_TO_UUID(rarity.id) as "id", name from rarity;

-- FALTAN DATOS --
insert into opus (id, name) values 
(UUID_TO_BIN(UUID()), 'Opus I'),
(UUID_TO_BIN(UUID()), 'Opus II'),
(UUID_TO_BIN(UUID()), 'Opus III'),
(UUID_TO_BIN(UUID()), 'Opus IV'),
(UUID_TO_BIN(UUID()), 'Opus V'),
(UUID_TO_BIN(UUID()), 'Opus VI'),
(UUID_TO_BIN(UUID()), 'Opus VII'),
(UUID_TO_BIN(UUID()), 'Opus VIII'),
(UUID_TO_BIN(UUID()), 'Opus IX'),
(UUID_TO_BIN(UUID()), 'Opus X'),
(UUID_TO_BIN(UUID()), 'Opus XI'),
(UUID_TO_BIN(UUID()), 'Opus XII'),
(UUID_TO_BIN(UUID()), 'Opus XIII'),
(UUID_TO_BIN(UUID()), 'Opus XIV'),
(UUID_TO_BIN(UUID()), 'Opus XV'),
(UUID_TO_BIN(UUID()), 'Opus XVI'),
(UUID_TO_BIN(UUID()), 'Opus XVII'),
(UUID_TO_BIN(UUID()), 'Opus XVIII'),
(UUID_TO_BIN(UUID()), 'Opus XIX'),
(UUID_TO_BIN(UUID()), 'Opus XX'),
(UUID_TO_BIN(UUID()), 'Opus XXI'),
(UUID_TO_BIN(UUID()), 'Opus XXII'),
(UUID_TO_BIN(UUID()), 'Opus XXIII'),
(UUID_TO_BIN(UUID()), 'Opus XXIV'),
(UUID_TO_BIN(UUID()), 'Opus XXV'),
(UUID_TO_BIN(UUID()), 'Legacy');
select BIN_TO_UUID(opus.id) as "id", name from opus;

insert into cardType (id, name) values
(UUID_TO_BIN(UUID()), 'Forward'),
(UUID_TO_BIN(UUID()), 'Monster'),
(UUID_TO_BIN(UUID()), 'Summon'),
(UUID_TO_BIN(UUID()), 'Backup');
select BIN_TO_UUID(cardType.id) as "id", name from cardType;

insert into element (id, name) values
(UUID_TO_BIN(UUID()), 'Fire'),
(UUID_TO_BIN(UUID()), 'Ice'),
(UUID_TO_BIN(UUID()), 'Wind'),
(UUID_TO_BIN(UUID()), 'Earth'),
(UUID_TO_BIN(UUID()), 'lightning'),
(UUID_TO_BIN(UUID()), 'Water'),
(UUID_TO_BIN(UUID()), 'light'),
(UUID_TO_BIN(UUID()), 'Dark');
select BIN_TO_UUID(element.id) as "id", name from element;

-- FALTAN DATOS --
insert into job (id, name) values
(UUID_TO_BIN(UUID()), 'AVALANCHE Operative'),
(UUID_TO_BIN(UUID()), 'Abhorrent One'),
(UUID_TO_BIN(UUID()), 'Acting Imperial Viceroy'),
(UUID_TO_BIN(UUID()), 'Actress of Wohlstok');
select BIN_TO_UUID(job.id) as "id", name from job;

-- FALTAN DATOS --
insert into category (id, name) values
(UUID_TO_BIN(UUID()), 'I'),
(UUID_TO_BIN(UUID()), 'II'),
(UUID_TO_BIN(UUID()), 'III'),
(UUID_TO_BIN(UUID()), 'IV'),
(UUID_TO_BIN(UUID()), 'V');
select BIN_TO_UUID(category.id) as "id", name from category;

insert into imageType (id, name) values
(UUID_TO_BIN(UUID()), 'Regular'),
(UUID_TO_BIN(UUID()), 'Foil'),
(UUID_TO_BIN(UUID()), 'Full Art');
select BIN_TO_UUID(imageType.id) as "id", name from imageType;

-- card insert --
insert into card (id, name, code, rarity_id, opus_id, cost, cardType_id, exburst, multiplayable, power, abilities, create_at, update_at) values
(UUID_TO_BIN(UUID()), 
'card example', 
'code-001', 
UUID_TO_BIN('b82b3a69-0aa0-11f0-abac-309c2314b3fd'), 
UUID_TO_BIN('9ad5bd86-0aa5-11f0-abac-309c2314b3fd'),
4,
UUID_TO_BIN('f962eabb-0aa5-11f0-abac-309c2314b3fd'),
true,
false,
8000,
'habilitie example habilitie example 2',
'2025-01-26 00:15:12',
'2025-01-26 00:15:12'
);
select BIN_TO_UUID(card.id) as 'id', card.name, code, rarity.name as 'rarity', opus.name as 'opus', cost, cardtype.name as 'card type', exburst, multiplayable, power, abilities, create_at, update_at
from card 
join rarity on card.rarity_id = rarity.id
join opus on card.opus_id = opus.id
join cardType on card.cardType_id = cardType.id;

	


/* 
update `product` 
set `name` = 'produto 3', `description` = 'descripion producto 3', `price` = 30000, `category_id` = UUID_TO_BIN('4ca04f05-ac58-11ef-b371-309c2314b3fd'), `isActive` = true, `modified_at` = '2024-12-03' 
where `id` = UUID_TO_BIN('941c9289-648a-433d-87d4-6e9a40dc74ec');
*/