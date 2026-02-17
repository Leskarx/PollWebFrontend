import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Check, Copy, ExternalLink } from 'lucide-react';
// import { createPoll } from '../services/api';
import Toast from './Toast';
import { createPoll } from '../services/api.createPoll';
export default function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [createdPoll, setCreatedPoll] = useState(null);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validate = () => {
    const newErrors = {};
    if (!question.trim()) {
      newErrors.question = 'Question is required';
    }
    const filledOptions = options.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await createPoll({
        question: question.trim(),
        options: options.filter(opt => opt.trim())
      });

      setCreatedPoll(result);
      setToast({ type: 'success', message: 'Poll created successfully!' });
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to create poll' });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(createdPoll.url);
    setToast({ type: 'success', message: 'Link copied to clipboard!' });
  };

  if (createdPoll) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/50 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 ring-2 ring-green-500/20">
                <Check className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <h2 className="mb-2 text-center text-3xl font-bold text-white">
              Your poll is ready!
            </h2>
            <p className="mb-8 text-center text-slate-400">
              Share the link below
            </p>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Shareable Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={createdPoll.url}
                  readOnly
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-200"
                />
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-600/10 px-1 py-2  md:px-4 md:py-3 text-sm font-medium text-indigo-300"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/poll/${createdPoll.pollId}`)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white"
              >
                <ExternalLink className="h-5 w-5" />
                Open Poll
              </button>

              <button
                onClick={() => {
                  setCreatedPoll(null);
                  setQuestion('');
                  setOptions(['', '']);
                  setErrors({});
                }}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 text-base font-semibold text-slate-300"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/50 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold text-white">
              Create a Poll
            </h1>
            <p className="text-lg text-slate-400">
              Add a question and options.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Poll Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-400">{errors.question}</p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Options
              </label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {errors.options && (
                <p className="mt-2 text-sm text-red-400">{errors.options}</p>
              )}

              <button
                type="button"
                onClick={addOption}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-400"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-lg font-semibold text-white"
            >
              {loading ? 'Creating poll...' : 'Create Poll'}
            </button>
          </form>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
