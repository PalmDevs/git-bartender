import { $ } from 'bun'
import { args, logger, setExitCode } from '../context'
import { string } from '../strings'
import { buildDirTree, printDirTree } from '../utils/dir-tree'
import { gitignoreLocalFilePath, parseGbGitignore, toGbGitignore } from '../utils/gitignore'

export const execute = async () => {
    if (!args.length) {
        logger.error(string('command.unignore.noArgs'))
        return setExitCode(1)
    }

    const files = await Promise.all(args.map(unignore).map(it => it.then(it => it[0]))).then(it => it.flat())

    logger.info(string('command.unignore.action'))
    logger.newline()

    printDirTree(buildDirTree(files))
}

export const description = string('command.unignore.description')

export const aliases = ['u']

export const usages = ['[...patterns]']

async function unignore(pattern: string) {
    const getFiles = await $`git ls-files --error-unmatch ${pattern}`.nothrow().quiet()
    const files = getFiles.text().trim().split('\n')

    const gitignore = await $`cat ${gitignoreLocalFilePath}`.quiet().then(it => it.text())
    const patterns = parseGbGitignore(gitignore)

    if (!patterns.length) {
        logger.warn(string('command.unignore.noMatch', pattern))
        return [[], []]
    }

    const newPatterns = patterns.filter(it => it !== pattern)
    if (newPatterns.length === patterns.length) {
        logger.warn(string('command.unignore.noMatch', pattern))
        return [[], []]
    }

    return [
        files,
        await Promise.all([
            getFiles.exitCode === 0 && $`git update-index --no-assume-unchanged ${files}`.quiet(),
            $`echo ${toGbGitignore(gitignore, newPatterns, patterns.length)} > ${gitignoreLocalFilePath}`.quiet(),
        ]),
    ] as const
}
