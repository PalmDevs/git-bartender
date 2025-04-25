import { $ } from 'bun'
import { args, logger } from '../context'
import { string } from '../strings'

export const execute = async () => {
    const amount = args[0] ? Number(args[0]) : 1

    logger.info(string('command.undo.action', amount))
    logger.newline()

    await $`git log --pretty="[%h] %an: %s" -${amount} HEAD`
    await $`git reset --soft HEAD~${amount}`
}

export const description = string('command.undo.description')

export const aliases = ['ud']

export const usages = ['[amount]']
