UPDATE `users` SET `email` = NULL WHERE `email` = '';
UPDATE `users` SET `phone` = NULL WHERE `phone` = '';

ALTER TABLE `users` ADD UNIQUE INDEX `users_email_unique` (`email`);
ALTER TABLE `users` ADD UNIQUE INDEX `users_phone_unique` (`phone`);
