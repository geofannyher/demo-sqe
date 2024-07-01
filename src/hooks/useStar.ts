import { useState } from "react";

const initialStars = [
  {
    voice_id: "Ls00zZyqtRMScCr1LTO5",
    star: "jokowi",
    model: "gpt-4-1106-preview",
    name: "Joko Widodo",
    urlVideo: "/videos/jokowi.mp4",
    urlImage: "/images/jokowi.png",
  },
  {
    voice_id: "C0WjTt4B1i9ao3nfW2E1",
    star: "nyi",
    model: "gpt-4-1106-preview",
    name: "Nyi Roro Kidul",
    urlVideo: "/videos/nyi.mp4",
    urlImage: "/images/nyi.jpg",
  },
  // { voice_id: 'n7r1jXzkjJukANTHRwfP', star: 'anya', model: 'gpt-4-1106-preview', name: 'Anya', urlVideo: '/videos/anya.mp4', urlImage: '/images/anya.png' },
  // { voice_id: 'UMo6MvEskYsIvHD1rY6R', star: 'yor', model: 'gpt-4-1106-preview', name: 'Yor Forgeer', urlVideo: '/videos/yor.mp4', urlImage: '/images/yor.jpg' },
  {
    voice_id: "HjBZ4k2TbC2b1zSwKfY4",
    star: "nami",
    model: "gpt-4-1106-preview",
    name: "Nami",
    urlVideo: "/videos/nami.mp4",
    urlImage: "/images/nami.jpg",
  },
  {
    voice_id: "mAVCqjTekWXbBC6SWKXQ",
    star: "boa",
    model: "gpt-4-1106-preview",
    name: "Boa Hancock",
    urlVideo: "/videos/boa.mp4",
    urlImage: "/images/boa.jpg",
  },
  {
    voice_id: "z5k6qXKc6oFyelz9HLGA",
    star: "astrid",
    model: "gpt-4-1106-preview",
    name: "Astrid",
    urlVideo: "/videos/astrid.mp4",
    urlImage: "/images/astrid.jpg",
  },
  {
    voice_id: "HH75XS6V3SIzATTbd8ej",
    star: "mamet",
    model: "gpt-4-1106-preview",
    name: "Mamet",
    urlVideo: "/videos/mamet.mp4",
    urlImage: "/images/mamet.jpg",
  },
  {
    voice_id: "I5uQJhcGBo9GPcOKOr0B",
    star: "ibu",
    model: "gpt-4-1106-preview",
    name: "Ibuk",
    urlVideo: "/videos/ibuk.mp4",
    urlImage: "/images/ibuk.jpg",
  },
];

const useStar = () => {
  const [stars] = useState(initialStars);

  const getByStar = (starName: string) => {
    const filteredStars = initialStars.filter((star) => star.star === starName);
    return filteredStars;
  };

  return { stars, getByStar };
};

export default useStar;
