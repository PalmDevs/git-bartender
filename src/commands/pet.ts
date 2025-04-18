import { logger, setExitCode } from '../context'
import { string } from '../strings'

export const execute = async () => {
    setExitCode(1)
    logger.warn(string('command.pet.warning'))
}

export const description = string('command.pet.description')
