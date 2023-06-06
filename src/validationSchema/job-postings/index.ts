import * as yup from 'yup';
import { jobApplicationValidationSchema } from 'validationSchema/job-applications';

export const jobPostingValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  business_organization_id: yup.string().nullable().required(),
  job_application: yup.array().of(jobApplicationValidationSchema),
});
