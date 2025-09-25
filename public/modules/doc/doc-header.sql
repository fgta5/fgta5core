-- doc.sql


/* =============================================
 * CREATE TABLE core."doc"
 * ============================================*/
create table core."doc" (
	doc_id varchar(4) not null,
	constraint doc_pk primary key (doc_id)
);
comment on table core."doc" is 'daftar document';	


-- =============================================
-- FIELD: doc_name text
-- =============================================
-- ADD doc_name
alter table core."doc" add doc_name text  ;
comment on column core."doc".doc_name is '';

-- MODIFY doc_name
alter table core."doc"
	alter column doc_name type text,
	ALTER COLUMN doc_name DROP DEFAULT,
	ALTER COLUMN doc_name DROP NOT NULL;
comment on column core."doc".doc_name is '';


-- =============================================
-- FIELD: doc_descr text
-- =============================================
-- ADD doc_descr
alter table core."doc" add doc_descr text  ;
comment on column core."doc".doc_descr is 'deskripsi dokumen';

-- MODIFY doc_descr
alter table core."doc"
	alter column doc_descr type text,
	ALTER COLUMN doc_descr DROP DEFAULT,
	ALTER COLUMN doc_descr DROP NOT NULL;
comment on column core."doc".doc_descr is 'deskripsi dokumen';


-- =============================================
-- FIELD: doc_seqnum int
-- =============================================
-- ADD doc_seqnum
alter table core."doc" add doc_seqnum int not null default 0;
comment on column core."doc".doc_seqnum is 'nilai dalam sequencer';

-- MODIFY doc_seqnum
alter table core."doc"
	alter column doc_seqnum type int,
	ALTER COLUMN doc_seqnum SET DEFAULT 0,
	ALTER COLUMN doc_seqnum SET NOT NULL;
comment on column core."doc".doc_seqnum is 'nilai dalam sequencer';


-- =============================================
-- FIELD: _createby bigint
-- =============================================
-- ADD _createby
alter table core."doc" add _createby bigint not null ;
comment on column core."doc"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."doc"
	alter column _createby type bigint,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."doc"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."doc" add _createdate timestamp with time zone not null ;
comment on column core."doc"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."doc"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate DROP DEFAULT,
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."doc"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby bigint
-- =============================================
-- ADD _modifyby
alter table core."doc" add _modifyby bigint  ;
comment on column core."doc"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."doc"
	alter column _modifyby type bigint,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."doc"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."doc" add _modifydate timestamp with time zone  ;
comment on column core."doc"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."doc"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."doc"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."doc"
	drop constraint uq$core$doc$doc_name;

alter table core."doc"
	drop constraint uq$core$doc$doc_seqnum;
	

-- Add unique index 
alter table  core."doc"
	add constraint uq$core$doc$doc_name unique (doc_name); 

alter table  core."doc"
	add constraint uq$core$doc$doc_seqnum unique (doc_seqnum); 

