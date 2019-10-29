import {Category} from './category';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: Category;
  status: 'published' | 'draft';
}

export interface GroupedEvents {
  [date: string]: {
    events: Array<Event>;
    categories: Array<string>;
  };
}
