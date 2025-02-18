import { createSystem, type SystemConfig } from '@chakra-ui/react'

const config: SystemConfig = {
  cssVarsRoot: 'body',
}

const system = createSystem(config)

export default system 