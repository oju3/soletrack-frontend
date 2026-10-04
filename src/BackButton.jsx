import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/hub')}
      className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  )
}

export default BackButton
