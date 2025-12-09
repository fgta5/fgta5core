-- approvaltype.sql


/* =============================================
 * CREATE TABLE core."approvaltyperole"
 * ============================================*/
create table core."approvaltyperole" (
	approvaltyperole_id bigint not null,
	constraint approvaltyperole_pk primary key (approvaltyperole_id)
);
comment on table core."approvaltyperole" is '';	


-- =============================================
-- FIELD: approvalsigntype_id smallint
-- =============================================
-- ADD approvalsigntype_id
alter table core."approvaltyperole" add approvalsigntype_id smallint  ;
comment on column core."approvaltyperole".approvalsigntype_id is '';

-- MODIFY approvalsigntype_id
alter table core."approvaltyperole"
	alter column approvalsigntype_id type smallint,
	ALTER COLUMN approvalsigntype_id DROP DEFAULT,
	ALTER COLUMN approvalsigntype_id DROP NOT NULL;
comment on column core."approvaltyperole".approvalsigntype_id is '';


-- =============================================
-- FIELD: approval_signtitle text
-- =============================================
-- ADD approval_signtitle
alter table core."approvaltyperole" add approval_signtitle text  ;
comment on column core."approvaltyperole".approval_signtitle is '';

-- MODIFY approval_signtitle
alter table core."approvaltyperole"
	alter column approval_signtitle type text,
	ALTER COLUMN approval_signtitle DROP DEFAULT,
	ALTER COLUMN approval_signtitle DROP NOT NULL;
comment on column core."approvaltyperole".approval_signtitle is '';


-- =============================================
-- FIELD: isfinalapproval boolean
-- =============================================
-- ADD isfinalapproval
alter table core."approvaltyperole" add isfinalapproval boolean not null default false;
comment on column core."approvaltyperole".isfinalapproval is '';

-- MODIFY isfinalapproval
alter table core."approvaltyperole"
	alter column isfinalapproval type boolean,
	ALTER COLUMN isfinalapproval SET DEFAULT false,
	ALTER COLUMN isfinalapproval SET NOT NULL;
comment on column core."approvaltyperole".isfinalapproval is '';


-- =============================================
-- FIELD: approvaltyperole_descr text
-- =============================================
-- ADD approvaltyperole_descr
alter table core."approvaltyperole" add approvaltyperole_descr text  ;
comment on column core."approvaltyperole".approvaltyperole_descr is '';

-- MODIFY approvaltyperole_descr
alter table core."approvaltyperole"
	alter column approvaltyperole_descr type text,
	ALTER COLUMN approvaltyperole_descr DROP DEFAULT,
	ALTER COLUMN approvaltyperole_descr DROP NOT NULL;
comment on column core."approvaltyperole".approvaltyperole_descr is '';


-- =============================================
-- FIELD: rolelevel_id smallint
-- =============================================
-- ADD rolelevel_id
alter table core."approvaltyperole" add rolelevel_id smallint  ;
comment on column core."approvaltyperole".rolelevel_id is '';

-- MODIFY rolelevel_id
alter table core."approvaltyperole"
	alter column rolelevel_id type smallint,
	ALTER COLUMN rolelevel_id DROP DEFAULT,
	ALTER COLUMN rolelevel_id DROP NOT NULL;
comment on column core."approvaltyperole".rolelevel_id is '';


-- =============================================
-- FIELD: role_id smallint
-- =============================================
-- ADD role_id
alter table core."approvaltyperole" add role_id smallint  ;
comment on column core."approvaltyperole".role_id is '';

-- MODIFY role_id
alter table core."approvaltyperole"
	alter column role_id type smallint,
	ALTER COLUMN role_id DROP DEFAULT,
	ALTER COLUMN role_id DROP NOT NULL;
comment on column core."approvaltyperole".role_id is '';


-- =============================================
-- FIELD: approvaltyperole_order smallint
-- =============================================
-- ADD approvaltyperole_order
alter table core."approvaltyperole" add approvaltyperole_order smallint not null default 0;
comment on column core."approvaltyperole".approvaltyperole_order is '';

-- MODIFY approvaltyperole_order
alter table core."approvaltyperole"
	alter column approvaltyperole_order type smallint,
	ALTER COLUMN approvaltyperole_order SET DEFAULT 0,
	ALTER COLUMN approvaltyperole_order SET NOT NULL;
comment on column core."approvaltyperole".approvaltyperole_order is '';


-- =============================================
-- FIELD: approvaltype_id int
-- =============================================
-- ADD approvaltype_id
alter table core."approvaltyperole" add approvaltype_id int  ;
comment on column core."approvaltyperole".approvaltype_id is '';

-- MODIFY approvaltype_id
alter table core."approvaltyperole"
	alter column approvaltype_id type int,
	ALTER COLUMN approvaltype_id DROP DEFAULT,
	ALTER COLUMN approvaltype_id DROP NOT NULL;
comment on column core."approvaltyperole".approvaltype_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."approvaltyperole" add _createby integer not null ;
comment on column core."approvaltyperole"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."approvaltyperole"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."approvaltyperole"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."approvaltyperole" add _createdate timestamp with time zone not null default now();
comment on column core."approvaltyperole"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."approvaltyperole"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."approvaltyperole"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."approvaltyperole" add _modifyby integer  ;
comment on column core."approvaltyperole"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."approvaltyperole"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."approvaltyperole"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."approvaltyperole" add _modifydate timestamp with time zone  ;
comment on column core."approvaltyperole"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."approvaltyperole"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."approvaltyperole"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE core."approvaltyperole" DROP CONSTRAINT fk$core$approvaltyperole$approvaltype_id;
ALTER TABLE core."approvaltyperole" DROP CONSTRAINT fk$core$approvaltyperole$role_id;
ALTER TABLE core."approvaltyperole" DROP CONSTRAINT fk$core$approvaltyperole$rolelevel_id;
ALTER TABLE core."approvaltyperole" DROP CONSTRAINT fk$core$approvaltyperole$approvalsigntype_id;


-- Add Foreign Key Constraint  
ALTER TABLE core."approvaltyperole"
	ADD CONSTRAINT fk$core$approvaltyperole$approvalsigntype_id
	FOREIGN KEY (approvalsigntype_id)
	REFERENCES core."approvalsigntype"(approvalsigntype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$approvaltyperole$approvalsigntype_id;
CREATE INDEX idx_fk$core$approvaltyperole$approvalsigntype_id ON core."approvaltyperole"(approvalsigntype_id);	


ALTER TABLE core."approvaltyperole"
	ADD CONSTRAINT fk$core$approvaltyperole$rolelevel_id
	FOREIGN KEY (rolelevel_id)
	REFERENCES core."rolelevel"(rolelevel_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$approvaltyperole$rolelevel_id;
CREATE INDEX idx_fk$core$approvaltyperole$rolelevel_id ON core."approvaltyperole"(rolelevel_id);	


ALTER TABLE core."approvaltyperole"
	ADD CONSTRAINT fk$core$approvaltyperole$role_id
	FOREIGN KEY (role_id)
	REFERENCES core."role"(role_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$approvaltyperole$role_id;
CREATE INDEX idx_fk$core$approvaltyperole$role_id ON core."approvaltyperole"(role_id);	


ALTER TABLE core."approvaltyperole"
	ADD CONSTRAINT fk$core$approvaltyperole$approvaltype_id
	FOREIGN KEY (approvaltype_id)
	REFERENCES core."approvaltype"(approvaltype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$approvaltyperole$approvaltype_id;
CREATE INDEX idx_fk$core$approvaltyperole$approvaltype_id ON core."approvaltyperole"(approvaltype_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================