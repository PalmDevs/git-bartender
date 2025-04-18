import chalkTemplate from 'chalk-template'
import { args, commands, logger } from '../context'
import { string } from '../strings'

export const execute = async () => {
    if (args.length) {
        return
    }

    logger.info(string('command.help.greet'))
    logger.info(string('command.help.action'))

    console.log('')
    console.info(
        chalkTemplate`{bold {${string('product.color.primary')} ${string('product.name')}}} • v${string('product.version')}`,
    )
    console.info(chalkTemplate`{${string('product.color.secondary')} ${string('product.description')}}`)
    console.log('')

    const cmds = Reflect.ownKeys(commands)
        .map(name => [name as string, commands[name as string]!] as const)
        .filter(([_, { hidden, uninvokable }]) => !hidden && !uninvokable)

    const cmdline = string('product.cmdline')
    const longestCmdName = cmds.reduce((acc, [name]) => (name.length > acc ? name.length : acc), 0)

    for (const [name, { description }] of cmds) {
        const paddingRight = longestCmdName - name.length + 2
        const prefix = chalkTemplate`{bold {${string('product.color.secondary')} ${cmdline} {${string('product.color.tertiary')} ${name}}}}`

        console.info(
            `${prefix}${' '.repeat(paddingRight)}${description ?? string('generic.command.placeholder.description')}`,
        )
    }
}

export const description = string('command.help.description')
