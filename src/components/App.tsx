import type { FC } from 'react'
import { isMobile } from "react-device-detect";
import { NotMobileWindow } from './NotMobileWindow';
import { MobileWindow } from './MobileWindow';

export const App: FC = () => {
  if (!isMobile) {
    return <NotMobileWindow />
  }
  return <MobileWindow />
}
