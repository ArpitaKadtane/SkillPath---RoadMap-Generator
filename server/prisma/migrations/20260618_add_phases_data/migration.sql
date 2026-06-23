-- AddColumn summary, estimatedDuration, and phasesData to Roadmap
ALTER TABLE "Roadmap" ADD COLUMN "summary" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Roadmap" ADD COLUMN "estimatedDuration" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Roadmap" ADD COLUMN "phasesData" JSONB NOT NULL DEFAULT '[]';
