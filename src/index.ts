import { execute as executeUnknown } from './commands/[unknown]'
import { execute as executeHelp } from './commands/help'
import { args, clearArgs, clearFlags, command, flags } from './context'
import { string } from './strings'
import { tryResolveCommand } from './utils'

process.title = string('product.name')

let ignorable: string

try {
    const { name: cmdName, cmd } = tryResolveCommand(command)
    if (!cmd) throw (ignorable = 'Command not found')

    if ('h' in flags || 'help' in flags) {
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
    if (ignorable!) await executeUnknown()
    else throw e
}
