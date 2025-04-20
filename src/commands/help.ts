import chalkTemplate from 'chalk-template'
import { args, commands, isCommandAlias, isSubcommand, logger, setExitCode, type Command } from '../context'
import { string } from '../strings'
import { tryResolveCommand } from '../utils'

export const execute = async () => {
    logger.info(string('command.help.greet'))

    const [command] = args
    if (command) specificCommandHelp(command)
    else generalHelp()
}

function commandCanBeShownInGeneralHelp([name, { hidden, uninvokable }]: readonly [string, Command]) {
    return !hidden && !uninvokable && !isCommandAlias(name) && !isSubcommand(name)
}

function generalHelp() {
    logger.info(string('command.help.action'))
    logger.newline()
    console.info(
        chalkTemplate`{bold {${string('product.color.primary')} ${string('product.name')}}} • v${string('product.version')}`,
    )
    console.info(chalkTemplate`{${string('product.color.secondary')} ${string('product.description')}}`)
    logger.newline()

    const cmds = Object.keys(commands)
        .map(name => [name, commands[name]!] as const)
        .filter(commandCanBeShownInGeneralHelp)

    const longestName = cmds.reduce((acc, [name]) => (name.length > acc ? name.length : acc), 0)

    for (const [name, { description }] of cmds) {
        const paddingRight = longestName - name.length + 2
        const prefix = genPrefix(name)

        console.info(
            `${prefix}${' '.repeat(paddingRight)}${description ?? string('generic.command.placeholder.description')}`,
        )
    }

    logger.newline()
    logger.info(string('command.help.flagTip'))
}

function specificCommandHelp(command: string) {
    const { name, cmd } = tryResolveCommand(command)

    if (!cmd) {
        logger.error(string('command.help.unknown', command))
        return setExitCode(1)
    }

    const actualName = name.replaceAll('/', ' ')
    const prefix = genPrefix(actualName)

    logger.info(string('command.help.actionSpecific', actualName))
    logger.newline()

    console.info(`${prefix}\n${cmd.description ?? string('generic.command.placeholder.description')}`)
    logger.newline()

    if (cmd.aliases) {
        logger.info(string('command.help.aliasesHeader'))
        console.info(cmd.aliases.join(', '))
        logger.newline()
    }

    if (cmd.subcommands) {
        logger.info(string('command.help.subcommandsHeader'))
        logger.newline()

        const scmds = Object.entries(cmd.subcommands).filter(([_, { hidden, uninvokable }]) => !hidden && !uninvokable)

        const longestScmdName = scmds.reduce((acc, [name]) => (name.length > acc ? name.length : acc), 0)

        for (const [sname, { description }] of scmds) {
            const paddingRight = longestScmdName - sname.length + 2
            const sprefix = chalkTemplate`${prefix} {${string('product.color.tertiary')} ${sname}}}`

            console.info(
                `${sprefix}${' '.repeat(paddingRight)}${description ?? string('generic.command.placeholder.description')}`,
            )
        }
    }

    if (cmd.usages) {
        logger.info(string('command.help.usagesHeader'))
        logger.newline()

        for (const usage of cmd.usages) console.info(`${prefix} ${usage}`)
    }

    // TODO: Add examples support

    return
}

function genPrefix(name: string) {
    const cmdline = string('product.cmdline')
    return chalkTemplate`{bold {${string('product.color.secondary')} ${cmdline} {${string('product.color.tertiary')} ${name}}}}`
}

export const description = string('command.help.description')

export const aliases = ['h']

export const usages = ['', '[command]', '[alias]']
