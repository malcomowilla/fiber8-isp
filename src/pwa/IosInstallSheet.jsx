import { AnimatePresence, motion } from 'framer-motion'
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const STEPS = [
  {
    icon: IosShareRoundedIcon,
    title: 'Tap Share',
    body: 'The square-with-arrow icon in the Safari toolbar.',
  },
  {
    icon: AddBoxOutlinedIcon,
    title: 'Add to Home Screen',
    body: 'Scroll the share sheet until you see it.',
  },
  {
    icon: CheckCircleOutlineRoundedIcon,
    title: 'Tap Add',
    body: 'Owitech lands on your home screen like any other app.',
  },
]

export default function IosInstallSheet({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            role="dialog"
            aria-label="Install on iOS"
            className="font-sans fixed inset-x-0 bottom-0 z-[80] rounded-t-3xl border-t border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
            style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </button>

            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Install on iPhone
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Safari doesn't allow a one-tap install, so it's three quick steps.
            </p>

            <ol className="mt-5 space-y-4">
              {STEPS.map(({ icon: Icon, title, body }, index) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                    <Icon
                      sx={{ fontSize: 18 }}
                      className="text-neutral-700 dark:text-neutral-200"
                    />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {index + 1}. {title}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.99] dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
            >
              Got it
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}