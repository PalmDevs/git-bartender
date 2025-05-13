import { string } from '../../strings'
import { logger } from '../../context'
import { getActiveBranch } from '../../utils/git'
import { $ } from 'bun'

const randomId = (length: number = 10): string => {
    let result = ''
    const digits = '0123456789'

    for (let i = 0; i < length; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length))
    }

    return result
}

export const execute = async () => {
    const oldBranch = await getActiveBranch()
    if (!oldBranch) return logger.error(string('generic.branch.noActiveBranch'))

    await $`git checkout --orphan ${randomId(16)}`
    await $`git add .`
    await $`git commit -m "chore: init"`
    await $`git branch -D ${oldBranch}`
    await $`git branch -m ${oldBranch}`

    logger.info()
    logger.info(string('command.delete.history.action', oldBranch))
}

export const description = string('command.delete.history.description')
