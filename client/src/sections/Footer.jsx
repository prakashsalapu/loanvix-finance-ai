import { IndianRupee } from 'lucide-react'

export default function Footer() {

  const currentYear = new Date().getFullYear()

  return (

    <footer className="bg-white border-t border-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col items-center text-center">

          {/* LOGO */}

          <div className="flex items-center gap-2 mb-4">

            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">

              <IndianRupee className="w-5 h-5 text-white" />

            </div>

            <span className="text-2xl font-bold text-gray-900">

              Loan<span className="gradient-text">Wise</span>

            </span>

          </div>

          {/* TAGLINE */}

          <p className="text-gray-500 text-sm sm:text-base max-w-md leading-relaxed mb-6">

            Your trusted partner for smart financial planning.
            Calculate EMIs, analyse loans, and make informed decisions.

          </p>
          <div>
          <p className="text-sm text-gray-600">
            Made with 🩵 by Prakash Salapu for Financial Clarity.
          </p></div>

          {/* COPYRIGHT */}

          <p className="text-sm text-gray-400">

            &copy; {currentYear} LoanVix. All rights reserved.

          </p>

        </div>

      </div>

    </footer>

  )

}