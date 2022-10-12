'use strict'

const STORAGE_KEY = 'booksDB'
const DEFAULT_IMG = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/346/blue-book_1f4d8.png'

var gBooks
var gFilterBy = { name: '', maxPrice:47 }

const gBooksNames = ['ARIEL AND THE PRINCE', 'MOWGLI MEETS BALOO', 'FROZEN',
    'FINDING DORY', 'TOY STORY 3', 'WALL E', '101 DALMATIANS']

const gBooksImgUrl = {
    'ARIEL AND THE PRINCE': 'https://www.booknet.co.il/Images/Site/Products/org/9781292346694.jpg',
    'MOWGLI MEETS BALOO': 'https://www.booknet.co.il/Images/Site/Products/org/9781292346687.jpg',
    'FROZEN': 'https://www.booknet.co.il/Images/Site/Products/org/9781292346717.jpg',
    'FINDING DORY': 'https://www.booknet.co.il/Images/Site/Products/org/9781292346731.jpg',
    'TOY STORY 3': 'https://www.booknet.co.il/Images/Site/Products/org/9781292346816.jpg',
    'WALL E': 'https://www.booknet.co.il/Images/Site/Products/org/9781292346878.jpg',
    '101 DALMATIANS': 'https://www.booknet.co.il/Images/Site/Products/org/9781292346748.jpg',
}

function getNames(){
    return gBooksNames
}

_createBooks()

function getBooks() {

    // Filtering:
    var books = gBooks.filter(book => book.name.includes(gFilterBy.name) &&
        book.price <= gFilterBy.maxPrice)

    return books
}

function _createBook(name) {
    return {
        id: makeId(),
        name,
        price: getRandomIntInclusive(5, 25),
        desc: makeLorem(),
        imgUrl: gBooksImgUrl[name]
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 21; i++) {
            var bookName = gBooksNames[getRandomIntInclusive(0, gBooksNames.length - 1)]
            books.push(_createBook(bookName))
        }
    }

    gBooks = books
    _saveBooksToStorage()
}

function addBook(name) {
    const book = _createBook(name)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}


function setBookFilter(filterBy = {}) {
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    return gFilterBy
}


function setBookSort(sortBy = {}) {
    if (sortBy.price !== undefined) {
        gBooks.sort((c1, c2) => (c1.price - c2.price) * sortBy.price)
    } else if (sortBy.name !== undefined) {
        gBooks.sort((c1, c2) => c1.name.localeCompare(c2.name) * sortBy.name)
    }
}