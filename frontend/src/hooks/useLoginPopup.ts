import { useLoginPopupContext } from '../../src/context/LoginPopupContext';

export const useLoginPopup = () => {
  return useLoginPopupContext();
};