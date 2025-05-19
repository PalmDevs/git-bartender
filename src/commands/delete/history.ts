import { $, randomUUIDv7 } from 'bun'
import { logger } from '../../context'
import { string } from '../../strings'
import { getActiveBranch, getBranchRemote } from '../../utils/git'

export const execute = async () => {
    const oldBranch = await getActiveBranch()
    if (!oldBranch) return logger.error(string('generic.branch.noActiveBranch'))

    const remote = await getBranchRemote(oldBranch)

    await $`git checkout --orphan ${randomUUIDv7()}`.quiet()
    await $`git add .`.quiet()
    await $`git commit -m "chore: init"`.quiet()
    await $`git branch -D ${oldBranch}`.quiet()
    await $`git branch -m ${oldBranch}`.quiet()

    if (remote) await $`git branch --set-upstream-to=${remote}/${oldBranch}`.quiet()

    logger.info(string('command.delete.history.action', oldBranch))
}

export const description = string('command.delete.history.description')
