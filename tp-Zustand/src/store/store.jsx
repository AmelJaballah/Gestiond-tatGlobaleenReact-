import { create } from 'zustand';

const useCharactersStore = create((set, get) => ({
  characters: [],
  likedIds: [],
  filter: 'all',
  loading: true,

  // Charger les personnages
  fetchCharacters: async () => {
    set({ loading: true });
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data = await response.json();
    set({ characters: data.results, loading: false });
  },

  // Toggle like
  toggleLike: (id) => set((state) => ({
    likedIds: state.likedIds.includes(id)
      ? state.likedIds.filter(likedId => likedId !== id)
      : [...state.likedIds, id]
  })),

  // Changer le filtre
  setFilter: (filter) => set({ filter }),

  // Selectors
  getLikedCharacters: () => {
    const { characters, likedIds } = get();
    return characters.filter(char => likedIds.includes(char.id));
  },

  getFilteredCharacters: () => {
    const { characters, filter } = get();
    if (filter === 'all') return characters;
    return characters.filter(char => char.status.toLowerCase() === filter);
  }
}));

export default useCharactersStore;
