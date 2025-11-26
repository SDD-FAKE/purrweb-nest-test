import { SetMetadata } from '@nestjs/common';
import { OwnershipOptions } from '../interfaces';

export const OWNERSHIP_KEY = 'ownership';

export const CheckOwnership = (options: OwnershipOptions) => SetMetadata(OWNERSHIP_KEY, options);