import { string } from '../../strings'
import { flags, logger } from '../../context'
import { getHeadCommit } from '../../utils/git'

export const execute = async () => {
    let commit = await getHeadCommit()
    if (!commit) return logger.error(string('command.what.commit.noCommit'))

    const lengthArg = flags.length ?? flags.l
    if (typeof lengthArg === 'boolean') return logger.error(string('command.what.commit.invalidLength'))

    const length = Number(lengthArg)
    if (Number.isNaN(lengthArg) || length < 1 || length > 40)
        return logger.error(string('command.what.commit.invalidLength'))

    if (lengthArg) commit = commit.slice(0, length)
    logger.info(string('command.what.commit.action', commit))
}

export const description = string('command.what.commit.description')

export const aliases = ['sha']
