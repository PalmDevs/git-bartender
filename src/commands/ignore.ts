import { $ } from 'bun'
import { args, logger } from '../context'
import { string } from '../strings'
import { buildDirTree, printDirTree } from '../utils/dir-tree'
import { parseGbGitignore, toGbGitignore } from '../utils/gitignore'

export const execute = async () => {
    if (!args.length) {
        const gitignore = await $`cat .git/info/exclude`.quiet().then(it => it.text())
        const patterns = parseGbGitignore(gitignore)

        logger.info(string('command.ignore.viewHeader'))
        logger.newline()

        if (patterns.length) printDirTree(buildDirTree(patterns))
        else logger.info(string('command.ignore.noFiles'))

        return
    }

    const files = await Promise.all(args.map(ignore).map(it => it.then(it => it[0]))).then(it => it.flat())

    logger.info(string('command.ignore.action'))
    logger.newline()

    printDirTree(buildDirTree(files))
}

export const description = string('command.ignore.description')

export const aliases = ['i']

export const usages = ['[...patterns]']

async function ignore(pattern: string) {
    const getFiles = await $`git ls-files --error-unmatch ${pattern}`.nothrow().quiet()
    const files = getFiles.text().trim().split('\n')

    const gitignore = await $`cat .git/info/exclude`.quiet().then(it => it.text())
    const patterns = parseGbGitignore(gitignore)

    if (patterns.includes(pattern)) {
        logger.info(string('command.ignore.dupe', pattern))
        return [[], []] as const
    }

    patterns.push(pattern)

    return [
        files,
        await Promise.all([
            getFiles.exitCode === 0 && $`git update-index --assume-unchanged ${files}`.quiet(),
            $`echo ${toGbGitignore(gitignore, patterns)} > .git/info/exclude`.quiet(),
        ]),
    ] as const
}
