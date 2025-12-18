-- rolelevel.sql


/* =============================================
 * CREATE TABLE core."rolelevel"
 * ============================================*/
create table core."rolelevel" (
	rolelevel_id smallint not null,
	constraint rolelevel_pk primary key (rolelevel_id)
);
comment on table core."rolelevel" is '';	


-- =============================================
-- FIELD: rolelevel_name text
-- =============================================
-- ADD rolelevel_name
alter table core."rolelevel" add rolelevel_name text  ;
comment on column core."rolelevel".rolelevel_name is '';

-- MODIFY rolelevel_name
alter table core."rolelevel"
	alter column rolelevel_name type text,
	ALTER COLUMN rolelevel_name DROP DEFAULT,
	ALTER COLUMN rolelevel_name DROP NOT NULL;
comment on column core."rolelevel".rolelevel_name is '';


-- =============================================
-- FIELD: rolelevel_descr text
-- =============================================
-- ADD rolelevel_descr
alter table core."rolelevel" add rolelevel_descr text  ;
comment on column core."rolelevel".rolelevel_descr is '';

-- MODIFY rolelevel_descr
alter table core."rolelevel"
	alter column rolelevel_descr type text,
	ALTER COLUMN rolelevel_descr DROP DEFAULT,
	ALTER COLUMN rolelevel_descr DROP NOT NULL;
comment on column core."rolelevel".rolelevel_descr is '';


-- =============================================
-- FIELD: rolelevel_order smallint
-- =============================================
-- ADD rolelevel_order
alter table core."rolelevel" add rolelevel_order smallint not null default 0;
comment on column core."rolelevel".rolelevel_order is '';

-- MODIFY rolelevel_order
alter table core."rolelevel"
	alter column rolelevel_order type smallint,
	ALTER COLUMN rolelevel_order SET DEFAULT 0,
	ALTER COLUMN rolelevel_order SET NOT NULL;
comment on column core."rolelevel".rolelevel_order is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."rolelevel" add _createby integer not null ;
comment on column core."rolelevel"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."rolelevel"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."rolelevel"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."rolelevel" add _createdate timestamp with time zone not null default now();
comment on column core."rolelevel"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."rolelevel"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."rolelevel"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."rolelevel" add _modifyby integer  ;
comment on column core."rolelevel"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."rolelevel"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."rolelevel"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."rolelevel" add _modifydate timestamp with time zone  ;
comment on column core."rolelevel"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."rolelevel"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."rolelevel"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."rolelevel"
	drop constraint uq$core$rolelevel$rolelevel_order;

alter table core."rolelevel"
	drop constraint uq$core$rolelevel$rolelevel_name;
	

-- Add unique index 
alter table  core."rolelevel"
	add constraint uq$core$rolelevel$rolelevel_name unique (rolelevel_name); 

alter table  core."rolelevel"
	add constraint uq$core$rolelevel$rolelevel_order unique (rolelevel_order); 

