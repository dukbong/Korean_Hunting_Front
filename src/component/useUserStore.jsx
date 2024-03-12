import {create} from 'zustand';

// 초기 상태 설정
const useUserStore = create((set) => ({
  userId: '',
  setUserId: (newUserId) => set({ userId: newUserId }),
}));

export default useUserStore;