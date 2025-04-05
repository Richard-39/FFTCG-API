delete from card_category;
delete from card_element;
delete from card_job;
delete from image;
delete from card;
delete from card_type;
delete from category;
delete from element;
delete from image_type;
delete from job;
delete from opus;
delete from rarity;

delete from card_category where card_id = UUID_TO_BIN('0da6efe7-56f3-4ed4-aebf-d4460f3a57f5');
delete from card_element where card_id = UUID_TO_BIN('0da6efe7-56f3-4ed4-aebf-d4460f3a57f5');
delete from card_job where card_id = UUID_TO_BIN('0da6efe7-56f3-4ed4-aebf-d4460f3a57f5');
delete from image where card_id = UUID_TO_BIN('0da6efe7-56f3-4ed4-aebf-d4460f3a57f5');
delete from card where id = UUID_TO_BIN('d02e0442-4c2d-463f-8f88-fd5e3718c99b');