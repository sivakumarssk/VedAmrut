import { useLoginPopupContext } from '@/context/LoginPopupContext';

export const useLoginPopup = () => {
  return useLoginPopupContext();
};