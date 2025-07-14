import { readdirSync, statSync } from 'fs'
import { logger } from './logger'

export interface Command {
    description?: string
    aliases?: string[]
    usages?: string[]
    execute(): Promise<any>
    hidden?: boolean
    uninvokable?: boolean
    subcommands?: Record<string, Command>
    examples?: [string, string][]
}

export const commands = {} as Record<string, Command>
export const inverseCommandAliases = {} as Record<string, string>

const SUBCOMMAND_DELIMITER = '/'
const COMMAND_DIR = `${import.meta.dir}/../commands`

for (const node of readdirSync(COMMAND_DIR)) {
    if (statSync(`${COMMAND_DIR}/${node}`).isDirectory()) continue

    const name = fileNameToCommandName(node)
    const cmd = (await import(`${COMMAND_DIR}/${node}`)) as Command
    commands[name] = cmd

    if (cmd.aliases)
        for (const alias of cmd.aliases) {
            if (inverseCommandAliases[alias]) logger.warn(`Duplicate alias: ${alias}`)
            inverseCommandAliases[alias] = name
            commands[alias] = cmd
        }

    if (cmd.subcommands)
        for (const [subName, subCmd] of Object.entries(cmd.subcommands)) {
            const fullName = `${name}${SUBCOMMAND_DELIMITER}${subName}`
            commands[fullName] = subCmd

            if (subCmd.aliases)
                for (const alias of subCmd.aliases) {
                    const fullAlias = `${name}${SUBCOMMAND_DELIMITER}${alias}`
                    if (inverseCommandAliases[fullAlias]) logger.warn(`Duplicate subcommand alias: ${fullAlias}`)
                    inverseCommandAliases[fullAlias] = fullName
                    commands[fullAlias] = subCmd
                }

            if (subCmd.subcommands) throw new Error('Subcommands of subcommands are currently not supported')
        }
}

export function isSubcommand(name: string) {
    return name.includes(SUBCOMMAND_DELIMITER)
}

export function isCommandAlias(name: string) {
    return Boolean(inverseCommandAliases[name])
}

function fileNameToCommandName(fileName: string) {
    return fileName.replace(/\.[mc]?tsx?$/, '').toLowerCase()
}
