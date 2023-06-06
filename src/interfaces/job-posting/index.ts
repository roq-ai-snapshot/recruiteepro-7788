import { JobApplicationInterface } from 'interfaces/job-application';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';

export interface JobPostingInterface {
  id?: string;
  title: string;
  description: string;
  business_organization_id: string;
  job_application?: JobApplicationInterface[];
  business_organization?: BusinessOrganizationInterface;
  _count?: {
    job_application?: number;
  };
}
