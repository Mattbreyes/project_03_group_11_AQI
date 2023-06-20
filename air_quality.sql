-- Data Engineering
drop table if exists us_aqi;
drop table if exists ca_wildfires;

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

CREATE TABLE ca_wildfires (
	Acres_burned int,
	Active Boolean,
	AdminUnit varchar(300) NOT NULL,
	AirTankers int,
	ArchiveYear varchar(100),
	calFireIncident varchar(5) NOT NULL,
	CanonicaUrl varchar(500),
	ConditionStatement varchar(10000),
	ControlStatement varchar(1000),
	Counties varchar(50),
	CountyIds varchar(200),
	CrewsInvolved int, 
	Dozers int,
	Engines int,
	Extinguished date,
	Fatalities int,
	Featured varchar (8),
	Final varchar(5),
	FuelType varchar(50),
	Helicopters int,
	Injuries int,
	Latiitude double precision,
	Location varchar(200),
	Longitude double precision,
	MajorIncident boolean,
	Name varchar(200),
	PercentContained int,
	PersonnelInvolved int,
	Public varchar(5),
	SearchDescription varchar(1000),
	SearchKeywords varchar(1000),
	Started date,
	Status varchar(15),
	StructuresDamaged int,
	StructuresDestroyed int,
	StructuresEvacuated int,
	StructuresThreatened int,
	UniqueId varchar(200) NOT NULL,
	Updated date NOT NULL,
	WaterTenders int
);

-- Load the file

copy us_aqi from 
'C:\Users\matth\OneDrive\Desktop\Education\UCB\US_AQI.csv' 
csv header delimiter ',';
copy ca_wildfires from
'C:\Users\matth\OneDrive\Desktop\Education\UCB\California_Fire_Incidents.csv'
csv header delimiter ',';



select * from us_aqi limit 5;
select * from ca_wildfires limit 5;
