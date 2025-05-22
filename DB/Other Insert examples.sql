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

insert into user (id, email, password) values (UUID_TO_BIN(UUID()), "ricardo@email.com", "123");
insert into `user` values (UUID_TO_BIN('b10b4e1f-39fa-4157-8079-97b1c4df643d'), 'lucia@correo.com', '$2b$10$Rj0ZphEF.vC0t8Z6Cal.PuUsSeqkk2BDvQ3AZoI/xT0ZAMVuOca6S') ;
-- update image set src = "image/card/c8b1a390-5b7a-42c2-9af5-37cace912168_FullArt_1.jpeg" where card_id = (UUID_TO_BIN('c8b1a390-5b7a-42c2-9af5-37cace912168'));



