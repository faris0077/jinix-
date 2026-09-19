-- ============================================================================
-- Chavara Residence OS — Hostel Applicants (2026-27 admissions form)
-- Run this in the Supabase Dashboard -> SQL Editor -> New query -> Run,
-- BEFORE applicants_data.sql.
--
-- SECURITY POSTURE — DELIBERATELY DIFFERENT FROM schema.sql:
-- This table holds real applicant PII (names, parents' phone numbers, home
-- address, income, religion, caste, medical notes). Unlike every other table
-- in this project, it gets NO row-level-security policy at all. RLS is
-- enabled with zero policies, which is a default-deny: the app's public
-- anon key CANNOT read, insert, update, or delete a single row here, no
-- matter what code ships to the browser. The only way to view or manage
-- this data is the Supabase Dashboard (Table Editor / SQL Editor) or a
-- server-side call using the SECRET service_role key — never the anon key.
-- Do not add an anon/authenticated policy to this table without deliberately
-- deciding to expose real applicants' PII to anyone holding the public key.
-- ============================================================================

create table if not exists public.hostel_applicants (
  id                  text primary key,
  submitted_at        timestamptz,
  email               text,
  full_name           text not null,
  department          text,
  programme           text,
  aided_or_sf         text,
  whatsapp_number     text,
  email_alt           text,
  eca_sports          text,
  eca_arts            text,
  eca_other           text,
  father_name         text,
  father_occupation   text,
  father_mobile       text,
  mother_name         text,
  mother_occupation   text,
  mother_mobile       text,
  home_address        text,
  monthly_income      numeric,
  place_of_residence  text,
  distance_km         numeric,
  age                 numeric,
  date_of_birth       date,
  marital_status      text,
  religion            text,
  caste               text,
  diocese_parish      text,
  category            text,
  height_cm           numeric,
  weight_kg           numeric,
  local_guardian      text,
  previous_college    text,
  previous_ug_degree  text,
  ug_cgpa             numeric,
  ug_percentage       text,
  ug_passing_year     numeric,
  other_degrees       text,
  medical_notes       text,
  photo_url           text,
  declaration_agreed  boolean not null default false,
  -- Internal admissions workflow (not part of the form submission)
  admission_status    text not null default 'new' check (admission_status in ('new', 'reviewing', 'offered', 'admitted', 'rejected', 'waitlisted')),
  admin_notes         text,
  created_at          timestamptz not null default now()
);

create index if not exists idx_applicants_status on public.hostel_applicants (admission_status);
create index if not exists idx_applicants_email  on public.hostel_applicants (email);

alter table public.hostel_applicants enable row level security;
-- No policies created intentionally — see security note above.
