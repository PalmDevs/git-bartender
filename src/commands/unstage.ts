import { $ } from 'bun'
import { args, logger } from '../context'
import { string } from '../strings'

export const execute = async () => {
    logger.info(string('command.unstage.action'))
    logger.newline()

    await $`git reset HEAD -- ${args}`.quiet()
}

export const description = string('command.unstage.description')

export const aliases = ['unadd', '!add']

export const usages = ['[...files]']
