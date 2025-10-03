-- program.sql


/* =============================================
 * CREATE TABLE core."program"
 * ============================================*/
create table core."program" (
	program_id int not null,
	constraint program_pk primary key (program_id)
);
comment on table core."program" is 'daftar program';	


-- =============================================
-- FIELD: program_title text
-- =============================================
-- ADD program_title
alter table core."program" add program_title text  ;
comment on column core."program".program_title is '';

-- MODIFY program_title
alter table core."program"
	alter column program_title type text,
	ALTER COLUMN program_title DROP DEFAULT,
	ALTER COLUMN program_title DROP NOT NULL;
comment on column core."program".program_title is '';


-- =============================================
-- FIELD: apps_id varchar(30)
-- =============================================
-- ADD apps_id
alter table core."program" add apps_id varchar(30)  ;
comment on column core."program".apps_id is '';

-- MODIFY apps_id
alter table core."program"
	alter column apps_id type varchar(30),
	ALTER COLUMN apps_id DROP DEFAULT,
	ALTER COLUMN apps_id DROP NOT NULL;
comment on column core."program".apps_id is '';


-- =============================================
-- FIELD: program_name text
-- =============================================
-- ADD program_name
alter table core."program" add program_name text  ;
comment on column core."program".program_name is '';

-- MODIFY program_name
alter table core."program"
	alter column program_name type text,
	ALTER COLUMN program_name DROP DEFAULT,
	ALTER COLUMN program_name DROP NOT NULL;
comment on column core."program".program_name is '';


-- =============================================
-- FIELD: program_variance text
-- =============================================
-- ADD program_variance
alter table core."program" add program_variance text  ;
comment on column core."program".program_variance is '';

-- MODIFY program_variance
alter table core."program"
	alter column program_variance type text,
	ALTER COLUMN program_variance DROP DEFAULT,
	ALTER COLUMN program_variance DROP NOT NULL;
comment on column core."program".program_variance is '';


-- =============================================
-- FIELD: programgroup_id int
-- =============================================
-- ADD programgroup_id
alter table core."program" add programgroup_id int  ;
comment on column core."program".programgroup_id is '';

-- MODIFY programgroup_id
alter table core."program"
	alter column programgroup_id type int,
	ALTER COLUMN programgroup_id DROP DEFAULT,
	ALTER COLUMN programgroup_id DROP NOT NULL;
comment on column core."program".programgroup_id is '';


-- =============================================
-- FIELD: program_descr text
-- =============================================
-- ADD program_descr
alter table core."program" add program_descr text  ;
comment on column core."program".program_descr is '';

-- MODIFY program_descr
alter table core."program"
	alter column program_descr type text,
	ALTER COLUMN program_descr DROP DEFAULT,
	ALTER COLUMN program_descr DROP NOT NULL;
comment on column core."program".program_descr is '';


-- =============================================
-- FIELD: program_icon text
-- =============================================
-- ADD program_icon
alter table core."program" add program_icon text  ;
comment on column core."program".program_icon is '';

-- MODIFY program_icon
alter table core."program"
	alter column program_icon type text,
	ALTER COLUMN program_icon DROP DEFAULT,
	ALTER COLUMN program_icon DROP NOT NULL;
comment on column core."program".program_icon is '';


-- =============================================
-- FIELD: program_isdisabled boolean
-- =============================================
-- ADD program_isdisabled
alter table core."program" add program_isdisabled boolean not null default false;
comment on column core."program".program_isdisabled is '';

-- MODIFY program_isdisabled
alter table core."program"
	alter column program_isdisabled type boolean,
	ALTER COLUMN program_isdisabled SET DEFAULT false,
	ALTER COLUMN program_isdisabled SET NOT NULL;
comment on column core."program".program_isdisabled is '';


-- =============================================
-- FIELD: generator_id int
-- =============================================
-- ADD generator_id
alter table core."program" add generator_id int  ;
comment on column core."program".generator_id is '';

-- MODIFY generator_id
alter table core."program"
	alter column generator_id type int,
	ALTER COLUMN generator_id DROP DEFAULT,
	ALTER COLUMN generator_id DROP NOT NULL;
comment on column core."program".generator_id is '';


-- =============================================
-- FIELD: _createby bigint
-- =============================================
-- ADD _createby
alter table core."program" add _createby bigint not null ;
comment on column core."program"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."program"
	alter column _createby type bigint,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."program"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."program" add _createdate timestamp with time zone not null ;
comment on column core."program"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."program"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate DROP DEFAULT,
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."program"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby bigint
-- =============================================
-- ADD _modifyby
alter table core."program" add _modifyby bigint  ;
comment on column core."program"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."program"
	alter column _modifyby type bigint,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."program"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."program" add _modifydate timestamp with time zone  ;
comment on column core."program"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."program"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."program"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE core."program" DROP CONSTRAINT fk$core$program$apps_id;
ALTER TABLE core."program" DROP CONSTRAINT fk$core$program$programgroup_id;
ALTER TABLE core."program" DROP CONSTRAINT fk$core$program$generator_id;


-- Add Foreign Key Constraint  
ALTER TABLE core."program"
	ADD CONSTRAINT fk$core$program$apps_id
	FOREIGN KEY (apps_id)
	REFERENCES core."apps"(apps_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$program$apps_id;
CREATE INDEX idx_fk$core$program$apps_id ON core."program"(apps_id);	


ALTER TABLE core."program"
	ADD CONSTRAINT fk$core$program$programgroup_id
	FOREIGN KEY (programgroup_id)
	REFERENCES core."programgroup"(programgroup_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$program$programgroup_id;
CREATE INDEX idx_fk$core$program$programgroup_id ON core."program"(programgroup_id);	


ALTER TABLE core."program"
	ADD CONSTRAINT fk$core$program$generator_id
	FOREIGN KEY (generator_id)
	REFERENCES core."generator"(generator_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$program$generator_id;
CREATE INDEX idx_fk$core$program$generator_id ON core."program"(generator_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."program"
	drop constraint uq$core$program$program_name;
	

-- Add unique index 
alter table  core."program"
	add constraint uq$core$program$program_name unique (program_name, program_variance); 

