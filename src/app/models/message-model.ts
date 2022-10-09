export interface Message {
  message_id: number;
  internal_code: string;
  external_code: string;
  description: string;
  amount: string;
  currency: string;
  type: string;
  label: string;
  labeler_code: string;
  date_assigned: Date;
  labeling_start_date: Date;
  labeling_end_date: Date;
  skip_count: number;
  comment: string;
  is_labeled: boolean
}


