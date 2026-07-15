/**
 * Subject Factory & Registry
 * Quản lý tất cả các môn học - central access point
 */

import { Subject } from './subject-base';
import { MathSubject } from './math.subject';
import { PhysicsSubject } from './physics.subject';
import { ChemistrySubject } from './chemistry.subject';
import { LiteratureSubject } from './literature.subject';
import { ForeignLanguageSubject } from './foreign-language.subject';
import { HistorySubject } from './history.subject';
import { GeographySubject } from './geography.subject';
import { CivicEducationSubject } from './civic-education.subject';
import { BiologySubject } from './biology.subject';

export { Subject } from './subject-base';
export * from './subject.types';

// Singleton instances
export const SUBJECTS = {
  toan: new MathSubject(),
  vat_li: new PhysicsSubject(),
  hoa_hoc: new ChemistrySubject(),
  ngu_van: new LiteratureSubject(),
  ngoai_ngu: new ForeignLanguageSubject(),
  lich_su: new HistorySubject(),
  dia_li: new GeographySubject(),
  gdcd: new CivicEducationSubject(),
  sinh_hoc: new BiologySubject(),
} as const;

export type SubjectCode = keyof typeof SUBJECTS;

// Get all subjects as array
export const getAllSubjects = (): Subject[] => {
  return Object.values(SUBJECTS);
};

// Get subject by code
export const getSubject = (code: string): Subject | undefined => {
  return SUBJECTS[code as SubjectCode];
};

// Get subjects for group A (KHTN)
export const getGroupASubjects = (): Subject[] => {
  return [SUBJECTS.toan, SUBJECTS.vat_li, SUBJECTS.hoa_hoc];
};
