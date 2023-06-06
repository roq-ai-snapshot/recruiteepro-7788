import * as yup from 'yup';
import { jobPostingValidationSchema } from 'validationSchema/job-postings';

export const businessOrganizationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  job_posting: yup.array().of(jobPostingValidationSchema),
});
