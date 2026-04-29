import Footer from './Footer'
import Header from './Header'
import PageTransition from './PageTransition'
import ScrollToTopButton from './ScrollToTopButton'
import TopHeader from './TopHeader'

function Layout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <TopHeader />
      <Header />
      <main className="mx-auto w-full max-w-[1170px] flex-1 px-4 sm:px-6 lg:px-0">
        <PageTransition />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

export default Layout
