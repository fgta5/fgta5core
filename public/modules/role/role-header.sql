-- role.sql


/* =============================================
 * CREATE TABLE core."role"
 * ============================================*/
create table core."role" (
	role_id smallint not null,
	constraint role_pk primary key (role_id)
);
comment on table core."role" is '';	


-- =============================================
-- FIELD: role_name text
-- =============================================
-- ADD role_name
alter table core."role" add role_name text  ;
comment on column core."role".role_name is '';

-- MODIFY role_name
alter table core."role"
	alter column role_name type text,
	ALTER COLUMN role_name DROP DEFAULT,
	ALTER COLUMN role_name DROP NOT NULL;
comment on column core."role".role_name is '';


-- =============================================
-- FIELD: user_id int
-- =============================================
-- ADD user_id
alter table core."role" add user_id int  ;
comment on column core."role".user_id is '';

-- MODIFY user_id
alter table core."role"
	alter column user_id type int,
	ALTER COLUMN user_id DROP DEFAULT,
	ALTER COLUMN user_id DROP NOT NULL;
comment on column core."role".user_id is '';


-- =============================================
-- FIELD: role_descr text
-- =============================================
-- ADD role_descr
alter table core."role" add role_descr text  ;
comment on column core."role".role_descr is '';

-- MODIFY role_descr
alter table core."role"
	alter column role_descr type text,
	ALTER COLUMN role_descr DROP DEFAULT,
	ALTER COLUMN role_descr DROP NOT NULL;
comment on column core."role".role_descr is '';


-- =============================================
-- FIELD: rolelevel_id smallint
-- =============================================
-- ADD rolelevel_id
alter table core."role" add rolelevel_id smallint  ;
comment on column core."role".rolelevel_id is '';

-- MODIFY rolelevel_id
alter table core."role"
	alter column rolelevel_id type smallint,
	ALTER COLUMN rolelevel_id DROP DEFAULT,
	ALTER COLUMN rolelevel_id DROP NOT NULL;
comment on column core."role".rolelevel_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."role" add _createby integer not null ;
comment on column core."role"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."role"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."role"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."role" add _createdate timestamp with time zone not null default now();
comment on column core."role"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."role"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."role"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."role" add _modifyby integer  ;
comment on column core."role"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."role"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."role"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."role" add _modifydate timestamp with time zone  ;
comment on column core."role"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."role"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."role"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE core."role" DROP CONSTRAINT fk$core$role$rolelevel_id;
ALTER TABLE core."role" DROP CONSTRAINT fk$core$role$user_id;


-- Add Foreign Key Constraint  
ALTER TABLE core."role"
	ADD CONSTRAINT fk$core$role$user_id
	FOREIGN KEY (user_id)
	REFERENCES core."user"(user_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$role$user_id;
CREATE INDEX idx_fk$core$role$user_id ON core."role"(user_id);	


ALTER TABLE core."role"
	ADD CONSTRAINT fk$core$role$rolelevel_id
	FOREIGN KEY (rolelevel_id)
	REFERENCES core."rolelevel"(rolelevel_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$role$rolelevel_id;
CREATE INDEX idx_fk$core$role$rolelevel_id ON core."role"(rolelevel_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."role"
	drop constraint uq$core$role$role_name;
	

-- Add unique index 
alter table  core."role"
	add constraint uq$core$role$role_name unique (role_name); 

