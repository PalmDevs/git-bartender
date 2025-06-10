import { $ } from 'bun'
import { args, logger } from '../context'
import { string } from '../strings'

export const execute = async () => {
    if (args.length) {
        const addResult = await $`git add ${args}`.quiet().nothrow()
        if (addResult.exitCode)
            return logger.error(string('command.addMissing.addError', addResult.stderr.toString().trim()))
    } else logger.warn(string('command.addMissing.noFiles'))

    await $`git commit --amend --no-edit`.quiet()

    logger.info(string('command.addMissing.action'))
}

export const description = string('command.addMissing.description')

export const aliases = ['addmissing', 'addm']

export const usages = ['<...files>']
