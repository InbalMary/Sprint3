const googleBooksURL = 'https://www.googleapis.com/books/v1/volumes?printType=books'

const GOOGLE_BOOKS_KEY = 'GoogleBooksDB'

let gGoogleBooksMap = utilService.loadFromStorage(GOOGLE_BOOKS_KEY) || {}

export const googleBookService = {
    query,
    debounce
}

function query(keyword) {
    if (gGoogleBooksMap[keyword]) {
        // console.log('variable')
		return Promise.resolve(gGoogleBooksMap[keyword])
	}

	return axios.get(`${googleBooksURL}&q=${keyword}`).then(({ data }) => {
		// console.log(data)
		gGoogleBooksMap[keyword] = data.items.map(_getBookInfo)
		// console.log(gGoogleBooksMap[keyword])
		utilService.saveToStorage(GOOGLE_BOOKS_KEY, gGoogleBooksMap)
		return gGoogleBooksMap[keyword]
	})
}

function _getBookInfo(book) {
    // console.log('_getBookInfo', book)
    const volumeInfo = book.volumeInfo || {}

    return {
        id: book.id,
        title: volumeInfo.title || 'No Title',
        subtitle: volumeInfo.subtitle || '',
        authors: volumeInfo.authors || ['Unknown Author'],
        publishedDate: volumeInfo.publishedDate ? +volumeInfo.publishedDate.split('-')[0] : 1900,
        description: volumeInfo.description || 'No description available.',
        pageCount: volumeInfo.pageCount || 0,
        categories: volumeInfo.categories || ['Uncategorized'],
        thumbnail: (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) || 
                   'https://covers.openlibrary.org/b/id/10523325-L.jpg',
        language: volumeInfo.language || 'en',
        listPrice: {
            amount: utilService.getRandomIntInclusive(10, 250),
            currencyCode: 'EUR',
            isOnSale: Math.random() > 0.7
        }
    }
}


function debounce(func, wait = 300) {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

	// id: '',
    //     title,
    //     subtitle: utilService.makeLorem(4),
    //     authors: [],
    //     publishedDate: utilService.getRandomIntInclusive(1950, 2024),
    //     description: utilService.makeLorem(20),
    //     pageCount: utilService.getRandomIntInclusive(20, 600),
    //     categories: [],
    //     thumbnail: 'https://covers.openlibrary.org/b/id/10523325-L.jpg',
    //     language: 'en',
    //     listPrice: {
    //         amount,
    //         currencyCode: 'EUR',
    //         isOnSale: Math.random() > 0.7
    //     }
// }

// function query(txt) {
//     console.log('Demo search for:', txt)

//     return Promise.resolve([
//         {
//             kind: "books#volume",
//             id: "vPP1ygEACAAJ",
//             etag: "ihijan/JvXg",
//             selfLink: "https://www.googleapis.com/books/v1/volumes/vPP1ygEACAAJ",
//             volumeInfo: {
//                 title: "What Is the Story of Mickey Mouse?",
//                 authors: ["Steve Korte", "Who Hq"],
//                 publisher: "Penguin Workshop",
//                 publishedDate: "2020-07-14",
//                 description: "Who HQ brings you the stories behind the most beloved characters...",
//                 industryIdentifiers: [
//                     { type: "ISBN_10", identifier: "0593094735" },
//                     { type: "ISBN_13", identifier: "9780593094730" }
//                 ],
//                 readingModes: { text: false, image: false },
//                 pageCount: 112,
//                 printType: "BOOK",
//                 categories: ["Juvenile Nonfiction"],
//                 maturityRating: "NOT_MATURE",
//                 allowAnonLogging: false,
//                 contentVersion: "preview-1.0.0",
//                 panelizationSummary: {
//                     containsEpubBubbles: false,
//                     containsImageBubbles: false
//                 },
//                 imageLinks: {
//                     smallThumbnail: "http://books.google.com/books/content?id=vPP1ygEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
//                     thumbnail: "http://books.google.com/books/content?id=vPP1ygEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
//                 },
//                 language: "en",
//                 previewLink: "http://books.google.com/books?id=vPP1ygEACAAJ&dq=mickey+mouse&hl=&as_pt=BOOKS&cd=6&source=gbs_api",
//                 infoLink: "http://books.google.com/books?id=vPP1ygEACAAJ&dq=mickey+mouse&hl=&as_pt=BOOKS&source=gbs_api",
//                 canonicalVolumeLink: "https://books.google.com/books/about/What_Is_the_Story_of_Mickey_Mouse.html?hl=&id=vPP1ygEACAAJ"
//             },
//             saleInfo: {
//                 country: "IL",
//                 saleability: "NOT_FOR_SALE",
//                 isEbook: false
//             },
//             accessInfo: {
//                 country: "IL",
//                 viewability: "NO_PAGES",
//                 embeddable: false,
//                 publicDomain: false,
//                 textToSpeechPermission: "ALLOWED",
//                 epub: { isAvailable: false },
//                 pdf: { isAvailable: false },
//                 webReaderLink: "http://play.google.com/books/reader?id=vPP1ygEACAAJ&hl=&as_pt=BOOKS&source=gbs_api",
//                 accessViewStatus: "NONE",
//                 quoteSharingAllowed: false
//             },
//             searchInfo: {
//                 textSnippet: "Who HQ brings you the stories behind the most beloved characters of our time."
//             }
//         },
//         {
//             kind: "books#volume",
//             id: "IvhZEQAAQBAJ",
//             etag: "YaWhx3504KA",
//             selfLink: "https://www.googleapis.com/books/v1/volumes/IvhZEQAAQBAJ",
//             volumeInfo: {
//                 title: "Disney A to Z: The Official Encyclopedia, Sixth Edition",
//                 authors: ["Steven Vagnini", "Dave Smith"],
//                 publisher: "Random House",
//                 publishedDate: "2023-09-26",
//                 description: "If you’re curious about The Walt Disney Company, this comprehensive, newly revised and updated encyclopedia is your one-stop guide...",
//                 industryIdentifiers: [
//                     { type: "ISBN_13", identifier: "9781368061919" },
//                     { type: "ISBN_10", identifier: "1368061915" }
//                 ],
//                 readingModes: { text: false, image: true },
//                 pageCount: 1024,
//                 printType: "BOOK",
//                 categories: ["Reference"],
//                 maturityRating: "NOT_MATURE",
//                 allowAnonLogging: false,
//                 contentVersion: "0.0.1.0.preview.1",
//                 panelizationSummary: {
//                     containsEpubBubbles: false,
//                     containsImageBubbles: false
//                 },
//                 imageLinks: {
//                     smallThumbnail: "http://books.google.com/books/content?id=IvhZEQAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
//                     thumbnail: "http://books.google.com/books/content?id=IvhZEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
//                 },
//                 language: "en",
//                 previewLink: "http://books.google.com/books?id=IvhZEQAAQBAJ&pg=PA577&dq=mickey+mouse&hl=&as_pt=BOOKS&cd=7&source=gbs_api",
//                 infoLink: "http://books.google.com/books?id=IvhZEQAAQBAJ&dq=mickey+mouse&hl=&as_pt=BOOKS&source=gbs_api",
//                 canonicalVolumeLink: "https://books.google.com/books/about/Disney_A_to_Z_The_Official_Encyclopedia.html?hl=&id=IvhZEQAAQBAJ"
//             },
//             saleInfo: {
//                 country: "IL",
//                 saleability: "NOT_FOR_SALE",
//                 isEbook: false
//             },
//             accessInfo: {
//                 country: "IL",
//                 viewability: "PARTIAL",
//                 embeddable: true,
//                 publicDomain: false,
//                 textToSpeechPermission: "ALLOWED",
//                 epub: { isAvailable: false },
//                 pdf: {
//                     isAvailable: true,
//                     acsTokenLink: "http://books.google.com/books/download/Disney_A_to_Z_The_Official_Encyclopedia-sample-pdf.acsm?id=IvhZEQAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
//                 },
//                 webReaderLink: "http://play.google.com/books/reader?id=IvhZEQAAQBAJ&hl=&as_pt=BOOKS&source=gbs_api",
//                 accessViewStatus: "SAMPLE",
//                 quoteSharingAllowed: false
//             },
//             searchInfo: {
//                 textSnippet: "Steven Vagnini, Dave Smith. MICKEY MOUSE CLUB HEADQUARTERS • 577 Mickey Mouse Anniversary Show..."
//             }
//         },
//         {
//             kind: "books#volume",
//             id: "RgQbBwAAQBAJ",
//             etag: "swgokKBrUXk",
//             selfLink: "https://www.googleapis.com/books/v1/volumes/RgQbBwAAQBAJ",
//             volumeInfo: {
//                 title: "A Mickey Mouse Reader",
//                 authors: ["Garry Apgar"],
//                 publisher: "Univ. Press of Mississippi",
//                 publishedDate: "2014-09-30",
//                 description: "A wide-ranging collection documenting Mickey Mouse’s cultural impact...",
//                 industryIdentifiers: [
//                     { type: "ISBN_13", identifier: "9781626743601" },
//                     { type: "ISBN_10", identifier: "1626743606" }
//                 ],
//                 readingModes: { text: true, image: true },
//                 pageCount: 575,
//                 printType: "BOOK",
//                 categories: ["Social Science"],
//                 maturityRating: "NOT_MATURE",
//                 allowAnonLogging: false,
//                 contentVersion: "1.2.2.0.preview.3",
//                 panelizationSummary: {
//                     containsEpubBubbles: false,
//                     containsImageBubbles: false
//                 },
//                 imageLinks: {
//                     smallThumbnail: "http://books.google.com/books/content?id=RgQbBwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
//                     thumbnail: "http://books.google.com/books/content?id=RgQbBwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
//                 },
//                 language: "en",
//                 previewLink: "http://books.google.com/books?id=RgQbBwAAQBAJ&printsec=frontcover&dq=mickey+mouse&hl=&as_pt=BOOKS&cd=8&source=gbs_api",
//                 infoLink: "http://books.google.com/books?id=RgQbBwAAQBAJ&dq=mickey+mouse&hl=&as_pt=BOOKS&source=gbs_api",
//                 canonicalVolumeLink: "https://books.google.com/books/about/A_Mickey_Mouse_Reader.html?hl=&id=RgQbBwAAQBAJ"
//             },
//             saleInfo: {
//                 country: "IL",
//                 saleability: "NOT_FOR_SALE",
//                 isEbook: false
//             },
//             accessInfo: {
//                 country: "IL",
//                 viewability: "PARTIAL",
//                 embeddable: true,
//                 publicDomain: false,
//                 textToSpeechPermission: "ALLOWED",
//                 epub: { isAvailable: true },
//                 pdf: { isAvailable: true },
//                 webReaderLink: "http://play.google.com/books/reader?id=RgQbBwAAQBAJ&hl=&as_pt=BOOKS&source=gbs_api",
//                 accessViewStatus: "SAMPLE",
//                 quoteSharingAllowed: false
//             },
//             searchInfo: {
//                 textSnippet: "Contributions by Walter Benjamin, Lillian Disney, Walt Disney, E. M. Forster..."
//             }
//         }
//     ]
//     )
// }
