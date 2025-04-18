import { closest, distance } from 'fastest-levenshtein'
import { execute as executeUnknown } from './commands/[unknown]'
import { command, commands, inverseCommandAliases } from './context'
import { string } from './strings'
import { yesNoPrompt } from './utils'

process.title = string('product.name')

try {
    let cmd = commands[command]
    if (!cmd) {
        const match = closest(
            command,
            Object.keys(commands).filter(c => !commands[c]!.hidden && !commands[c]!.uninvokable),
        )

        if (distance(command, match) <= 2) {
            if (yesNoPrompt(string('generic.command.correctionConfirmation', inverseCommandAliases[match] ?? match)))
                cmd = commands[match]
            console.log('')
        }
    }

    if (!cmd) throw 'Command not found'

    const { execute, uninvokable } = cmd!
    if (uninvokable) throw 'Command not invokable'

    await execute()
} catch {
    await executeUnknown()
}
