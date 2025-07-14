import { $ } from 'bun'
import path from 'path'
import { args, logger, setExitCode } from '../context'
import { string } from '../strings'
import { buildDirTree, printDirTree } from '../utils/dir-tree'
import { gitignoreLocalFilePath, parseGbGitignore, toGbGitignore } from '../utils/gitignore'
import { getRootDir } from '../utils/git'

export const execute = async () => {
    if (!args.length) {
        const gitignore = await $`cat ${gitignoreLocalFilePath}`.quiet().then(it => it.text())
        const patterns = parseGbGitignore(gitignore)

        logger.info(string('command.ignore.viewHeader'))
        logger.newline()

        if (patterns.length) printDirTree(buildDirTree(patterns))
        else logger.info(string('command.ignore.noFiles'))

        return
    }

    const rootDir = await getRootDir()
    if (!rootDir) {
        logger.error(string('error.git.noRepo'))
        return setExitCode(1)
    }

    const ignoreWrapped = (pattern: string) => ignore(pattern, rootDir)

    const files = await Promise.all(args.map(ignoreWrapped).map(it => it.then(it => it[0]))).then(it => it.flat())
    if (!files.length) return setExitCode(1)

    logger.info(string('command.ignore.action'))
    logger.newline()

    printDirTree(buildDirTree(files))
}

export const description = string('command.ignore.description')

export const aliases = ['i']

export const usages = ['[...patterns]']

async function ignore(pattern: string, rootDir: string) {
    const relativePattern = path.relative(rootDir, pattern)
    const getFiles = await $`cd ${rootDir}; git ls-files --error-unmatch ${relativePattern}`.nothrow().quiet()
    const files = getFiles.text().trim().split('\n')

    const gitignore = await $`cat ${gitignoreLocalFilePath}`.quiet().then(it => it.text())
    const patterns = parseGbGitignore(gitignore)

    const actualPattern = `/${relativePattern.replaceAll('\\', '/')}`

    if (patterns.includes(actualPattern)) {
        logger.info(string('command.ignore.dupe', pattern))
        return [[], []] as const
    }

    patterns.push(actualPattern)

    return [
        files,
        await Promise.all([
            getFiles.exitCode === 0 && $`cd ${rootDir}; git update-index --assume-unchanged ${files}`.quiet(),
            $`echo ${toGbGitignore(gitignore, patterns, patterns.length)} > ${gitignoreLocalFilePath}`.quiet(),
        ]),
    ] as const
}
