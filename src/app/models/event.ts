import {Category} from './category';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: Category;
  complete: boolean;
  status: 'published' | 'draft';
}

export interface GroupedEvents {
  [date: string]: {
    events: Array<Event>;
    categories: Array<string>;
  };
}
