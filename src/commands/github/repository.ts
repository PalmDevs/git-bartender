import { string } from '../../strings'
import { flags, logger, setExitCode } from '../../context'
import { gitHubRepoOwnerAndNameFromRemote, openGitHubRepository } from '../../utils/github'
import { getActiveBranch, getBranchRemote } from '../../utils/git'

export const execute = async () => {
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

    logger.info(string('command.github.repository.action', owner, repo))

    await openGitHubRepository(owner, repo, branch)
}

function preferFirstString(...items: any[]) {
    return items.find(it => typeof it === 'string' && it)
}

export const description = string('command.github.repository.description')

export const aliases = ['r', 'repo']

export const usages = ['', '--branch [branch]', '-b [branch]']
