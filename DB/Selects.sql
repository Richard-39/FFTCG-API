-- Rarity --
select BIN_TO_UUID(rarity.id) as "id", name from rarity;

-- Opus --
select BIN_TO_UUID(opus.id) as "id", name from opus;

-- Card Type --
select BIN_TO_UUID(cardType.id) as "id", name from cardType;

-- Element --
select BIN_TO_UUID(element.id) as "id", name from element;

-- Job --
select BIN_TO_UUID(job.id) as "id", name from job;

-- Categoy --
select BIN_TO_UUID(category.id) as "id", name from category;

-- Image Type --
select BIN_TO_UUID(imageType.id) as "id", name from imageType;

-- Card --
select BIN_TO_UUID(card.id) as 'id', card.name, code, rarity.name as 'rarity', opus.name as 'opus', cost, cardtype.name as 'card type', exburst, multiplayable, power, abilities, create_at, update_at
from card 
join rarity on card.rarity_id = rarity.id
join opus on card.opus_id = opus.id
join cardType on card.cardType_id = cardType.id;

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

SELECT * FROM card
ORDER BY RAND()
LIMIT 1;

select * from image;