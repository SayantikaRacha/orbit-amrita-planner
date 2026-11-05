-- Run in a Supabase/PostgreSQL project. All student-owned data has RLS enabled.
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);
create table program_templates (
  id uuid primary key default gen_random_uuid(), university text not null, program_name text not null,
  regulation text not null, source_url text, verification_status text not null default 'staged'
  check (verification_status in ('staged','verified','withdrawn')), published_at timestamptz
);
create table courses (
  id uuid primary key default gen_random_uuid(), template_id uuid not null references program_templates on delete cascade,
  code text not null, title text not null, semester int not null check (semester between 1 and 12),
  credits numeric(4,1) not null default 0, category text not null, evaluation_pattern text, pass_fail boolean not null default false,
  unique(template_id, code)
);
create table enrollments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles on delete cascade,
  template_id uuid not null references program_templates, created_at timestamptz not null default now(), unique(user_id, template_id)
);
create table academic_attempts (
  id uuid primary key default gen_random_uuid(), enrollment_id uuid not null references enrollments on delete cascade,
  course_id uuid not null references courses, grade text not null, confirmed boolean not null default false,
  source_document_id uuid, updated_at timestamptz not null default now(), unique(enrollment_id, course_id)
);
create table documents (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles on delete cascade,
  filename text not null, storage_key text, retain_original boolean not null default false,
  document_type text not null, status text not null default 'queued'
  check(status in ('queued','extracting','needs_review','confirmed','deleted')), created_at timestamptz not null default now()
);
alter table academic_attempts add constraint academic_attempt_source_fk foreign key(source_document_id) references documents on delete set null;
create table extraction_candidates (
  id uuid primary key default gen_random_uuid(), document_id uuid not null references documents on delete cascade,
  field_path text not null, candidate_value jsonb not null, confidence numeric(4,3) not null check(confidence between 0 and 1),
  source_page int, confirmed boolean not null default false, corrected_value jsonb
);
create table study_plans (
  id uuid primary key default gen_random_uuid(), enrollment_id uuid not null references enrollments on delete cascade,
  target_cgpa numeric(3,2) not null check(target_cgpa between 0 and 10), weekly_hours int not null check(weekly_hours between 1 and 80),
  allocations jsonb not null default '[]', updated_at timestamptz not null default now()
);
create table coach_messages (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles on delete cascade,
  role text not null check(role in ('user','assistant')), content text not null, created_at timestamptz not null default now()
);
alter table profiles enable row level security; alter table enrollments enable row level security; alter table academic_attempts enable row level security;
alter table documents enable row level security; alter table extraction_candidates enable row level security; alter table study_plans enable row level security; alter table coach_messages enable row level security;
create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own enrollment" on enrollments for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own attempts" on academic_attempts for all using (enrollment_id in (select id from enrollments where user_id = auth.uid())) with check (enrollment_id in (select id from enrollments where user_id = auth.uid()));
create policy "own documents" on documents for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own candidates" on extraction_candidates for all using (document_id in (select id from documents where user_id = auth.uid())) with check (document_id in (select id from documents where user_id = auth.uid()));
create policy "own plans" on study_plans for all using (enrollment_id in (select id from enrollments where user_id = auth.uid())) with check (enrollment_id in (select id from enrollments where user_id = auth.uid()));
create policy "own chats" on coach_messages for all using (user_id = auth.uid()) with check (user_id = auth.uid());

