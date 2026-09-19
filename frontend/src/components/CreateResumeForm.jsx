import React, { useState } from 'react'
import { Input } from './Inputs'
import { useNavigate } from 'react-router-dom'
import { createResume } from '../lib/resumeStore'

const CreateResumeForm = ({ onSuccess }) => {
    const [title, setTitle] = useState("")
    const [error, setError] = useState(null)
    const [busy, setBusy] = useState(false)
    const navigate = useNavigate()

    const handleCreateResume = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Please enter resume title")
            return
        }
        setError("")
        setBusy(true)

        try {
            const resume = await createResume({ title: title.trim() })
            if (onSuccess) onSuccess();
            navigate(`/resume/${resume._id}`)
        }
        catch (err) {
            console.error('Failed to create resume:', err)
            setError('Something went wrong. Please try again.')
        }
        finally {
            setBusy(false)
        }
    }

    return (
        <div className='w-full max-w-md p-8'>
            <h3 className='font-display text-xl font-bold text-ink'>Create New Resume</h3>
            <p className='mt-1.5 text-sm leading-relaxed text-slate-500 mb-7'>
                Give your resume a title to get started. You can customize everything later.
            </p>

            <form onSubmit={handleCreateResume}>
                <Input value={title} onChange={({ target }) => setTitle(target.value)}
                    label='Resume Title' placeholder='e.g., John Doe - Software Engineer'
                    type='text' />

                {error && <p className='text-sm font-medium text-red-500 mb-4'>{error}</p>}

                <button disabled={busy} type='submit'
                    className='btn-primary w-full disabled:opacity-60'>
                    {busy ? 'Creating…' : 'Create Resume'}
                </button>
            </form>
        </div>
    )
}

export default CreateResumeForm
