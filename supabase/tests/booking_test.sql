\set ON_ERROR_STOP 0
-- Use verified clinic hours for the test
update working_hours set open_time='09:30', close_time='18:30', is_closed=false where day_of_week between 0 and 5;
update working_hours set open_time='10:00', close_time='14:00', is_closed=false where day_of_week=6;
-- pick next Monday at least 3 days away
select (current_date + ((8 - extract(dow from current_date)::int) % 7) + 7) as d \gset
\echo test date :d
set role anon;
\echo == T1 slots on a weekday (expect 18 slots of 30 min, 9:30-18:30, remaining 2)
select count(*) as slots, min(start_time), max(end_time), min(remaining) from get_available_slots(:'d');
\echo == T2 book twice into 10:00, third must fail SLOT_UNAVAILABLE
select book_appointment(:'d','10:00','Braces consultation','Anna Smith','+61 412 345 678','anna@example.com','Australia','Australia/Sydney','First visit') ->> 'booking_ref' ~ '^KD-[2-9A-Z]{6}$' as ref_ok;
select book_appointment(:'d','10:00','Root canal','Ram Thapa','9801234567',null,'Nepal','Asia/Kathmandu',null) is not null as booked2;
select book_appointment(:'d','10:00','Cleaning','Third Person','9807654321',null,null,null,null);
\echo == T3 10:00 gone from list, 10:30 still there
select bool_or(start_time='10:00') as has_1000, bool_or(start_time='10:30') as has_1030 from get_available_slots(:'d');
\echo == T4 validation errors
select book_appointment(:'d','11:00','Cleaning','A','123',null,null,null,null);
select book_appointment(:'d','11:00','Cleaning','Valid Name','12',null,null,null,null);
select book_appointment(:'d','11:00','Cleaning','Valid Name','9800000000','not-an-email',null,null,null);
select book_appointment(:'d','11:15','Cleaning','Valid Name','9800000000',null,null,null,null);
\echo == T5 past and too-far dates give no slots
select count(*) as past from get_available_slots(current_date - 1);
select count(*) as far from get_available_slots(current_date + 400);
\echo == T6 pending limit per phone (limit 3; Anna has 1 -> 2 more ok, 4th fails)
select book_appointment(:'d','11:00','Braces','Anna Smith','+61-412-345-678',null,'Australia',null,null) is not null as p2;
select book_appointment(:'d','11:30','Braces','Anna Smith','61412345678',null,'Australia',null,null) is not null as p3;
select book_appointment(:'d','12:00','Braces','Anna Smith','+61 412 345 678',null,'Australia',null,null);
\echo == T7 anon cannot read private tables
select count(*) as anon_sees_appointments from appointments;
select count(*) as anon_sees_patients from patients;
reset role;
\echo == T8 data written correctly
select count(*) as patients, sum(is_international::int) as intl from patients;
select status, source, count(*) from appointments group by 1,2;
select form_type, priority, left(message,60) from leads order by created_at limit 1;
\echo == T9 blocked date and closed day
insert into blocked_dates values (:'d'::date + 1, 'Holiday');
update working_hours set is_closed = true where day_of_week = 3;
select count(*) as blocked from get_available_slots(:'d'::date + 1);
select count(*) as closed_wed from get_available_slots(:'d'::date + 2);
\echo == T10 cancelled appointment frees the place
update appointments set status='cancelled' where start_time='10:00' and patient_message='First visit';
select bool_or(start_time='10:00') as has_1000_again from get_available_slots(:'d');
\echo == T11 saturday 10-14
select count(*) as sat_slots from get_available_slots(:'d'::date + 5);
