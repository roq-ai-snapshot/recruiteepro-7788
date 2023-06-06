import { InterviewInterface } from 'interfaces/interview';
import { ResumeInterface } from 'interfaces/resume';
import { JobPostingInterface } from 'interfaces/job-posting';
import { UserInterface } from 'interfaces/user';

export interface JobApplicationInterface {
  id?: string;
  job_posting_id: string;
  applicant_id: string;
  status: string;
  interview?: InterviewInterface[];
  resume?: ResumeInterface[];
  job_posting?: JobPostingInterface;
  user?: UserInterface;
  _count?: {
    interview?: number;
    resume?: number;
  };
}
