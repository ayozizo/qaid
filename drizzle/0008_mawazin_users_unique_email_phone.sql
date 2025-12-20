UPDATE `users` SET `email` = LOWER(TRIM(`email`)) WHERE `email` IS NOT NULL;
--> statement-breakpoint
UPDATE `users` SET `phone` = TRIM(`phone`) WHERE `phone` IS NOT NULL;
--> statement-breakpoint
UPDATE `users` SET `email` = NULL WHERE `email` = '';
--> statement-breakpoint
UPDATE `users` SET `phone` = NULL WHERE `phone` = '';
--> statement-breakpoint
UPDATE `users` u
JOIN (
  SELECT `email`, MIN(`id`) AS keep_id
  FROM `users`
  WHERE `email` IS NOT NULL
  GROUP BY `email`
  HAVING COUNT(*) > 1
) d ON u.`email` = d.`email`
SET u.`email` = NULL
WHERE u.`id` <> d.keep_id;
--> statement-breakpoint
UPDATE `users` u
JOIN (
  SELECT `phone`, MIN(`id`) AS keep_id
  FROM `users`
  WHERE `phone` IS NOT NULL
  GROUP BY `phone`
  HAVING COUNT(*) > 1
) d ON u.`phone` = d.`phone`
SET u.`phone` = NULL
WHERE u.`id` <> d.keep_id;
--> statement-breakpoint

ALTER TABLE `users`
  ADD UNIQUE INDEX `users_email_unique` (`email`),
  ADD UNIQUE INDEX `users_phone_unique` (`phone`);
