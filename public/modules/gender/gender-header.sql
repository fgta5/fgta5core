-- gender.sql


/* =============================================
 * CREATE TABLE core."gender"
 * ============================================*/
create table core."gender" (
	gender_id smallint not null,
	constraint gender_pk primary key (gender_id)
);
comment on table core."gender" is '';	


-- =============================================
-- FIELD: gender_name text
-- =============================================
-- ADD gender_name
alter table core."gender" add gender_name text  ;
comment on column core."gender".gender_name is '';

-- MODIFY gender_name
alter table core."gender"
	alter column gender_name type text,
	ALTER COLUMN gender_name DROP DEFAULT,
	ALTER COLUMN gender_name DROP NOT NULL;
comment on column core."gender".gender_name is '';


-- =============================================
-- FIELD: gender_isnature boolean
-- =============================================
-- ADD gender_isnature
alter table core."gender" add gender_isnature boolean not null default false;
comment on column core."gender".gender_isnature is '';

-- MODIFY gender_isnature
alter table core."gender"
	alter column gender_isnature type boolean,
	ALTER COLUMN gender_isnature SET DEFAULT false,
	ALTER COLUMN gender_isnature SET NOT NULL;
comment on column core."gender".gender_isnature is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."gender" add _createby integer not null ;
comment on column core."gender"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."gender"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."gender"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."gender" add _createdate timestamp with time zone not null default now();
comment on column core."gender"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."gender"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."gender"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."gender" add _modifyby integer  ;
comment on column core."gender"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."gender"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."gender"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."gender" add _modifydate timestamp with time zone  ;
comment on column core."gender"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."gender"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."gender"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  core."gender"
	add constraint uq$core$gender$gender_name unique (gender_name); 

