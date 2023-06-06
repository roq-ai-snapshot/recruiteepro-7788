import { JobPostingInterface } from 'interfaces/job-posting';
import { UserInterface } from 'interfaces/user';

export interface BusinessOrganizationInterface {
  id?: string;
  name: string;
  user_id: string;
  job_posting?: JobPostingInterface[];
  user?: UserInterface;
  _count?: {
    job_posting?: number;
  };
}
