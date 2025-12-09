-- approval.sql


/* =============================================
 * CREATE TABLE core."approval"
 * ============================================*/
create table core."approval" (
	approval_id bigint not null,
	constraint approval_pk primary key (approval_id)
);
comment on table core."approval" is '';	


-- =============================================
-- FIELD: approval_document text
-- =============================================
-- ADD approval_document
alter table core."approval" add approval_document text  ;
comment on column core."approval".approval_document is 'dokumen object approval';

-- MODIFY approval_document
alter table core."approval"
	alter column approval_document type text,
	ALTER COLUMN approval_document DROP DEFAULT,
	ALTER COLUMN approval_document DROP NOT NULL;
comment on column core."approval".approval_document is 'dokumen object approval';


-- =============================================
-- FIELD: approvaltype_id int
-- =============================================
-- ADD approvaltype_id
alter table core."approval" add approvaltype_id int  ;
comment on column core."approval".approvaltype_id is '';

-- MODIFY approvaltype_id
alter table core."approval"
	alter column approvaltype_id type int,
	ALTER COLUMN approvaltype_id DROP DEFAULT,
	ALTER COLUMN approvaltype_id DROP NOT NULL;
comment on column core."approval".approvaltype_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."approval" add _createby integer not null ;
comment on column core."approval"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."approval"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."approval"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."approval" add _createdate timestamp with time zone not null default now();
comment on column core."approval"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."approval"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."approval"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."approval" add _modifyby integer  ;
comment on column core."approval"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."approval"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."approval"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."approval" add _modifydate timestamp with time zone  ;
comment on column core."approval"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."approval"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."approval"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE core."approval" DROP CONSTRAINT fk$core$approval$approvaltype_id;


-- Add Foreign Key Constraint  
ALTER TABLE core."approval"
	ADD CONSTRAINT fk$core$approval$approvaltype_id
	FOREIGN KEY (approvaltype_id)
	REFERENCES core."approvaltype"(approvaltype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$approval$approvaltype_id;
CREATE INDEX idx_fk$core$approval$approvaltype_id ON core."approval"(approvaltype_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================