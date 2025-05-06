import { $ } from 'bun'

export async function remoteExists(remote: string) {
    const result = await $`git config remote.${remote}.url`.nothrow().quiet()
    return !result.exitCode
}

export async function localBranchExists(branch: string) {
    const result = await $`git show-ref refs/heads/${branch}`.nothrow().quiet()
    return !result.exitCode
}

export async function remoteBranchExists(remote: string, branch: string) {
    const result = await $`git ls-remote --heads ${remote} ${branch}`.text()
    return Boolean(result)
}

export async function getActiveBranch() {
    const result = await $`git symbolic-ref --short HEAD`.nothrow().quiet()
    if (result.exitCode) return null
    return result.text().trim()
}

export async function getBranchRemote(branch: string) {
    const result = await $`git config --get branch.${branch}.remote`.nothrow().quiet()
    if (result.exitCode) return null
    return result.text().trim()
}

export async function getRemoteDefaultBranch(remote: string) {
    const result = await $`git remote show ${remote}`.text()
    const match = result.match(/HEAD branch:\s+(\S+)/)
    if (!match) return null
    return match[1]!.trim()
}
