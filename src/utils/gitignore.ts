const GB_GITIGNORE_HEADER = '# git-bartender-ignore'

export function parseGbGitignore(gitignore: string) {
    const lines = gitignore.split('\n')
    const parsed: string[] = []

    const idx = lines.findIndex(it => it === GB_GITIGNORE_HEADER) + 1
    if (!idx) return parsed

    for (let i = idx; i < lines.length; i++) {
        const line = lines[i]!
        const trimmed = line.trim()
        if (trimmed) parsed.push(trimmed)
        else break
    }

    return parsed
}

export function toGbGitignore(gitignore: string, patterns: string[], beforeLength = 0) {
    const lines = gitignore.split('\n')
    const gbGitignoreIndex = lines.findIndex(it => it === GB_GITIGNORE_HEADER)

    if (gbGitignoreIndex === -1) {
        if (lines.length && lines.at(-1)!.trim()) lines.push('')
        lines.push(GB_GITIGNORE_HEADER)
        lines.push(...patterns)
    } else {
        if (patterns.length) lines.splice(gbGitignoreIndex + 1, beforeLength, ...patterns)
        else lines.splice(gbGitignoreIndex, beforeLength + 1)
    }

    return lines.join('\n')
}
