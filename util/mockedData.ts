import { IUser } from '../database/models/user/user.interface';
import { IBook } from '../database/models/book/book.interface';

export const getUsers: IUser[] = [
  {
    email: 'first@gmail.com',
    isVerifiedEmail: true,
    password: 'randomHash',
    registrationMethod: 'email',
    confirmationEmailDateSent: new Date(),
    confirmationEmailDateClicked: new Date()
  },
  {
    email: 'second@gmail.com',
    isVerifiedEmail: false,
    password: 'randomHash2',
    registrationMethod: 'email',
    confirmationEmailDateSent: new Date(),
    confirmationEmailDateClicked: new Date()
  }
];

const PR_IOSIF_TRIFA = 'Father Iosif Trifa';
const TRAIAN_DORZ = 'Traian Dorz';
const IOAN_MARINI = 'Ioan Marini';
const PR_VASILE_MIHOC = 'Pr. Vasile Mihoc';
const STARE_NOUA = 'New';

const EDITURA_OASTEA_DOMNULUI = 'Editura Oastea Domnului';
const LITERATURA_OASTEI_DOMNULUI = 'Literatura Oastei Domnului';

export const getBooksNew: IBook[] = [
  {
    title: 'What is Lord`s army',
    author: PR_IOSIF_TRIFA,
    publisher: EDITURA_OASTEA_DOMNULUI,
    price: 15,
    pages: 223,
    description:
      '... feeling the lack of this guidebook more and more for the Lord`s Army and for those entering the Army, I printed it again. In Romania, book is called `Ce este Oastea Domnului`',
    state: STARE_NOUA,
    quantity: 15,
    soldQuantity: 45,
    image: '/books/ceEsteOasteaDomnului_Pr_Iosif_Trifa.jpg',
    discount: 0,
    category: LITERATURA_OASTEI_DOMNULUI,
    publishingYear: 1998,
    rating: 5.0,
    reviews: ['41224d776a326fb40f000001', '41224d776a326fb40f000002']
  },
  {
    title: 'Christ - My testimony',
    author: TRAIAN_DORZ,
    publisher: EDITURA_OASTEA_DOMNULUI,
    price: 35,
    pages: 333,
    description:
      'Christ - My testimony - An astonishing book of Romania`s greatest christian-orthodox poet. In Romania, book is called `Hristos - Mărturia mea`',
    state: STARE_NOUA,
    quantity: 15,
    soldQuantity: 45,
    image: '/books/Hristos_marturia_mea.jpg',
    discount: 0,
    category: LITERATURA_OASTEI_DOMNULUI,
    publishingYear: 1998,
    rating: 4.5,
    reviews: ['41224d776a326fb40f000003', '41224d776a326fb40f000004']
  },
  {
    title: 'Christian thoughts',
    author: IOAN_MARINI,
    publisher: EDITURA_OASTEA_DOMNULUI,
    price: 10,
    pages: 54,
    description: 'Christian thoughts for every person who wants to live as a christian(-orthodox)',
    state: STARE_NOUA,
    quantity: 15,
    soldQuantity: 45,
    image: '/books/ganduri_crestine.jpg',
    discount: 20,
    category: LITERATURA_OASTEI_DOMNULUI,
    publishingYear: 1999,
    rating: 4.0,
    reviews: ['41224d776a326fb40f000005', '41224d776a326fb40f000006']
  },
  {
    title: 'Seven Bible interpretations of the Mother of God',
    author: PR_VASILE_MIHOC,
    publisher: EDITURA_OASTEA_DOMNULUI,
    price: 15,
    pages: 76,
    description: 'Seven Bible interpretations of the Mother of God',
    state: STARE_NOUA,
    quantity: 15,
    soldQuantity: 45,
    image: '/books/sapte_talcuiri_biblice_despre_Maica_Domnului.jpg',
    discount: 10,
    category: LITERATURA_OASTEI_DOMNULUI,
    publishingYear: 2013,
    rating: 4.5,
    reviews: ['41224d776a326fb40f000005', '41224d776a326fb40f000006']
  },
  {
    title: 'Alcohol - the spirit of the devil',
    author: PR_IOSIF_TRIFA,
    publisher: EDITURA_OASTEA_DOMNULUI,
    price: 12,
    pages: 56,
    description: 'Alcohol is the spirit of the devil.',
    state: STARE_NOUA,
    quantity: 25,
    soldQuantity: 35,
    image: '/books/alcoolul_duhul_diavolului_Pr_Iosif_Trifa.jpg',
    discount: 0,
    category: LITERATURA_OASTEI_DOMNULUI,
    publishingYear: 2015,
    rating: 4.5,
    reviews: ['41224d776a326fb40f000007', '41224d776a326fb40f000009']
  },
  {
    title: 'Miracle and mystery',
    author: TRAIAN_DORZ,
    publisher: EDITURA_OASTEA_DOMNULUI,
    price: 35,
    pages: 86,
    description: 'Miracle and mystery - poems about Mother of God',
    state: STARE_NOUA,
    quantity: 45,
    soldQuantity: 45,
    image: '/books/minune_si_taina.jpg',
    discount: 10,
    category: LITERATURA_OASTEI_DOMNULUI,
    publishingYear: 2000,
    rating: 4.5,
    reviews: ['41224d776a326fb40f000001', '41224d776a326fb40f000002']
  },
  {
    title: 'Food for the Christian family',
    author: IOAN_MARINI,
    publisher: EDITURA_OASTEA_DOMNULUI,
    price: 15,
    pages: 36,
    description: 'Biblical teachings for the christian family',
    state: STARE_NOUA,
    quantity: 35,
    soldQuantity: 15,
    image: '/books/hrana_pentru_familia_crestina.jpg',
    discount: 0,
    category: LITERATURA_OASTEI_DOMNULUI,
    publishingYear: 1993,
    rating: 4.5,
    reviews: ['41224d776a326fb40f000011', '41224d776a326fb40f000012']
  },
  {
    title: '600 religious stories',
    author: PR_IOSIF_TRIFA,
    publisher: EDITURA_OASTEA_DOMNULUI,
    price: 20,
    pages: 430,
    description: 'Spiritually and amazing stories to learn from',
    state: STARE_NOUA,
    quantity: 25,
    soldQuantity: 45,
    image: '/books/600_istorioare_Pr_Iosif_Trifa.jpg',
    discount: 0,
    category: LITERATURA_OASTEI_DOMNULUI,
    publishingYear: 1997,
    rating: 4.5,
    reviews: ['41224d776a326fb40f000013', '41224d776a326fb40f000014']
  }
];
