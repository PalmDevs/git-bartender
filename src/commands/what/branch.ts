import { logger } from '../../context'
import { string } from '../../strings'
import { getActiveBranch } from '../../utils/git'

export const execute = async () => {
    const branch = await getActiveBranch()
    if (!branch) return logger.error(string('generic.branch.noActiveBranch'))
    logger.info(string('command.what.branch.action', branch))
}

export const description = string('command.what.branch.description')
