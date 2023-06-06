import * as yup from 'yup';
import { interviewValidationSchema } from 'validationSchema/interviews';
import { resumeValidationSchema } from 'validationSchema/resumes';

export const jobApplicationValidationSchema = yup.object().shape({
  status: yup.string().required(),
  job_posting_id: yup.string().nullable().required(),
  applicant_id: yup.string().nullable().required(),
  interview: yup.array().of(interviewValidationSchema),
  resume: yup.array().of(resumeValidationSchema),
});
