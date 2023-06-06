import { InterviewInterface } from 'interfaces/interview';
import { UserInterface } from 'interfaces/user';

export interface FeedbackInterface {
  id?: string;
  interview_id: string;
  user_id: string;
  comment: string;

  interview?: InterviewInterface;
  user?: UserInterface;
  _count?: {};
}
