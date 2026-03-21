-- Workout App Schema

CREATE TABLE workout_templates (
  id text PRIMARY KEY,
  name text NOT NULL,
  exercises jsonb NOT NULL DEFAULT '[]',
  estimated_minutes integer NOT NULL DEFAULT 30,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE scheduled_workouts (
  id text PRIMARY KEY,
  template_id text NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  status text NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'in_progress', 'completed', 'skipped')),
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE workout_sessions (
  id text PRIMARY KEY,
  template_id text NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  scheduled_workout_id text NOT NULL REFERENCES scheduled_workouts(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL,
  completed_at timestamptz,
  current_exercise_index integer NOT NULL DEFAULT 0,
  exercises jsonb NOT NULL DEFAULT '[]',
  overall_feeling text CHECK (overall_feeling IN ('easy', 'good', 'hard')),
  notes text
);

ALTER TABLE scheduled_workouts
  ADD CONSTRAINT fk_session
  FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE SET NULL;

-- RLS: enabled but open for v0 (no auth)
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON workout_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON scheduled_workouts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON workout_sessions FOR ALL USING (true) WITH CHECK (true);

-- Seed data
INSERT INTO workout_templates (id, name, estimated_minutes, exercises) VALUES
  ('tmpl-upper', 'Upper Body Strength', 35, '[{"id":"ex-warmup-upper","name":"Treadmill Walk (Warmup)","sets":1,"reps":"5 min","defaultWeight":0,"equipmentLabel":"No equipment","formCues":["Start at a comfortable pace","Swing your arms naturally"]},{"id":"ex-db-press","name":"Dumbbell Chest Press","sets":3,"reps":10,"defaultWeight":15,"equipmentLabel":"Two 15 lb dumbbells","formCues":["Keep your back flat on the bench","Lower the dumbbells to chest level, then press up","Exhale as you push up"],"commonMistakes":["Arching the lower back off the bench","Flaring elbows too wide"]},{"id":"ex-seated-row","name":"Seated Cable Row","sets":3,"reps":12,"defaultWeight":40,"equipmentLabel":"Cable machine at 40 lb","formCues":["Sit tall with feet on the platform","Pull the handle to your stomach, squeezing your shoulder blades","Control the return slowly"],"commonMistakes":["Leaning too far back","Using momentum instead of muscles"]},{"id":"ex-shoulder-press","name":"Dumbbell Shoulder Press","sets":3,"reps":10,"defaultWeight":10,"equipmentLabel":"Two 10 lb dumbbells","formCues":["Start with dumbbells at shoulder height","Press straight up overhead","Keep your core tight throughout"]},{"id":"ex-bicep-curl","name":"Dumbbell Bicep Curl","sets":3,"reps":12,"defaultWeight":10,"equipmentLabel":"Two 10 lb dumbbells","formCues":["Keep your elbows close to your sides","Curl up slowly, squeeze at the top","Lower with control — don''t swing"]}]'),
  ('tmpl-lower', 'Lower Body Strength', 40, '[{"id":"ex-warmup-lower","name":"Stationary Bike (Warmup)","sets":1,"reps":"5 min","defaultWeight":0,"equipmentLabel":"No equipment","formCues":["Keep a steady, comfortable pace","Adjust the seat so your knees don''t lock"]},{"id":"ex-goblet-squat","name":"Goblet Squat","sets":3,"reps":10,"defaultWeight":20,"equipmentLabel":"One 20 lb dumbbell","formCues":["Hold the dumbbell at your chest with both hands","Push your hips back and lower as if sitting in a chair","Drive through your heels to stand up"],"commonMistakes":["Knees caving inward","Rounding the lower back"]},{"id":"ex-leg-press","name":"Leg Press","sets":3,"reps":12,"defaultWeight":90,"equipmentLabel":"Leg press machine at 90 lb","formCues":["Place feet shoulder-width apart on the platform","Lower the weight until knees are at 90 degrees","Press through your heels to extend"]},{"id":"ex-leg-curl","name":"Seated Leg Curl","sets":3,"reps":12,"defaultWeight":30,"equipmentLabel":"Leg curl machine at 30 lb","formCues":["Adjust the pad to sit just above your ankles","Curl your legs down slowly","Squeeze at the bottom, then return with control"]},{"id":"ex-calf-raise","name":"Standing Calf Raise","sets":3,"reps":15,"defaultWeight":0,"equipmentLabel":"Bodyweight","formCues":["Stand on the edge of a step with heels hanging off","Rise up on your toes as high as you can","Lower slowly below the step level for a full stretch"]}]'),
  ('tmpl-full', 'Full Body Strength', 45, '[{"id":"ex-warmup-full","name":"Treadmill Walk (Warmup)","sets":1,"reps":"5 min","defaultWeight":0,"equipmentLabel":"No equipment","formCues":["Start at a comfortable pace","Swing your arms naturally"]},{"id":"ex-db-squat","name":"Dumbbell Squat","sets":3,"reps":10,"defaultWeight":20,"equipmentLabel":"Two 20 lb dumbbells","formCues":["Keep a neutral spine by looking forward and bracing your core","Drive through your heels as you stand up"],"commonMistakes":["Letting knees track over toes too far","Rounding the back at the bottom"]},{"id":"ex-db-row","name":"Dumbbell Row","sets":3,"reps":10,"defaultWeight":15,"equipmentLabel":"One 15 lb dumbbell","formCues":["Place one knee and hand on the bench for support","Pull the dumbbell to your hip, elbow close to your body","Lower with control"]},{"id":"ex-plank","name":"Weighted Plank","sets":3,"reps":"45s","defaultWeight":0,"equipmentLabel":"Bodyweight (add plate on back if comfortable)","formCues":["Keep your body in a straight line from head to heels","Don''t let your hips sag or pike up","Breathe steadily throughout"]},{"id":"ex-lat-pulldown","name":"Lat Pulldown","sets":3,"reps":12,"defaultWeight":40,"equipmentLabel":"Lat pulldown machine at 40 lb","formCues":["Grip the bar slightly wider than shoulder-width","Pull the bar to your upper chest, squeezing your lats","Return slowly — don''t let the weight stack slam"]},{"id":"ex-db-lunge","name":"Dumbbell Walking Lunge","sets":3,"reps":"8 each leg","defaultWeight":10,"equipmentLabel":"Two 10 lb dumbbells","formCues":["Take a big step forward and lower your back knee toward the floor","Keep your front knee behind your toes","Push off your front foot to step into the next lunge"]}]');
