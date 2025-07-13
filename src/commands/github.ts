import { execute as executeHelp } from './help'
import { string } from '../strings'
import { args, clearArgs, clearFlags, logger, setExitCode } from '../context'

import * as ActionsCommand from './github/actions'
import * as PullRequestCommand from './github/pull-request'
import * as RepositoryCommand from './github/repository'

export const execute = async () => {
    setExitCode(1)

    const [subcommand] = args

    if (!subcommand) {
        logger.error(string('generic.command.noSubcommand'))
        logger.newline()

        clearFlags()
        clearArgs()
        args.push('github')
        await executeHelp()

        return
    }

    logger.error(string('generic.command.invalidSubcommand'))
}

export const description = string('command.github.description')

export const aliases = ['gh']

export const subcommands = {
    actions: ActionsCommand,
    repository: RepositoryCommand,
    'pull-request': PullRequestCommand,
}
