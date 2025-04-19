import { $ } from 'bun'
import open from 'open'

export async function openGitHubPullRequest(
    targetOwner: string,
    targetName: string,
    targetBranch: string,
    fromOwner: string,
    fromName: string,
    fromBranch: string,
) {
    await open(
        `http://github.com/${targetOwner}/${targetName}/compare/${targetBranch}...${fromOwner}:${fromName}:${fromBranch}?quick_pull=1`,
    )
}

export async function gitHubRepoOwnerAndNameFromUrl(remote: string) {
    const remoteResult = await $`git config --get remote.${remote}.url`.nothrow().quiet()
    if (remoteResult.exitCode) return []

    const match = remoteResult
        .text()
        .trim()
        .match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/)

    const [, owner, repoName] = match ?? []
    if (!owner || !repoName) return []

    return [owner, repoName] as const
}
