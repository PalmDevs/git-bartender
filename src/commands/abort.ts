import { $ } from 'bun'
import { existsSync } from 'fs'

import { logger, setExitCode } from '../context'
import { string } from '../strings'
import { getGitDirPath } from '../utils/git'

export const execute = async () => {
    const gitDir = await getGitDirPath()
    if (!gitDir) {
        setExitCode(1)
        logger.error(string('error.git.noRepo'))
        return
    }

    const mode = StuckModes.find(([_, file]) => existsSync(`${gitDir}/${file}`))

    if (!mode) {
        setExitCode(1)
        logger.error(string('command.abort.notStuck'))
        return
    }

    logger.info(string(`command.abort.action.${mode[0] as StuckMode}`))
    logger.newline()

    await $`git ${mode[2]}`.quiet()
}

export const description = string('command.abort.description')

export const aliases = ['ab']

export const usages = ['']

type StuckMode = (typeof StuckModes)[number][0]

const StuckModes = [
    ['merge', 'MERGE_HEAD', ['merge', '--abort']],
    ['rebase', 'rebase-merge', ['rebase', '--abort']],
    ['cherryPick', 'CHERRY_PICK_HEAD', ['cherry-pick', '--abort']],
    ['revert', 'REVERT_HEAD', ['revert', '--abort']],
    ['bisect', 'BISECT_LOG', ['bisect', 'reset']],
    ['applyPatch', 'rebase-apply', ['am', '--abort']],
] as const satisfies [mode: string, file: string, args: string[]][]
