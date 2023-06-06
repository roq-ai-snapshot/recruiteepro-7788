import * as yup from 'yup';
import { feedbackValidationSchema } from 'validationSchema/feedbacks';

export const interviewValidationSchema = yup.object().shape({
  date_time: yup.date().required(),
  job_application_id: yup.string().nullable().required(),
  interviewer_id: yup.string().nullable().required(),
  feedback: yup.array().of(feedbackValidationSchema),
});
