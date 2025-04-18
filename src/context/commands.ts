import { readdirSync } from 'fs'

export interface Command {
    description?: string
    aliases?: string[]
    usages?: string[]
    execute(): Promise<any>
    hidden?: boolean
    uninvokable?: boolean
}

export const commands = {} as Record<string, Command>
export const inverseCommandAliases = {} as Record<string, string>

for (const f of readdirSync(`${import.meta.dir}/../commands`)) {
    const name = fileNameToCommandName(f)
    const cmd = require(`${import.meta.dir}/../commands/${f}`) as Command
    commands[name] = cmd

    if (cmd.aliases)
        for (const alias of cmd.aliases) {
            inverseCommandAliases[alias] = name
            commands[alias] = cmd
        }
}

function fileNameToCommandName(fileName: string) {
    return fileName.replace(/\.[mc]?tsx?$/, '').toLowerCase()
}
