-- approvalsigntype.sql


/* =============================================
 * CREATE TABLE core."approvalsigntype"
 * ============================================*/
create table core."approvalsigntype" (
	approvalsigntype_id smallint not null,
	constraint approvalsigntype_pk primary key (approvalsigntype_id)
);
comment on table core."approvalsigntype" is '';	


-- =============================================
-- FIELD: approvalsigntype_name text
-- =============================================
-- ADD approvalsigntype_name
alter table core."approvalsigntype" add approvalsigntype_name text  ;
comment on column core."approvalsigntype".approvalsigntype_name is '';

-- MODIFY approvalsigntype_name
alter table core."approvalsigntype"
	alter column approvalsigntype_name type text,
	ALTER COLUMN approvalsigntype_name DROP DEFAULT,
	ALTER COLUMN approvalsigntype_name DROP NOT NULL;
comment on column core."approvalsigntype".approvalsigntype_name is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."approvalsigntype" add _createby integer not null ;
comment on column core."approvalsigntype"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."approvalsigntype"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."approvalsigntype"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."approvalsigntype" add _createdate timestamp with time zone not null default now();
comment on column core."approvalsigntype"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."approvalsigntype"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."approvalsigntype"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."approvalsigntype" add _modifyby integer  ;
comment on column core."approvalsigntype"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."approvalsigntype"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."approvalsigntype"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."approvalsigntype" add _modifydate timestamp with time zone  ;
comment on column core."approvalsigntype"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."approvalsigntype"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."approvalsigntype"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  core."approvalsigntype"
	add constraint uq$core$approvalsigntype$approvalsigntype_name unique (approvalsigntype_name); 

