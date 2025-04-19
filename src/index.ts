import { execute as executeUnknown } from './commands/[unknown]'
import { execute as executeHelp } from './commands/help'
import { args, clearArgs, clearFlags, command, flags, logger } from './context'
import { string } from './strings'
import { tryResolveCommand } from './utils'

process.title = string('product.name')

let ignorable: string

try {
    logger.debug(`Command: ${command}, Args: ${JSON.stringify(args)}, Flags: ${JSON.stringify(flags)}`)

    const { name: cmdName, cmd } = tryResolveCommand(command)
    if (!cmd) throw (ignorable = 'Command not found')

    logger.debug(`Resolved command: ${cmdName}`)
    logger.debug('Command object:', cmd)

    if ('h' in flags || 'help' in flags) {
        logger.debug('User requested help via flags')

        clearArgs()
        clearFlags()
        args.push(cmdName)
        await executeHelp()
    } else {
        const { execute, uninvokable } = cmd!
        if (uninvokable) throw (ignorable = 'Command not invokable')

        await execute()
    }
} catch (e) {
    logger.debug(`Caught error (ignorable = ${Boolean(ignorable!)}):`, e)
    if (ignorable!) await executeUnknown()
    else {
        logger.error(string('generic.error'))
        console.error(e)
    }
}
