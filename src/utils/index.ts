import chalkTemplate from 'chalk-template'
import { closest, distance } from 'fastest-levenshtein'

import { commands, inverseCommandAliases, logger } from '../context'
import { string } from '../strings'

export function prompt(question: string) {
    return globalThis.prompt(chalkTemplate`{cyanBright ${question}}`)
}

export function yesNoPrompt(question: string, defaultValue = false) {
    const defaultValueString = defaultValue ? 'Y/n' : 'y/N'
    const result = prompt(chalkTemplate`{bold ?} ${question} {gray (${defaultValueString})}`)

    if (!result) return defaultValue

    return result[0]!.toLowerCase() === 'y'
}

export function tryResolveCommand(command: string) {
    let name: string
    let cmd = commands[command]

    if (!cmd && command.length >= 3) {
        const match = closest(
            command,
            Object.keys(commands).filter(c => !commands[c]!.hidden && !commands[c]!.uninvokable),
        )

        name = inverseCommandAliases[match] ?? match

        if (distance(command, match) <= 2) {
            if (yesNoPrompt(string('generic.command.correctionConfirmation', name!))) cmd = commands[match]
            logger.newline()
        }
    } else name = inverseCommandAliases[command] ?? command

    return { name, cmd } as const
}
