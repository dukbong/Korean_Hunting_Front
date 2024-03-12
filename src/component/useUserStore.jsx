import create from 'zustand';

// 초기 상태 설정
const useUserStore = create((set) => ({
  userId: localStorage.getItem("userId") || '',
  setUserId: (newUserId) => {
    set({ userId: newUserId });
    localStorage.setItem("userId", newUserId); // userId를 로컬 스토리지에 저장
  },
}));

export default useUserStore;  