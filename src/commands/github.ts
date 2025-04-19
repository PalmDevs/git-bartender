import { execute as executeHelp } from './help'
import { string } from '../strings'
import { args, clearArgs, clearFlags, logger, setExitCode } from '../context'
import { gitHubRepoOwnerAndNameFromUrl, openGitHubPullRequest } from '../utils/github'
import {
    getActiveBranch,
    getBranchRemote,
    getRemoteDefaultBranch,
    localBranchExists,
    remoteBranchExists,
    remoteExists,
} from '../utils/git'

export const execute = async () => {
    const [subcommand] = args

    if (!subcommand) {
        logger.error(string('command.github.noSubcommand'))
        logger.newline()

        clearFlags()
        clearArgs()
        args.push('github')
        await executeHelp()

        return
    }

    switch (subcommand) {
        case 'pr':
        case 'pull-request':
            return await pullRequest()
    }
}

async function pullRequest() {
    const [, branches] = args
    const [targetRef, fromRef] = branches?.split(':') ?? []

    let targetRemote: string | undefined
    let targetBranch: string | undefined

    let fromRemote: string | undefined
    let fromBranch: string | undefined

    if (targetRef) {
        if (targetRef.includes('/')) {
            const [origin, branch] = targetRef.split('/')
            targetRemote = origin
            targetBranch = branch
        } else targetBranch = targetRef
    }

    if (fromRef) {
        if (fromRef.includes('/')) {
            const [origin, branch] = fromRef.split('/')
            fromRemote = origin
            fromBranch = branch
        } else fromBranch = fromRef
    }

    // No from branch specified, so we need to get the current branch
    if (!fromBranch) {
        const currentBranch = await getActiveBranch()
        if (!currentBranch) {
            logger.error(string('command.github.noActiveLocalBranch'))
            return setExitCode(1)
        }

        fromBranch = currentBranch
    } else if (!(await localBranchExists(fromBranch))) {
        // User specified a custom from local branch, but it doesn't exist
        logger.error(string('command.github.noLocalBranch', fromBranch))
        return setExitCode(1)
    }

    if (!fromRemote) {
        const remote = await getBranchRemote(fromBranch)
        if (!remote) {
            logger.error(string('command.github.noLocalBranchRemote'))
            return setExitCode(1)
        }

        fromRemote = remote
    } else if (!(await remoteExists(fromRemote))) {
        // User specified a custom remote, but it doesn't exist
        logger.error(string('command.github.noRemote', fromRemote))
        return setExitCode(1)
    }

    // Check if the remote branch exists
    if (!(await remoteBranchExists(fromRemote, fromBranch))) {
        logger.error(string('command.github.noFromRemoteBranch'))
        return setExitCode(1)
    }

    if (!targetRemote) targetRemote = fromRemote
    else if (!(await remoteExists(targetRemote))) {
        // User specified a custom target remote, but it doesn't exist
        logger.error(string('command.github.noRemote', targetRemote))
        return setExitCode(1)
    }

    if (!targetBranch) {
        const defaultBranch = await getRemoteDefaultBranch(targetRemote)
        if (!defaultBranch) {
            logger.error(string('command.github.noTargetBranch'))
            return setExitCode(1)
        }

        targetBranch = defaultBranch
    } else if (!(await remoteBranchExists(targetRemote, targetBranch))) {
        // User specified a custom target branch, but it doesn't exist
        logger.error(string('command.github.noTargetBranch'))
        return setExitCode(1)
    }

    const [targetOwner, targetName] = await gitHubRepoOwnerAndNameFromUrl(targetRemote)
    if (!targetOwner) {
        logger.error(string('command.github.notGitHubRemote', targetRemote))
        return setExitCode(1)
    }

    const [fromOwner, fromName] = await gitHubRepoOwnerAndNameFromUrl(fromRemote)
    if (!fromOwner) {
        logger.error(string('command.github.notGitHubRemote', fromRemote))
        return setExitCode(1)
    }

    logger.debug(`PR @ ${targetOwner}/${targetName}:${targetBranch} <- ${fromOwner}/${fromName}:${fromBranch}`)
    logger.info(string('command.github.actionPr', targetBranch, targetRemote, fromBranch, fromRemote))

    await openGitHubPullRequest(targetOwner, targetName, targetBranch, fromOwner, fromName, fromBranch)
}

export const description = string('command.github.description')

export const aliases = ['gh']

export const usages = [
    'pr|pull-request',
    'pr|pull-request <target_branch>',
    'pr|pull-request <target_remote>/[target_branch]',
    'pr|pull-request <target_remote>/[target_branch]:<from_remote>/[from_branch]',
]

export const examples = [
    ['pr dev', 'Create a PR from this branch -> origin/dev'],
    ['pr upstream/main', 'Create a PR from this branch -> upstream/main'],
    ['pr dev:staging', 'Create a PR from origin/staging -> origin/dev'],
    ['pr dev:upstream/main', 'Create a PR from upstream/main -> origin/dev'],
    ['pr /main:upstream/', 'Create a PR from upstream/main -> origin/main'],
]
