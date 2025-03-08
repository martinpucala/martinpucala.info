import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// import { devtools, persist } from 'zustand/middleware';

const store = (set, get) => ({
    photosRoot: 'https://europe-central2-bubkos-galeria.cloudfunctions.net/files',
    photos: [],

    init: async () => {
        const response = await fetch(get().photosRoot);
        const photos = (await response.text())
            .split('\n')
            .map(url => url.trim())
            .filter(url => !!url);

        set({ photos });
    }
});

export const useStore = create(devtools(store), { name: 'galleryStore' });
