ALTER TABLE `users` ADD `accountType` enum('individual','law_firm','enterprise') NOT NULL DEFAULT 'individual';
--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionPlan` enum('individual','law_firm','enterprise') NOT NULL DEFAULT 'individual';
--> statement-breakpoint
ALTER TABLE `users` ADD `seatLimit` int NOT NULL DEFAULT 1;
