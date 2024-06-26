import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      itemId: null,
      setItemId: (itemId) => set({ itemId }),
      product: null,
      setProduct: (product) => set({ product }),
      cartCount: 0,
      setCartCount: (count) => set({ cartCount: count }),
    }),
    {
      name: 'Acctoken',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useUserStore;
