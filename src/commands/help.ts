import chalkTemplate from 'chalk-template'
import figures from 'figures'
import { readdir } from 'fs/promises'
import { args, logger } from '../context'
import { string } from '../strings'

interface Command {
    description?: string
    usages?: string[]
    execute(): Promise<any>
    hidden?: boolean
    uninvokable?: boolean
}

export const execute = async () => {
    if (args.length) {
        return
    }

    logger.info(string('command.help.greet'))
    logger.info(string('command.help.action'))

    console.log('')
    console.info(
        chalkTemplate`{bold {${string('product.color.primary')} ${string('product.name')}}} {${string('product.color.secondary')} • v${string('product.version')}}`,
    )
    console.info(chalkTemplate`{${string('product.color.secondary')} ${string('product.description')}}`)
    console.log('')

    const cmds = await Promise.all(
        await readdir(import.meta.dir).then(f =>
            f.map(async f => [fileNameToCommandName(f), (await import(`${import.meta.dir}/${f}`)) as Command] as const),
        ),
    ).then(cmds => cmds.filter(([_, cmd]) => !(cmd.hidden || cmd.uninvokable)))

    const cmdline = string('product.cmdline')
    const longestCmdName = cmds.reduce((acc, [name]) => (name.length > acc ? name.length : acc), 0)

    for (const [name, { description, usages }] of cmds) {
        const paddingRight = longestCmdName - name.length + 2
        const prefix = chalkTemplate`{bold {${string('product.color.secondary')} ${cmdline} {${string('product.color.tertiary')} ${name}}}}`

        console.info(`${prefix}${' '.repeat(paddingRight)}${description ?? string('placeholder.command.description')}`)
    }
}

export const description = string('command.help.description')

function fileNameToCommandName(fileName: string) {
    return fileName.replace(/\.[mc]?tsx?$/, '').toLowerCase()
}
