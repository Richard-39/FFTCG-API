-- Basic insert, for new db and data --

insert into rarity (id, name) values 
(UUID_TO_BIN(UUID()), 'Legend'),
(UUID_TO_BIN(UUID()), 'Hero'),
(UUID_TO_BIN(UUID()), 'Rare'),
(UUID_TO_BIN(UUID()), 'Common'),
(UUID_TO_BIN(UUID()), 'Starter'),
(UUID_TO_BIN(UUID()), 'Promo'),
(UUID_TO_BIN(UUID()), 'Boss');
select BIN_TO_UUID(rarity.id) as "id", name from rarity;

insert into opus (id, name, opus_code) values 
(UUID_TO_BIN(UUID()), 'Opus I', '1'),
(UUID_TO_BIN(UUID()), 'Opus II', '2'),
(UUID_TO_BIN(UUID()), 'Opus III', '3'),
(UUID_TO_BIN(UUID()), 'Opus IV', '4'),
(UUID_TO_BIN(UUID()), 'Opus V', '5'),
(UUID_TO_BIN(UUID()), 'Opus VI', '6'),
(UUID_TO_BIN(UUID()), 'Opus VII', '7'),
(UUID_TO_BIN(UUID()), 'Opus VIII', '8'),
(UUID_TO_BIN(UUID()), 'Opus IX', '9'),
(UUID_TO_BIN(UUID()), 'Opus X', '10'),
(UUID_TO_BIN(UUID()), 'Opus XI', '11'),
(UUID_TO_BIN(UUID()), 'Opus XII', '12'),
(UUID_TO_BIN(UUID()), 'Opus XIII', '13'),
(UUID_TO_BIN(UUID()), 'Opus XIV', '14'),
(UUID_TO_BIN(UUID()), 'Opus XV (Crystal Dominion)', '15'),
(UUID_TO_BIN(UUID()), 'Opus XVI (Emissaries of Light)', '16'),
(UUID_TO_BIN(UUID()), 'Opus XVII (Rebellion\'s Call)', '17'),
(UUID_TO_BIN(UUID()), 'Opus XVIII (Resurgence of Power)', '18'),
(UUID_TO_BIN(UUID()), 'Opus XIX (From Nightmares)', '19'),
(UUID_TO_BIN(UUID()), 'Opus XX (Dawn of Heroes)', '20'),
(UUID_TO_BIN(UUID()), 'Opus XXI (Beyond Destiny)', '21'),
(UUID_TO_BIN(UUID()), 'Opus XXII (Hidden Hope)', '22'),
(UUID_TO_BIN(UUID()), 'Opus XXIII (Hidden Trials)', '23'),
(UUID_TO_BIN(UUID()), 'Opus XXIV (Hidden Legends)', '24'),
(UUID_TO_BIN(UUID()), 'Opus XXV (Tears of the Planet)', '25'),
(UUID_TO_BIN(UUID()), 'Legacy Collection', 'LE');
select BIN_TO_UUID(opus.id) as "id", name from opus;

insert into card_type (id, name) values
(UUID_TO_BIN(UUID()), 'Forward'),
(UUID_TO_BIN(UUID()), 'Monster'),
(UUID_TO_BIN(UUID()), 'Summon'),
(UUID_TO_BIN(UUID()), 'Backup');
select BIN_TO_UUID(card_type.id) as "id", name from card_type;

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
(UUID_TO_BIN(UUID()), 'Actress of Wohlstok'),
(UUID_TO_BIN(UUID()), 'Mobile Artillery'),
(UUID_TO_BIN(UUID()), 'Warrior'),
(UUID_TO_BIN(UUID()), 'Mythril Musketeer'),
(UUID_TO_BIN(UUID()), 'Standard Unit'),
(UUID_TO_BIN(UUID()), 'Merc'),
(UUID_TO_BIN(UUID()), 'SOLDIER'),
(UUID_TO_BIN(UUID()), 'Salamander'),
(UUID_TO_BIN(UUID()), 'Artificial Life'),
(UUID_TO_BIN(UUID()), 'Archfiend'),
(UUID_TO_BIN(UUID()), 'Cat'),
(UUID_TO_BIN(UUID()), 'Necron'),
(UUID_TO_BIN(UUID()), 'Faction Leader'),
(UUID_TO_BIN(UUID()), 'Chimera'),
(UUID_TO_BIN(UUID()), 'King'),
(UUID_TO_BIN(UUID()), 'Bard'),
(UUID_TO_BIN(UUID()), 'Instructor'),
(UUID_TO_BIN(UUID()), 'Dark Knight'),
(UUID_TO_BIN(UUID()), 'Scientist'),
(UUID_TO_BIN(UUID()), 'Mevyn'),
(UUID_TO_BIN(UUID()), 'Captain'),
(UUID_TO_BIN(UUID()), 'Mysterious Woman'),
(UUID_TO_BIN(UUID()), 'Gullwings'),
(UUID_TO_BIN(UUID()), 'Black Mage'),
(UUID_TO_BIN(UUID()), 'Songstress'),
(UUID_TO_BIN(UUID()), 'Summoner'),
(UUID_TO_BIN(UUID()), 'Ancient'),
(UUID_TO_BIN(UUID()), 'Goobbue'),
(UUID_TO_BIN(UUID()), 'Tantalus Member'),
(UUID_TO_BIN(UUID()), 'Thief'),
(UUID_TO_BIN(UUID()), 'Pilot'),
(UUID_TO_BIN(UUID()), 'Prince'),
(UUID_TO_BIN(UUID()), 'Mandragora'),
(UUID_TO_BIN(UUID()), 'Ninja'),
(UUID_TO_BIN(UUID()), 'Princess'),
(UUID_TO_BIN(UUID()), 'Monk'),
(UUID_TO_BIN(UUID()), 'Gunslinger'),
(UUID_TO_BIN(UUID()), 'Rat'),
(UUID_TO_BIN(UUID()), 'Warrior of Light'),
(UUID_TO_BIN(UUID()), 'War Machine'),
(UUID_TO_BIN(UUID()), 'Doll'),
(UUID_TO_BIN(UUID()), 'Earthshaker'),
(UUID_TO_BIN(UUID()), 'Outlaw'),
(UUID_TO_BIN(UUID()), 'Engineer'),
(UUID_TO_BIN(UUID()), 'Genome'),
(UUID_TO_BIN(UUID()), 'Fighter'),
(UUID_TO_BIN(UUID()), 'Praetor'),
(UUID_TO_BIN(UUID()), 'Member of the Turks'),
(UUID_TO_BIN(UUID()), 'Corneo\'s Pet'),
(UUID_TO_BIN(UUID()), 'Queen'),
(UUID_TO_BIN(UUID()), 'Kraken'),
(UUID_TO_BIN(UUID()), 'Wraith'),
(UUID_TO_BIN(UUID()), 'Paladin'),
(UUID_TO_BIN(UUID()), 'Guardian'),
(UUID_TO_BIN(UUID()), 'Blitzballer'),
(UUID_TO_BIN(UUID()), 'Research Chief'),
(UUID_TO_BIN(UUID()), 'Owner'),
(UUID_TO_BIN(UUID()), 'White Mage'),
(UUID_TO_BIN(UUID()), 'Vesna Krasna'),
(UUID_TO_BIN(UUID()), 'Witch'),
(UUID_TO_BIN(UUID()), 'Lunarian'),
(UUID_TO_BIN(UUID()), 'Descendant of the Zilart'),
(UUID_TO_BIN(UUID()), 'Illusion'),
(UUID_TO_BIN(UUID()), 'Emperor'),
(UUID_TO_BIN(UUID()), 'Crimson Archer'),
(UUID_TO_BIN(UUID()), 'Dragoon'),
(UUID_TO_BIN(UUID()), 'War Hero'),
(UUID_TO_BIN(UUID()), 'Grand Général'),
(UUID_TO_BIN(UUID()), 'Epopt'),
(UUID_TO_BIN(UUID()), 'Warlock');
select BIN_TO_UUID(job.id) as "id", name from job;

insert into category (id, name) values
(UUID_TO_BIN(UUID()), 'I'),
(UUID_TO_BIN(UUID()), 'II'),
(UUID_TO_BIN(UUID()), 'III'),
(UUID_TO_BIN(UUID()), 'IV'),
(UUID_TO_BIN(UUID()), 'V'),
(UUID_TO_BIN(UUID()), 'VI'),
(UUID_TO_BIN(UUID()), 'VII'),
(UUID_TO_BIN(UUID()), 'VIII'),
(UUID_TO_BIN(UUID()), 'IX'),
(UUID_TO_BIN(UUID()), 'X'),
(UUID_TO_BIN(UUID()), 'XI'),
(UUID_TO_BIN(UUID()), 'XII'),
(UUID_TO_BIN(UUID()), 'XIII'),
(UUID_TO_BIN(UUID()), 'XIV'),
(UUID_TO_BIN(UUID()), 'XV'),
(UUID_TO_BIN(UUID()), 'XVI'),
(UUID_TO_BIN(UUID()), 'Anniversary'),
(UUID_TO_BIN(UUID()), 'Crystal Hunt'),
(UUID_TO_BIN(UUID()), 'DFF'),
(UUID_TO_BIN(UUID()), 'FFBE'),
(UUID_TO_BIN(UUID()), 'FFCC'),
(UUID_TO_BIN(UUID()), 'FFEX'),
(UUID_TO_BIN(UUID()), 'FFL'),
(UUID_TO_BIN(UUID()), 'FFRK'),
(UUID_TO_BIN(UUID()), 'FFT'),
(UUID_TO_BIN(UUID()), 'FFTA'),
(UUID_TO_BIN(UUID()), 'FFTA2'),
(UUID_TO_BIN(UUID()), 'LOV'),
(UUID_TO_BIN(UUID()), 'MOBIUS'),
(UUID_TO_BIN(UUID()), 'MQ'),
(UUID_TO_BIN(UUID()), 'PICTLOGICA'),
(UUID_TO_BIN(UUID()), 'SOPFFO'),
(UUID_TO_BIN(UUID()), 'Special'),
(UUID_TO_BIN(UUID()), 'THEATRHYTHM'),
(UUID_TO_BIN(UUID()), 'Type-0'),
(UUID_TO_BIN(UUID()), 'WOFF');
select BIN_TO_UUID(category.id) as "id", name from category;

insert into image_type (id, name) values
(UUID_TO_BIN(UUID()), 'Regular'),
(UUID_TO_BIN(UUID()), 'Foil'),
(UUID_TO_BIN(UUID()), 'Full Art');
select BIN_TO_UUID(image_type.id) as "id", name from image_type;



/*
-- card example insert --
insert into card (id, name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, create_at, update_at) values
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
select BIN_TO_UUID(card.id) as 'id', card.name, code, rarity.name as 'rarity', opus.name as 'opus', cost, card_type.name as 'card type', exburst, multiplayable, power, abilities, create_at, update_at
from card 
join rarity on card.rarity_id = rarity.id
join opus on card.opus_id = opus.id
join card_type on card.card_type_id = card_type.id;
*/

/* 
update `product` 
set `name` = 'produto 3', `description` = 'descripion producto 3', `price` = 30000, `category_id` = UUID_TO_BIN('4ca04f05-ac58-11ef-b371-309c2314b3fd'), `isActive` = true, `modified_at` = '2024-12-03' 
where `id` = UUID_TO_BIN('941c9289-648a-433d-87d4-6e9a40dc74ec');
*/

insert into card (id, name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, create_at, update_at) values
(UUID_TO_BIN(UUID()), 
'card example', 
'code-001', 
UUID_TO_BIN('b82b3a69-0aa0-11f0-abac-309c2314b3fd'), 
UUID_TO_BIN('9ad5bd86-0aa5-11f0-abac-309c2314b3fd'),
null,
UUID_TO_BIN('f962eabb-0aa5-11f0-abac-309c2314b3fd'),
true,
false,
8000,
'habilitie example habilitie example 2',
'2025-01-26 00:15:12',
'2025-01-26 00:15:12'
);

-- update image set src = "image/card/c8b1a390-5b7a-42c2-9af5-37cace912168_FullArt_1.jpeg" where card_id = (UUID_TO_BIN('c8b1a390-5b7a-42c2-9af5-37cace912168'));



