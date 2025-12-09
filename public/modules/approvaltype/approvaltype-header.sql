-- approvaltype.sql


/* =============================================
 * CREATE TABLE core."approvaltype"
 * ============================================*/
create table core."approvaltype" (
	approvaltype_id int not null,
	constraint approvaltype_pk primary key (approvaltype_id)
);
comment on table core."approvaltype" is '';	


-- =============================================
-- FIELD: approvaltype_name text
-- =============================================
-- ADD approvaltype_name
alter table core."approvaltype" add approvaltype_name text  ;
comment on column core."approvaltype".approvaltype_name is '';

-- MODIFY approvaltype_name
alter table core."approvaltype"
	alter column approvaltype_name type text,
	ALTER COLUMN approvaltype_name DROP DEFAULT,
	ALTER COLUMN approvaltype_name DROP NOT NULL;
comment on column core."approvaltype".approvaltype_name is '';


-- =============================================
-- FIELD: approvaltype_descr text
-- =============================================
-- ADD approvaltype_descr
alter table core."approvaltype" add approvaltype_descr text  ;
comment on column core."approvaltype".approvaltype_descr is '';

-- MODIFY approvaltype_descr
alter table core."approvaltype"
	alter column approvaltype_descr type text,
	ALTER COLUMN approvaltype_descr DROP DEFAULT,
	ALTER COLUMN approvaltype_descr DROP NOT NULL;
comment on column core."approvaltype".approvaltype_descr is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."approvaltype" add _createby integer not null ;
comment on column core."approvaltype"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."approvaltype"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."approvaltype"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."approvaltype" add _createdate timestamp with time zone not null default now();
comment on column core."approvaltype"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."approvaltype"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."approvaltype"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."approvaltype" add _modifyby integer  ;
comment on column core."approvaltype"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."approvaltype"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."approvaltype"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."approvaltype" add _modifydate timestamp with time zone  ;
comment on column core."approvaltype"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."approvaltype"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."approvaltype"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."approvaltype"
	drop constraint uq$core$approvaltype$approvaltype_name;
	

-- Add unique index 
alter table  core."approvaltype"
	add constraint uq$core$approvaltype$approvaltype_name unique (approvaltype_name); 

