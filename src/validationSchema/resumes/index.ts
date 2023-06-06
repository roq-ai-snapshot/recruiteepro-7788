import * as yup from 'yup';

export const resumeValidationSchema = yup.object().shape({
  file_path: yup.string().required(),
  job_application_id: yup.string().nullable().required(),
});
