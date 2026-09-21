import React, { useRef, useState, useEffect, useMemo } from 'react'
import { resumeTemplates, DUMMY_RESUME_DATA } from '../utils/data'
import RenderResume from './RenderResume'
import { TemplateCard } from './Cards'
import { Check, Search, Sparkles } from 'lucide-react'

const CATEGORIES = ['All', 'Shanidhya', 'Reactive Resume', 'ATS & Clean', 'Modern & Creative']

const ThemeSelector = ({ selectedTheme, setSelectedTheme, resumeData, onClose }) => {
  const resumeRef = useRef(null)
  const [baseWidth, setBaseWidth] = useState(794)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedThemeId, setSelectedThemeId] = useState(
    selectedTheme || resumeTemplates[0]?.id || ""
  )

  const handleThemeSelection = () => {
    setSelectedTheme(selectedThemeId)
    onClose()
  }

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth)
    }
  }

  useEffect(() => {
    updateBaseWidth()
    window.addEventListener('resize', updateBaseWidth)
    return () => {
      window.removeEventListener('resize', updateBaseWidth)
    }
  }, [])

  const filteredTemplates = useMemo(() => {
    return resumeTemplates.filter((t) => {
      const matchesCategory =
        activeCategory === 'All' || t.category === activeCategory
      const matchesSearch =
        !searchQuery.trim() ||
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.layoutType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.recommendedRoles?.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const currentTemplate = resumeTemplates.find((t) => t.id === selectedThemeId)

  return (
    <div className='max-w-7xl mx-auto px-4'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 sm:p-6 bg-gradient-to-r from-white via-violet-50/50 to-teal-50/50 rounded-2xl border border-violet-100 shadow-xs'>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {resumeTemplates.length} Available
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Selected: <span className="font-bold text-violet-700">{currentTemplate?.name || "Template"}</span>
            {currentTemplate?.description && ` — ${currentTemplate.description}`}
          </p>
        </div>
        <button
          className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all cursor-pointer'
          onClick={handleThemeSelection}
        >
          <Check size={18} /> Apply Changes
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8'>
        {/* Left Column: Template Gallery */}
        <div className='lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-4'>
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? resumeTemplates.length
                  : resumeTemplates.filter((t) => t.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-white text-violet-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, layout, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50/50"
            />
          </div>

          {/* Template Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[60vh] lg:max-h-[68vh] overflow-auto p-1'>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                thumbnailImg={template.thumbnailImg}
                isSelected={selectedThemeId === template.id}
                name={template.name}
                category={template.category}
                atsScore={template.atsScore}
                layoutType={template.layoutType}
                onSelect={() => setSelectedThemeId(template.id)}
              />
            ))}
            {filteredTemplates.length === 0 && (
              <div className="col-span-2 py-8 text-center text-xs text-slate-400">
                No templates found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Live Interactive Preview */}
        <div className='lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 overflow-hidden' ref={resumeRef}>
          <div className="mb-3 pb-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">{currentTemplate?.name || selectedThemeId}</span>
              {currentTemplate?.category && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {currentTemplate.category}
                </span>
              )}
              {currentTemplate?.layoutType && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {currentTemplate.layoutType}
                </span>
              )}
            </div>
            {currentTemplate?.atsScore && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <Check size={12} /> ATS Score: {currentTemplate.atsScore}
              </span>
            )}
          </div>

          {currentTemplate?.recommendedRoles && currentTemplate.recommendedRoles.length > 0 && (
            <div className="mb-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best for:</span>
              {currentTemplate.recommendedRoles.map((role) => (
                <span key={role} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {role}
                </span>
              ))}
            </div>
          )}

          <div className="overflow-auto max-h-[75vh] flex justify-center bg-slate-50/50 p-2 rounded-xl">
            <RenderResume
              templateId={selectedThemeId}
              resumeData={resumeData || DUMMY_RESUME_DATA}
              containerWidth={baseWidth}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector