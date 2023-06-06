import { JobApplicationInterface } from 'interfaces/job-application';

export interface ResumeInterface {
  id?: string;
  file_path: string;
  job_application_id: string;

  job_application?: JobApplicationInterface;
  _count?: {};
}
