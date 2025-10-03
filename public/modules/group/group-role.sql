-- group.sql


/* =============================================
 * CREATE TABLE core."grouprole"
 * ============================================*/
create table core."grouprole" (
	grouprole_id bigint not null,
	constraint grouprole_pk primary key (grouprole_id)
);
comment on table core."grouprole" is '';	


-- =============================================
-- FIELD: role_id int
-- =============================================
-- ADD role_id
alter table core."grouprole" add role_id int  ;
comment on column core."grouprole".role_id is '';

-- MODIFY role_id
alter table core."grouprole"
	alter column role_id type int,
	ALTER COLUMN role_id DROP DEFAULT,
	ALTER COLUMN role_id DROP NOT NULL;
comment on column core."grouprole".role_id is '';


-- =============================================
-- FIELD: grouprole_isdisabled boolean
-- =============================================
-- ADD grouprole_isdisabled
alter table core."grouprole" add grouprole_isdisabled boolean not null default false;
comment on column core."grouprole".grouprole_isdisabled is '';

-- MODIFY grouprole_isdisabled
alter table core."grouprole"
	alter column grouprole_isdisabled type boolean,
	ALTER COLUMN grouprole_isdisabled SET DEFAULT false,
	ALTER COLUMN grouprole_isdisabled SET NOT NULL;
comment on column core."grouprole".grouprole_isdisabled is '';


-- =============================================
-- FIELD: group_id int
-- =============================================
-- ADD group_id
alter table core."grouprole" add group_id int  ;
comment on column core."grouprole".group_id is '';

-- MODIFY group_id
alter table core."grouprole"
	alter column group_id type int,
	ALTER COLUMN group_id DROP DEFAULT,
	ALTER COLUMN group_id DROP NOT NULL;
comment on column core."grouprole".group_id is '';


-- =============================================
-- FIELD: _createby bigint
-- =============================================
-- ADD _createby
alter table core."grouprole" add _createby bigint not null ;
comment on column core."grouprole"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."grouprole"
	alter column _createby type bigint,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."grouprole"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."grouprole" add _createdate timestamp with time zone not null ;
comment on column core."grouprole"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."grouprole"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate DROP DEFAULT,
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."grouprole"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby bigint
-- =============================================
-- ADD _modifyby
alter table core."grouprole" add _modifyby bigint  ;
comment on column core."grouprole"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."grouprole"
	alter column _modifyby type bigint,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."grouprole"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."grouprole" add _modifydate timestamp with time zone  ;
comment on column core."grouprole"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."grouprole"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."grouprole"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE core."grouprole" DROP CONSTRAINT fk$core$grouprole$role_id;
ALTER TABLE core."grouprole" DROP CONSTRAINT fk$core$grouprole$group_id;


-- Add Foreign Key Constraint  
ALTER TABLE core."grouprole"
	ADD CONSTRAINT fk$core$grouprole$role_id
	FOREIGN KEY (role_id)
	REFERENCES core."role"(role_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$grouprole$role_id;
CREATE INDEX idx_fk$core$grouprole$role_id ON core."grouprole"(role_id);	


ALTER TABLE core."grouprole"
	ADD CONSTRAINT fk$core$grouprole$group_id
	FOREIGN KEY (group_id)
	REFERENCES core."group"(group_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$grouprole$group_id;
CREATE INDEX idx_fk$core$grouprole$group_id ON core."grouprole"(group_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."grouprole"
	drop constraint uq$core$grouprole$grouprole_pair;
	

-- Add unique index 
alter table  core."grouprole"
	add constraint uq$core$grouprole$grouprole_pair unique (group_id, grouprole_id); 

