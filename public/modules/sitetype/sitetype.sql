-- sitetype.sql


/* =============================================
 * CREATE TABLE ent."sitetype"
 * ============================================*/
create table ent."sitetype" (
	sitetype_id varchar(6) not null,
	constraint sitetype_pk primary key (sitetype_id)
);
comment on table ent."sitetype" is 'daftar tipe site';	


-- =============================================
-- FIELD: sitetype_name text
-- =============================================
-- ADD sitetype_name
alter table ent."sitetype" add sitetype_name text  ;
comment on column ent."sitetype".sitetype_name is '';

-- MODIFY sitetype_name
alter table ent."sitetype"
	alter column sitetype_name type text,
	ALTER COLUMN sitetype_name DROP DEFAULT,
	ALTER COLUMN sitetype_name DROP NOT NULL;
comment on column ent."sitetype".sitetype_name is '';


-- =============================================
-- FIELD: sitetype_descr text
-- =============================================
-- ADD sitetype_descr
alter table ent."sitetype" add sitetype_descr text  ;
comment on column ent."sitetype".sitetype_descr is '';

-- MODIFY sitetype_descr
alter table ent."sitetype"
	alter column sitetype_descr type text,
	ALTER COLUMN sitetype_descr DROP DEFAULT,
	ALTER COLUMN sitetype_descr DROP NOT NULL;
comment on column ent."sitetype".sitetype_descr is '';


-- =============================================
-- FIELD: _createby bigint
-- =============================================
-- ADD _createby
alter table ent."sitetype" add _createby bigint not null ;
comment on column ent."sitetype"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table ent."sitetype"
	alter column _createby type bigint,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column ent."sitetype"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table ent."sitetype" add _createdate timestamp with time zone not null ;
comment on column ent."sitetype"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table ent."sitetype"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate DROP DEFAULT,
	ALTER COLUMN _createdate SET NOT NULL;
comment on column ent."sitetype"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby bigint
-- =============================================
-- ADD _modifyby
alter table ent."sitetype" add _modifyby bigint  ;
comment on column ent."sitetype"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table ent."sitetype"
	alter column _modifyby type bigint,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column ent."sitetype"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table ent."sitetype" add _modifydate timestamp with time zone  ;
comment on column ent."sitetype"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table ent."sitetype"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column ent."sitetype"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table ent."sitetype"
	drop constraint uq$ent$sitetype$sitetype_name;
	

-- Add unique index 
alter table  ent."sitetype"
	add constraint uq$ent$sitetype$sitetype_name unique (sitetype_name); 

