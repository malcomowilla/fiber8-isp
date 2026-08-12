import { motion, AnimatePresence } from "framer-motion"
import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Key, Trash2, AlertCircle, CheckCircle, Plus } from 'lucide-react'
import DeletePasskey from '../delete/DeletePasskey'
import {Link} from "react-router-dom"



const PasskeyList = () => {
  const [passkeys, setPasskeys] = useState([])
  const [openDelete, setOpenDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passkeyId, setPasskeyId] = useState('')
  const [pageLoading, setPageLoading] = useState(true)

  const subdomain = window.location.hostname.split('.')[0]

  const getPasskeys = useCallback(async () => {
    try {
      setPageLoading(true)
      const response = await fetch('/api/get_passkey_credentials', {
        method: 'GET',
        headers: {
          'X-Subdomain': subdomain,
        },
      })

      const newData = await response.json()

      if (response.ok) {
        setPasskeys(newData.credentials || [])
      } else {
        toast.error('Failed to load passkeys', {
          position: "top-center",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error('Something went wrong', {
        position: "top-center",
        duration: 4000,
      })
    } finally {
      setPageLoading(false)
    }
  }, [subdomain])

  useEffect(() => {
    getPasskeys()
  }, [getPasskeys])

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const deletePassKey = async (id) => {
    setLoading(true)

    try {
      const response = await fetch(`/api/delete_passkey?id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Subdomain': subdomain,
        },
      })

      if (response.ok) {
        setPasskeys((prev) => prev.filter((cred) => cred.id !== id))
        toast.success('Passkey deleted successfully', {
          position: "top-center",
          duration: 4000,
        })
        setOpenDelete(false)
      } else {
        toast.error('Failed to delete passkey', {
          position: "top-center",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error('Something went wrong', {
        position: "top-center",
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  const truncateId = (id) => {
    if (!id) return ''
    return id.length > 24 ? id.substring(0, 24) + '...' : id
  }

  return (
    <>
      <Toaster />

      <DeletePasskey
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        deletePasskey={deletePassKey}
        id={passkeyId}
        loading={loading}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 font-sans">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Key size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Passkeys</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-16">Manage your registered passkeys for secure authentication</p>
          </div>

          {/* Loading State */}
          {pageLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="animate-spin">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Loading your passkeys...</p>
              </div>
            </div>
          ) : passkeys.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12"
            >
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <AlertCircle size={32} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Passkeys Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    You haven't registered any passkeys yet. Add your first passkey to enable secure, passwordless authentication.
                  </p>
                  <Link
                    to="/admin/profile"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-600
                     text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus size={18} />
                    Register Passkey
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            // Passkeys List
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {passkeys.map((passkey, index) => (
                  <motion.div
                    key={passkey.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Key size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {truncateId(passkey.id)}
                            </p>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              <CheckCircle size={12} />
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {passkey.created_at ? new Date(passkey.created_at).toLocaleDateString() : 'Created'}
                          </p>
                        </div>
                      </div>

                      {/* Right Section - Delete Button */}
                      <motion.button
                        onClick={() => {
                          setPasskeyId(passkey.id)
                          setOpenDelete(true)
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0 p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                        aria-label="Delete passkey"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 mt-6"
              >
                <div className="flex gap-3">
                  <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">Passkey Security</p>
                    <p>Your passkeys use your device's biometrics (fingerprint/face) or PIN to authenticate. They never transmit your password.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PasskeyList