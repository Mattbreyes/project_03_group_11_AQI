-- Data Engineering
drop table if exists us_aqi;

CREATE TABLE us_aqi (
	id int NOT NULL,
	CBSA_Code int NOT NULL,
	Date date NOT NULL,
	AQI int NOT NULL,
	Category varchar (100) NOT NULL,
	Defining_Parameter varchar(50) NOT NULL,
	Number_of_Sites_Reporting int NOT NULL,
	city_ascii varchar(25) NOT NULL,
	state_id varchar(2) NOT NULL,
	state_name varchar(25) NOT NULL,
	lat double precision NOT NULL,
	lng double precision NOT NULL,
	population double precision NOT NULL,
	density double precision NOT NULL,
	timezone varchar(100),
	primary key (id)

);


select * from us_aqi limit 5;
