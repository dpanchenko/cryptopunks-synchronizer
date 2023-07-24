import { v4 as uuidv4 } from 'uuid';

import { UUID } from '@domain/types';

export const generateUuid = (): UUID => uuidv4();
