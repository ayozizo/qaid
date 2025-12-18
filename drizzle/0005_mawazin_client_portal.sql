ALTER TABLE `clients` ADD `portalToken` varchar(64);
--> statement-breakpoint
ALTER TABLE `clients` ADD `portalEnabled` boolean NOT NULL DEFAULT FALSE;
--> statement-breakpoint
ALTER TABLE `documents` ADD `isSharedWithClient` boolean NOT NULL DEFAULT FALSE;
