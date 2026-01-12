import type { FC } from 'react'
import { isMobile } from "react-device-detect";
import { Monitor } from './Monitor';
import { Controller } from './Controller';

export const App: FC = () => {
  if (isMobile) {
    return <Controller />
  }
  return <Monitor />
}
