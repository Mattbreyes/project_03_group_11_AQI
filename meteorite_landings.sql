drop table if exists landing;
CREATE TABLE meteorite_landing (
	name varchar (100) NOT NULL,
	id int NOT NULL,
	nametype varchar (30) NOT NULL,
	recclass varchar (100) NOT NULL,
	mass_g double precision,
	fall varchar (10) NOT NULL,
	year int,
	reclat double precision,
	reclong double precision,
	GoeLocation varchar (100),
	primary key (id)
);

copy meteorite_landing from 
'/private/tmp/Meteorite_Landings.csv' 
csv header delimiter ',';

select * from meteorite_landing;