import { $ } from 'bun';
import { string } from '../../strings';
import { logger } from '../../context';

export const execute = async () => {
    const branch = await $`git rev-parse --abbrev-ref HEAD`.text();
    logger.info(string('command.what.branch.action', branch.trim()));
};

export const description = string('command.what.branch.description');