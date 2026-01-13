import { h, render } from 'preact';

import htm from 'htm';
import { useEffect, useRef, useState } from 'preact/hooks';

import { useStore } from './store.js';


const html = htm.bind(h);
const times = '\u00D7';


const App = ({}) => {
    const { photos, photosRoot, init } = useStore();
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const firstPhotoContainerRef = useRef(null);
    const containerRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setSelectedPhoto(null);
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const photoIndex = selectedPhoto
                ? Math.min(photos.length - 1, photos.indexOf(selectedPhoto) + 1)
                : 0;
            setSelectedPhoto(photos[photoIndex]);
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            const photoIndex = selectedPhoto
                ? Math.max(0, photos.indexOf(selectedPhoto) - 1)
                : photos.length - 1;
            setSelectedPhoto(photos[photoIndex]);
        }
    };

    const handleThumbnailClick = (e) => {
        e.preventDefault();
        setSelectedPhoto(e.currentTarget.href.replace(/^.*\//, ''));
    };

    const handlePhotoCloseClick = (e) => {
        e.preventDefault();
        setSelectedPhoto(null);
    };

    useEffect(() => {
        void init();
    }, [init]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return html`
        <div
            class="w-full h-full max-h-screen overflow-y-auto"
            ref=${containerRef}
        >
            <div class="grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-0 p-0 bg-black">
                ${photos.sort((a, b) => {
                    const [dateA, timeA] = a.slice(0, 14).match(/.{1,8}/g)
                    const [dateB, timeB] = b.slice(0, 14).match(/.{1,8}/g)
                    return +dateB - +dateA || +timeA - +timeB;
                }).map((() => {
                    let lastDate = null;

                    return (photo, index) => {
                        const isDifferentDay = lastDate !== photo.slice(0, 8);
                        const photoDate = [photo.slice(6, 8).replace(/^0/, ''), photo.slice(4, 6).replace(/^0/, ''), photo.slice(0, 4)].join('.');

                        const result = html`
                            ${isDifferentDay
                                ? html`<h2 class="col-span-full text-white text-2xl font-bold my-2 mx-2">${photoDate}</h2>`
                                : null}
                            <a
                                class="inline-block aspect-square relative"
                                href="${photosRoot}/${photo}"
                                onClick=${handleThumbnailClick}
                                ref=${index === 0 ? firstPhotoContainerRef : null}
                            >
                                <span class="absolute top-0 right-0 bg-black text-white px-2 py-1 text-2xl">
                                    ${photo.slice(8).replace(/^(\d{2})(\d{2}).*$/, '$1:$2')}
                                </span>
                                <img
                                    class="w-full h-full object-cover"
                                    style="border: 0.5px solid transparent"
                                    loading="lazy"
                                    src="${photosRoot}/thumbnails/${photo}"
                                    alt=""
                                />
                            </a>
                        `;

                        lastDate = photo.slice(0, 8);

                        return result;
                    };
                })())}
                ${selectedPhoto // FIXME - remove inline styles
                    ? html`
                        <div class="fixed left-0 top-0 w-full h-full bg-black">
                            <img
                                class="w-full h-full object-contain"
                                loading="eager"
                                src="${photosRoot}/${selectedPhoto}"
                                alt=""
                            />
                            <a
                                class="fixed right-0 top-0 m-4 z-10"
                                href=""
                                onClick=${handlePhotoCloseClick}
                            >
                                <span class="text-black text-6xl" style="text-shadow: 0 0 5px #888;">
                                    ${times}
                                </span>
                            </a>
                            <a
                                class="fixed inline-block left-0 top-1/4 h-3/4 w-1/4 z-5"
                                href=""
                                onClick=${e => { e.preventDefault(); handleKeyDown({ ...e, key: 'ArrowLeft' }); }}
                            >
                            </a>
                            <a
                                class="fixed inline-block right-0 top-1/4 h-3/4 w-1/4 z-5"
                                href=""
                                onClick=${e => { e.preventDefault(); handleKeyDown({ ...e, key: 'ArrowRight' }); }}
                            >
                            </a>
                        </div>
                    `
                    : null}
            </div>
        </div>
    `;
};


render(html`<${App} />`, document.getElementById('root'));
