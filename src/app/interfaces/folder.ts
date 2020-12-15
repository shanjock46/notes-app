import {Note} from './note';

export interface Folder {
  id?: string;
  name?: string;
  selected?: boolean;
  notes?: Note[];
}
