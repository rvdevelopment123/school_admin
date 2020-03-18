export const seedDatabase = true; // Seeds database with some demo data when the database is empty
export const staticPath = './../vuefull-images';
export const uploadDir = staticPath + '/images/';
export const userRoles: string[] = ['user', 'vendor', 'manager', 'admin']; // This should be in ascending order of authority. e.g. In this case guest will not have access to any other role, where as admin will have the role of guest+user+vendor+manager+admin // Used at auth.service.ts
export const levels: string[] = [
    'Pre-school',
    'Level 1',
    'Level 2',
    'Level 3',
    'Level 4',
    'Level 5',
    'Level 6',
    'Level 7',
    'Level 8',
    'Level 9',
    'Level 10',
    'Level 11',
    'Level 12',
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year'
  ];
export const pageSize: number = 40
