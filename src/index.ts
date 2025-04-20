import { execute as executeUnknown } from './commands/[unknown]'
import { execute as executeHelp } from './commands/help'
import { args, clearArgs, clearFlags, command, commands, flags, logger } from './context'
import { string } from './strings'
import { tryResolveCommand } from './utils'

async function gitBartender() {
    process.title = string('product.name')

    let ignorable: string

    logger.debug('All commands:', commands)

    try {
        logger.debug(`Command: ${command}, Args: ${JSON.stringify(args)}, Flags: ${JSON.stringify(flags)}`)

        const { name: cmdName, cmd } = tryResolveCommand(command)
        if (!cmd) throw (ignorable = 'Command not found')

        logger.debug(`Resolved command: ${cmdName}`)
        logger.debug('Command object:', cmd)

        const { execute, uninvokable, subcommands } = cmd!
        if (uninvokable) throw (ignorable = 'Command not invokable')

        const scmd = args[0]
        if (subcommands && scmd) {
            logger.debug(`User specified subcommand: ${scmd}`)

            const { name: scmdName, cmd: subcommand } = tryResolveCommand(`${cmdName}/${scmd}`)
            if (subcommand) {
                if (flags.help || flags.h) {
                    logger.debug('User requested subcommand help via flags')

                    clearArgs()
                    clearFlags()
                    args.push(scmdName)
                    await executeHelp()

                    return
                }

                logger.debug(`Invoking subcommand ${scmd} of ${cmdName}`)
                logger.debug('Subcommand object:', subcommand)

                args.shift()
                await subcommand.execute()

                return
            }
        }

        if (flags.help || flags.h) {
            logger.debug('User requested command help via flags')

            clearArgs()
            clearFlags()
            args.push(cmdName)
            await executeHelp()

            return
        }

        await execute()
    } catch (e) {
        logger.debug(`Caught error (ignorable = ${Boolean(ignorable!)}):`, e)
        if (ignorable!) await executeUnknown()
        else {
            logger.error(string('generic.error'))
            console.error(e)
        }
    }
}

await gitBartender()
