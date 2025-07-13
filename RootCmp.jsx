const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from './cmps/AppHeader.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'
import { MailIndex } from './apps/mail/pages/MailIndex.jsx'
import { MailDetails } from './apps/mail/pages/MailDetails.jsx'
import { MailEdit } from './apps/mail/pages/MailEdit.jsx'
import { NoteIndex } from './apps/note/pages/NoteIndex.jsx'

import { NotFound } from "./apps/books/cmps/NotFound.jsx"
import { BookIndex } from "./apps/books/Pages/BookIndex.jsx"
import { BookDetails } from "./apps/books/Pages/BookDetails.jsx"
import { BookEdit } from "./apps/books/cmps/BookEdit.jsx"
import { BookAdd } from "./apps/books/cmps/BookAdd.jsx"
import { BookChart } from "./apps/books/cmps/BookChart.jsx"

export function RootCmp() {
    return <Router>
        <section className="root-cmp">
            <AppHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/mail" element={<MailIndex />} >
                    <Route path="/mail/:mailId" element={<MailDetails />} />
                    <Route path="/mail/edit" element={<MailEdit />} />
                    <Route path="/mail/edit/:mailId" element={<MailEdit />} />
                </Route>
                <Route path="/note" element={<NoteIndex />} />

                <Route path="/book" element={<BookIndex />} />
                <Route path="/book/:bookId" element={<BookDetails />} />
                <Route path="/book/edit" element={<BookEdit />} />
                <Route path="/book/edit/:bookId" element={<BookEdit />} />
                <Route path="/book/add" element={<BookAdd />} />
                <Route path="/book/chart" element={<BookChart />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
            <UserMsg />
        </section>
    </Router>
}
