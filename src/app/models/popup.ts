import { Event } from './event';
import {Category} from './category';

export interface PopupConfig {
  isOpen: boolean;
  event?: Event;
  category?: Category;
}
