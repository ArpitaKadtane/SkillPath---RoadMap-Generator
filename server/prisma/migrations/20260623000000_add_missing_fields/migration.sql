-- Add missing columns to User table
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");

-- Make password nullable for Google auth users
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- Make Profile fields optional
ALTER TABLE "Profile" ALTER COLUMN "careerGoal" DROP NOT NULL;
ALTER TABLE "Profile" ALTER COLUMN "studyHoursPerWeek" DROP NOT NULL;
ALTER TABLE "Profile" ALTER COLUMN "targetCompletionDate" DROP NOT NULL;

-- Add missing Profile columns
ALTER TABLE "Profile" ADD COLUMN "learningGoal" TEXT;
ALTER TABLE "Profile" ADD COLUMN "learningStyle" TEXT;
ALTER TABLE "Profile" ADD COLUMN "experienceLevel" TEXT;
ALTER TABLE "Profile" ADD COLUMN "occupation" TEXT;
ALTER TABLE "Profile" ADD COLUMN "skills" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Profile" ADD COLUMN "motivation" TEXT;

-- Add missing Roadmap columns
ALTER TABLE "Roadmap" ADD COLUMN "learningPurpose" TEXT;
ALTER TABLE "Roadmap" ADD COLUMN "preferredTech" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Roadmap" ADD COLUMN "currentSkills" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Roadmap" ADD COLUMN "desiredOutcome" TEXT;
ALTER TABLE "Roadmap" ADD COLUMN "roadmapStyle" TEXT NOT NULL DEFAULT 'Balanced';
