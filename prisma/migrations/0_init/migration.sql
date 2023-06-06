-- CreateTable
CREATE TABLE "business_organization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "business_organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "interview_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_application_id" UUID NOT NULL,
    "interviewer_id" UUID NOT NULL,
    "date_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_application" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_posting_id" UUID NOT NULL,
    "applicant_id" UUID NOT NULL,
    "status" VARCHAR(255) NOT NULL,

    CONSTRAINT "job_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_posting" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "business_organization_id" UUID NOT NULL,

    CONSTRAINT "job_posting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "file_path" VARCHAR(255) NOT NULL,
    "job_application_id" UUID NOT NULL,

    CONSTRAINT "resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "business_organization" ADD CONSTRAINT "business_organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interview"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interview" ADD CONSTRAINT "interview_interviewer_id_fkey" FOREIGN KEY ("interviewer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interview" ADD CONSTRAINT "interview_job_application_id_fkey" FOREIGN KEY ("job_application_id") REFERENCES "job_application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "job_application_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "job_application_job_posting_id_fkey" FOREIGN KEY ("job_posting_id") REFERENCES "job_posting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_posting" ADD CONSTRAINT "job_posting_business_organization_id_fkey" FOREIGN KEY ("business_organization_id") REFERENCES "business_organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resume" ADD CONSTRAINT "resume_job_application_id_fkey" FOREIGN KEY ("job_application_id") REFERENCES "job_application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

