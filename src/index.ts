import { execute as executeUnknown } from './commands/[unknown]'
import { execute as executeHelp } from './commands/help'
import { args, clearArgs, clearFlags, command, flags } from './context'
import { string } from './strings'
import { tryResolveCommand } from './utils'

process.title = string('product.name')

try {
    const { name: cmdName, cmd } = tryResolveCommand(command)
    if (!cmd) throw 'Command not found'

    if ('h' in flags || 'help' in flags) {
        clearArgs()
        clearFlags()
        args.push(cmdName)
        await executeHelp()
    } else {
        const { execute, uninvokable } = cmd!
        if (uninvokable) throw 'Command not invokable'

        await execute()
    }
} catch (e) {
    if (typeof e === 'string') await executeUnknown()
    else throw e
}
