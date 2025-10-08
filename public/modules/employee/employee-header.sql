-- employee.sql


/* =============================================
 * CREATE TABLE dev."employee"
 * ============================================*/
create table dev."employee" (
	employee_id varchar(30) not null,
	constraint employee_pk primary key (employee_id)
);
comment on table dev."employee" is '';	


-- =============================================
-- FIELD: employe_name varchar(30)
-- =============================================
-- ADD employe_name
alter table dev."employee" add employe_name varchar(30)  ;
comment on column dev."employee".employe_name is '';

-- MODIFY employe_name
alter table dev."employee"
	alter column employe_name type varchar(30),
	ALTER COLUMN employe_name DROP DEFAULT,
	ALTER COLUMN employe_name DROP NOT NULL;
comment on column dev."employee".employe_name is '';


-- =============================================
-- FIELD: birth_place varchar(30)
-- =============================================
-- ADD birth_place
alter table dev."employee" add birth_place varchar(30)  ;
comment on column dev."employee".birth_place is '';

-- MODIFY birth_place
alter table dev."employee"
	alter column birth_place type varchar(30),
	ALTER COLUMN birth_place DROP DEFAULT,
	ALTER COLUMN birth_place DROP NOT NULL;
comment on column dev."employee".birth_place is '';


-- =============================================
-- FIELD: birth_date date
-- =============================================
-- ADD birth_date
alter table dev."employee" add birth_date date  default now();
comment on column dev."employee".birth_date is '';

-- MODIFY birth_date
alter table dev."employee"
	alter column birth_date type date,
	ALTER COLUMN birth_date SET DEFAULT now(),
	ALTER COLUMN birth_date DROP NOT NULL;
comment on column dev."employee".birth_date is '';


-- =============================================
-- FIELD: joint_date date
-- =============================================
-- ADD joint_date
alter table dev."employee" add joint_date date  default now();
comment on column dev."employee".joint_date is '';

-- MODIFY joint_date
alter table dev."employee"
	alter column joint_date type date,
	ALTER COLUMN joint_date SET DEFAULT now(),
	ALTER COLUMN joint_date DROP NOT NULL;
comment on column dev."employee".joint_date is '';


-- =============================================
-- FIELD: _createby bigint
-- =============================================
-- ADD _createby
alter table dev."employee" add _createby bigint not null ;
comment on column dev."employee"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table dev."employee"
	alter column _createby type bigint,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column dev."employee"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table dev."employee" add _createdate timestamp with time zone not null ;
comment on column dev."employee"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table dev."employee"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate DROP DEFAULT,
	ALTER COLUMN _createdate SET NOT NULL;
comment on column dev."employee"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby bigint
-- =============================================
-- ADD _modifyby
alter table dev."employee" add _modifyby bigint  ;
comment on column dev."employee"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table dev."employee"
	alter column _modifyby type bigint,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column dev."employee"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table dev."employee" add _modifydate timestamp with time zone  ;
comment on column dev."employee"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table dev."employee"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column dev."employee"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================