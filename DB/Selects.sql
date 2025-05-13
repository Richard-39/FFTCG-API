-- Rarity --
select BIN_TO_UUID(rarity.id) as "id", name from rarity;

-- Opus --
select BIN_TO_UUID(opus.id) as "id", name, opus_code from opus;

-- Card Type --
select BIN_TO_UUID(card_type.id) as "id", name from card_type;

-- Element --
select BIN_TO_UUID(element.id) as "id", name from element;

-- Job --
select BIN_TO_UUID(job.id) as "id", name from job;

-- Categoy --
select BIN_TO_UUID(category.id) as "id", name from category;

-- Image Type --
select BIN_TO_UUID(image_type.id) as "id", name from image_type;

-- Card --
select BIN_TO_UUID(card.id) as 'id', card.name, code, rarity.name as 'rarity', opus.name as 'opus', cost, card_type.name as 'card type', exburst, multiplayable, power, abilities, create_at, update_at
from card 
join rarity on card.rarity_id = rarity.id
join opus on card.opus_id = opus.id
join card_type on card.card_type_id = card_type.id;

-- Card Element --
select BIN_TO_UUID(card_element.card_id), card.code as 'code', element.name as 'element' from card_element
join card on card_element.card_id = card.id
join element on card_element.element_id = element.id;

-- Card Job --
select BIN_TO_UUID(card_job.card_id), card.code as 'code', job.name as 'job' from card_job
join card on card_job.card_id = card.id
join job on card_job.job_id = job.id;

-- Card category --
select BIN_TO_UUID(card_category.card_id), card.code as 'code', category.name as 'category' from card_category
join card on card_category.card_id = card.id
join category on card_category.category_id = category.id;

select BIN_TO_UUID(card_id), src from image;
select src from image where card_id = UUID_TO_BIN('c1cd682c-3cdc-4b1a-b40e-2eebd8b73c41');

SELECT * FROM card
ORDER BY RAND()
LIMIT 1;

-- export to sql insert
select concat("UUID_TO_BIN('", BIN_TO_UUID(card.id), "'") as 'id', name, code, concat("UUID_TO_BIN('", BIN_TO_UUID(rarity_id), "'") as 'rarity_id', concat("UUID_TO_BIN('", BIN_TO_UUID(opus_id), "'") as 'opus_id', cost, concat("UUID_TO_BIN('", BIN_TO_UUID(card_type_id), "'") as 'cardType_id', exburst, multiplayable, power, abilities, create_at, update_at
from card;

SHOW VARIABLES LIKE 'max_connections';
SHOW STATUS WHERE `variable_name` = 'Threads_connected';

select 1;

do sleep(5);

-- card by code --
SELECT BIN_TO_UUID(card.id) as `id`, card.name, code, rarity.name as `rarity`, opus.name as `opus`, cost, card_type.name as `card type`, exburst, multiplayable, power, abilities, create_at, update_at 
from card 
join rarity on card.rarity_id = rarity.id 
join opus on card.opus_id = opus.id 
join card_type on card.card_type_id = card_type.id 
where code = '25-006L';

select card.name, src from card 
join 
	(select card_id, image_type.name, src from image
	join image_type on image.image_type_id = image_type.id
	where image_type.name = "Regular") as subImage 
on subImage.card_id = card.id;

select card_id, src from image
join image_type on image.image_type_id = image_type.id
where image_type.name = "Regular";

select distinct card.name, code, src 
from card 
join 
	(
		select card_id, src from image
		where image.image_type_id = (select id from image_type where name = 'Regular')
    ) as subImage 
    on subImage.card_id = card.id
join card_element on card.id = card_element.card_id
join card_job on card.id = card_job.card_id
join card_category on card.id = card_category.card_id

where card.rarity_id = UUID_TO_BIN('8643860e-0e7c-11f0-abac-309c2314b3fd')
and card.opus_id = UUID_TO_BIN('8646f14a-0e7c-11f0-abac-309c2314b3fd')
and card.card_type_id = UUID_TO_BIN('8649c8eb-0e7c-11f0-abac-309c2314b3fd')

and card_element.element_id = UUID_TO_BIN('864c913c-0e7c-11f0-abac-309c2314b3fd')
and card_job.job_id = UUID_TO_BIN('864f747c-0e7c-11f0-abac-309c2314b3fd')
and card_category.category_id = UUID_TO_BIN('8652a006-0e7c-11f0-abac-309c2314b3fd')

and card.name like '%a%'
and card.cost = 2
and card.exburst = false
and card.multiplayable = true
and card.power <= 9000
and card.abilities like '%discard%'

order by code asc	
limit 4
offset 0
;

SELECT code from card order by rand() limit 1;
select id from image_type where name = 'Regular';

select distinct count(code) 
from card 
join 
	(
		select card_id, src from image
		where image.image_type_id = (select id from image_type where name = 'Regular')
    ) as subImage 
    on subImage.card_id = card.id
order by code asc	
limit 10
offset 0
;

select BIN_TO_UUID(id), email, password from user;
select password from user where email = "ricardo@email.com";