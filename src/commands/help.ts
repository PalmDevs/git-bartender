import chalkTemplate from 'chalk-template'
import { args, commands, inverseCommandAliases, logger, setExitCode } from '../context'
import { string } from '../strings'
import { tryResolveCommand } from '../utils'

export const execute = async () => {
    const cmdline = string('product.cmdline')

    logger.info(string('command.help.greet'))

    const [command] = args

    if (command) {
        const { name, cmd } = tryResolveCommand(command)

        if (!cmd) {
            logger.error(string('command.help.unknown', command))
            return setExitCode(1)
        }

        logger.info(string('command.help.actionSpecific', name))
        logger.newline()

        const prefix = chalkTemplate`{bold {${string('product.color.secondary')} ${cmdline} {${string('product.color.tertiary')} ${name}}}}`

        console.info(`${prefix}\n${cmd.description ?? string('generic.command.placeholder.description')}\n`)

        if (cmd.usages) {
            logger.info(string('command.help.usagesHeader'))
            logger.newline()

            for (const usage of cmd.usages) {
                console.info(`${prefix} ${usage}`)
            }
        }

        return
    }

    logger.info(string('command.help.action'))

    logger.newline()
    console.info(
        chalkTemplate`{bold {${string('product.color.primary')} ${string('product.name')}}} • v${string('product.version')}`,
    )
    console.info(chalkTemplate`{${string('product.color.secondary')} ${string('product.description')}}`)
    logger.newline()

    const cmds = Object.keys(commands)
        .map(name => [name, commands[name]!] as const)
        .filter(([_, { hidden, uninvokable }]) => !hidden && !uninvokable)

    const longestCmdName = cmds.reduce((acc, [name]) => (name.length > acc ? name.length : acc), 0)

    for (const [name, { description }] of cmds) {
        if (name in inverseCommandAliases) continue

        const paddingRight = longestCmdName - name.length + 2
        const prefix = chalkTemplate`{bold {${string('product.color.secondary')} ${cmdline} {${string('product.color.tertiary')} ${name}}}}`

        console.info(
            `${prefix}${' '.repeat(paddingRight)}${description ?? string('generic.command.placeholder.description')}`,
        )
    }

    logger.newline()
    logger.info(string('command.help.flagTip'))
}

export const description = string('command.help.description')

export const aliases = ['h']

export const usages = ['', '[command]', '[alias]']
