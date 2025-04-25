import { $ } from 'bun'
import { logger } from '../context'
import { string } from '../strings'

export const execute = async () => {
    logger.info(string('command.discard.action'))
    logger.newline()

    await $`git reset HEAD --hard`.quiet()
}

export const description = string('command.discard.description')

export const aliases = ['explode', 'dc']

export const usages = ['']
