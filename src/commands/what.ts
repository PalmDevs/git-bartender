import { args, clearArgs, clearFlags, logger, setExitCode } from '../context'
import { string } from '../strings'
import { execute as executeHelp } from './help'

import * as BranchCommand from './what/branch'

export const execute = async () => {
    setExitCode(1)

    const [subcommand] = args

    if (!subcommand) {
        logger.error(string('generic.command.noSubcommand'))
        logger.newline()

        clearFlags()
        clearArgs()
        args.push('what')
        await executeHelp()

        return
    }

    logger.error(string('generic.command.invalidSubcommand'))
}

export const description = string('command.what.description')

export const aliases = ['which']

export const subcommands = {
    branch: BranchCommand,
}
