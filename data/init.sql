
CREATE TABLE `child` (
                         `id` bigint(20) UNSIGNED NOT NULL,
                         `main_id` bigint(11) UNSIGNED NOT NULL,
                         `name` varchar(255) NOT NULL,
                         `created` int(10) UNSIGNED NOT NULL,
                         `uid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `main` (
                        `id` bigint(20) UNSIGNED NOT NULL,
                        `uid` varchar(255) NOT NULL,
                        `pid` bigint(20) UNSIGNED DEFAULT NULL,
                        `special_id` bigint(20) UNSIGNED DEFAULT NULL,
                        `name` varchar(255) NOT NULL,
                        `data` json DEFAULT NULL,
                        `created` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `special` (
                           `id` bigint(20) UNSIGNED NOT NULL,
                           `guid` varchar(255) NOT NULL,
                           `name` varchar(255) NOT NULL,
                           `ct` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `child`
    ADD PRIMARY KEY (`id`),
    ADD KEY `FK_42bd11ea26d631d3ad8153141218a247` (`main_id`);

ALTER TABLE `main`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `uid` (`uid`),
    ADD UNIQUE KEY `name` (`name`),
    ADD KEY `FK_4daf2f77864aea256bfdad97549aecdf` (`pid`),
    ADD KEY `FK_b5568dd01455ed5c596c90d80d0071dc` (`special_id`);

ALTER TABLE `special`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `child`
    MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `main`
    MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2862;

ALTER TABLE `special`
    MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

ALTER TABLE `child`
    ADD CONSTRAINT `FK_42bd11ea26d631d3ad8153141218a247` FOREIGN KEY (`main_id`) REFERENCES `main` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE `main`
    ADD CONSTRAINT `FK_4daf2f77864aea256bfdad97549aecdf` FOREIGN KEY (`pid`) REFERENCES `main` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD CONSTRAINT `FK_b5568dd01455ed5c596c90d80d0071dc` FOREIGN KEY (`special_id`) REFERENCES `special` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE `main` ADD `some` VARCHAR(255) NULL DEFAULT NULL AFTER `name`;
