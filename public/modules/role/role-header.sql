-- role.sql


/* =============================================
 * CREATE TABLE core."role"
 * ============================================*/
create table core."role" (
	role_id int not null,
	constraint role_pk primary key (role_id)
);
comment on table core."role" is 'daftar role';	


-- =============================================
-- FIELD: role_name text
-- =============================================
-- ADD role_name
alter table core."role" add role_name text  ;
comment on column core."role".role_name is '';

-- MODIFY role_name
alter table core."role"
	alter column role_name type text,
	ALTER COLUMN role_name DROP DEFAULT,
	ALTER COLUMN role_name DROP NOT NULL;
comment on column core."role".role_name is '';


-- =============================================
-- FIELD: role_descr text
-- =============================================
-- ADD role_descr
alter table core."role" add role_descr text  ;
comment on column core."role".role_descr is '';

-- MODIFY role_descr
alter table core."role"
	alter column role_descr type text,
	ALTER COLUMN role_descr DROP DEFAULT,
	ALTER COLUMN role_descr DROP NOT NULL;
comment on column core."role".role_descr is '';


-- =============================================
-- FIELD: _createby bigint
-- =============================================
-- ADD _createby
alter table core."role" add _createby bigint not null ;
comment on column core."role"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."role"
	alter column _createby type bigint,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."role"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."role" add _createdate timestamp with time zone not null ;
comment on column core."role"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."role"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate DROP DEFAULT,
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."role"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby bigint
-- =============================================
-- ADD _modifyby
alter table core."role" add _modifyby bigint  ;
comment on column core."role"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."role"
	alter column _modifyby type bigint,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."role"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."role" add _modifydate timestamp with time zone  ;
comment on column core."role"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."role"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."role"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."role"
	drop constraint uq$core$role$role_name;
	

-- Add unique index 
alter table  core."role"
	add constraint uq$core$role$role_name unique (role_name); 

