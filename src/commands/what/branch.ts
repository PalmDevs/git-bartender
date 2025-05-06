import { string } from '../../strings'
import { logger } from '../../context'
import { getActiveBranch } from '../../utils/git'

export const execute = async () => {
    const branch = await getActiveBranch()
    if (!branch) return logger.error(string('command.what.branch.noActiveBranch'))
    logger.info(string('command.what.branch.action', branch))
}

export const description = string('command.what.branch.description')
