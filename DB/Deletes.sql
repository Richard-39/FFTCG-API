delete from card_category;
delete from card_element;
delete from card_job;
delete from image;
delete from card;
delete from cardtype;
delete from category;
delete from element;
delete from imagetype;
delete from job;
delete from opus;
delete from rarity;


delete from card_category where card_id = UUID_TO_BIN('9b397470-775a-4b02-9e9d-e98944c90804');
delete from card_element where card_id = UUID_TO_BIN('9b397470-775a-4b02-9e9d-e98944c90804');
delete from card where id = UUID_TO_BIN('9b397470-775a-4b02-9e9d-e98944c90804');