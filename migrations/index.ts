import * as migration_20261110_164951_initial from './20261110_164951_initial';
import * as migration_20261110_170000_rate_limit from './20261110_170000_rate_limit';

export const migrations = [
  {
    up: migration_20261110_164951_initial.up,
    down: migration_20261110_164951_initial.down,
    name: '20261110_164951_initial'
  },
  {
    up: migration_20261110_170000_rate_limit.up,
    down: migration_20261110_170000_rate_limit.down,
    name: '20261110_170000_rate_limit'
  },
];
