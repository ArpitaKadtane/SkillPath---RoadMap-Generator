-- Safely add missing columns (idempotent - checks existence first)

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='googleId') THEN
    ALTER TABLE "User" ADD COLUMN "googleId" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='avatar') THEN
    ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='password' AND is_nullable='NO') THEN
    ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");

-- Make Profile fields nullable if they were NOT NULL
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='careerGoal' AND is_nullable='NO') THEN
    ALTER TABLE "Profile" ALTER COLUMN "careerGoal" DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='studyHoursPerWeek' AND is_nullable='NO') THEN
    ALTER TABLE "Profile" ALTER COLUMN "studyHoursPerWeek" DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='targetCompletionDate' AND is_nullable='NO') THEN
    ALTER TABLE "Profile" ALTER COLUMN "targetCompletionDate" DROP NOT NULL;
  END IF;
END $$;

-- Add missing Profile columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='learningGoal') THEN
    ALTER TABLE "Profile" ADD COLUMN "learningGoal" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='learningStyle') THEN
    ALTER TABLE "Profile" ADD COLUMN "learningStyle" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='experienceLevel') THEN
    ALTER TABLE "Profile" ADD COLUMN "experienceLevel" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='occupation') THEN
    ALTER TABLE "Profile" ADD COLUMN "occupation" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='skills') THEN
    ALTER TABLE "Profile" ADD COLUMN "skills" TEXT[] NOT NULL DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='motivation') THEN
    ALTER TABLE "Profile" ADD COLUMN "motivation" TEXT;
  END IF;
END $$;

-- Add missing Roadmap columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Roadmap' AND column_name='learningPurpose') THEN
    ALTER TABLE "Roadmap" ADD COLUMN "learningPurpose" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Roadmap' AND column_name='preferredTech') THEN
    ALTER TABLE "Roadmap" ADD COLUMN "preferredTech" TEXT[] NOT NULL DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Roadmap' AND column_name='currentSkills') THEN
    ALTER TABLE "Roadmap" ADD COLUMN "currentSkills" TEXT[] NOT NULL DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Roadmap' AND column_name='desiredOutcome') THEN
    ALTER TABLE "Roadmap" ADD COLUMN "desiredOutcome" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Roadmap' AND column_name='roadmapStyle') THEN
    ALTER TABLE "Roadmap" ADD COLUMN "roadmapStyle" TEXT NOT NULL DEFAULT 'Balanced';
  END IF;
END $$;
