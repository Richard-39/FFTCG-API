SELECT * FROM card
ORDER BY RAND()
LIMIT 1;

select * from image;

select BIN_TO_UUID(card_element.card_id), card.code as 'code', element.name as 'element' from card_element
join card on card_element.card_id = card.id
join element on card_element.element_id = element.id
;

select BIN_TO_UUID(card_job.card_id), card.code as 'code', job.name as 'job' from card_job
join card on card_job.card_id = card.id
join job on card_job.job_id = job.id
;

select BIN_TO_UUID(card_category.card_id), card.code as 'code', category.name as 'category' from card_category
join card on card_category.card_id = card.id
join category on card_category.category_id = category.id
;