import { args, flags, logger, setExitCode } from '../../context'
import { string } from '../../strings'
import { getActiveBranch, getBranchRemote } from '../../utils/git'
import { gitHubRepoOwnerAndNameFromRemote, openGitHubActions } from '../../utils/github'

export const execute = async () => {
    const [workflow] = args.slice(1)
    const branchFlag = flags.branch ?? flags.b
    const activeBranch = await getActiveBranch()
    const branch = branchFlag === true ? activeBranch : preferFirstString(flags.branch, flags.b)

    if (!activeBranch && !branch) {
        logger.error(string('command.github.noActiveLocalBranch'))
        return setExitCode(1)
    }

    const remote = await getBranchRemote(branch ?? activeBranch)

    if (!remote) {
        logger.error(string('command.github.noLocalBranchRemote'))
        return setExitCode(1)
    }

    const [owner, repo] = await gitHubRepoOwnerAndNameFromRemote(remote)

    logger.info(string('command.github.actions.action', owner, repo))

    await openGitHubActions(owner, repo, {
        branch,
        workflow,
    })
}

function preferFirstString(...items: any[]) {
    return items.find(it => typeof it === 'string' && it)
}

export const description = string('command.github.actions.description')

export const aliases = ['a', 'action']

export const usages = ['', '[workflow]', '[workflow] --branch [branch]', '[workflow] -b [branch]']
