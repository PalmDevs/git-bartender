import { execute as executeHelp } from './help'
import { string } from '../strings'
import { args, clearArgs, clearFlags, logger, setExitCode } from '../context'

import * as DeleteHistoryCommand from './delete/history'

export const execute = async () => {
    setExitCode(1)

    const [subcommand] = args

    if (!subcommand) {
        logger.error(string('generic.command.noSubcommand'))
        logger.newline()

        clearFlags()
        clearArgs()
        args.push('delete')
        await executeHelp()

        return
    }

    logger.error(string('generic.command.invalidSubcommand'))
}

export const description = string('command.delete.description')

export const aliases = ['del']

export const subcommands = {
    history: DeleteHistoryCommand,
}
