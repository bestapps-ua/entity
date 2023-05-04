CREATE TABLE `main` (
                        `id` bigint(20) UNSIGNED NOT NULL,
                        `uid` varchar(255) NOT NULL,
                        `pid` bigint(20) UNSIGNED DEFAULT NULL,
                        `name` varchar(255) NOT NULL,
                        `data` json DEFAULT NULL,
                        `created` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `main`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `uid` (`uid`),
    ADD UNIQUE KEY `name` (`name`),
    ADD KEY `FK_4daf2f77864aea256bfdad97549aecdf` (`pid`);


ALTER TABLE `main`
    MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `main`
    ADD CONSTRAINT `FK_4daf2f77864aea256bfdad97549aecdf` FOREIGN KEY (`pid`) REFERENCES `main` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
