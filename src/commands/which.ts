import { execute as executeHelp } from './help'
import { string } from '../strings'
import { args, clearArgs, clearFlags, logger, setExitCode } from '../context'

import * as BranchCommand from './which/branch'

export const execute = async () => {
    setExitCode(1)

    const [subcommand] = args

    if (!subcommand) {
        logger.error(string('command.github.noSubcommand'))
        logger.newline()

        clearFlags()
        clearArgs()
        args.push('which')
        await executeHelp()

        return
    }

    logger.error(string('command.github.invalidSubcommand'))
}

export const description = string('command.which.description')

export const aliases = ['what']

export const subcommands = {
    branch: BranchCommand,
}
