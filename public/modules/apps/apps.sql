-- apps.sql


/* =============================================
 * CREATE TABLE core."apps"
 * ============================================*/
create table core."apps" (
	apps_id varchar(30) not null,
	constraint apps_pk primary key (apps_id)
);
comment on table core."apps" is '';	


-- =============================================
-- FIELD: apps_isdisabled boolean
-- =============================================
-- ADD apps_isdisabled
alter table core."apps" add apps_isdisabled boolean not null default false;
comment on column core."apps".apps_isdisabled is '';

-- MODIFY apps_isdisabled
alter table core."apps"
	alter column apps_isdisabled type boolean,
	ALTER COLUMN apps_isdisabled SET DEFAULT false,
	ALTER COLUMN apps_isdisabled SET NOT NULL;
comment on column core."apps".apps_isdisabled is '';


-- =============================================
-- FIELD: apps_name text
-- =============================================
-- ADD apps_name
alter table core."apps" add apps_name text not null default '';
comment on column core."apps".apps_name is '';

-- MODIFY apps_name
alter table core."apps"
	alter column apps_name type text,
	ALTER COLUMN apps_name SET DEFAULT '',
	ALTER COLUMN apps_name SET NOT NULL;
comment on column core."apps".apps_name is '';


-- =============================================
-- FIELD: apps_descr text
-- =============================================
-- ADD apps_descr
alter table core."apps" add apps_descr text  ;
comment on column core."apps".apps_descr is '';

-- MODIFY apps_descr
alter table core."apps"
	alter column apps_descr type text,
	ALTER COLUMN apps_descr DROP DEFAULT,
	ALTER COLUMN apps_descr DROP NOT NULL;
comment on column core."apps".apps_descr is '';


-- =============================================
-- FIELD: apps_url text
-- =============================================
-- ADD apps_url
alter table core."apps" add apps_url text  ;
comment on column core."apps".apps_url is '';

-- MODIFY apps_url
alter table core."apps"
	alter column apps_url type text,
	ALTER COLUMN apps_url DROP DEFAULT,
	ALTER COLUMN apps_url DROP NOT NULL;
comment on column core."apps".apps_url is '';


-- =============================================
-- FIELD: apps_directory text
-- =============================================
-- ADD apps_directory
alter table core."apps" add apps_directory text  ;
comment on column core."apps".apps_directory is '';

-- MODIFY apps_directory
alter table core."apps"
	alter column apps_directory type text,
	ALTER COLUMN apps_directory DROP DEFAULT,
	ALTER COLUMN apps_directory DROP NOT NULL;
comment on column core."apps".apps_directory is '';


-- =============================================
-- FIELD: _createby bigint
-- =============================================
-- ADD _createby
alter table core."apps" add _createby bigint not null ;
comment on column core."apps"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."apps"
	alter column _createby type bigint,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."apps"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."apps" add _createdate timestamp with time zone not null ;
comment on column core."apps"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."apps"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate DROP DEFAULT,
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."apps"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby bigint
-- =============================================
-- ADD _modifyby
alter table core."apps" add _modifyby bigint  ;
comment on column core."apps"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."apps"
	alter column _modifyby type bigint,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."apps"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."apps" add _modifydate timestamp with time zone  ;
comment on column core."apps"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."apps"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."apps"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."apps"
	drop constraint uq$core$apps$apps_name;
	

-- Add unique index 
alter table  core."apps"
	add constraint uq$core$apps$apps_name unique (apps_name); 

