import { existsSync } from 'fs'
import { $ } from 'bun'

import { logger, setExitCode } from '../context'
import { string } from '../strings'

export const execute = async () => {
    const mode = StuckModes.find(([_, file]) => existsSync(file))

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
    ['merge', '.git/MERGE_HEAD', ['merge', '--abort']],
    ['rebase', '.git/rebase-merge', ['rebase', '--abort']],
    ['cherryPick', '.git/CHERRY_PICK_HEAD', ['cherry-pick', '--abort']],
    ['revert', '.git/REVERT_HEAD', ['revert', '--abort']],
    ['bisect', '.git/BISECT_LOG', ['bisect', 'reset']],
    ['applyPatch', '.git/rebase-apply', ['am', '--abort']],
] as const satisfies [mode: string, file: string, args: string[]][]
