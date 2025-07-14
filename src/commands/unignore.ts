import { $ } from 'bun'
import path from 'path'
import { args, logger, setExitCode } from '../context'
import { string } from '../strings'
import { buildDirTree, printDirTree } from '../utils/dir-tree'
import { gitignoreLocalFilePath, parseGbGitignore, toGbGitignore } from '../utils/gitignore'
import { getRootDir } from '../utils/git'

export const execute = async () => {
    if (!args.length) {
        logger.error(string('command.unignore.noArgs'))
        return setExitCode(1)
    }

    const rootDir = await getRootDir()
    if (!rootDir) {
        logger.error(string('error.git.noRepo'))
        return setExitCode(1)
    }

    const unignoreWrapped = (pattern: string) => unignore(pattern, rootDir)

    const files = await Promise.all(args.map(unignoreWrapped).map(it => it.then(it => it[0]))).then(it => it.flat())
    if (!files.length) return setExitCode(1)

    logger.info(string('command.unignore.action'))
    logger.newline()

    printDirTree(buildDirTree(files))
}

export const description = string('command.unignore.description')

export const aliases = ['u']

export const usages = ['[...patterns]']

async function unignore(pattern: string, rootDir: string) {
    const relativePattern = path.relative(rootDir, pattern)
    const getFiles = await $`cd ${rootDir}; git ls-files --error-unmatch ${relativePattern}`.nothrow().quiet()
    const files = getFiles.text().trim().split('\n')

    const gitignore = await $`cat ${gitignoreLocalFilePath}`.quiet().then(it => it.text())
    const patterns = parseGbGitignore(gitignore)

    if (!patterns.length) {
        logger.error(string('command.unignore.noMatch', pattern))
        return [[], []]
    }

    const actualPattern = `/${relativePattern.replaceAll('\\', '/')}`

    const newPatterns = patterns.filter(it => it !== actualPattern)
    if (newPatterns.length === patterns.length) {
        logger.error(string('command.unignore.noMatch', pattern))
        return [[], []]
    }

    return [
        files,
        await Promise.all([
            getFiles.exitCode === 0 && $`cd ${rootDir}; git update-index --no-assume-unchanged ${files}`.quiet(),
            $`echo ${toGbGitignore(gitignore, newPatterns, patterns.length)} > ${gitignoreLocalFilePath}`.quiet(),
        ]),
    ] as const
}
