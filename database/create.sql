DROP TABLE Example;
DROP TABLE User;
DROP TABLE UserAndRows;

CREATE TABLE User (
	id int NOT NULL,
	username varchar(20),
	hash varchar(20),
	PRIMARY KEY (id)
);

CREATE TABLE Example (
	id int NOT NULL,
	title varchar(30),
	PRIMARY KEY (id)
);

CREATE TABLE UserAndRows (
	name varchar(20),
	row int,
	Foreign Key (name) References User(username),
	Foreign Key (row) References Example(id)
	PRIMARY Key (row, name)
);


INSERT INTO User VALUES (
	1,
	"admin",
	"$2b$10$exkwiP0IPneZdgdlHzLY/e6Xp7t1V.WEFgPHaIV.wPniKH1sPCTba"
);

INSERT INTO Example VALUES (
	1,
	"row title"
);

INSERT INTO Example VALUES (
	2,
	"row title 2"
);

INSERT INTO UserAndRows VALUES (
	"admin",
	1
);




