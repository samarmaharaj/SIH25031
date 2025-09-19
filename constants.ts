
import { Status, Category, Department } from './types';

export const ALL_STATUSES: Status[] = [
  Status.Submitted,
  Status.Assigned,
  Status.InProgress,
  Status.Resolved,
  Status.Rejected,
];

export const ALL_CATEGORIES: Category[] = [
  Category.Pothole,
  Category.Graffiti,
  Category.StreetlightOut,
  Category.Trash,
  Category.TreeIssue,
  Category.Other,
];

export const ALL_DEPARTMENTS: Department[] = [
  Department.PublicWorks,
  Department.Transportation,
  Department.ParksAndRec,
  Department.Sanitation,
];
