'use strict'

function onInit() {

    renderFilterByQueryStringParams()
    renderBooks()
    renderNamesInFilter()
}

function renderNamesInFilter() {

    const names = getNames()

    const strHTMLs = names.map(name => `<option>${name}</option>`)
    strHTMLs.unshift('<option value="">Select Book Name</option>')

    const elSelect = document.querySelector('.filter-name-select')
    elSelect.innerHTML = strHTMLs.join('')

}

function renderBooks() {
    var books = getBooks()
    var strHtmls = books.map(book => `
        <article class="book-preview">
            <button class="btn-remove" onclick="onDeleteBook('${book.id}')">X</button>
            <h5>${book.name}</h5>
            <h6>price: <span>${book.price}</span> $</h6>
            <button onclick="onReadBook('${book.id}',true)">Details</button>
            <button onclick="onUpdateBook('${book.id}')">Update</button>
            <img onerror="this.src='${DEFAULT_IMG}'" src="${book.imgUrl}" alt="${book.name} image">
            <div onmouseout="onReadBook('${book.id}',false)" onclick="onReadBook('${book.id}',false)" class="modal m-${book.id}"></div>
        </article> 
        `
    )
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
    
}



function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    // flashMsg(`Book Deleted`)
}

function onAddBook() {
    var name = prompt('name?', 'ARIEL AND THE PRINCE')
    if (name) {
        const book = addBook(name)
        // gBooks.unshift(book)
        renderBooks()
        // flashMsg(`Book Added (id: ${book.id})`)
    }
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +prompt('Price?', book.price)
    if (newPrice && book.price !== newPrice) {
        const book = updateBook(bookId, newPrice)
        renderBooks()
        // flashMsg(`Price updated to: ${book.price}`)
    }
}

function onReadBook(bookId, isOpen) {
    const elModal = document.querySelector(`.m-${bookId}`)
    if (isOpen) {
        const book = getBookById(bookId)
        elModal.innerText = book.desc
        elModal.classList.add('animated')
    }
    else elModal.classList.remove('animated')
}


function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?name=${filterBy.name}&maxPrice=${filterBy.maxPrice}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}


// function onCloseModal() {
//     document.querySelector('.modal').classList.remove('open')
// }

// function flashMsg(msg) {
//     const el = document.querySelector('.user-msg')
//     el.innerText = msg
//     el.classList.add('open')
//     setTimeout(() => {
//         el.classList.remove('open')
//     }, 3000)
// }

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        vendor: queryStringParams.get('name') || '',
        minSpeed: +queryStringParams.get('maxPrice') || 0
    }

    if (!filterBy.name && !filterBy.maxPrice) return

    document.querySelector('.filter-name-select').value = filterBy.name
    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    setBookFilter(filterBy)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked

    // const sortBy = {}
    // sortBy[prop] = (isDesc)? -1 : 1

    // Shorter Syntax:
    const sortBy = {
        [prop]: (isDesc) ? -1 : 1
    }

    setBookSort(sortBy)
    renderBooks()
}


// function onNextPage() {
//     nextPage()
//     renderCars()
// }